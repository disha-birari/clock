import React from 'react';
import { ClockConfig } from '../types/clock';
import { PRESET_CLOCKS, MATERIAL_DETAILS, SIZE_PRICING } from '../lib/presets';
import { ClockCanvas } from './ClockCanvas';
import { Sliders, Sparkles, ArrowRight, Check } from 'lucide-react';

interface CatalogProps {
  onSelectPreset: (config: ClockConfig) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onSelectPreset }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            Curated Signature Clock Collections
          </h2>
          <p className="text-xs text-slate-400">
            Explore handcrafted master artisan base designs. Select any edition to open in the live Studio Customizer.
          </p>
        </div>
      </div>

      {/* Grid of Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PRESET_CLOCKS.map((preset) => {
          const mat = MATERIAL_DETAILS[preset.frameMaterial];
          const basePrice = SIZE_PRICING[preset.size]?.price || 200;
          const estPrice = Math.round(basePrice * mat.basePriceMultiplier);

          return (
            <div
              key={preset.id}
              className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-gold-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                {/* Canvas Render Preview */}
                <div className="relative flex items-center justify-center py-6 bg-gradient-to-b from-white/5 to-transparent rounded-xl mb-4 overflow-hidden">
                  <ClockCanvas config={preset} sizePx={180} />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-gold-400 font-semibold">
                    {preset.size}" Diameter
                  </span>
                  <span className="text-xs font-bold text-slate-100 font-mono">${estPrice}</span>
                </div>

                <h3 className="text-base font-bold font-serif text-slate-100 group-hover:text-gold-400 transition-colors">
                  {preset.name}
                </h3>

                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {mat.description}
                </p>

                {/* Features Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    {mat.name.split(' ')[0]}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                    {preset.numeralStyle}
                  </span>
                  {preset.ledBacklight && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                      LED Backlit
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPreset(preset)}
                className="w-full mt-5 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-gold-500 hover:text-black border border-white/10 hover:border-gold-500 text-slate-100 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group-hover:shadow-glow"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize This Edition</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
