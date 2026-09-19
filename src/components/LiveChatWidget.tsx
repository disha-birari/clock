import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types/clock';
import { subscribeToChatMessages, sendChatMessage } from '../lib/firebase';
import { MessageSquare, Send, X, User, ShieldCheck, Minimize2 } from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [clientName, setClientName] = useState('Client Guest');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = subscribeToChatMessages((list) => {
      setMessages(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const textToSend = input.trim();
    setInput('');
    await sendChatMessage(textToSend, 'client', clientName);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-gold-500 to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-glow-lg hover:scale-105 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Live Artisan Desk</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-400 animate-ping" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 bg-[#11141D] border border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[480px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-studio-900 to-studio-850 border-b border-white/10 p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold text-xs">
                JL
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100 flex items-center gap-1">
                  Master Craftsman Jean-Luc
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Online for Real-Time Consultation
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/5"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0B0D12]/60">
            {messages.map((m) => {
              const isClient = m.sender === 'client';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-slate-400 font-mono mb-0.5 px-1">
                    {m.senderName} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div
                    className={`max-w-[85%] p-2.5 rounded-xl text-xs leading-relaxed ${
                      isClient
                        ? 'bg-gold-500 text-black font-medium rounded-tr-none'
                        : 'bg-white/10 border border-white/10 text-slate-100 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#11141D] flex gap-2">
            <input
              type="text"
              placeholder="Ask artisan about wood, dial, dimensions..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-[#0B0D12] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-gold-500 text-black font-bold hover:bg-gold-400 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
