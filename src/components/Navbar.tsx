import React from 'react';
import { isFirebaseConnected } from '../lib/firebase';
import { 
  Clock, 
  Sliders, 
  Grid, 
  Eye, 
  Activity, 
  Database,
  Radio,
  Award,
  Star,
  Users,
  Camera,
  Ruler,
  Sparkles,
  Gift
} from 'lucide-react';

export type ActiveTab = 'studio' | 'photo' | 'catalog' | 'room' | 'tracker' | 'auth' | 'reviews';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenFirebaseModal: () => void;
  onOpenBespokeModal: () => void;
  onOpenCoDesignModal: () => void;
  onOpenDistanceModal: () => void;
  onOpenARModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenFirebaseModal,
  onOpenBespokeModal,
  onOpenCoDesignModal,
  onOpenDistanceModal,
  onOpenARModal,
}) => {
  const firebaseConnected = isFirebaseConnected();

  return (
    <header className="sticky top-0 z-40 bg-[#08090D]/85 backdrop-blur-2xl border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onTabChange('photo')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 via-amber-400 to-yellow-300 text-black flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform font-bold">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg tracking-wider text-slate-100 group-hover:text-gold-400 transition-colors">
                CHRONOCRAFT
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 shadow-glow flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-gold-400" />
                STUDIO v2.0
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight">
              Real-Time Custom Clock Engineering
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => onTabChange('photo')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'photo'
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Photo Studio</span>
          </button>

          <button
            onClick={() => onTabChange('studio')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Clock Studio</span>
          </button>

          <button
            onClick={() => onTabChange('catalog')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>

          <button
            onClick={() => onTabChange('room')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'room'
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Room Scale</span>
          </button>

          <button
            onClick={() => onTabChange('tracker')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tracker'
                ? 'bg-gradient-to-r from-gold-500 to-amber-400 text-black shadow-glow scale-105'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Tracker</span>
          </button>

          <button
            onClick={() => onTabChange('auth')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'auth'
                ? 'bg-gold-500 text-black shadow-glow'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AR Camera Wall Preview */}
          <button
            onClick={onOpenARModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 text-black hover:bg-gold-400 text-xs font-bold transition-all shadow-glow"
            title="Live AR Camera Wall Preview"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AR Camera Wall</span>
          </button>

          <button
            onClick={onOpenDistanceModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-100 hover:bg-white/20 text-xs font-semibold transition-colors"
          >
            <Ruler className="w-3.5 h-3.5 text-gold-400" />
            <span>Size Guide</span>
          </button>

          <button
            onClick={onOpenCoDesignModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300 hover:bg-gold-500/20 text-xs font-semibold transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Co-Design</span>
          </button>
        </div>
      </div>
    </header>
  );
};
