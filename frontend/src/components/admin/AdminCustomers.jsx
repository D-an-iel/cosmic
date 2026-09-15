import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Users,
  Search,
  Download,
  ExternalLink,
  MessageCircle,
  Clock,
  Sparkles,
  MapPin,
  Package,
  X,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';

export default function AdminCustomers() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTier, setActiveTier] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTier !== 'ALL') params.append('tier', activeTier);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const response = await fetch(`http://localhost:4000/api/admin/customers?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      } else {
        setError(data.message || 'Failed to retrieve patron directory');
      }
    } catch (err) {
      setError('Connection to Atelier Clientèle Service failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [activeTier]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const getTierBadge = (tier) => {
    if (tier === 'MAISON OBSIDIAN VIP') {
      return (
        <span className="px-2 py-0.5 bg-white/10 border border-white/25 text-white text-[9px] font-mono uppercase tracking-widest rounded-sm">
          OBSIDIAN VIP
        </span>
      );
    }
    if (tier === 'GOLD CIRCLE') {
      return (
        <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[9px] font-mono uppercase tracking-widest rounded-sm">
          GOLD CIRCLE
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[#808080] text-[9px] font-mono uppercase tracking-widest rounded-sm">
        CONNOISSEUR
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
            VIP Patron Directory & Concierge Dossiers
          </span>
          <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-white">
            Clientèle Maison // Directory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting VIP Patron Ledger CSV...')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-white/10 hover:border-white/25 text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export VIP Roster</span>
          </button>
          <button
            onClick={fetchCustomers}
            className="p-2 bg-[#121212] border border-white/10 hover:border-white/25 text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
            title="Refresh Clientèle"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. PATRON TIERS TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px">
        {[
          { key: 'ALL', label: 'All Patrons' },
          { key: 'MAISON OBSIDIAN VIP', label: 'Maison Obsidian VIP (>₹40k)' },
          { key: 'GOLD CIRCLE', label: 'Gold Circle (>₹15k)' },
          { key: 'NEW CONNOISSEUR', label: 'New Connoisseurs' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTier(tab.key)}
            className={`px-4 py-2.5 text-xs tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 font-medium ${
              activeTier === tab.key
                ? 'border-[#C0C0C0] text-white'
                : 'border-transparent text-[#707070] hover:text-[#C0C0C0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. SEARCH CONTROLS */}
      <form onSubmit={handleSearchSubmit} className="max-w-md relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patron by name, email, or phone number..."
          className="w-full bg-[#0E0E0E] border border-white/15 px-3.5 py-2.5 pl-10 text-xs text-white placeholder-[#505050] outline-none focus:border-[#C0C0C0] rounded-sm"
        />
        <Search className="w-4 h-4 text-[#606060] absolute left-3 top-3" />
      </form>

      {/* 3. PATRON DIRECTORY TABLE */}
      <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-[#C0C0C0] rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#707070]">Loading Patron Directory...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Users className="w-8 h-8 text-[#404040] mx-auto" />
            <p className="text-xs text-[#707070] uppercase tracking-wider">No patrons found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#0C0C0C] text-[10px] uppercase tracking-wider text-[#707070]">
                  <th className="py-3 px-4">Patron Name & Tier</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Primary Destination</th>
                  <th className="py-3 px-4">Acquisitions</th>
                  <th className="py-3 px-4">Lifetime Spend (LTV)</th>
                  <th className="py-3 px-4">Last Activity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white group-hover:text-[#C0C0C0] transition-colors">
                        {c.name || 'Private Patron'}
                      </div>
                      <div className="mt-1">{getTierBadge(c.tier)}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#A0A0A0]">
                      <div>{c.email}</div>
                      <div className="text-[10px] text-[#707070]">{c.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#C0C0C0]">
                      {c.addresses?.[0]?.city ? (
                        <span>
                          {c.addresses[0].city}, {c.addresses[0].country}
                        </span>
                      ) : (
                        <span className="text-[#505050]">Unspecified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">
                      {c.totalOrders} Piece(s)
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-white">
                      ₹{c.ltv.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-[#808080]">
                      {c.lastOrderDate ? (
                        new Date(c.lastOrderDate).toLocaleDateString('en-GB')
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(c);
                        }}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                      >
                        View Dossier →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. SLIDE-OVER PATRON DOSSIER */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-lg bg-[#0C0C0C] border-l border-white/15 h-full p-6 overflow-y-auto space-y-6 animate-fadeIn">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                  Patron Confidential Dossier
                </span>
                <h2 className="font-serif text-xl font-light text-white">
                  {selectedCustomer.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-[#707070] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VIP Tier Banner */}
            <div className="p-4 bg-[#111111] border border-white/10 rounded-sm flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[#808080]">Current Standing</div>
                <div className="font-mono text-sm text-white mt-0.5">{selectedCustomer.tier}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-[#808080]">Cumulative LTV</div>
                <div className="font-mono text-base font-bold text-white">
                  ₹{selectedCustomer.ltv.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Contact & Concierge */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#606060] block">
                Direct Maison Channels
              </span>
              <div className="p-3 bg-[#111111] border border-white/5 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Mail className="w-3.5 h-3.5 text-[#808080]" />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Phone className="w-3.5 h-3.5 text-[#808080]" />
                  <span>{selectedCustomer.phone || 'No direct phone logged'}</span>
                </div>
              </div>

              {selectedCustomer.phone && (
                <a
                  href={`https://wa.me/${selectedCustomer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 rounded-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Open WhatsApp VIP Concierge</span>
                </a>
              )}
            </div>

            {/* Atelier Sizing & Preferences */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#606060] block">
                Craft Preferences & Sizing
              </span>
              <div className="p-3 bg-[#111111] border border-white/5 rounded-sm space-y-1.5 text-[#A0A0A0]">
                <div className="flex justify-between">
                  <span>Standard Ring Size:</span>
                  <span className="text-white font-mono">US 8 (18.2mm)</span>
                </div>
                <div className="flex justify-between">
                  <span>Preferred Metal Finish:</span>
                  <span className="text-white">Solid 925 • Liquid Rhodium</span>
                </div>
                <div className="flex justify-between">
                  <span>Packaging Preference:</span>
                  <span className="text-white">Signature Velvet Cosmic Box</span>
                </div>
              </div>
            </div>

            {/* Delivery Addresses */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#606060] block">
                Registered Addresses ({selectedCustomer.addresses?.length || 0})
              </span>
              {selectedCustomer.addresses?.map((addr) => (
                <div key={addr.id} className="p-3 bg-[#111111] border border-white/5 rounded-sm text-[#A0A0A0] text-xs">
                  <p className="text-white font-medium">{addr.fullName}</p>
                  <p>{addr.addressLine1}</p>
                  <p>{addr.city}, {addr.state} - <span className="font-mono text-white">{addr.pincode}</span></p>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div className="space-y-2 text-xs">
              <span className="text-[10px] uppercase tracking-wider text-[#606060] block">
                Acquisition History
              </span>
              <div className="space-y-2">
                {selectedCustomer.orders?.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 bg-[#111111] border border-white/5 rounded-sm flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-medium text-white">#{ord.orderNumber}</div>
                      <div className="text-[10px] text-[#707070]">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB')} • {ord.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-white">₹{Number(ord.total).toLocaleString('en-IN')}</div>
                      <span className="text-[9px] font-mono text-emerald-400">{ord.paymentStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
