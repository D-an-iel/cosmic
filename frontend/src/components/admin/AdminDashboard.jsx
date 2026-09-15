import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  TrendingUp,
  Package,
  CircleDollarSign,
  Zap,
  Clock,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setMetrics(data.data);
      } else {
        setError(data.message || 'Failed to fetch maison metrics');
      }
    } catch (err) {
      setError('Unable to connect to Atelier metrics service');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Poll telemetry every 30s
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#C0C0C0] rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-[0.25em] text-[#707070]">
          Synchronizing Maison Telemetry...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#707070] block mb-1">
            Executive Operations • Real-Time Telemetry
          </span>
          <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-white">
            Vue d'Ensemble // Atelier
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-white/10 hover:border-white/25 text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Vault</span>
          </button>

          <Link
            to="/admin/orders"
            className="chrome-button px-4 py-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 rounded-sm"
          >
            <span>Open Order Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-500/30 text-red-200 text-xs">
          {error}
        </div>
      )}

      {/* 1. KPI TELEMETRY RIBBON (4 METRIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1: Gross Revenue */}
        <div className="bg-[#080808] border border-white/10 p-5 rounded-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[#808080] mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em]">Gross Revenue (Today)</span>
            <CircleDollarSign className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <div className="font-serif text-2xl lg:text-3xl text-white tracking-wide mb-2">
            ₹{metrics?.todayRevenue ? metrics.todayRevenue.toLocaleString('en-IN') : '0'}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-medium">
              ↑ {metrics?.revenueGrowth || '+0.0'}%
            </span>
            <span className="text-[#606060] text-[11px]">vs previous cycle</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-[#707070] flex justify-between">
            <span>Cumulative Vault:</span>
            <span className="font-mono text-white">
              ₹{metrics?.grossRevenue ? metrics.grossRevenue.toLocaleString('en-IN') : '0'}
            </span>
          </div>
        </div>

        {/* Card 2: Orders In Queue */}
        <div className="bg-[#080808] border border-white/10 p-5 rounded-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[#808080] mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em]">Orders In Queue</span>
            <Package className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <div className="font-serif text-2xl lg:text-3xl text-white tracking-wide mb-2">
            {metrics?.totalOrdersCount || 0} Pieces
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-wider rounded-sm">
              {metrics?.awaitingDispatchCount || 0} Awaiting Dispatch
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-[#707070] flex justify-between">
            <span>Pipeline Status:</span>
            <span className="text-emerald-400">Atelier Active</span>
          </div>
        </div>

        {/* Card 3: Average Order Value */}
        <div className="bg-[#080808] border border-white/10 p-5 rounded-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[#808080] mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em]">Average Order Value (AOV)</span>
            <Sparkles className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <div className="font-serif text-2xl lg:text-3xl text-white tracking-wide mb-2">
            ₹{metrics?.aov ? metrics.aov.toLocaleString('en-IN') : '0'}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#C0C0C0] text-[11px]">Solid 925 & Liquid Rhodium</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-[#707070] flex justify-between">
            <span>Top Acquisition:</span>
            <span className="text-white">Lunar Silver Ring</span>
          </div>
        </div>

        {/* Card 4: Fulfillment Velocity */}
        <div className="bg-[#080808] border border-white/10 p-5 rounded-sm relative overflow-hidden group hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-[#808080] mb-3">
            <span className="text-[10px] uppercase tracking-[0.2em]">Fulfillment Velocity</span>
            <Zap className="w-4 h-4 text-[#C0C0C0]" />
          </div>
          <div className="font-serif text-2xl lg:text-3xl text-white tracking-wide mb-2">
            {metrics?.fulfillmentVelocity || '94.2%'}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-medium">Avg {metrics?.avgHoursToShip || '4.2h'}</span>
            <span className="text-[#606060] text-[11px]">to BlueDart dispatch</span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-[#707070] flex justify-between">
            <span>Air Express Target:</span>
            <span className="font-mono text-white">&lt; 24h</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN SECTION: URGENT DISPATCH QUEUE & VAULT ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (8 Cols): Urgent Dispatch Queue */}
        <div className="lg:col-span-8 bg-[#080808] border border-white/10 p-5 md:p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Urgent Dispatch Queue
              </h2>
              <p className="text-[11px] text-[#707070]">
                Awaiting workshop verification, certificate generation, and airway packaging
              </p>
            </div>
            <Link
              to="/admin/orders?status=PROCESSING"
              className="text-xs text-[#C0C0C0] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>View All ({metrics?.awaitingDispatchCount || 0})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {metrics?.urgentQueue?.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#606060]">
              All current orders have been dispatched. No pending fulfillment backlog.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-[#606060]">
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Patron</th>
                    <th className="py-2.5 px-3">Fine Jewelry Piece</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {metrics?.urgentQueue?.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => navigate(`/admin/orders/${item.id}`)}
                      className="hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-3 font-mono text-white font-medium">
                        #{item.orderNumber}
                      </td>
                      <td className="py-3 px-3 text-[#C0C0C0]">
                        {item.patron}
                      </td>
                      <td className="py-3 px-3 text-[#909090]">
                        {item.pieces?.[0]?.name || 'Fine Jewelry'}
                        {item.pieces?.length > 1 && ` +${item.pieces.length - 1} more`}
                      </td>
                      <td className="py-3 px-3 font-mono text-white">
                        ₹{item.total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 border border-white/15 text-[10px] uppercase tracking-wider text-white transition-all rounded-sm">
                          Pack Dossier →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right (4 Cols): Atelier Vault Alerts (Low Stock) */}
        <div className="lg:col-span-4 bg-[#080808] border border-white/10 p-5 md:p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Vault Alarms
              </h2>
              <p className="text-[11px] text-[#707070]">
                Critical stock depletion at workbench
              </p>
            </div>
            <Link
              to="/admin/products"
              className="text-xs text-[#C0C0C0] hover:text-white transition-colors"
            >
              Vault →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics?.lowStockProducts?.map((p) => {
              const isCritical = p.stock <= 2;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate('/admin/products')}
                  className="p-3 bg-[#0E0E0E] border border-white/5 hover:border-white/20 transition-all cursor-pointer rounded-sm flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs text-white font-medium truncate">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-[#707070] uppercase tracking-wider">
                      {p.category} • ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm ${
                        isCritical
                          ? 'bg-red-950/50 border border-red-500/40 text-red-300 animate-pulse'
                          : 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {p.stock} in Vault
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. LOWER TELEMETRY & ACTIVITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 Cols): Velocity Visualizer */}
        <div className="lg:col-span-7 bg-[#080808] border border-white/10 p-5 md:p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Revenue Velocity Spectrum
              </h2>
              <p className="text-[11px] text-[#707070]">
                24-Hour Acquisition Distribution
              </p>
            </div>
            <div className="flex gap-1 text-[10px] font-mono text-[#808080]">
              <span className="px-2 py-1 bg-white/10 text-white rounded-sm">24H</span>
              <span className="px-2 py-1 hover:text-white cursor-pointer">7D</span>
              <span className="px-2 py-1 hover:text-white cursor-pointer">30D</span>
            </div>
          </div>

          {/* Minimalist Architectural CSS Bar Graph */}
          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
            {[45, 62, 35, 78, 92, 54, 88, 100, 72, 60, 85, 95].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-white/5 group-hover:bg-[#C0C0C0] transition-all rounded-t-sm relative flex items-end justify-center"
                     style={{ height: `${val}%` }}>
                  <div className="absolute -top-7 bg-[#1A1A1A] border border-white/20 text-[9px] font-mono px-1.5 py-0.5 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{(val * 1800).toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-[9px] font-mono text-[#606060]">
                  {`${(idx * 2).toString().padStart(2, '0')}h`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right (5 Cols): Live Activity Feed */}
        <div className="lg:col-span-5 bg-[#080808] border border-white/10 p-5 md:p-6 rounded-sm space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Maison Stream
              </h2>
              <p className="text-[11px] text-[#707070]">
                Live settlements, courier scans & patron actions
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {metrics?.activityStream?.map((item) => (
              <div key={item.id} className="flex items-start gap-3 text-xs border-b border-white/5 pb-2.5 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C0C0C0] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#D0D0D0] text-[11px] leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] font-mono text-[#606060]">
                    {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
