import React, { useState } from 'react';
import { ClockConfig, WallBackdrop } from '../types/clock';
import { ClockCanvas } from './ClockCanvas';
import { Sliders, Upload, Layers, Maximize, Eye } from 'lucide-react';

interface RoomVisualizerProps {
  config: ClockConfig;
}

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ config }) => {
  const [backdrop, setBackdrop] = useState<WallBackdrop>('wood-panel');
  const [customBackdropUrl, setCustomBackdropUrl] = useState<string | null>(null);
  const [wallHeightOffset, setWallHeightOffset] = useState<number>(35); // percentage top

  const handleCustomRoomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCustomBackdropUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert clock size (10" to 36") to pixel diameter in the room frame
  // Base scale: 14" = 180px, 36" = 360px
  const scaledPx = Math.round(100 + (config.size / 36) * 260);

  const getBackdropStyle = () => {
    if (customBackdropUrl) {
      return { backgroundImage: `url(${customBackdropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    switch (backdrop) {
      case 'wood-panel':
        return {
          background: 'linear-gradient(to bottom, #2A1B17, #1A100E)',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        };
      case 'gallery-white':
        return { background: 'linear-gradient(to bottom, #F1F5F9, #E2E8F0)' };
      case 'industrial-brick':
        return {
          background: '#261D1A',
          backgroundImage: 'repeating-linear-gradient(0deg, #1C1513, #1C1513 2px, transparent 2px, transparent 24px), repeating-linear-gradient(90deg, #1C1513, #1C1513 2px, transparent 2px, transparent 50px)',
        };
      case 'dark-slate':
        return { background: 'linear-gradient(to bottom, #0F172A, #020617)' };
      case 'pastel-living':
        return { background: 'linear-gradient(to bottom, #334155, #1E293B)' };
      default:
        return { background: '#0F172A' };
    }
  };

  return (
    <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold font-serif text-slate-100 flex items-center gap-2">
            <Eye className="w-5 h-5 text-gold-400" />
            Room Scale & Wall Backdrop Visualizer
          </h2>
          <p className="text-xs text-slate-400">
            Preview how your {config.size}" custom clock looks against real interior room walls and furniture scale.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/20 text-gold-400 text-xs font-semibold cursor-pointer border border-gold-500/30 hover:bg-gold-500/30">
            <Upload className="w-3.5 h-3.5" />
            Upload Your Room Photo
            <input type="file" accept="image/*" onChange={handleCustomRoomUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Backdrop Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] mr-2">
          Wall Backdrop:
        </span>
        {[
          { id: 'wood-panel', label: 'Warm Wood Panel' },
          { id: 'gallery-white', label: 'Gallery White Wall' },
          { id: 'industrial-brick', label: 'Industrial Brick' },
          { id: 'dark-slate', label: 'Dark Obsidian Slate' },
          { id: 'pastel-living', label: 'Modern Living Room' },
        ].map((bg) => (
          <button
            key={bg.id}
            onClick={() => {
              setCustomBackdropUrl(null);
              setBackdrop(bg.id as WallBackdrop);
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              !customBackdropUrl && backdrop === bg.id
                ? 'border-gold-500 bg-gold-500/20 text-gold-300 font-bold'
                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
            }`}
          >
            {bg.label}
          </button>
        ))}
      </div>

      {/* Main Room Simulation Viewport */}
      <div
        className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all flex flex-col justify-between"
        style={getBackdropStyle()}
      >
        {/* Wall Height Adjustment Slider Overlay */}
        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 flex items-center gap-2 text-xs text-slate-200">
          <Sliders className="w-3.5 h-3.5 text-gold-400" />
          <span>Wall Height:</span>
          <input
            type="range"
            min={15}
            max={60}
            value={wallHeightOffset}
            onChange={(e) => setWallHeightOffset(Number(e.target.value))}
            className="w-24 accent-gold-400 cursor-pointer"
          />
        </div>

        {/* Clock Canvas Centered on Room Wall */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 drop-shadow-2xl"
          style={{ top: `${wallHeightOffset}%` }}
        >
          <ClockCanvas config={config} sizePx={scaledPx} />
        </div>

        {/* Simulated Furniture Element (Executive Sofa / Desk) for Realistic Scale Context */}
        <div className="mt-auto w-full z-10 flex flex-col items-center">
          {/* Furniture Shadow */}
          <div className="w-3/4 h-3 bg-black/40 blur-md rounded-full mb-1"></div>
          {/* Modern Sofa Element */}
          <div className="w-4/5 h-24 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-3xl border-t border-x border-white/10 shadow-2xl flex items-center justify-center relative">
            {/* Sofa Cushions detail lines */}
            <div className="w-1/3 h-full border-r border-white/5"></div>
            <div className="w-1/3 h-full border-r border-white/5"></div>
            <span className="absolute bottom-2 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              [ Standard 84" Living Room Sofa Reference Scale ]
            </span>
          </div>
        </div>
      </div>

      {/* Scale Info Bar */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300 font-mono">
        <div>
          Clock Diameter: <strong className="text-gold-400">{config.size} inches</strong> ({(config.size * 2.54).toFixed(1)} cm)
        </div>
        <div>
          Visual Scale Ratio: <strong className="text-slate-100">{scaledPx}px rendering frame</strong>
        </div>
      </div>
    </div>
  );
};
