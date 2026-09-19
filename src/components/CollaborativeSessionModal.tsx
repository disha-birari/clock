import React, { useState, useEffect } from 'react';
import { ClockConfig } from '../types/clock';
import { subscribeToCollaborativeSession, updateCollaborativeSession } from '../lib/firebase';
import { Users, Copy, Check, Radio, Share2 } from 'lucide-react';

interface CollaborativeSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClockConfig;
  onConfigSynced: (syncedConfig: ClockConfig) => void;
}

export const CollaborativeSessionModal: React.FC<CollaborativeSessionModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigSynced,
}) => {
  const [roomCode, setRoomCode] = useState<string>('ROOM-882');
  const [inputRoom, setInputRoom] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isJoined || !roomCode) return;
    const unsub = subscribeToCollaborativeSession(roomCode, (newConfig) => {
      onConfigSynced(newConfig);
    });
    return () => unsub();
  }, [isJoined, roomCode]);

  if (!isOpen) return null;

  const handleCreateRoom = () => {
    const code = `ROOM-${Math.floor(100 + Math.random() * 900)}`;
    setRoomCode(code);
    setIsJoined(true);
    updateCollaborativeSession(code, config, 'Host Designer');
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoom.trim()) return;
    const clean = inputRoom.trim().toUpperCase();
    setRoomCode(clean);
    setIsJoined(true);
  };

  const handleBroadcastCurrent = () => {
    if (roomCode) {
      updateCollaborativeSession(roomCode, config, 'Co-Designer');
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Live Co-Design Session
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        {!isJoined ? (
          <div className="space-y-5 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Synchronize your studio customizer in real-time across multiple computers, tablets, or with family & business partners.
            </p>

            <button
              onClick={handleCreateRoom}
              className="w-full py-3 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 shadow-glow flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Create New Co-Design Room</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-4 text-slate-500 font-mono text-[10px]">OR JOIN EXISTING</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleJoinRoom} className="space-y-3">
              <input
                type="text"
                placeholder="Enter 6-digit Room Code (e.g. ROOM-882)..."
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value)}
                className="w-full bg-[#0B0D12] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-500"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-white/10 text-slate-100 font-bold hover:bg-white/20 border border-white/15"
              >
                Join Live Room
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-emerald-400 uppercase">ACTIVE REAL-TIME ROOM</div>
                <div className="text-lg font-bold font-mono text-slate-100">{roomCode}</div>
              </div>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-slate-400">
              Any parameter edits you make in the Studio are automatically broadcast live to all connected participants in this room.
            </p>

            <button
              onClick={handleBroadcastCurrent}
              className="w-full py-2.5 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase shadow-glow"
            >
              Push My Current Clock Specs to Room
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
