import React, { useState } from 'react';
import { 
  getStoredFirebaseConfig, 
  saveFirebaseConfig, 
  clearFirebaseConfig, 
  isFirebaseConnected, 
  FirebaseCredentials 
} from '../lib/firebase';
import { Database, CheckCircle2, AlertCircle, Key, RefreshCw } from 'lucide-react';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getStoredFirebaseConfig();
  const connected = isFirebaseConnected();

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !projectId.trim()) return;

    const creds: FirebaseCredentials = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim(),
    };

    saveFirebaseConfig(creds);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Firebase Real-Time Connectivity Hub
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        {/* Connection Status Badge */}
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            connected
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-gold-500/10 border-gold-500/40 text-gold-300'
          }`}
        >
          {connected ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gold-400 shrink-0" />
          )}
          <div className="text-xs">
            <div className="font-bold text-sm">
              {connected ? 'Cloud Firebase Firestore Connected' : 'Reactive Local Fallback Engine Active'}
            </div>
            <p className="mt-0.5 opacity-90 leading-relaxed">
              {connected
                ? `Active Cloud Project ID: ${currentConfig?.projectId}. Orders and designs sync live across all client browsers.`
                : 'Operating in zero-config local mode. Enter your Firebase project keys below to connect your live database anytime.'}
            </p>
          </div>
        </div>

        {/* Credential Form */}
        <form onSubmit={handleSave} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">API Key (VITE_FIREBASE_API_KEY)</label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Project ID</label>
              <input
                type="text"
                placeholder="chronocraft-clock"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Auth Domain</label>
              <input
                type="text"
                placeholder="chronocraft-clock.firebaseapp.com"
                value={authDomain}
                onChange={(e) => setAuthDomain(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Storage Bucket</label>
              <input
                type="text"
                placeholder="chronocraft-clock.appspot.com"
                value={storageBucket}
                onChange={(e) => setStorageBucket(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">App ID</label>
              <input
                type="text"
                placeholder="1:123456789:web:abcdef..."
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-between gap-3 border-t border-white/10">
            {currentConfig && (
              <button
                type="button"
                onClick={clearFirebaseConfig}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30"
              >
                Reset Credentials
              </button>
            )}

            <button
              type="submit"
              className="ml-auto px-5 py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 shadow-glow"
            >
              Save Credentials & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
