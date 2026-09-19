import React, { useState } from 'react';
import { calculateOptimalClockSize } from '../lib/ergonomics';
import { SizeInches } from '../types/clock';
import { Sliders, Maximize2, Check, Ruler, Info } from 'lucide-react';

interface DistanceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedSize: (size: SizeInches) => void;
}

export const DistanceCalculatorModal: React.FC<DistanceCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedSize,
}) => {
  const [distanceFeet, setDistanceFeet] = useState<number>(16);

  if (!isOpen) return null;

  const result = calculateOptimalClockSize(distanceFeet);

  const handleApplySize = () => {
    onSelectRecommendedSize(result.recommendedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Ergonomic Viewing Distance Calculator
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-slate-300 leading-relaxed">
            Based on Human Factors Engineering constant visual subtense angle ($D = 2 \cdot L \cdot \tan(\theta/2)$). Enter your room's viewing distance:
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-slate-100">
              <span>Room Viewing Distance:</span>
              <span className="font-mono text-gold-400 text-base">{distanceFeet} Feet ({(distanceFeet * 0.3048).toFixed(1)} m)</span>
            </div>

            <input
              type="range"
              min={4}
              max={50}
              value={distanceFeet}
              onChange={(e) => setDistanceFeet(Number(e.target.value))}
              className="w-full accent-gold-400 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>4 ft (Desk)</span>
              <span>25 ft (Living)</span>
              <span>50 ft (Lobby)</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-bold uppercase text-[10px]">Calculated Ergonomic Size:</span>
              <span className="text-lg font-bold font-mono text-gold-400">{result.recommendedSize}" Clock</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {result.description}
            </p>
          </div>

          <button
            onClick={handleApplySize}
            className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 shadow-glow flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply Recommended {result.recommendedSize}" Size to Studio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
