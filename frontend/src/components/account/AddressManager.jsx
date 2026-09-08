import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddressManager = () => {
  const { token } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (err) {
      setError('Failed to load destination registry');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    const name = (formData.fullName || '').trim();
    if (!name) {
      errors.fullName = 'Full Name is required';
    } else if (name.length < 2) {
      errors.fullName = 'Full Name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s'.]+$/.test(name)) {
      errors.fullName = 'Full Name should contain letters and spaces only';
    }

    const digitsOnly = (formData.phone || '').replace(/\D/g, '');
    if (!formData.phone || !formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      errors.phone = 'Phone number must be a valid 10-digit mobile number';
    }

    const addr1 = (formData.addressLine1 || '').trim();
    if (!addr1) {
      errors.addressLine1 = 'Street address is required';
    } else if (addr1.length < 5) {
      errors.addressLine1 = 'Address must be at least 5 characters';
    } else if (!/[a-zA-Z0-9]/.test(addr1)) {
      errors.addressLine1 = 'Address must include alphanumeric details (building, street, flat)';
    }

    const addr2 = (formData.addressLine2 || '').trim();
    if (addr2 && !/[a-zA-Z0-9]/.test(addr2)) {
      errors.addressLine2 = 'Must include alphanumeric details if provided';
    }

    const city = (formData.city || '').trim();
    if (!city) {
      errors.city = 'City is required';
    } else if (city.length < 2) {
      errors.city = 'City must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.-]+$/.test(city)) {
      errors.city = 'City should contain letters only';
    }

    const state = (formData.state || '').trim();
    if (!state) {
      errors.state = 'State is required';
    } else if (state.length < 2) {
      errors.state = 'State must be at least 2 characters';
    } else if (!/^[a-zA-Z\s.-]+$/.test(state)) {
      errors.state = 'State should contain letters only';
    }

    const pinDigits = (formData.pincode || '').replace(/\D/g, '');
    if (!formData.pincode || !formData.pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (pinDigits.length < 5 || pinDigits.length > 6) {
      errors.pincode = 'Pincode must be a 6-digit postal code';
    }

    const country = (formData.country || '').trim();
    if (!country) {
      errors.country = 'Country is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors) {
      setError('Please resolve the highlighted fields below');
      return;
    }

    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId
      ? `http://localhost:4000/api/addresses/${editingId}`
      : 'http://localhost:4000/api/addresses';

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim().replace(/\D/g, '').slice(-10),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2 ? formData.addressLine2.trim() : undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        country: formData.country.trim() || 'India',
        pincode: formData.pincode.trim(),
        isDefault: formData.isDefault || addresses.length === 0,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) {
        fetchAddresses();
        setIsAdding(false);
        setEditingId(null);
        setFormData({
          fullName: '', phone: '', addressLine1: '', addressLine2: '',
          city: '', state: '', country: 'India', pincode: '',
        });
        setFieldErrors({});
      } else {
        throw new Error(data.error || data.message || 'Registry update failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this destination from your registry?')) return;
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/api/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
      } else {
        throw new Error(data.error || data.message || 'Deletion failed');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setIsAdding(true);
    setFieldErrors({});
    setError('');
    setFormData({ ...addr });
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs uppercase tracking-widest text-[#666666] animate-pulse-subtle">
        Retrieving Destination Registry...
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-serif uppercase tracking-wider text-white">Atelier Destinations</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#808080] mt-1">
            Registered shipping coordinates for your acquisitions.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingId(null);
              setError('');
              setFieldErrors({});
              setFormData({
                fullName: '', phone: '', addressLine1: '', addressLine2: '',
                city: '', state: '', country: 'India', pincode: '',
              });
            }}
            className="px-4 py-2 border border-white/20 text-[10px] uppercase tracking-widest text-[#C0C0C0] hover:text-white hover:border-white transition-all cursor-pointer"
          >
            + Add New
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 border border-white/10 bg-white/5 backdrop-blur-md mb-12 animate-fadeIn">
          <div className="sm:col-span-2 flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-white font-medium">
              {editingId ? 'Refine Destination' : 'New Destination'}
            </span>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); setFieldErrors({}); setError(''); }}
              className="text-[10px] uppercase tracking-widest text-[#888888] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text" placeholder="e.g. Jean-Luc Delacroix" value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.fullName ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.fullName && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.fullName}</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Contact Number (10 Digits) <span className="text-red-400">*</span>
            </label>
            <input
              type="tel" placeholder="e.g. 9876543210" maxLength={13} value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.phone ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.phone && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.phone}</span>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Street Address / Building <span className="text-red-400">*</span> (Alphanumeric)
            </label>
            <input
              type="text" placeholder="e.g. 42 Rue du Faubourg Saint-Honoré, Suite 4B" value={formData.addressLine1}
              onChange={e => handleInputChange('addressLine1', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.addressLine1 ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.addressLine1 && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.addressLine1}</span>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">
              Apartment, Unit, Landmark (Optional)
            </label>
            <input
              type="text" placeholder="e.g. Near Place Vendôme" value={formData.addressLine2}
              onChange={e => handleInputChange('addressLine2', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.addressLine2 ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.addressLine2 && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.addressLine2}</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text" placeholder="e.g. Mumbai" value={formData.city}
              onChange={e => handleInputChange('city', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.city ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.city && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.city}</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              State <span className="text-red-400">*</span>
            </label>
            <input
              type="text" placeholder="e.g. Maharashtra" value={formData.state}
              onChange={e => handleInputChange('state', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.state ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.state && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.state}</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Postal Pincode <span className="text-red-400">*</span> (6 Digits)
            </label>
            <input
              type="text" placeholder="e.g. 400001" maxLength={6} value={formData.pincode}
              onChange={e => handleInputChange('pincode', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.pincode ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.pincode && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.pincode}</span>
            )}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#A0A0A0] mb-1">
              Country <span className="text-red-400">*</span>
            </label>
            <input
              type="text" placeholder="e.g. India" value={formData.country}
              onChange={e => handleInputChange('country', e.target.value)}
              className={`w-full bg-black border px-3 py-2 text-xs text-white placeholder-[#444444] focus:outline-none ${
                fieldErrors.country ? 'border-red-500/80 focus:border-red-400' : 'border-white/20 focus:border-white'
              }`}
            />
            {fieldErrors.country && (
              <span className="text-[10px] text-red-400 tracking-wider block mt-1">{fieldErrors.country}</span>
            )}
          </div>

          <button
            type="submit"
            className="sm:col-span-2 py-3 chrome-button text-xs uppercase tracking-widest font-bold cursor-pointer mt-2"
          >
            Confirm Registry Entry
          </button>
        </form>
      )}

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest text-center animate-fadeIn">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.length === 0 ? (
          <div className="md:col-span-2 py-20 text-center border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-xs uppercase tracking-widest text-[#666666]">No destinations registered in your archives.</p>
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`group relative p-6 border chrome-border-refined luxury-glass transition-all duration-500 ${
                addr.isDefault ? 'border-white/40 bg-white/[0.05]' : 'bg-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-white font-medium">
                    {addr.fullName}
                  </h3>
                  {addr.isDefault && (
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 block mt-1">
                      Primary Destination
                    </span>
                  )}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(addr)}
                    className="p-1.5 text-[#888888] hover:text-white transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572l16.732-16.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-[#888888] hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-[#A0A0A0] leading-relaxed font-light space-y-1">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                <p className="uppercase tracking-widest text-[#666666]">{addr.country}</p>
                <p className="text-[10px] text-[#888888]">Tel: {addr.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddressManager;
