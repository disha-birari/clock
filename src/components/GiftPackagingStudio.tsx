import React, { useState } from 'react';
import { Gift, Sparkles, Check, Heart } from 'lucide-react';

interface GiftPackagingStudioProps {
  onPackagingUpdated: (details: {
    enabled: boolean;
    velvetColor: string;
    cardMessage: string;
  }) => void;
}

export const GiftPackagingStudio: React.FC<GiftPackagingStudioProps> = ({ onPackagingUpdated }) => {
  const [enabled, setEnabled] = useState(false);
  const [velvetColor, setVelvetColor] = useState('#881337'); // Royal Crimson
  const [cardMessage, setCardMessage] = useState('Happy Birthday! May every second bring joy.');

  const updateState = (eState: boolean, vColor: string, msg: string) => {
    setEnabled(eState);
    setVelvetColor(vColor);
    setCardMessage(msg);
    onPackagingUpdated({ enabled: eState, velvetColor: vColor, cardMessage: msg });
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-gold-500/30 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-100 flex items-center gap-2">
          <Gift className="w-4 h-4 text-gold-400" />
          Luxury Presentation Gift Box & Gold Foil Card
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => updateState(e.target.checked, velvetColor, cardMessage)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
        </label>
      </div>

      {enabled && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <label className="block text-[11px] text-slate-300 font-semibold mb-2">
              Select Velvet Interior Lining Color
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { hex: '#881337', name: 'Royal Crimson' },
                { hex: '#064E3B', name: 'Emerald Velvet' },
                { hex: '#0F172A', name: 'Obsidian Midnight' },
                { hex: '#581C87', name: 'Imperial Purple' },
              ].map((v) => (
                <button
                  key={v.hex}
                  type="button"
                  onClick={() => updateState(enabled, v.hex, cardMessage)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                    velvetColor === v.hex
                      ? 'border-gold-400 bg-gold-500/20 text-gold-300 shadow-glow'
                      : 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: v.hex }} />
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 font-semibold mb-1">
              Personal Gold Foil Inscription Gift Card Message
            </label>
            <textarea
              rows={2}
              maxLength={120}
              value={cardMessage}
              onChange={(e) => updateState(enabled, velvetColor, e.target.value)}
              className="w-full bg-[#0B0D12] border border-white/15 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
