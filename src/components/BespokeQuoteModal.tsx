import React, { useState } from 'react';
import { submitBespokeQuote } from '../lib/firebase';
import confetti from 'canvas-confetti';
import { Building2, Send, CheckCircle2 } from 'lucide-react';

interface BespokeQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BespokeQuoteModal: React.FC<BespokeQuoteModalProps> = ({ isOpen, onClose }) => {
  const [clientName, setClientName] = useState('');
  const [companyOrProject, setCompanyOrProject] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState<number>(5);
  const [targetSize, setTargetSize] = useState('24" Statement');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      await submitBespokeQuote({
        clientName,
        companyOrProject,
        email,
        phone,
        quantity,
        targetSize,
        specialRequirements,
      });

      confetti({ particleCount: 80, spread: 60 });
      setIsSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Bespoke & Architectural Quote Request
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold font-serif text-slate-100">Quote Inquiry Submitted!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Our Master Craftsman & Architectural Design Lead will review your specs and email a CAD drawing proposal within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider shadow-glow"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <p className="text-slate-400">
              Request bespoke bulk production, custom corporate logo laser engraving, oversized wall installations, or hotel lobby centerpieces.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Sterling"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sterling Hotels & Resorts"
                  value={companyOrProject}
                  onChange={(e) => setCompanyOrProject(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="david@sterling.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Units</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Dimension</label>
                <select
                  value={targetSize}
                  onChange={(e) => setTargetSize(e.target.value)}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100"
                >
                  <option value='14" Standard Wall'>14" Standard Wall</option>
                  <option value='18" Executive Wall'>18" Executive Wall</option>
                  <option value='24" Statement Wall'>24" Statement Wall</option>
                  <option value='36" Grand Architectural'>36" Grand Architectural</option>
                  <option value="Custom Architectural Dimension">Custom Architectural Spec</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Special Requirements & Materials (Wood species, Metal alloy, Logo placement)
              </label>
              <textarea
                rows={3}
                placeholder="Describe your custom architectural clock vision or logo engraving guidelines..."
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl p-3 text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-glow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending Request...' : 'Submit Quote Request to Master Craftsman'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
