import React from 'react';
import { isFirebaseConnected } from '../lib/firebase';
import { 
  Clock, 
  Sliders, 
  Grid, 
  Eye, 
  Activity, 
  Building2, 
  Database,
  Radio,
  Award,
  Star,
  Users,
  Camera
} from 'lucide-react';

export type ActiveTab = 'studio' | 'photo' | 'catalog' | 'room' | 'tracker' | 'auth' | 'reviews';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenFirebaseModal: () => void;
  onOpenBespokeModal: () => void;
  onOpenCoDesignModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenFirebaseModal,
  onOpenBespokeModal,
  onOpenCoDesignModal,
}) => {
  const firebaseConnected = isFirebaseConnected();

  return (
    <header className="sticky top-0 z-40 bg-[#0B0D12]/90 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('studio')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-300 text-black flex items-center justify-center shadow-glow font-bold">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg tracking-wider text-slate-100">
                CHRONOCRAFT
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                REAL-TIME STUDIO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              Bespoke Custom Clock Engineering
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => onTabChange('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => onTabChange('photo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'photo'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Photo Memory Studio</span>
          </button>

          <button
            onClick={() => onTabChange('catalog')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'catalog'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Collections</span>
          </button>

          <button
            onClick={() => onTabChange('room')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'room'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Room Scale</span>
          </button>

          <button
            onClick={() => onTabChange('tracker')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tracker'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tracker</span>
          </button>

          <button
            onClick={() => onTabChange('auth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'auth'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Authenticator</span>
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCoDesignModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Co-Design</span>
          </button>

          <button
            onClick={onOpenFirebaseModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              firebaseConnected
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-gold-500/30 bg-gold-500/10 text-gold-300 hover:bg-gold-500/20'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{firebaseConnected ? 'Firebase' : 'Cloud Setup'}</span>
            <Radio className={`w-3 h-3 ${firebaseConnected ? 'text-emerald-400 animate-ping' : 'text-gold-400'}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
