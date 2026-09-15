import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Printer,
  ShieldCheck,
  Send,
  MessageCircle,
  ExternalLink,
  CreditCard,
  Building,
  UserCheck,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Luxury Presentation Checklist state
  const [checklist, setChecklist] = useState({
    velvetBox: true,
    certificate: true,
    polishingCloth: true,
    giftNote: false,
  });

  // Courier & Tracking State
  const [courierName, setCourierName] = useState('BlueDart Apex Air Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingAssigned, setTrackingAssigned] = useState(false);

  // Internal Notes State
  const [notes, setNotes] = useState([
    { id: 1, author: 'Maison System', text: 'Order authenticated & Razorpay settlement escrow verified.', time: 'At Order Creation' },
    { id: 2, author: 'Master Jeweller Marco', text: 'Piece inspected under 10x magnification. Rhodium sheen flawless.', time: '2 hours ago' },
  ]);
  const [newNote, setNewNote] = useState('');

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/admin/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
        if (!trackingNumber) {
          setTrackingNumber(`BD-${Date.now().toString().slice(-8)}`);
        }
      } else {
        setError(data.message || 'Order dossier could not be retrieved');
      }
    } catch (err) {
      setError('Connection to Atelier Order Service failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:4000/api/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setOrder((prev) => ({ ...prev, status: newStatus }));
        setNotes((prev) => [
          ...prev,
          {
            id: Date.now(),
            author: 'Atelier Director',
            text: `Order status advanced to ${newStatus}.`,
            time: 'Just now',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDispatchWithTracking = async () => {
    setUpdatingStatus(true);
    try {
      const response = await fetch(`http://localhost:4000/api/admin/orders/${id}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          courier: courierName,
          trackingNumber: trackingNumber,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setOrder((prev) => ({ ...prev, status: 'SHIPPED' }));
        setTrackingAssigned(true);
        setNotes((prev) => [
          ...prev,
          {
            id: Date.now(),
            author: 'Logistics Dispatch',
            text: `Airway bill ${trackingNumber} generated via ${courierName}. Status advanced to SHIPPED.`,
            time: 'Just now',
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to assign tracking:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Directeur Atelier',
        text: newNote.trim(),
        time: 'Just now',
      },
    ]);
    setNewNote('');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#C0C0C0] rounded-full animate-spin" />
        <span className="text-xs uppercase tracking-[0.25em] text-[#707070]">
          Decrypting Commande Dossier...
        </span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8 bg-[#0E0E0E] border border-red-500/30 text-center space-y-4 rounded-sm">
        <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-300">{error || 'Order not found'}</p>
        <Link to="/admin/orders" className="text-xs text-[#C0C0C0] hover:text-white underline">
          ← Return to Master Order Ledger
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'PENDING', label: 'Order Registered' },
    { key: 'PROCESSING', label: 'In Atelier Workshop' },
    { key: 'SHIPPED', label: 'Air Courier Dispatched' },
    { key: 'DELIVERED', label: 'Hand Delivered' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'PROCESSING':
        return 1;
      case 'SHIPPED':
        return 2;
      case 'DELIVERED':
        return 3;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Dossier Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            to="/admin/orders"
            className="text-xs text-[#707070] hover:text-white transition-colors inline-flex items-center gap-1.5 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Master Order Ledger</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl md:text-3xl uppercase tracking-wider text-white">
              Dossier #{order.orderNumber}
            </h1>
            <span className="px-2.5 py-0.5 bg-white/10 border border-white/15 text-[10px] font-mono text-white rounded-sm">
              {order.status}
            </span>
          </div>
          <p className="text-[11px] text-[#707070] mt-1 font-mono">
            Placed on {new Date(order.createdAt).toLocaleString('en-GB')} • Direct Atelier Escrow
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-white/10 hover:border-white/25 text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Packing Slip</span>
          </button>

          <button
            onClick={() => alert('Certificate of Authenticity assay document prepared for high-res printing.')}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#121212] border border-white/10 hover:border-white/25 text-xs text-[#C0C0C0] hover:text-white transition-all cursor-pointer rounded-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#C0C0C0]" />
            <span>Assay Certificate</span>
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE FULFILLMENT STEPPER */}
      <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#707070]">
            Fulfillment Advancement Pipeline
          </span>
          <div className="flex items-center gap-2">
            {order.status === 'PENDING' && (
              <button
                disabled={updatingStatus}
                onClick={() => handleUpdateStatus('PROCESSING')}
                className="px-3.5 py-1.5 chrome-button text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Advance to Atelier Workshop →
              </button>
            )}
            {order.status === 'PROCESSING' && (
              <button
                disabled={updatingStatus}
                onClick={handleDispatchWithTracking}
                className="px-3.5 py-1.5 chrome-button text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Verify & Dispatch Air Courier →
              </button>
            )}
            {order.status === 'SHIPPED' && (
              <button
                disabled={updatingStatus}
                onClick={() => handleUpdateStatus('DELIVERED')}
                className="px-3.5 py-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold uppercase tracking-wider rounded-sm cursor-pointer"
              >
                Confirm Final Delivery (Delivered)
              </button>
            )}
          </div>
        </div>

        {/* Stepper Track */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step.key}
                onClick={() => handleUpdateStatus(step.key)}
                className={`p-3.5 border rounded-sm transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-white/10 border-[#C0C0C0] text-white shadow-[0_0_15px_rgba(192,192,192,0.15)]'
                    : isCompleted
                    ? 'bg-[#0E0E0E] border-white/20 text-[#C0C0C0]'
                    : 'bg-[#060606] border-white/5 text-[#505050] hover:border-white/15'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#707070]">
                    STAGE 0{idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="text-xs font-medium tracking-wide">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TWO-COLUMN OPERATIONAL DOSSIER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (8 COLS): LINE ITEMS, PACKAGING, FINANCIALS */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. Line Items */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Order Line Items & Craft Specifications
            </h2>

            <div className="divide-y divide-white/5">
              {order.orderItems?.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#121212] border border-white/10 rounded-sm overflow-hidden shrink-0 flex items-center justify-center text-xs text-[#606060]">
                      <Package className="w-6 h-6 text-[#C0C0C0]" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm text-white font-medium">
                        {item.product?.name || 'Lunar Silver Ring'}
                      </div>
                      <div className="text-[11px] font-mono text-[#808080]">
                        SKU: {item.product?.slug ? item.product.slug.toUpperCase() : 'CSR-LUN-925-08'}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-[#A0A0A0]">
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm">
                          Material: Solid 925 Sterling Silver
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm">
                          Finish: Liquid Rhodium Dip
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm">
                          Size: US 8 (Atelier 18.2mm)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-mono text-white text-sm font-semibold">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-[#707070]">
                      Qty: {item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. Luxury Presentation Checklist */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C0C0C0]" />
                Haute Joaillerie Presentation Checklist
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">
                REQUIRED BEFORE DISPATCH
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-3 p-3 bg-[#0E0E0E] border border-white/5 rounded-sm cursor-pointer hover:border-white/15 transition-all">
                <input
                  type="checkbox"
                  checked={checklist.velvetBox}
                  onChange={(e) => setChecklist({ ...checklist, velvetBox: e.target.checked })}
                  className="rounded border-white/20 text-[#C0C0C0] focus:ring-0 cursor-pointer"
                />
                <span className="text-[#C0C0C0]">Signature Velvet Cosmic Presentation Box</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#0E0E0E] border border-white/5 rounded-sm cursor-pointer hover:border-white/15 transition-all">
                <input
                  type="checkbox"
                  checked={checklist.certificate}
                  onChange={(e) => setChecklist({ ...checklist, certificate: e.target.checked })}
                  className="rounded border-white/20 text-[#C0C0C0] focus:ring-0 cursor-pointer"
                />
                <span className="text-[#C0C0C0]">Certificate of Authenticity & Assay Card</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#0E0E0E] border border-white/5 rounded-sm cursor-pointer hover:border-white/15 transition-all">
                <input
                  type="checkbox"
                  checked={checklist.polishingCloth}
                  onChange={(e) => setChecklist({ ...checklist, polishingCloth: e.target.checked })}
                  className="rounded border-white/20 text-[#C0C0C0] focus:ring-0 cursor-pointer"
                />
                <span className="text-[#C0C0C0]">Microfiber Liquid Rhodium Polishing Cloth</span>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[#0E0E0E] border border-white/5 rounded-sm cursor-pointer hover:border-white/15 transition-all">
                <input
                  type="checkbox"
                  checked={checklist.giftNote}
                  onChange={(e) => setChecklist({ ...checklist, giftNote: e.target.checked })}
                  className="rounded border-white/20 text-[#C0C0C0] focus:ring-0 cursor-pointer"
                />
                <span className="text-[#C0C0C0]">Handwritten Atelier Calligraphy Note</span>
              </label>
            </div>
          </div>

          {/* C. Financial & Payment Telemetry */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#C0C0C0]" />
              Financial & Razorpay Telemetry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2 text-[#A0A0A0]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complimentary Insured Air Courier:</span>
                  <span className="font-mono text-emerald-400">₹0.00 (Gratis)</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Fine Silver GST (3%):</span>
                  <span className="font-mono text-[#808080]">
                    ₹{(order.total * 0.03).toFixed(2)} (Included)
                  </span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Total Amount Paid:</span>
                  <span className="font-mono text-base">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="p-3 bg-[#0E0E0E] border border-white/5 rounded-sm space-y-2 font-mono text-[11px]">
                <div className="text-[10px] uppercase text-[#707070] font-sans">Payment Escrow Data</div>
                <div className="flex justify-between text-[#808080]">
                  <span>Gateway:</span>
                  <span className="text-white">Razorpay Standard</span>
                </div>
                <div className="flex justify-between text-[#808080]">
                  <span>Payment ID:</span>
                  <span className="text-[#C0C0C0]">
                    {order.payment?.razorpayPaymentId || 'pay_P8x1892k1992'}
                  </span>
                </div>
                <div className="flex justify-between text-[#808080]">
                  <span>Escrow Status:</span>
                  <span className="text-emerald-400">CAPTURED & SETTLED</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 COLS): PATRON DOSSIER, ADDRESS & AWB, ATELIER NOTES */}
        <div className="lg:col-span-4 space-y-6">
          {/* A. Patron VIP Dossier */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                Patron Dossier
              </h2>
              <span className="px-2 py-0.5 bg-white/10 border border-white/20 text-[9px] font-mono text-white rounded-sm">
                {order.patronDossier?.tier || 'MAISON OBSIDIAN VIP'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-white font-medium text-sm">
                  {order.user?.name || 'Vikramaditya Sharma'}
                </div>
                <div className="text-[#808080]">{order.user?.email || 'patron@cosmic.com'}</div>
                <div className="text-[#808080]">{order.user?.phone || '+91 98201 99882'}</div>
              </div>

              <div className="p-3 bg-[#0E0E0E] border border-white/5 rounded-sm space-y-1 font-mono text-[11px]">
                <div className="flex justify-between text-[#808080]">
                  <span>Lifetime Spend (LTV):</span>
                  <span className="text-white">
                    ₹{order.patronDossier?.ltv ? order.patronDossier.ltv.toLocaleString('en-IN') : order.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#808080]">
                  <span>Historical Orders:</span>
                  <span className="text-white">{order.patronDossier?.totalOrders || 1} Orders</span>
                </div>
              </div>

              {order.user?.phone && (
                <a
                  href={`https://wa.me/${order.user.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center gap-2 rounded-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp VIP Concierge</span>
                </a>
              )}
            </div>
          </div>

          {/* B. Destination & Airway Bill (AWB) */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C0C0C0]" />
              Shipping Destination & Airway Bill
            </h2>

            <div className="space-y-3 text-xs">
              <div className="text-[#C0C0C0] leading-relaxed">
                <p className="text-white font-medium">{order.address?.fullName || order.user?.name}</p>
                <p>{order.address?.addressLine1}</p>
                {order.address?.addressLine2 && <p>{order.address?.addressLine2}</p>}
                <p>
                  {order.address?.city}, {order.address?.state} -{' '}
                  <span className="font-mono text-white">{order.address?.pincode}</span>
                </p>
                <p>{order.address?.country}</p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <label className="block text-[10px] uppercase tracking-wider text-[#707070]">
                  Courier Service Partner
                </label>
                <select
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 px-3 py-2 text-xs text-white rounded-sm outline-none"
                >
                  <option value="BlueDart Apex Air Express">BlueDart Apex Air Express</option>
                  <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                  <option value="Armored Vault Courier (Mumbai/Delhi)">Armored Vault Courier</option>
                </select>

                <label className="block text-[10px] uppercase tracking-wider text-[#707070] pt-2">
                  Airway Bill (AWB) / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#111111] border border-white/15 px-3 py-2 text-xs font-mono text-white rounded-sm outline-none"
                />

                <button
                  type="button"
                  onClick={handleDispatchWithTracking}
                  className="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white uppercase tracking-wider rounded-sm transition-all font-medium cursor-pointer"
                >
                  Assign AWB & Notify Patron
                </button>
              </div>
            </div>
          </div>

          {/* C. Internal Atelier Notes & Audit Trail */}
          <div className="bg-[#080808] border border-white/10 p-6 rounded-sm space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3">
              Atelier Notes & Audit Trail
            </h2>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
              {notes.map((n) => (
                <div key={n.id} className="p-2.5 bg-[#0E0E0E] border border-white/5 rounded-sm space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-white">{n.author}</span>
                    <span className="text-[#606060] font-mono">{n.time}</span>
                  </div>
                  <p className="text-[#A0A0A0] text-[11px] leading-relaxed">{n.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add confidential atelier note..."
                className="flex-1 bg-[#111111] border border-white/15 px-3 py-2 text-xs text-white placeholder-[#505050] outline-none rounded-sm"
              />
              <button
                type="submit"
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
