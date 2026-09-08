import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddressSelector = forwardRef(({ selectedAddress, onSelectAddress }, ref) => {
  const { token, user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setAddresses(data.data);
        if (data.data.length === 0) {
          setIsAdding(true);
        } else if (!selectedAddress) {
          const defaultAddr = data.data.find(a => a.isDefault) || data.data[0];
          onSelectAddress(defaultAddr);
        }
      }
    } catch (err) {
      setError('Failed to load destinations registry');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    // 1. Full Name: min 2 chars, letters/spaces
    const name = (newAddress.fullName || '').trim();
    if (!name) {
      errors.fullName = 'Full Name is required';
    } else if (name.length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'.]+$/.test(name)) {
      errors.fullName = 'Full Name should contain letters and spaces only';
    }

    // 2. Phone: exactly 10-digit number
    const digitsOnly = (newAddress.phone || '').replace(/\D/g, '');
    if (!newAddress.phone || !newAddress.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      errors.phone = 'Phone number must be a valid 10-digit mobile number';
    }

    // 3. Street Address: min 5 chars, must contain alphanumeric
    const addr1 = (newAddress.addressLine1 || '').trim();
    if (!addr1) {
      errors.addressLine1 = 'Street address is required';
    } else if (addr1.length < 5) {
      errors.addressLine1 = 'Address must be at least 5 characters';
    } else if (!/[a-zA-Z0-9]/.test(addr1)) {
      errors.addressLine1 = 'Address must include alphanumeric details (building, street, flat)';
    }

    // 4. Address Line 2: optional, alphanumeric if present
    const addr2 = (newAddress.addressLine2 || '').trim();
    if (addr2 && !/[a-zA-Z0-9]/.test(addr2)) {
      errors.addressLine2 = 'Must include alphanumeric details if provided';
    }

    // 5. City: min 2 chars, letters only
    const city = (newAddress.city || '').trim();
    if (!city) {
      errors.city = 'City is required';
    } else if (city.length < 2) {
      errors.city = 'City must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.-]+$/.test(city)) {
      errors.city = 'City should contain letters only';
    }

    // 6. State: min 2 chars, letters only
    const state = (newAddress.state || '').trim();
    if (!state) {
      errors.state = 'State is required';
    } else if (state.length < 2) {
      errors.state = 'State must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.-]+$/.test(state)) {
      errors.state = 'State should contain letters only';
    }

    // 7. Pincode: 6 digits
    const pinDigits = (newAddress.pincode || '').replace(/\D/g, '');
    if (!newAddress.pincode || !newAddress.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (pinDigits.length < 5 || pinDigits.length > 6) {
      errors.pincode = 'Pincode must be a 6-digit postal code';
    }

    // 8. Country: required
    const country = (newAddress.country || '').trim();
    if (!country) {
      errors.country = 'Country is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleInputChange = (field, value) => {
    setNewAddress(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const executeSaveAddress = async () => {
    const errors = validateForm();
    if (errors) {
      setError('Please resolve the highlighted address fields before proceeding');
      return null;
    }

    setIsSaving(true);
    setError('');
    try {
      const payload = {
        fullName: newAddress.fullName.trim(),
        phone: newAddress.phone.trim().replace(/\D/g, '').slice(-10),
        addressLine1: newAddress.addressLine1.trim(),
        addressLine2: newAddress.addressLine2 ? newAddress.addressLine2.trim() : undefined,
        city: newAddress.city.trim(),
        state: newAddress.state.trim(),
        country: newAddress.country.trim() || 'India',
        pincode: newAddress.pincode.trim(),
        isDefault: addresses.length === 0,
      };

      const response = await fetch('http://localhost:4000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setAddresses(prev => [...prev, data.data]);
        onSelectAddress(data.data);
        setIsAdding(false);
        setNewAddress({
          fullName: '',
          phone: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: 'India',
          pincode: '',
        });
        setFieldErrors({});
        return data.data;
      } else {
        const errorMsg = data.error || data.message || 'Failed to save address';
        setError(errorMsg);
        return null;
      }
    } catch (err) {
      setError(err.message || 'Failed to save destination');
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  useImperativeHandle(ref, () => ({
    isAdding,
    hasFormData: Boolean(
      newAddress.fullName.trim() ||
      newAddress.addressLine1.trim() ||
      newAddress.city.trim() ||
      newAddress.pincode.trim()
    ),
    savePendingAddress: executeSaveAddress,
  }));

  const handleSaveClick = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await executeSaveAddress();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      executeSaveAddress();
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center text-xs uppercase tracking-widest text-[#888888] animate-pulse">
        Retrieving Address Registry...
      </div>
    );
  }

  if (isAdding) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-white font-medium">Add New Atelier Destination</h3>
            <p className="text-[10px] text-[#707070] tracking-wider mt-0.5">Please ensure all required fields are accurately completed.</p>
          </div>
          {addresses.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setError('');
                setFieldErrors({});
              }}
              className="text-[10px] uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" onKeyDown={handleKeyDown}>
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Jean-Luc Delacroix"
              value={newAddress.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.fullName ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.fullName && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.fullName}</span>
            )}
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Contact Number (10 Digits) <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              maxLength={13}
              value={newAddress.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.phone ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.phone && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.phone}</span>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Street Address / Building / Suite <span className="text-red-400">*</span> (Alphanumeric)
            </label>
            <input
              type="text"
              placeholder="e.g. 42 Rue du Faubourg Saint-Honoré, Suite 4B"
              value={newAddress.addressLine1}
              onChange={e => handleInputChange('addressLine1', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.addressLine1 ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.addressLine1 && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.addressLine1}</span>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">
              Apartment, Unit, Landmark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near Place Vendôme"
              value={newAddress.addressLine2}
              onChange={e => handleInputChange('addressLine2', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.addressLine2 ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.addressLine2 && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.addressLine2}</span>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai"
              value={newAddress.city}
              onChange={e => handleInputChange('city', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.city ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.city && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.city}</span>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              State <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Maharashtra"
              value={newAddress.state}
              onChange={e => handleInputChange('state', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.state ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.state && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.state}</span>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Postal Pincode <span className="text-red-400">*</span> (6 Digits)
            </label>
            <input
              type="text"
              placeholder="e.g. 400001"
              maxLength={6}
              value={newAddress.pincode}
              onChange={e => handleInputChange('pincode', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.pincode ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.pincode && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.pincode}</span>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Country <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. India"
              value={newAddress.country}
              onChange={e => handleInputChange('country', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] transition-colors focus:outline-none ${
                fieldErrors.country ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.country && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.country}</span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            disabled={isSaving}
            className="sm:col-span-2 py-3.5 chrome-button text-xs uppercase tracking-widest font-semibold disabled:opacity-50 cursor-pointer mt-2"
          >
            {isSaving ? 'Saving Destination...' : 'Confirm Destination'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs uppercase tracking-wider text-center mt-3">
            {error}
          </div>
        )}
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-xs text-[#888888] uppercase tracking-widest">
          No saved destinations found in your registry
        </p>
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 border border-white/20 text-xs uppercase tracking-widest text-[#C0C0C0] hover:text-white hover:border-white transition-all cursor-pointer"
        >
          Add Shipping Destination
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-[0.2em] text-white">Saved Destinations</h3>
        <button
          type="button"
          onClick={() => {
            setIsAdding(true);
            setError('');
            setFieldErrors({});
          }}
          className="text-[10px] uppercase tracking-widest text-[#C0C0C0] hover:text-white transition-colors cursor-pointer"
        >
          + Add New Destination
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            onClick={() => onSelectAddress(addr)}
            className={`p-4 border transition-all cursor-pointer ${
              selectedAddress?.id === addr.id
                ? 'border-white bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'border-white/10 bg-[#080808] text-[#888888] hover:border-white/30'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-white">{addr.fullName}</span>
              {addr.isDefault && (
                <span className="text-[9px] uppercase tracking-widest bg-white/10 px-1.5 py-0.5 text-white">
                  Default
                </span>
              )}
            </div>
            <div className="text-[10px] leading-relaxed font-light text-[#A0A0A0]">
              {addr.addressLine1}
              {addr.addressLine2 && `, ${addr.addressLine2}`}
              <br />
              {addr.city}, {addr.state} - {addr.pincode}
              <br />
              {addr.country}
              <div className="text-[9px] text-[#707070] mt-1">Tel: {addr.phone}</div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs uppercase tracking-wider text-center mt-3">
          {error}
        </div>
      )}
    </div>
  );
});

AddressSelector.displayName = 'AddressSelector';

export default AddressSelector;
