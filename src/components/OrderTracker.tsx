import React, { useState, useEffect } from 'react';
import { ClockOrder, OrderStage } from '../types/clock';
import { 
  subscribeToSingleOrder, 
  updateOrderStage, 
  isFirebaseConnected, 
  subscribeToOrders 
} from '../lib/firebase';
import { ClockCanvas } from './ClockCanvas';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Wrench, 
  Printer, 
  Activity, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface OrderTrackerProps {
  initialTracking?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ initialTracking = 'CHRONO-98421-US' }) => {
  const [searchQuery, setSearchQuery] = useState(initialTracking);
  const [order, setOrder] = useState<ClockOrder | null>(null);
  const [allOrders, setAllOrders] = useState<ClockOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newStatusNote, setNewStatusNote] = useState<string>('');
  const [selectedNextStage, setSelectedNextStage] = useState<OrderStage>('laser-cutting');

  // Subscribe to searched order
  useEffect(() => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    const unsubscribe = subscribeToSingleOrder(searchQuery, (data) => {
      setOrder(data);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [searchQuery]);

  // Subscribe to all orders for demo selector
  useEffect(() => {
    const unsub = subscribeToOrders((orders) => {
      setAllOrders(orders);
    });
    return () => unsub();
  }, []);

  const STAGES: { id: OrderStage; label: string; icon: any }[] = [
    { id: 'order-placed', label: 'Order Registered', icon: Clock },
    { id: 'material-sourcing', label: 'Timber & Metal Sourced', icon: Sparkles },
    { id: 'laser-cutting', label: 'CNC & Laser Engraving', icon: Wrench },
    { id: 'dial-printing', label: 'Dial UV Printing', icon: Printer },
    { id: 'assembly-calibration', label: 'Movement Assembly', icon: Activity },
    { id: 'quality-testing', label: '24hr QC Calibration', icon: ShieldCheck },
    { id: 'shipped', label: 'Shipped & En Route', icon: Truck },
  ];

  const getStageIndex = (stage: OrderStage) => {
    return STAGES.findIndex((s) => s.id === stage);
  };

  const currentStageIdx = order ? getStageIndex(order.currentStage) : 0;

  const handleAdminUpdateStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    const msg = newStatusNote.trim() || `Advanced stage to ${selectedNextStage}`;
    await updateOrderStage(order.id, selectedNextStage, msg, 'Master Craftsman');
    setNewStatusNote('');
  };

  return (
    <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold-400" />
            Real-Time Client Order Status Tracker
          </h2>
          <p className="text-xs text-slate-400">
            Monitor handcrafting stages, laser calibration, and live courier status via Firebase Firestore.
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter Order ID or Tracking Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0D12] border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-gold-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Demo Quick-Fill Order Buttons */}
      {allOrders.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
            Demo Active Orders:
          </span>
          {allOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => setSearchQuery(o.trackingNumber || o.id)}
              className={`px-3 py-1 rounded-lg border font-mono text-[11px] transition-all ${
                searchQuery === o.trackingNumber || searchQuery === o.id
                  ? 'border-gold-500 bg-gold-500/20 text-gold-300 font-bold'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
              }`}
            >
              {o.id} ({o.customerName})
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12 text-slate-400 text-xs animate-pulse">
          Fetching live Firestore record for {searchQuery}...
        </div>
      )}

      {/* Order Not Found */}
      {!isLoading && !order && (
        <div className="text-center py-12 text-slate-400 text-xs space-y-2">
          <p className="text-slate-300 font-semibold text-sm">No Active Order Found matching "{searchQuery}"</p>
          <p>Please check your tracking number or select one of the demo active orders above.</p>
        </div>
      )}

      {/* Active Order Details */}
      {!isLoading && order && (
        <div className="space-y-8">
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Client / Recipient
              </span>
              <div className="text-base font-bold text-slate-100">{order.customerName}</div>
              <div className="text-xs text-slate-400">{order.customerEmail}</div>
              <div className="text-xs font-mono text-gold-400 font-semibold mt-2">
                Order Ref: {order.id}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Custom Specs
              </span>
              <div className="text-sm font-semibold text-slate-200">
                {order.clockConfig.size}" {order.clockConfig.frameMaterial.toUpperCase()} FRAME
              </div>
              <div className="text-xs text-slate-400">
                Chime: {order.clockConfig.chime} • LED: {order.clockConfig.ledBacklight ? 'Yes' : 'No'}
              </div>
              <div className="text-xs font-mono text-slate-300 mt-2">
                Total Paid: ${order.totalAmount}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Estimated Delivery
                </span>
                <div className="text-base font-bold text-emerald-400">
                  {order.estimatedDeliveryDays} Business Days
                </div>
              </div>
              <div className="w-20 h-20 shrink-0 mt-2">
                <ClockCanvas config={order.clockConfig} sizePx={80} />
              </div>
            </div>
          </div>

          {/* Visual Step Progress Timeline Bar */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Handcrafting & Assembly Timeline
            </h3>

            <div className="relative flex items-center justify-between">
              {/* Connecting background line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />
              {/* Active progress line */}
              <div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-gold-500 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(currentStageIdx / (STAGE_COUNT_MINUS_ONE)) * 100}%` }}
              />

              {STAGES.map((st, idx) => {
                const IconComponent = st.icon;
                const isCompleted = idx <= currentStageIdx;
                const isCurrent = idx === currentStageIdx;

                return (
                  <div key={st.id} className="relative z-10 flex flex-col items-center group">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'border-gold-400 bg-gold-500 text-black scale-110 shadow-glow'
                          : isCompleted
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400'
                          : 'border-white/10 bg-[#0B0D12] text-slate-500'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium max-w-[80px] text-center line-clamp-2 ${
                        isCurrent ? 'text-gold-400 font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Real-time Activity History Stream */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
              Live Craftsman Log & Updates
            </h3>
            <div className="space-y-2">
              {order.history &&
                order.history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-gold-400 mt-1 shrink-0 shadow-glow" />
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between text-slate-300 mb-1">
                        <span className="font-bold text-slate-100 flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5 text-gold-400" />
                          {h.author}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {new Date(h.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{h.message}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Real-Time Admin Stage Simulation Control Panel */}
          <div className="p-5 rounded-2xl border border-gold-500/30 bg-gold-500/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Live Demo Tool: Advance Production Stage in Real-Time
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                {isFirebaseConnected() ? 'CONNECTED TO CLOUD FIRESTORE' : 'REACTIVE LOCAL SYNC'}
              </span>
            </div>

            <form onSubmit={handleAdminUpdateStage} className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Select Target Stage</label>
                <select
                  value={selectedNextStage}
                  onChange={(e) => setSelectedNextStage(e.target.value as OrderStage)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 font-medium"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Craftsman Status Note</label>
                <input
                  type="text"
                  placeholder="e.g. Quality inspection passed 100%..."
                  value={newStatusNote}
                  onChange={(e) => setNewStatusNote(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-glow"
                >
                  Update & Emit Real-Time Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const STAGE_COUNT_MINUS_ONE = 6;
