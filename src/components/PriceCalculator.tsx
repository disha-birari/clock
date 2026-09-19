import React, { useState } from 'react';
import { ClockConfig } from '../types/clock';
import { MATERIAL_DETAILS, SIZE_PRICING } from '../lib/presets';
import { createOrder, saveClockDesign } from '../lib/firebase';
import { CurrencyCode, CURRENCIES, formatCurrencyAmount } from '../lib/currencies';
import confetti from 'canvas-confetti';
import { 
  ShoppingCart, 
  Bookmark, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Globe,
  Gift
} from 'lucide-react';

interface PriceCalculatorProps {
  config: ClockConfig;
  onOrderCreated: (trackingNumber: string) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ config, onOrderCreated }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const sizeInfo = SIZE_PRICING[config.size] || SIZE_PRICING[14];
  const matInfo = MATERIAL_DETAILS[config.frameMaterial] || MATERIAL_DETAILS['walnut'];

  const basePrice = sizeInfo.price;
  const materialExtra = Math.round(basePrice * (matInfo.basePriceMultiplier - 1));
  const photoExtra = config.dialTexture === 'custom-photo' ? 35 : 0;
  const engravingExtra = config.engravedText && config.engravedText.trim().length > 0 ? 25 : 0;
  const ledExtra = config.ledBacklight ? 30 : 0;
  const chimeExtra = config.chime === 'westminster-chime' ? 40 : 0;

  const totalAmountUsd = basePrice + materialExtra + photoExtra + engravingExtra + ledExtra + chimeExtra;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const order = await createOrder(config, customerName, customerEmail, totalAmountUsd);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
      setIsCheckoutOpen(false);
      onOrderCreated(order.trackingNumber);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDesign = async () => {
    try {
      const designId = await saveClockDesign(config);
      confetti({ particleCount: 50, spread: 50 });
      setSaveMessage(`Design Saved! ID: ${designId}`);
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareLink = () => {
    const json = encodeURIComponent(JSON.stringify(config));
    const url = `${window.location.origin}${window.location.pathname}?design=${json}`;
    navigator.clipboard.writeText(url);
    setSaveMessage('Shareable Design Link copied to clipboard!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  return (
    <div className="bg-[#11141D]/90 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-6 shadow-glow-lg flex flex-col justify-between h-full">
      <div>
        {/* Header Title & Multi-Currency Switcher */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Live Customizer Summary
              </h3>
              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-[#0B0D12] border border-white/15 rounded-lg text-[10px] text-slate-200 px-1.5 py-0.5 font-mono cursor-pointer"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xl font-bold font-serif text-slate-100 mt-1">
              {config.name || 'Custom ChronoCraft Edition'}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400">Total Price</span>
            <div className="text-2xl font-extrabold text-gold-400 font-mono">
              {formatCurrencyAmount(totalAmountUsd, currency)}
            </div>
          </div>
        </div>

        {/* Itemized Pricing Table */}
        <div className="space-y-3 text-xs mb-6">
          <div className="flex justify-between items-center text-slate-300">
            <span>Base Clock Size ({config.size}" Frame)</span>
            <span className="font-mono text-slate-100">{formatCurrencyAmount(basePrice, currency)}</span>
          </div>

          <div className="flex justify-between items-center text-slate-300">
            <span>Material: {matInfo.name.split(' ')[0]} {matInfo.name.split(' ')[1]}</span>
            <span className="font-mono text-slate-100">
              {materialExtra > 0 ? `+${formatCurrencyAmount(materialExtra, currency)}` : 'Included'}
            </span>
          </div>

          {photoExtra > 0 && (
            <div className="flex justify-between items-center text-gold-400">
              <span>Custom Photo Dial Printing</span>
              <span className="font-mono">+{formatCurrencyAmount(35, currency)}</span>
            </div>
          )}

          {engravingExtra > 0 && (
            <div className="flex justify-between items-center text-gold-400">
              <span>Laser Engraving Inscription</span>
              <span className="font-mono">+{formatCurrencyAmount(25, currency)}</span>
            </div>
          )}

          {ledExtra > 0 && (
            <div className="flex justify-between items-center text-gold-400">
              <span>LED Halo Backlight System</span>
              <span className="font-mono">+{formatCurrencyAmount(30, currency)}</span>
            </div>
          )}

          {chimeExtra > 0 && (
            <div className="flex justify-between items-center text-gold-400">
              <span>Westminster Acoustic Chime</span>
              <span className="font-mono">+{formatCurrencyAmount(40, currency)}</span>
            </div>
          )}
        </div>

        {/* Industry Trust Highlights */}
        <div className="bg-white/5 rounded-xl p-3.5 space-y-2 mb-6 border border-white/5">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>3-Year Warranty</strong> on precision quartz movement</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Truck className="w-4 h-4 text-sky-400 shrink-0" />
            <span><strong>Tracked Shipping</strong> with wooden crate protection</span>
          </div>
        </div>

        {saveMessage && (
          <div className="p-3 mb-4 rounded-xl bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <button
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-black font-bold text-sm tracking-wide uppercase shadow-glow hover:shadow-glow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Order Custom Clock — {formatCurrencyAmount(totalAmountUsd, currency)}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSaveDesign}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5 text-gold-400" />
            <span>Save Design</span>
          </button>

          <button
            onClick={handleShareLink}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Checkout Modal Dialog */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold font-serif text-slate-100">
                  Confirm Custom Clock Order
                </h3>
                <p className="text-xs text-slate-400">
                  Your clock will enter production in real-time immediately upon checkout.
                </p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address for Live Real-Time Tracking
                </label>
                <input
                  type="email"
                  required
                  placeholder="eleanor@vance.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold text-sm tracking-wide uppercase shadow-glow"
              >
                {isSubmitting ? 'Registering Order...' : 'Complete Order & Start Crafting'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
