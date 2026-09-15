import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Gem,
  Search,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  Sliders,
  DollarSign,
  Package
} from 'lucide-react';

export default function AdminProducts() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Restock Drawer State
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockDelta, setRestockDelta] = useState(10);
  const [restocking, setRestocking] = useState(false);

  // Edit Product Modal State
  const [editProduct, setEditProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || 'Failed to retrieve vault catalog');
      }
    } catch (err) {
      setError('Connection to Atelier Vault failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    if (!restockProduct) return;
    setRestocking(true);

    const newStock = Math.max(0, restockProduct.stock + Number(restockDelta));

    try {
      const response = await fetch(`http://localhost:4000/api/admin/products/${restockProduct.id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ stock: newStock }),
      });
      const data = await response.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === restockProduct.id ? { ...p, stock: newStock } : p))
        );
        setRestockProduct(null);
      }
    } catch (err) {
      console.error('Stock update failed:', err);
    } finally {
      setRestocking(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setSavingEdit(true);

    try {
      const response = await fetch(`http://localhost:4000/api/admin/products/${editProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });
      const data = await response.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editProduct.id ? { ...p, ...editFormData } : p))
        );
        setEditProduct(null);
      }
    } catch (err) {
      console.error('Failed to save piece details:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (p.category && p.category.toLowerCase().includes(activeCategory.toLowerCase()));
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Calculate vault stats
  const totalVaultUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => (p.stock || 0) <= 5).length;
  const totalValuation = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
            Fine Jewelry Catalog & Metal Vault
          </span>
          <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-white">
            Catalogue & Pièces // Vault Matrix
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2 bg-[#121212] border border-white/10 hover:border-white/25 text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
            title="Refresh Vault"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. VAULT STATS RIBBON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#080808] border border-white/10 p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#707070] mb-1">Active Pieces</div>
          <div className="font-serif text-2xl text-white">{products.length} Designs</div>
          <div className="text-[10px] text-[#A0A0A0] mt-1">925 Silver & Liquid Rhodium</div>
        </div>

        <div className="bg-[#080808] border border-white/10 p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#707070] mb-1">Total Vault Units</div>
          <div className="font-serif text-2xl text-white">{totalVaultUnits} Units</div>
          <div className="text-[10px] text-emerald-400 mt-1">Ready for Dispatch</div>
        </div>

        <div className="bg-[#080808] border border-white/10 p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#707070] mb-1">Low Stock Alarms</div>
          <div className="font-serif text-2xl text-amber-400">{lowStockCount} Critical</div>
          <div className="text-[10px] text-[#808080] mt-1">Depleted sizes at bench</div>
        </div>

        <div className="bg-[#080808] border border-white/10 p-4 rounded-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#707070] mb-1">Vault Inventory Value</div>
          <div className="font-serif text-2xl text-white">₹{totalValuation.toLocaleString('en-IN')}</div>
          <div className="text-[10px] text-[#A0A0A0] mt-1">Retail Valuation</div>
        </div>
      </div>

      {/* 2. CATEGORY TABS & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: 'ALL', label: 'All Pièces' },
            { key: 'ring', label: 'Rings & Bands' },
            { key: 'necklace', label: 'Pendants & Chains' },
            { key: 'cuff', label: 'Ear Cuffs & Bracelets' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-sm ${
                activeCategory === cat.key
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-[#707070] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search piece title or SKU..."
            className="w-full bg-[#0E0E0E] border border-white/15 px-3 py-1.5 pl-8 text-xs text-white placeholder-[#505050] outline-none focus:border-[#C0C0C0] rounded-sm"
          />
          <Search className="w-3.5 h-3.5 text-[#606060] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* 3. INVENTORY MATRIX TABLE */}
      <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-[#C0C0C0] rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#707070]">Loading Vault Inventory...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Package className="w-8 h-8 text-[#404040] mx-auto" />
            <p className="text-xs text-[#707070] uppercase tracking-wider">No jewelry pieces match criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#0C0C0C] text-[10px] uppercase tracking-wider text-[#707070]">
                  <th className="py-3 px-4">Piece Title & SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Retail Price</th>
                  <th className="py-3 px-4">Compare At</th>
                  <th className="py-3 px-4">Sizing Matrix / Vault Stock</th>
                  <th className="py-3 px-4">Vault Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map((p) => {
                  const isLow = (p.stock || 0) <= 5;

                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white group-hover:text-[#C0C0C0] transition-colors">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#707070]">
                          SKU: {p.slug ? p.slug.toUpperCase() : 'CSR-PIECE'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A0A0A0] uppercase tracking-wider text-[10px]">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-white">
                        ₹{Number(p.price).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#606060]">
                        {p.comparePrice ? `₹${Number(p.comparePrice).toLocaleString('en-IN')}` : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {/* Ring Size Breakdown Matrix */}
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => {
                              setRestockProduct(p);
                              setRestockDelta(10);
                            }}
                            className="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono rounded cursor-pointer transition-all"
                            title="Click to update units"
                          >
                            Sz 7: {Math.max(1, Math.floor((p.stock || 10) * 0.3))}
                          </button>
                          <button
                            onClick={() => {
                              setRestockProduct(p);
                              setRestockDelta(10);
                            }}
                            className={`px-2 py-0.5 border text-[10px] font-mono rounded cursor-pointer transition-all ${
                              isLow
                                ? 'bg-red-950/40 border-red-500/30 text-red-300 animate-pulse'
                                : 'bg-white/5 hover:bg-white/15 border-white/10 text-white'
                            }`}
                            title="Click to update units"
                          >
                            Sz 8: {p.stock}
                          </button>
                          <button
                            onClick={() => {
                              setRestockProduct(p);
                              setRestockDelta(10);
                            }}
                            className="px-2 py-0.5 bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] font-mono rounded cursor-pointer transition-all"
                            title="Click to update units"
                          >
                            Sz 9: {Math.max(1, Math.floor((p.stock || 10) * 0.4))}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isLow ? (
                          <span className="px-2 py-0.5 bg-red-950/50 border border-red-500/30 text-red-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
                            AVAILABLE ({p.stock})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setRestockProduct(p);
                              setRestockDelta(10);
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase tracking-wider rounded-sm transition-all cursor-pointer"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => {
                              setEditProduct(p);
                              setEditFormData({
                                name: p.name,
                                price: p.price,
                                comparePrice: p.comparePrice || '',
                                stock: p.stock,
                                category: p.category,
                                description: p.description || '',
                              });
                            }}
                            className="p-1 text-[#707070] hover:text-white transition-colors cursor-pointer"
                            title="Edit Piece Parameters"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. QUICK INLINE RESTOCK DRAWER */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0E0E0E] border border-white/20 p-6 shadow-2xl space-y-6 animate-fadeIn rounded-sm">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                  Atelier Vault Adjustment
                </span>
                <h3 className="font-serif text-lg text-white">{restockProduct.name}</h3>
              </div>
              <button onClick={() => setRestockProduct(null)} className="text-[#707070] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#141414] border border-white/5 rounded-sm flex justify-between font-mono">
                <span className="text-[#808080]">Current Registered Stock:</span>
                <span className="text-white font-bold">{restockProduct.stock} units</span>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1.5">
                  Units to Add / Subtract (e.g. +15 or -2)
                </label>
                <input
                  type="number"
                  value={restockDelta}
                  onChange={(e) => setRestockDelta(e.target.value)}
                  className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white font-mono text-sm rounded-sm outline-none focus:border-[#C0C0C0]"
                  required
                />
              </div>

              <div className="p-3 bg-[#141414] border border-white/5 rounded-sm flex justify-between font-mono">
                <span className="text-[#808080]">Calculated New Vault Stock:</span>
                <span className="text-emerald-400 font-bold">
                  {Math.max(0, restockProduct.stock + Number(restockDelta))} units
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setRestockProduct(null)}
                  className="px-4 py-2 text-xs text-[#808080] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={restocking}
                  className="chrome-button px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm cursor-pointer disabled:opacity-50"
                >
                  {restocking ? 'Synchronizing...' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. EDIT PRODUCT MODAL */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0E0E0E] border border-white/20 p-6 shadow-2xl space-y-6 animate-fadeIn rounded-sm max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                  Edit Fine Piece Parameters
                </span>
                <h3 className="font-serif text-lg text-white">{editProduct.name}</h3>
              </div>
              <button onClick={() => setEditProduct(null)} className="text-[#707070] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                  Piece Title
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white rounded-sm outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white font-mono rounded-sm outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Compare-At Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    value={editFormData.comparePrice}
                    onChange={(e) => setEditFormData({ ...editFormData, comparePrice: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white font-mono rounded-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white rounded-sm outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                    Total Vault Stock
                  </label>
                  <input
                    type="number"
                    value={editFormData.stock}
                    onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                    className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white font-mono rounded-sm outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#A0A0A0] mb-1">
                  Atelier Craft Description
                </label>
                <textarea
                  rows={3}
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-[#161616] border border-white/15 px-3 py-2 text-white rounded-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 text-xs text-[#808080] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="chrome-button px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm cursor-pointer disabled:opacity-50"
                >
                  {savingEdit ? 'Updating...' : 'Publish Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
