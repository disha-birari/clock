import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, Volume2, CheckCircle2 } from 'lucide-react';

interface VoiceMessageRecorderProps {
  onAudioSaved: (audioBlobUrl: string) => void;
}

export const VoiceMessageRecorder: React.FC<VoiceMessageRecorderProps> = ({ onAudioSaved }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordTimeSec, setRecordTimeSec] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioSaved(url);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTimeSec(0);

      timerRef.current = setInterval(() => {
        setRecordTimeSec((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access denied or error', err);
      alert('Microphone access is required to record custom chime voice notes.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleClear = () => {
    setAudioUrl(null);
    setRecordTimeSec(0);
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-100 flex items-center gap-2">
          <Mic className="w-4 h-4 text-gold-400" />
          Custom Voice Message Chime Recording
        </span>
        <span className="text-[10px] text-slate-400 font-mono">OPTIONAL ADD-ON</span>
      </div>

      <p className="text-slate-400 text-[11px] leading-relaxed">
        Record a 5 to 15 second voice greeting (e.g. birthday wish, family quote) to embed into the clock's chime sound module.
      </p>

      {audioUrl ? (
        <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0" />
            <div>
              <div className="font-bold text-slate-100">Voice Note Attached</div>
              <div className="text-[10px] text-slate-400 font-mono">Length: {recordTimeSec}s</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <audio src={audioUrl} controls className="h-8 max-w-[140px]" />
            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
              title="Delete recording"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-1">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs flex items-center gap-2 animate-pulse shadow-glow"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop Recording ({recordTimeSec}s)</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-xl bg-gold-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-gold-400 shadow-glow transition-all"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Record Voice Note</span>
            </button>
          )}

          <span className="text-[10px] font-mono text-slate-400">
            {isRecording ? `Recording Audio...` : 'Microphone Ready'}
          </span>
        </div>
      )}
    </div>
  );
};
