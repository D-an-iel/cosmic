import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  CheckSquare,
  Square,
  ExternalLink,
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  Truck,
  Eye,
  RefreshCw,
  X
} from 'lucide-react';

export default function AdminOrders() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [quickPreviewOrder, setQuickPreviewOrder] = useState(null);

  // Filter states
  const activeTab = searchParams.get('status') || 'ALL';
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 25 });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'ALL') params.append('status', activeTab);
      if (paymentFilter !== 'ALL') params.append('paymentStatus', paymentFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      params.append('page', page);
      params.append('limit', 25);

      const response = await fetch(`http://localhost:4000/api/admin/orders?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Connection to Atelier Order Ledger failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab, paymentFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleTabChange = (status) => {
    setPage(1);
    if (status === 'ALL') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ status });
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o.id));
    }
  };

  const toggleSelectOrder = (id, e) => {
    e.stopPropagation();
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      for (const id of selectedOrders) {
        await fetch(`http://localhost:4000/api/admin/orders/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });
      }
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      console.error('Bulk update error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
            Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2 py-0.5 bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
            In Atelier
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-2 py-0.5 bg-purple-950/40 border border-purple-500/30 text-purple-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
            Dispatched
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="px-2 py-0.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2 py-0.5 bg-red-950/40 border border-red-500/30 text-red-300 text-[10px] font-mono uppercase tracking-wider rounded-sm">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-mono uppercase tracking-wider rounded-sm">
            {status}
          </span>
        );
    }
  };

  const getTierBadge = (tier) => {
    if (tier === 'MAISON OBSIDIAN VIP') {
      return (
        <span className="px-1.5 py-0.5 bg-white/10 border border-white/20 text-[#FFFFFF] text-[9px] font-mono uppercase tracking-widest rounded-sm">
          OBSIDIAN VIP
        </span>
      );
    }
    if (tier === 'GOLD CIRCLE') {
      return (
        <span className="px-1.5 py-0.5 bg-amber-950/30 border border-amber-500/20 text-amber-300 text-[9px] font-mono uppercase tracking-widest rounded-sm">
          GOLD CIRCLE
        </span>
      );
    }
    return (
      <span className="px-1.5 py-0.5 bg-white/5 text-[#808080] text-[9px] font-mono uppercase tracking-widest rounded-sm">
        PATRON
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
            Fulfillment & Air Courier Pipeline
          </span>
          <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-white">
            Commandes // Master Ledger
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              // Export manifest mock
              alert('Exporting Maison Air Courier Manifest CSV...');
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-white/10 hover:border-white/25 text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Manifest</span>
          </button>
          <button
            onClick={fetchOrders}
            className="p-2 bg-[#121212] border border-white/10 hover:border-white/25 text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. STATUS TABS */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-px">
        {[
          { key: 'ALL', label: 'All Orders' },
          { key: 'PENDING', label: 'Pending Verification' },
          { key: 'PROCESSING', label: 'In Atelier' },
          { key: 'SHIPPED', label: 'Dispatched' },
          { key: 'DELIVERED', label: 'Delivered' },
          { key: 'CANCELLED', label: 'Cancelled' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-4 py-2.5 text-xs tracking-wider transition-all whitespace-nowrap cursor-pointer border-b-2 font-medium ${
              activeTab === tab.key
                ? 'border-[#C0C0C0] text-white'
                : 'border-transparent text-[#707070] hover:text-[#C0C0C0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number (#ORD-...), patron name, phone, or email..."
            className="w-full bg-[#0E0E0E] border border-white/15 px-4 py-2.5 pl-10 text-xs text-white placeholder-[#505050] outline-none focus:border-[#C0C0C0] transition-colors rounded-sm"
          />
          <Search className="w-4 h-4 text-[#606060] absolute left-3.5 top-3" />
        </div>

        <div className="sm:col-span-4 flex gap-2">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="flex-1 bg-[#0E0E0E] border border-white/15 px-3 py-2.5 text-xs text-[#C0C0C0] outline-none focus:border-[#C0C0C0] transition-colors rounded-sm cursor-pointer"
          >
            <option value="ALL">Payment: All</option>
            <option value="PAID">Paid / Captured</option>
            <option value="PENDING">Pending Settlement</option>
            <option value="FAILED">Failed</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white uppercase tracking-wider font-semibold rounded-sm transition-all cursor-pointer"
          >
            Filter
          </button>
        </div>
      </form>

      {/* 3. BULK ACTION BAR (Visible when 1+ selected) */}
      {selectedOrders.length > 0 && (
        <div className="bg-[#121212] border border-[#C0C0C0]/40 p-3 px-4 rounded-sm flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{selectedOrders.length}</span>
            <span className="text-[#A0A0A0]">orders selected for batch execution:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkStatusChange('PROCESSING')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] uppercase tracking-wider text-white transition-all rounded-sm cursor-pointer"
            >
              Move to Atelier Packing
            </button>
            <button
              onClick={() => handleBulkStatusChange('SHIPPED')}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] uppercase tracking-wider text-white transition-all rounded-sm cursor-pointer"
            >
              Batch Dispatch (BlueDart)
            </button>
            <button
              onClick={() => setSelectedOrders([])}
              className="text-xs text-[#808080] hover:text-white px-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* 4. MASTER ORDER LEDGER TABLE */}
      <div className="bg-[#080808] border border-white/10 rounded-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-[#C0C0C0] rounded-full animate-spin mx-auto" />
            <p className="text-xs uppercase tracking-widest text-[#707070]">
              Loading Order Ledger...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <Package className="w-8 h-8 text-[#404040] mx-auto" />
            <p className="text-xs text-[#707070] uppercase tracking-wider">
              No orders found matching the filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-[#0C0C0C] text-[10px] uppercase tracking-wider text-[#707070]">
                  <th className="py-3 px-4 w-10">
                    <button onClick={toggleSelectAll} className="cursor-pointer text-[#808080] hover:text-white">
                      {selectedOrders.length === orders.length && orders.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4">Order No.</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patron & Tier</th>
                  <th className="py-3 px-4">Fine Pieces</th>
                  <th className="py-3 px-4">Value</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => {
                  const isSelected = selectedOrders.includes(order.id);

                  return (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className={`hover:bg-white/5 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-white/5' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => toggleSelectOrder(order.id, e)}>
                        <button className="cursor-pointer text-[#606060] group-hover:text-white">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-white" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-white group-hover:text-[#C0C0C0] transition-colors">
                        #{order.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#808080] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-white truncate max-w-[140px]">
                          {order.user?.name || 'Private Client'}
                        </div>
                        <div className="mt-0.5">{getTierBadge(order.patronTier)}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A0A0A0]">
                        <div className="truncate max-w-[180px]">
                          {order.orderItems?.[0]?.name || 'Fine Jewelry Piece'}
                        </div>
                        {order.orderItems?.length > 1 && (
                          <span className="text-[10px] text-[#606060]">
                            +{order.orderItems.length - 1} additional piece(s)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-white">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        {order.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {order.paymentStatus}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickPreviewOrder(order);
                          }}
                          title="Quick Preview"
                          className="p-1.5 text-[#707070] hover:text-white transition-colors cursor-pointer mr-2 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[#606060] group-hover:text-white transition-colors text-xs">
                          →
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer & Pagination */}
        <div className="p-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#707070]">
          <div>
            Showing <span className="text-white font-medium">{orders.length}</span> of{' '}
            <span className="text-white font-medium">{pagination.total}</span> orders in Maison Ledger
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 bg-[#121212] border border-white/10 hover:border-white/20 disabled:opacity-40 disabled:pointer-events-none text-white rounded-sm"
            >
              Previous
            </button>
            <span className="font-mono text-white px-2">
              {page} / {pagination.totalPages || 1}
            </span>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-[#121212] border border-white/10 hover:border-white/20 disabled:opacity-40 disabled:pointer-events-none text-white rounded-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* 5. QUICK SLIDE-OVER DRAWER */}
      {quickPreviewOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0C0C0C] border-l border-white/15 h-full p-6 overflow-y-auto space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                  Quick Atelier Preview
                </span>
                <h2 className="font-mono text-base font-semibold text-white">
                  #{quickPreviewOrder.orderNumber}
                </h2>
              </div>
              <button
                onClick={() => setQuickPreviewOrder(null)}
                className="text-[#707070] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#606060] block mb-1">
                  Patron Information
                </span>
                <p className="text-white font-medium">{quickPreviewOrder.user?.name}</p>
                <p className="text-[#808080]">{quickPreviewOrder.user?.email}</p>
                <p className="text-[#808080]">{quickPreviewOrder.user?.phone || 'No phone'}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#606060] block mb-1">
                  Delivery Destination
                </span>
                <p className="text-[#C0C0C0]">
                  {quickPreviewOrder.address?.addressLine1}, {quickPreviewOrder.address?.city},{' '}
                  {quickPreviewOrder.address?.state} - {quickPreviewOrder.address?.pincode}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#606060] block mb-1">
                  Fine Pieces
                </span>
                <div className="space-y-2">
                  {quickPreviewOrder.orderItems?.map((item) => (
                    <div key={item.id} className="p-2.5 bg-[#121212] border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-[10px] text-[#707070]">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono text-white">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="text-[#808080]">Total Charged</span>
                <span className="font-mono font-bold text-white text-base">
                  ₹{quickPreviewOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  const id = quickPreviewOrder.id;
                  setQuickPreviewOrder(null);
                  navigate(`/admin/orders/${id}`);
                }}
                className="w-full py-3 chrome-button text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 rounded-sm cursor-pointer"
              >
                <span>Open Complete Dossier</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
