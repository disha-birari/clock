import React from 'react';
import { Columns, Check, X, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { ClockConfig } from '../types/clock';
import { formatCurrencyAmount, CurrencyCode } from '../lib/currencies';

interface ClockCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedConfigs: ClockConfig[];
  currentConfig: ClockConfig;
  currency: CurrencyCode;
}

export const ClockCompareModal: React.FC<ClockCompareModalProps> = ({
  isOpen,
  onClose,
  savedConfigs,
  currentConfig,
  currency,
}) => {
  if (!isOpen) return null;

  // Ensure current design is always included
  const allToCompare = [currentConfig, ...savedConfigs.filter((c) => c.id !== currentConfig.id)].slice(0, 3);

  const calculatePrice = (cfg: ClockConfig) => {
    let price = 240;
    if (cfg.size === 18) price += 60;
    if (cfg.size === 24) price += 120;
    if (cfg.size === 36) price += 240;
    if (cfg.frameMaterial === 'rosewood' || cfg.frameMaterial === 'marble') price += 80;
    if (cfg.ledBacklight) price += 45;
    if (cfg.engravedText) price += 35;
    return price;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0D0F17] border border-cyan-500/30 rounded-3xl w-full max-w-4xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <Columns className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                Design Comparison Studio Matrix
              </h2>
              <p className="text-xs text-slate-400">Side-by-side technical & aesthetic specification breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto overflow-y-auto py-6 flex-1 space-y-4">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-xs font-mono text-slate-400 uppercase w-44">Feature / Metric</th>
                {allToCompare.map((cfg, idx) => (
                  <th key={idx} className="p-3 text-sm font-bold text-cyan-300">
                    <div className="flex items-center justify-between">
                      <span>{cfg.name || `Design Spec #${idx + 1}`}</span>
                      {idx === 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-normal">
                          Active Canvas
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              <tr>
                <td className="p-3 font-semibold text-slate-300">Diameter Size</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-white font-mono">{cfg.size} Inches ({Math.round(cfg.size * 2.54)} cm)</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Timber & Frame</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-cyan-400 capitalize">{cfg.frameMaterial.replace('-', ' ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Numeral Typography</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-slate-300 capitalize">{cfg.numeralStyle}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Hand Style</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-slate-300 capitalize">{cfg.handStyle.replace('-', ' ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Laser Inscription</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-slate-300">
                    {cfg.engravedText ? (
                      <span className="text-emerald-400 font-serif italic">"{cfg.engravedText}"</span>
                    ) : (
                      <span className="text-slate-500 font-mono">None</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Halo LED Backlight</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3">
                    {cfg.ledBacklight ? (
                      <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                        <Check className="w-4 h-4" /> Enabled ({cfg.ledColor || '#FCE076'})
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <X className="w-4 h-4" /> Disabled
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-300">Acoustic Movement</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 text-slate-300 capitalize">{cfg.chime.replace('-', ' ')}</td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-bold text-white text-sm">Estimated Total</td>
                {allToCompare.map((cfg, i) => (
                  <td key={i} className="p-3 font-bold text-sm text-cyan-400 font-mono">
                    {formatCurrencyAmount(calculatePrice(cfg), currency)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            Compare up to 3 saved clock customizer specifications.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
