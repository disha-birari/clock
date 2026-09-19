import React, { useState, useEffect } from 'react';
import { ClockConfig, SizeInches } from './types/clock';
import { DEFAULT_CLOCK_CONFIG, PRESET_CLOCKS } from './lib/presets';
import { Navbar, ActiveTab } from './components/Navbar';
import { ClockCanvas } from './components/ClockCanvas';
import { ClockStudio } from './components/ClockStudio';
import { PriceCalculator } from './components/PriceCalculator';
import { RoomVisualizer } from './components/RoomVisualizer';
import { OrderTracker } from './components/OrderTracker';
import { Catalog } from './components/Catalog';
import { FirebaseModal } from './components/FirebaseModal';
import { BespokeQuoteModal } from './components/BespokeQuoteModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { CollaborativeSessionModal } from './components/CollaborativeSessionModal';
import { SerialAuthenticator } from './components/SerialAuthenticator';
import { CustomerReviews } from './components/CustomerReviews';
import { LiveActivityTicker } from './components/LiveActivityTicker';
import { PhotoClockStudio } from './components/PhotoClockStudio';
import { DistanceCalculatorModal } from './components/DistanceCalculatorModal';
import { ARWallCameraModal } from './components/ARWallCameraModal';
import { VoiceMessageRecorder } from './components/VoiceMessageRecorder';
import { GiftPackagingStudio } from './components/GiftPackagingStudio';
import { SoundSimulatorModal } from './components/SoundSimulatorModal';
import { LEDBacklightStudio } from './components/LEDBacklightStudio';
import { ClockCompareModal } from './components/ClockCompareModal';
import { CurrencyCode } from './lib/currencies';
import { 
  RotateCcw, 
  Clock
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('photo');
  const [clockConfig, setClockConfig] = useState<ClockConfig>(DEFAULT_CLOCK_CONFIG);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState<string>('CHRONO-98421-US');
  const [savedConfigs, setSavedConfigs] = useState<ClockConfig[]>([]);

  // Modals state
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [isCoDesignModalOpen, setIsCoDesignModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);
  const [isARModalOpen, setIsARModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedDesign = urlParams.get('design');
      if (sharedDesign) {
        const parsed = JSON.parse(decodeURIComponent(sharedDesign));
        setClockConfig(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse share link', e);
    }
  }, []);

  const handleOrderCreated = (trackingNumber: string) => {
    setActiveTrackingNumber(trackingNumber);
    setActiveTab('tracker');
  };

  const handleApplyRecommendedSize = (recommendedSize: SizeInches) => {
    setClockConfig((prev) => ({ ...prev, size: recommendedSize }));
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
        onOpenBespokeModal={() => setIsBespokeModalOpen(true)}
        onOpenCoDesignModal={() => setIsCoDesignModalOpen(true)}
        onOpenDistanceModal={() => setIsDistanceModalOpen(true)}
        onOpenARModal={() => setIsARModalOpen(true)}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
      />

      {/* Real-Time Live Activity Stream Ticker */}
      <LiveActivityTicker />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* VIEW 1: MULTI-PHOTO MEMORY CLOCK STUDIO */}
        {activeTab === 'photo' && <PhotoClockStudio />}

        {/* VIEW 2: STANDARD CHRONO STUDIO CUSTOMIZER */}
        {activeTab === 'studio' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center justify-center relative min-h-[460px]">
                  <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
                    <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      Live Canvas Renderer ({clockConfig.size}" Scale)
                    </span>
                    <button
                      onClick={() => setClockConfig(DEFAULT_CLOCK_CONFIG)}
                      className="text-slate-400 hover:text-gold-400 flex items-center gap-1 font-semibold transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Specs
                    </button>
                  </div>

                  <div className="my-auto py-4">
                    <ClockCanvas config={clockConfig} sizePx={340} />
                  </div>

                  <div className="w-full pt-4 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 uppercase font-mono mr-1 shrink-0">
                      Presets:
                    </span>
                    {PRESET_CLOCKS.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setClockConfig(p)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 transition-colors shrink-0"
                      >
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LED Backlight Studio */}
                <LEDBacklightStudio
                  ledEnabled={clockConfig.ledBacklight}
                  ledColor={clockConfig.ledColor || '#FCE076'}
                  onToggleLed={(enabled) => setClockConfig((prev) => ({ ...prev, ledBacklight: enabled }))}
                  onChangeLedColor={(color) => setClockConfig((prev) => ({ ...prev, ledColor: color, ledBacklight: true }))}
                />

                {/* Voice Chime Message Recorder */}
                <VoiceMessageRecorder onAudioSaved={(url) => console.log('Voice chime recorded', url)} />

                {/* Luxury Gift Packaging Studio */}
                <GiftPackagingStudio onPackagingUpdated={(info) => console.log('Packaging updated', info)} />
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7">
                  <ClockStudio config={clockConfig} onChange={setClockConfig} />
                </div>
                <div className="md:col-span-5">
                  <PriceCalculator config={clockConfig} onOrderCreated={handleOrderCreated} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: SIGNATURE CATALOG */}
        {activeTab === 'catalog' && (
          <Catalog
            onSelectPreset={(selectedConfig) => {
              setClockConfig(selectedConfig);
              setActiveTab('studio');
            }}
          />
        )}

        {/* VIEW 4: ROOM WALL BACKDROP VISUALIZER */}
        {activeTab === 'room' && <RoomVisualizer config={clockConfig} />}

        {/* VIEW 5: REAL-TIME CLIENT ORDER TRACKER */}
        {activeTab === 'tracker' && <OrderTracker initialTracking={activeTrackingNumber} />}

        {/* VIEW 6: LASER SERIAL AUTHENTICATOR */}
        {activeTab === 'auth' && <SerialAuthenticator />}

        {/* VIEW 7: VERIFIED CUSTOMER REVIEWS */}
        {activeTab === 'reviews' && <CustomerReviews />}
      </main>

      {/* Floating Live Consultation Chat Widget */}
      <LiveChatWidget />

      {/* Mechanical Sound & Chime Simulator Modal */}
      <SoundSimulatorModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        currentChime={clockConfig.chime}
        onSelectChime={(chime) => setClockConfig((prev) => ({ ...prev, chime }))}
      />

      {/* Side-by-Side Design Comparison Matrix Modal */}
      <ClockCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        savedConfigs={PRESET_CLOCKS}
        currentConfig={clockConfig}
        currency="USD"
      />

      {/* Live AR Camera Wall Previewer Modal */}
      <ARWallCameraModal
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
        config={clockConfig}
      />

      {/* Ergonomic Distance Calculator Modal */}
      <DistanceCalculatorModal
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
        onSelectRecommendedSize={handleApplyRecommendedSize}
      />

      {/* Collaborative Session Modal */}
      <CollaborativeSessionModal
        isOpen={isCoDesignModalOpen}
        onClose={() => setIsCoDesignModalOpen(false)}
        config={clockConfig}
        onConfigSynced={(synced) => setClockConfig(synced)}
      />

      {/* Firebase Settings Modal */}
      <FirebaseModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Bespoke Architectural Quote Modal */}
      <BespokeQuoteModal
        isOpen={isBespokeModalOpen}
        onClose={() => setIsBespokeModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#08090D] py-8 px-4 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-200">CHRONOCRAFT STUDIO</span>
            <span>— Precision Real-Time Custom Clock Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button onClick={() => setIsFirebaseModalOpen(true)} className="hover:text-gold-400 transition-colors">
              Firebase Config
            </button>
            <button onClick={() => setIsBespokeModalOpen(true)} className="hover:text-gold-400 transition-colors">
              Bespoke Inquiries
            </button>
            <span>© 2026 ChronoCraft. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
