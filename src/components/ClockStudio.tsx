import React, { useState } from 'react';
import { 
  ClockConfig, 
  FrameMaterial, 
  NumeralStyle, 
  HandStyle, 
  ChimeType, 
  SizeInches,
  WorldSubdial,
  LaserInlayStyle
} from '../types/clock';
import { MATERIAL_DETAILS, SIZE_PRICING } from '../lib/presets';
import { playChimeSound } from './ClockCanvas';
import { ContrastMeter } from './ContrastMeter';
import { LivePhotoUploader } from './LivePhotoUploader';
import { 
  Palette, 
  Sparkles, 
  Sliders, 
  Type, 
  Volume2, 
  Sun, 
  Maximize2, 
  Check, 
  Globe,
  Compass,
  Image as ImageIcon
} from 'lucide-react';

interface ClockStudioProps {
  config: ClockConfig;
  onChange: (updated: ClockConfig) => void;
}

export const ClockStudio: React.FC<ClockStudioProps> = ({ config, onChange }) => {
  const [activeTab, setActiveTab] = useState<'frame' | 'dial' | 'subdials' | 'engraving'>('frame');

  const updateConfig = (key: keyof ClockConfig, value: any) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  const handlePhotoSelected = (photoDataUrl: string) => {
    onChange({
      ...config,
      dialTexture: 'custom-photo',
      customPhotoUrl: photoDataUrl,
    });
  };

  const toggleSubdial = (sub: WorldSubdial) => {
    const existing = config.subdials || [];
    const index = existing.findIndex((s) => s.id === sub.id);
    if (index >= 0) {
      const filtered = existing.filter((s) => s.id !== sub.id);
      updateConfig('subdials', filtered);
    } else {
      updateConfig('subdials', [...existing, sub]);
    }
  };

  const WORLD_CITY_PRESETS: WorldSubdial[] = [
    { id: 'london', label: 'LONDON', timezoneOffsetHours: 0, position: 'left' },
    { id: 'tokyo', label: 'TOKYO', timezoneOffsetHours: 9, position: 'right' },
    { id: 'nyc', label: 'NEW YORK', timezoneOffsetHours: -5, position: 'bottom' },
  ];

  return (
    <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
      {/* Studio Header Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('frame')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
            activeTab === 'frame'
              ? 'bg-gold-500 text-black shadow-glow'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Frame & Size</span>
        </button>

        <button
          onClick={() => setActiveTab('dial')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
            activeTab === 'dial'
              ? 'bg-gold-500 text-black shadow-glow'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Dial & Photos</span>
        </button>

        <button
          onClick={() => setActiveTab('subdials')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
            activeTab === 'subdials'
              ? 'bg-gold-500 text-black shadow-glow'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>World Sub-Dials</span>
        </button>

        <button
          onClick={() => setActiveTab('engraving')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-medium text-xs transition-all duration-200 ${
            activeTab === 'engraving'
              ? 'bg-gold-500 text-black shadow-glow'
              : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Inlay & Lighting</span>
        </button>
      </div>

      {/* TAB 1: FRAME & SIZE */}
      {activeTab === 'frame' && (
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
              1. Select Clock Diameter Size
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {([10, 14, 18, 24, 36] as SizeInches[]).map((sz) => {
                const info = SIZE_PRICING[sz];
                const isSelected = config.size === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => updateConfig('size', sz)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/10 shadow-glow'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-lg font-bold text-slate-100">{sz}"</div>
                    <div className="text-xs text-gold-400 font-semibold">${info.price}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{info.name.split(' ')[1]}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>{SIZE_PRICING[config.size].recommendedUse}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
              2. Frame Material & Craftsmanship
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(MATERIAL_DETAILS).map((mat) => {
                const isSelected = config.frameMaterial === mat.id;
                return (
                  <div
                    key={mat.id}
                    onClick={() => updateConfig('frameMaterial', mat.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/10 shadow-glow ring-1 ring-gold-500'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-white/20 shrink-0 shadow-inner flex items-center justify-center"
                      style={{ backgroundColor: mat.texturePattern }}
                    >
                      {isSelected && <Check className="w-5 h-5 text-gold-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-slate-100">{mat.name}</span>
                        <span className="text-xs font-mono text-gold-400">
                          {mat.basePriceMultiplier > 1 ? `+${Math.round((mat.basePriceMultiplier - 1) * 100)}%` : 'Base'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mat.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIAL & PHOTOS */}
      {activeTab === 'dial' && (
        <div className="space-y-6">
          {/* Instant Real-Time Photo Uploader */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
              Instant Real-Time Photo Dial Customizer
            </label>
            <LivePhotoUploader
              onPhotoSelected={handlePhotoSelected}
              currentPhotoUrl={config.customPhotoUrl}
              label="Upload File, Take Live Webcam Snap, or Paste Image Link"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
              Dial Texture & Pattern
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'brushed-wood', label: 'Brushed Wood Grain' },
                { id: 'marble-vein', label: 'Marble Veins' },
                { id: 'sunburst', label: 'Sunburst Metallic' },
                { id: 'smooth', label: 'Matte Solid' },
              ].map((tex) => (
                <button
                  key={tex.id}
                  onClick={() => updateConfig('dialTexture', tex.id)}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                    config.dialTexture === tex.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {tex.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
              Clock Hands Craftsmanship
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { id: 'breguet-luxury', label: 'Breguet Luxury Ring' },
                { id: 'classic-spade', label: 'Heritage Spade' },
                { id: 'modern-bar', label: 'Modern Bar' },
                { id: 'neon-glow', label: 'Cyber Neon Glow' },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => updateConfig('handStyle', h.id as HandStyle)}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                    config.handStyle === h.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>

            <ContrastMeter
              handColor={config.handColor || '#E6C453'}
              dialColor={config.dialColor || '#181C28'}
            />
          </div>
        </div>
      )}

      {/* TAB 3: WORLD SUB-DIALS */}
      {activeTab === 'subdials' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-400" />
                Multi-Timezone World Sub-Dials (Real-Time Ticking)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">+$45 EACH</span>
            </div>
            <p className="text-xs text-slate-400">
              Add real-time synchronized mini sub-dials for international business hubs or family in other timezones.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {WORLD_CITY_PRESETS.map((city) => {
                const isSelected = (config.subdials || []).some((s) => s.id === city.id);
                return (
                  <button
                    key={city.id}
                    onClick={() => toggleSubdial(city)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{city.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      UTC {city.timezoneOffsetHours >= 0 ? `+${city.timezoneOffsetHours}` : city.timezoneOffsetHours} Hours
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INLAY & LIGHTING */}
      {activeTab === 'engraving' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400">
              Laser Engraving Inscription & Inlay Finish
            </label>

            <input
              type="text"
              maxLength={40}
              placeholder="e.g. TEMPUS FUGIT • EST. 2026"
              value={config.engravedText || ''}
              onChange={(e) => updateConfig('engravedText', e.target.value)}
              className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'natural-burn', label: 'Natural Burn Wood' },
                { id: 'gold-foil', label: 'Metallic Gold Foil' },
                { id: 'silver-inlay', label: 'Silver Liquid Inlay' },
                { id: 'black-enamel', label: 'Gloss Black Enamel' },
              ].map((inl) => (
                <button
                  key={inl.id}
                  onClick={() => updateConfig('engravedInlayStyle', inl.id as LaserInlayStyle)}
                  className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                    config.engravedInlayStyle === inl.id
                      ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                  }`}
                >
                  {inl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Studio Light Angle Direction (360°)
              </span>
              <span className="text-xs font-mono text-slate-200">{config.lightAngleDegrees || 45}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={config.lightAngleDegrees || 45}
              onChange={(e) => updateConfig('lightAngleDegrees', Number(e.target.value))}
              className="w-full accent-gold-400 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
