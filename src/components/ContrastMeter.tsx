import React from 'react';
import { evaluateDialLegibility } from '../lib/ergonomics';
import { ShieldCheck, AlertCircle, Eye, CheckCircle2 } from 'lucide-react';

interface ContrastMeterProps {
  handColor: string;
  dialColor: string;
  className?: string;
}

export const ContrastMeter: React.FC<ContrastMeterProps> = ({
  handColor,
  dialColor,
  className = '',
}) => {
  const legibility = evaluateDialLegibility(handColor, dialColor);

  return (
    <div className={`p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-slate-300 font-semibold flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-gold-400" />
          Dial Contrast Legibility Analyzer
        </span>
        <span className={`px-2 py-0.5 rounded font-mono font-bold border text-[11px] ${legibility.badgeColor}`}>
          {legibility.ratio}:1 — {legibility.rating}
        </span>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        {legibility.advice}
      </p>
    </div>
  );
};
