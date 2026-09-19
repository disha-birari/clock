import React from 'react';
import { PhotoClockConfig } from '../types/clock';
import { PhotoClockCanvas } from './PhotoClockCanvas';
import { Printer, Download, CheckCircle2, ShieldCheck, FileText, Award } from 'lucide-react';

interface PdfReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PhotoClockConfig;
  customerName?: string;
  totalPrice: number;
}

export const PdfReceiptModal: React.FC<PdfReceiptModalProps> = ({
  isOpen,
  onClose,
  config,
  customerName = 'Valued Customizer',
  totalPrice,
}) => {
  if (!isOpen) return null;

  const serialCode = `CHRONO-PDF-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 space-y-0 relative">
        {/* Printable PDF Receipt Content Container */}
        <div id="printable-receipt" className="p-8 bg-[#0B0D12] text-slate-100 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-xl text-gold-400 tracking-wider">
                  CHRONOCRAFT STUDIO
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40">
                  OFFICIAL SPECIFICATION & RECEIPT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Master Craftsman Guild • Custom Memory Clock Division
              </p>
            </div>

            <div className="text-right font-mono text-xs text-slate-400">
              <div>Date: <strong className="text-slate-100">{orderDate}</strong></div>
              <div>Serial Ref: <strong className="text-gold-400">{serialCode}</strong></div>
            </div>
          </div>

          {/* Main Layout: Rendered Custom Photo Clock Visual + Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* High-Res Canvas Rendering */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <PhotoClockCanvas config={config} sizePx={220} />
              <span className="text-[10px] font-mono text-slate-400 mt-2">
                Rendered Spec Image: {config.photoCount} Photo(s) • {config.maskShape.toUpperCase()} Mask
              </span>
            </div>

            {/* Spec Highlights */}
            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-sm text-gold-400 border-b border-white/10 pb-1">
                Custom Clock Specifications
              </h4>

              <div className="space-y-1.5 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Body Shape:</span>
                  <span className="font-bold text-slate-100">{config.bodyShape.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Frame Timber / Metal:</span>
                  <span className="font-bold text-slate-100">{config.frameMaterial.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Photo Count Slots:</span>
                  <span className="font-bold text-gold-400">{config.photoCount} Slot(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mask Cutout Shape:</span>
                  <span className="font-bold text-slate-100">{config.maskShape.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clock Pins Style:</span>
                  <span className="font-bold text-slate-100">{config.pinStyle.toUpperCase()}</span>
                </div>
                {config.engravedText && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Engraved Text:</span>
                    <span className="font-bold text-gold-400">"{config.engravedText}"</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Pricing Receipt Table */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gold-400 border-b border-white/10 pb-2 mb-2">
              Itemized Cost Receipt Breakdown
            </h4>

            <div className="space-y-1.5 text-xs font-mono text-slate-300">
              <div className="flex justify-between">
                <span>Base Custom Clock Diameter ({config.size}")</span>
                <span>$180</span>
              </div>
              <div className="flex justify-between">
                <span>Material Craftsmanship ({config.frameMaterial})</span>
                <span>+$40</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Photo Printing & Slot Fitting ({config.photoCount} Photos)</span>
                <span>+${config.photoCount * 15}</span>
              </div>
              <div className="flex justify-between">
                <span>Clock Body Outline Shaping ({config.bodyShape})</span>
                <span>+$25</span>
              </div>
              <div className="flex justify-between">
                <span>Clock Pins Craftsmanship ({config.pinStyle})</span>
                <span>+$15</span>
              </div>
              {config.engravedText && (
                <div className="flex justify-between text-gold-400">
                  <span>Laser Engraving Inscription Fee</span>
                  <span>+$25</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/15 pt-2 text-sm font-sans font-bold text-slate-100">
                <span>TOTAL AMOUNT PAID:</span>
                <span className="font-mono text-gold-400 font-extrabold text-base">${totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Guarantee Footer */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-4 font-mono">
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes 3-Year Precision Quartz Movement Guarantee</span>
            </div>
            <div>Registered Client: <strong>{customerName}</strong></div>
          </div>
        </div>

        {/* Modal Action Buttons Footer */}
        <div className="p-4 bg-[#11141D] border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-slate-300 hover:bg-white/20"
          >
            Close Receipt Window
          </button>

          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-all shadow-glow flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
