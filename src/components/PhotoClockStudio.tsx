import React, { useState } from 'react';
import { 
  PhotoClockConfig, 
  PhotoMaskShape, 
  ClockBodyShape, 
  ClockPinStyle, 
  PhotoSlot, 
  SizeInches,
  FrameMaterial
} from '../types/clock';
import { PhotoClockCanvas } from './PhotoClockCanvas';
import { PdfReceiptModal } from './PdfReceiptModal';
import { MATERIAL_DETAILS } from '../lib/presets';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Heart, 
  Grid, 
  Layers, 
  Upload, 
  Sliders, 
  Printer, 
  FileText, 
  Check, 
  Sparkles,
  Maximize2,
  Disc,
  Hexagon,
  Square
} from 'lucide-react';

export const DEFAULT_PHOTO_CONFIG: PhotoClockConfig = {
  photoCount: 4,
  maskShape: 'quadrant',
  slots: [
    { id: 1, label: 'Top Left Photo', zoom: 1.0, xOffset: 0, yOffset: 0 },
    { id: 2, label: 'Top Right Photo', zoom: 1.0, xOffset: 0, yOffset: 0 },
    { id: 3, label: 'Bottom Right Photo', zoom: 1.0, xOffset: 0, yOffset: 0 },
    { id: 4, label: 'Bottom Left Photo', zoom: 1.0, xOffset: 0, yOffset: 0 },
  ],
  bodyShape: 'round-wall',
  pinStyle: 'gold-bullet-pin',
  pinColor: '#E6C453',
  frameMaterial: 'walnut',
  dialColor: '#181C28',
  size: 18,
  handStyle: 'breguet-luxury',
  handColor: '#E6C453',
  secondHandColor: '#EF4444',
  engravedText: 'OUR FAMILY MOMENTS',
};

export const PhotoClockStudio: React.FC = () => {
  const [config, setConfig] = useState<PhotoClockConfig>(DEFAULT_PHOTO_CONFIG);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Price Calculation
  const basePrice = 180;
  const photoExtra = config.photoCount * 15;
  const bodyExtra = config.bodyShape !== 'round-wall' ? 25 : 0;
  const engravingExtra = config.engravedText && config.engravedText.trim().length > 0 ? 25 : 0;
  const totalPrice = basePrice + photoExtra + bodyExtra + engravingExtra;

  // Handle Photo Count Changes
  const handleSetPhotoCount = (count: 1 | 2 | 3 | 4 | 6 | 12) => {
    const newSlots: PhotoSlot[] = Array.from({ length: count }, (_, i) => {
      const existing = config.slots.find((s) => s.id === i + 1);
      return (
        existing || {
          id: i + 1,
          label: count === 12 ? `Hour ${i + 1}` : `Photo Slot ${i + 1}`,
          zoom: 1.0,
          xOffset: 0,
          yOffset: 0,
        }
      );
    });

    let defaultMask: PhotoMaskShape = 'circle';
    if (count === 4) defaultMask = 'quadrant';
    else if (count === 12) defaultMask = '12-hour-circles';
    else if (count === 2) defaultMask = 'circle';

    setConfig({
      ...config,
      photoCount: count,
      maskShape: defaultMask,
      slots: newSlots,
    });
  };

  // Handle Individual Slot Image Upload
  const handleSlotImageUpload = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        const updatedSlots = config.slots.map((s) =>
          s.id === slotId ? { ...s, imageUrl: result } : s
        );
        setConfig({ ...config, slots: updatedSlots });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSlotZoom = (slotId: number, zoomValue: number) => {
    const updatedSlots = config.slots.map((s) =>
      s.id === slotId ? { ...s, zoom: zoomValue } : s
    );
    setConfig({ ...config, slots: updatedSlots });
  };

  return (
    <div className="space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Camera className="w-6 h-6 text-gold-400" />
            Multi-Photo Memory Clock Studio
          </h2>
          <p className="text-xs text-slate-400">
            Customize bespoke photo memory wall clocks with custom photo counts, mask shapes, clock body outlines & pins.
          </p>
        </div>

        {/* Action: Open Printable PDF Spec Receipt */}
        <button
          onClick={() => {
            confetti({ particleCount: 60, spread: 60 });
            setIsReceiptOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-black font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-105 transition-all flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Download PDF Spec & Receipt</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Real-Time HTML5 Canvas Visualizer */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative min-h-[460px]">
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-gold-400" />
                Live Photo Canvas ({config.photoCount} Photo Slots)
              </span>
              <span className="text-gold-400 font-mono font-bold text-sm">
                Itemized: ${totalPrice}
              </span>
            </div>

            {/* Photo Clock Canvas */}
            <div className="my-auto py-2">
              <PhotoClockCanvas config={config} sizePx={340} />
            </div>

            {/* Price Info Bar */}
            <div className="w-full pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-300">
              <span>{config.bodyShape.toUpperCase()} • {config.maskShape.toUpperCase()}</span>
              <span className="text-gold-400 font-bold">${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Step-by-Step Customizer Panel */}
        <div className="lg:col-span-7 bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Step Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-white/10 pb-4">
            {[
              { step: 1, label: '1. Photo Count' },
              { step: 2, label: '2. Mask Shapes' },
              { step: 3, label: '3. Fit Slot Photos' },
              { step: 4, label: '4. Body & Pins' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step as any)}
                className={`py-2 px-3 rounded-xl font-medium text-xs text-center transition-all ${
                  activeStep === s.step
                    ? 'bg-gold-500 text-black shadow-glow font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* STEP 1: PHOTO QUANTITY SELECTION */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Select Number of Photo Slots inside Clock Dial
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { count: 1, label: '1 Solo Center Photo', desc: 'Single statement memory image' },
                  { count: 2, label: '2 Photos Split', desc: 'Side-by-side couple portrait' },
                  { count: 3, label: '3 Photos Radial', desc: 'Triangular memory collage' },
                  { count: 4, label: '4 Quadrants', desc: '4 seasonal or family photos' },
                  { count: 6, label: '6 Honeycomb Grid', desc: '6 geometric collage slots' },
                  { count: 12, label: '12 Hour Position Circles', desc: '12 photos for each hour mark!' },
                ].map((p) => {
                  const isSelected = config.photoCount === p.count;
                  return (
                    <button
                      key={p.count}
                      onClick={() => handleSetPhotoCount(p.count as any)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-gold-500 bg-gold-500/10 shadow-glow ring-1 ring-gold-500'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="text-base font-bold text-slate-100">{p.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: MASK SHAPE SELECTION */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Select Photo Frame Mask Cutout Shape
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { id: 'circle', label: 'Circle Cutouts', icon: Disc },
                  { id: 'heart', label: 'Heart Shape Cutout', icon: Heart },
                  { id: 'quadrant', label: 'Quadrant Pie Slices', icon: Grid },
                  { id: '12-hour-circles', label: '12-Hour Circles', icon: Camera },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = config.maskShape === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setConfig({ ...config, maskShape: m.id as PhotoMaskShape })}
                      className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-gold-500 bg-gold-500/10 shadow-glow text-gold-400'
                          : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-100">{m.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD & FIT SLOT PHOTOS */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400">
                Upload & Fit Images into Photo Slots ({config.photoCount} Total Slots)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-2">
                {config.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-xl border border-white/10 bg-white/5 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">
                        📷 {slot.label || `Slot ${slot.id}`}
                      </span>
                      {slot.imageUrl && (
                        <span className="text-[10px] text-emerald-400 font-mono">IMAGE LOADED</span>
                      )}
                    </div>

                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gold-500 text-black font-semibold text-xs cursor-pointer hover:bg-gold-400 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      Upload Slot Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSlotImageUpload(slot.id, e)}
                        className="hidden"
                      />
                    </label>

                    {slot.imageUrl && (
                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400">
                          <span>Zoom Scale:</span>
                          <span className="font-mono text-slate-200">{slot.zoom.toFixed(1)}x</span>
                        </div>
                        <input
                          type="range"
                          min={0.5}
                          max={2.5}
                          step={0.1}
                          value={slot.zoom}
                          onChange={(e) => handleSlotZoom(slot.id, Number(e.target.value))}
                          className="w-full accent-gold-400 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: BODY SHAPE & CLOCK PINS */}
          {activeStep === 4 && (
            <div className="space-y-6">
              {/* Clock Body Shape Picker */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
                  Select Outer Clock Body Outline Shape
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'round-wall', label: 'Round Classic Wall', icon: Disc },
                    { id: 'square-minimal', label: 'Square Minimalist', icon: Square },
                    { id: 'arch-tabletop', label: 'Gothic Arch Mantel', icon: Maximize2 },
                    { id: 'hexagon-geometric', label: 'Hexagon Geometric', icon: Hexagon },
                  ].map((b) => {
                    const Icon = b.icon;
                    const isSelected = config.bodyShape === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => setConfig({ ...config, bodyShape: b.id as ClockBodyShape })}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all flex flex-col items-center gap-2 ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{b.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clock Pins Style Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-3">
                  Clock Center Pins & Cap Craftsmanship
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'gold-bullet-pin', label: 'Solid Gold Bullet Pin' },
                    { id: 'silver-capped-pin', label: 'Silver Capped Pin' },
                    { id: 'black-obsidian-pin', label: 'Black Obsidian Pin' },
                    { id: 'ruby-gem-pin', label: 'Ruby Gemstone Pin' },
                  ].map((pin) => {
                    const isSelected = config.pinStyle === pin.id;
                    return (
                      <button
                        key={pin.id}
                        onClick={() => setConfig({ ...config, pinStyle: pin.id as ClockPinStyle })}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-500/10 text-gold-400 shadow-glow'
                            : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        {pin.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Engraving Inscription */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">
                  Dial Laser Engraved Message
                </label>
                <input
                  type="text"
                  maxLength={35}
                  placeholder="e.g. OUR FAMILY MOMENTS • 2026"
                  value={config.engravedText || ''}
                  onChange={(e) => setConfig({ ...config, engravedText: e.target.value })}
                  className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-slate-100"
                />
              </div>
            </div>
          )}

          {/* Bottom Action Button */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block">Total Spec Price:</span>
              <span className="text-2xl font-bold font-mono text-gold-400">${totalPrice}</span>
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 70, spread: 70 });
                setIsReceiptOpen(true);
              }}
              className="px-6 py-3 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-all shadow-glow flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Download PDF Spec Sheet & Receipt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Downloadable PDF Receipt Modal */}
      <PdfReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        config={config}
        totalPrice={totalPrice}
      />
    </div>
  );
};
