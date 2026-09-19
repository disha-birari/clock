import React from 'react';
import { Sun, Sparkles, Zap, Flame, ShieldAlert } from 'lucide-react';

interface LEDBacklightStudioProps {
  ledEnabled: boolean;
  ledColor: string;
  onToggleLed: (enabled: boolean) => void;
  onChangeLedColor: (color: string) => void;
}

export const LEDBacklightStudio: React.FC<LEDBacklightStudioProps> = ({
  ledEnabled,
  ledColor,
  onToggleLed,
  onChangeLedColor,
}) => {
  const colorPresets = [
    { name: 'Warm Quartz Gold', hex: '#FCE076', tag: 'Cozy Living' },
    { name: 'Cyberpunk Neon Cyan', hex: '#06B6D4', tag: 'Modern Gaming' },
    { name: 'Sunset Amber Glow', hex: '#F97316', tag: 'Atmospheric' },
    { name: 'Emerald Aurora', hex: '#10B981', tag: 'Biophilic Design' },
    { name: 'Royal Violet Pulse', hex: '#8B5CF6', tag: 'Executive Suite' },
    { name: 'Pure Gallery White', hex: '#FFFFFF', tag: 'Architectural' },
  ];

  return (
    <div className="bg-[#11131F] border border-cyan-500/20 rounded-2xl p-5 text-white space-y-4 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl transition-all ${ledEnabled ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'bg-white/5 text-slate-400'}`}>
            <Sun className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              Halo Backlight & RGB Ambient Engine
              {ledEnabled && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                  ACTIVE
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">Rear LED halo diffusion strip with smart room ambient sensors</p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => onToggleLed(!ledEnabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            ledEnabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
              ledEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {ledEnabled && (
        <div className="space-y-4 pt-2 border-t border-white/10 animate-in fade-in duration-200">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-2 block">Ambient Color Spectrum Presets</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorPresets.map((preset) => (
                <button
                  key={preset.hex}
                  onClick={() => onChangeLedColor(preset.hex)}
                  className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-left ${
                    ledColor.toLowerCase() === preset.hex.toLowerCase()
                      ? 'bg-white/10 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-sm"
                    style={{ backgroundColor: preset.hex }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-white truncate">{preset.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">{preset.tag}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs text-slate-300 block mb-1">Custom Hex Spectrum Picker</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={ledColor}
                  onChange={(e) => onChangeLedColor(e.target.value)}
                  className="w-10 h-9 rounded-xl bg-transparent border border-white/20 cursor-pointer"
                />
                <input
                  type="text"
                  value={ledColor}
                  onChange={(e) => onChangeLedColor(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-cyan-400 w-28 uppercase"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-white/5 p-2 rounded-xl border border-white/10 max-w-[160px]">
              Includes 12V low-voltage magnetic power connector & smart home Alexa/Google Home support.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
