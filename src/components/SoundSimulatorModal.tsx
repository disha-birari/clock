import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Bell, Play, Square, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { ChimeType } from '../types/clock';

interface SoundSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChime: ChimeType;
  onSelectChime: (chime: ChimeType) => void;
}

export const SoundSimulatorModal: React.FC<SoundSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentChime,
  onSelectChime,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSound, setSelectedSound] = useState<ChimeType>(currentChime);
  const [volume, setVolume] = useState(0.6);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSound();
    };
  }, []);

  if (!isOpen) return null;

  const initAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playTickSound = (type: ChimeType) => {
    initAudioCtx();
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (type === 'silent-sweep') {
      // Very soft low frequency sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(volume * 0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
      return;
    }

    if (type === 'grandfather-tick' || type === 'soft-pendulum') {
      const isPendulum = type === 'soft-pendulum';
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.value = isPendulum ? 600 : 1200;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isPendulum ? 350 : 800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + (isPendulum ? 0.08 : 0.04));

      gain.gain.setValueAtTime(volume * (isPendulum ? 0.4 : 0.6), ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isPendulum ? 0.08 : 0.04));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + (isPendulum ? 0.08 : 0.04));
      return;
    }

    if (type === 'westminster-chime') {
      // Play a short 3-note Westminster melody sample
      const notes = [440, 554.37, 659.25, 329.63]; // A4, C#5, E5, E4
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);

        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.25);
        gain.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + idx * 0.25 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.25 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 0.6);
      });
    }
  };

  const startSound = (type: ChimeType) => {
    stopSound();
    setIsPlaying(true);
    setSelectedSound(type);

    playTickSound(type);
    timerRef.current = window.setInterval(() => {
      playTickSound(type);
    }, type === 'westminster-chime' ? 2500 : 1000);
  };

  const stopSound = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const chimeOptions: { id: ChimeType; title: string; desc: string; tag: string }[] = [
    {
      id: 'silent-sweep',
      title: 'Ultra-Silent Japanese Sweep',
      desc: '0 dB completely noiseless motor continuous rotation movement.',
      tag: 'Best for Bedrooms',
    },
    {
      id: 'grandfather-tick',
      title: 'Vintage Grandfather Mechanical',
      desc: 'Deep warm brass escapement tick with rhythmic acoustic resonate resonance.',
      tag: 'Heritage Feel',
    },
    {
      id: 'soft-pendulum',
      title: 'Soft Wood Pendulum Cadence',
      desc: 'Muffled organic thud sound designed for quiet study rooms and libraries.',
      tag: 'Calming Rhythm',
    },
    {
      id: 'westminster-chime',
      title: 'Westminster Hourly Chime',
      desc: 'Classic 4-bell chime sequence synthesized with harmonic resonance.',
      tag: 'Classic Luxury',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-[#0D0F17] border border-cyan-500/30 rounded-3xl w-full max-w-xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-cyan-400">
                Acoustic Chime & Ticking Simulator
              </h2>
              <p className="text-xs text-slate-400">Web Audio API real-time mechanical sound engine</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSound();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Volume Slider */}
        <div className="my-6 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
          <button
            onClick={() => setVolume(volume === 0 ? 0.6 : 0)}
            className="text-cyan-400 hover:text-cyan-300"
          >
            {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs font-mono text-cyan-400 w-12 text-right">{Math.round(volume * 100)}%</span>
        </div>

        {/* Sound Selection Grid */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {chimeOptions.map((opt) => {
            const isSelected = selectedSound === opt.id;
            const isThisPlaying = isPlaying && isSelected;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  setSelectedSound(opt.id);
                  onSelectChime(opt.id);
                  startSound(opt.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                    : 'bg-white/5 border-white/10 hover:border-cyan-500/40 hover:bg-white/10'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{opt.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {opt.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{opt.desc}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isThisPlaying) {
                      stopSound();
                    } else {
                      onSelectChime(opt.id);
                      startSound(opt.id);
                    }
                  }}
                  className={`p-3 rounded-xl transition-all ${
                    isThisPlaying
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-cyan-500 text-black font-bold hover:bg-cyan-400'
                  }`}
                >
                  {isThisPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All clocks ship with silent sweep quartz as standard.</span>
          </div>
          <button
            onClick={() => {
              stopSound();
              onClose();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Apply Movement & Close
          </button>
        </div>
      </div>
    </div>
  );
};
