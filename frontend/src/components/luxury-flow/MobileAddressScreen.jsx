import React, { useState, useEffect } from 'react';

export default function MobileAddressScreen({
  savedAddresses = [],
  selectedAddress,
  onSelectAddress,
  onSaveNewAddress,
  onContinueToPayment,
  isSubmitting,
  user,
}) {
  const [isAddingNew, setIsAddingNew] = useState(savedAddresses.length === 0);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone?.replace(/\D/g, '').slice(-10) || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (savedAddresses.length === 0) {
      setIsAddingNew(true);
    } else if (!selectedAddress && savedAddresses.length > 0) {
      onSelectAddress(savedAddresses[0]);
    }
  }, [savedAddresses]);

  const validateField = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Only letters and spaces permitted';
        return '';
      case 'phone': {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Contact phone is required';
        if (digits.length !== 10) return 'Must be exactly 10 digits';
        return '';
      }
      case 'addressLine1':
        if (!value.trim()) return 'Street address is required';
        if (value.trim().length < 5) return 'Detailed street address required (min 5 characters)';
        return '';
      case 'city':
        if (!value.trim()) return 'City is required';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Letters only';
        return '';
      case 'state':
        if (!value.trim()) return 'State is required';
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Letters only';
        return '';
      case 'pincode': {
        const pinDigits = value.replace(/\D/g, '');
        if (!pinDigits) return 'Pincode is required';
        if (pinDigits.length !== 6) return 'Must be 6 digits';
        return '';
      }
      default:
        return '';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAddingNew && selectedAddress) {
      onContinueToPayment(selectedAddress);
      return;
    }

    // Validate all fields
    const newErrors = {};
    ['fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode'].forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save and continue
    const saved = await onSaveNewAddress(formData);
    if (saved) {
      onContinueToPayment(saved);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] block font-medium">
            Step 01 • Commission Destination
          </span>
          <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-[0.12em] text-white font-normal mt-0.5">
            Shipping Address
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/15 bg-white/5 text-[9px] uppercase tracking-[0.2em] text-[#C0C0C0]">
          <span>✦</span>
          <span>Insured White-Glove</span>
        </div>
      </div>

      {/* Returning User Saved Addresses Cards */}
      {savedAddresses.length > 0 && !isAddingNew && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
              Saved Patrons Destinations ({savedAddresses.length})
            </span>
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white underline underline-offset-4 cursor-pointer"
            >
              + Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {savedAddresses.map((addr) => {
              const isSelected = selectedAddress?.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => onSelectAddress(addr)}
                  className={`relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#C0C0C0] bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                      : 'border-white/15 bg-black/60 hover:border-white/30 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-full border border-white/20 text-[8px] uppercase tracking-widest text-[#A0A0A0]">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A0A0A0] leading-relaxed">
                        {addr.addressLine1}
                        {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      </p>
                      <p className="text-xs text-[#707070]">
                        {addr.city}, {addr.state} • {addr.pincode}
                      </p>
                      <p className="text-[11px] font-mono text-[#888888] pt-1">
                        Contact: {addr.phone}
                      </p>
                    </div>

                    {/* Radio indicator */}
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-white bg-white text-black' : 'border-white/30'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* iOS-Style Form Card */}
      {(isAddingNew || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {savedAddresses.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-[10px] uppercase tracking-[0.2em] text-[#808080] hover:text-white cursor-pointer"
              >
                ← Select From Saved Addresses
              </button>
            </div>
          )}

          {/* Grouped iOS Inset Container */}
          <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl overflow-hidden divide-y divide-white/10 shadow-2xl">
            {/* Full Name */}
            <div className="p-3.5 space-y-1">
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                Full Name
              </label>
              <input
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Alexander Vance"
                className="w-full bg-transparent text-sm text-white placeholder-[#404040] focus:outline-none"
              />
              {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName}</p>}
            </div>

            {/* Phone Number */}
            <div className="p-3.5 space-y-1">
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                Mobile Number (10 Digits)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#707070]">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-sm text-white placeholder-[#404040] font-mono focus:outline-none"
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
            </div>

            {/* Street Address */}
            <div className="p-3.5 space-y-1">
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                Street Address / Residence
              </label>
              <input
                type="text"
                autoComplete="street-address"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="42 Skyline Boulevard, Penthouse 8"
                className="w-full bg-transparent text-sm text-white placeholder-[#404040] focus:outline-none"
              />
              {errors.addressLine1 && <p className="text-[10px] text-red-400 mt-1">{errors.addressLine1}</p>}
            </div>

            {/* City & State (2 cols on small screens) */}
            <div className="grid grid-cols-2 divide-x divide-white/10">
              <div className="p-3.5 space-y-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                  City
                </label>
                <input
                  type="text"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className="w-full bg-transparent text-sm text-white placeholder-[#404040] focus:outline-none"
                />
                {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city}</p>}
              </div>

              <div className="p-3.5 space-y-1">
                <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                  State
                </label>
                <input
                  type="text"
                  autoComplete="address-level1"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full bg-transparent text-sm text-white placeholder-[#404040] focus:outline-none"
                />
                {errors.state && <p className="text-[10px] text-red-400 mt-1">{errors.state}</p>}
              </div>
            </div>

            {/* Pincode */}
            <div className="p-3.5 space-y-1">
              <label className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-medium block">
                Postal Pincode (6 Digits)
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value.replace(/\D/g, ''))}
                placeholder="400001"
                className="w-full bg-transparent text-sm text-white placeholder-[#404040] font-mono focus:outline-none"
              />
              {errors.pincode && <p className="text-[10px] text-red-400 mt-1">{errors.pincode}</p>}
            </div>
          </div>

          {/* iOS Toggle: Save Address */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md">
            <div>
              <span className="text-xs font-medium text-white block">Save Address</span>
              <span className="text-[10px] text-[#707070]">Store for future Maison acquisitions</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white peer-checked:after:bg-black" />
            </label>
          </div>

          {/* Continue CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Storing Destination...</span>
              </span>
            ) : (
              <>
                <span>Continue To Payment</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Button when selecting existing address */}
      {!isAddingNew && savedAddresses.length > 0 && (
        <button
          type="button"
          onClick={() => onContinueToPayment(selectedAddress)}
          disabled={!selectedAddress}
          className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer mt-6"
        >
          <span>Continue To Payment</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
}
