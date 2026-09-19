import React, { useState, useEffect } from 'react';
import { Activity, Sparkles, ShoppingBag } from 'lucide-react';

const DEMO_ACTIVITIES = [
  '⚡ Client in Boston just saved a 18" American Walnut Clock design',
  '🎉 Order ORD-98421 (Vance Residence) advanced to UV Dial Printing',
  '✨ Client in London enabled Dual Timezone Sub-dials (Tokyo & NYC)',
  '🛠️ Master Craftsman Jean-Luc completed 24hr QC Calibration for ORD-49210',
  '🌟 Client in Chicago requested 36" Architectural Brass Quote',
];

export const LiveActivityTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % DEMO_ACTIVITIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gold-500/10 via-amber-500/10 to-transparent border-y border-gold-500/20 py-2 px-4 font-mono text-xs overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-gold-400 bg-gold-500/20 px-2 py-0.5 rounded border border-gold-500/40 shrink-0">
          <Activity className="w-3 h-3 animate-pulse" />
          Live Real-Time Stream
        </span>
        <div className="text-slate-200 transition-all duration-500 truncate">
          {DEMO_ACTIVITIES[index]}
        </div>
      </div>
    </div>
  );
};
