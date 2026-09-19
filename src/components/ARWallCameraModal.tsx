import React, { useState, useRef, useEffect } from 'react';
import { ClockConfig } from '../types/clock';
import { ClockCanvas } from './ClockCanvas';
import { Eye, Sliders, Camera, AlertCircle, Check } from 'lucide-react';

interface ARWallCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ClockConfig;
}

export const ARWallCameraModal: React.FC<ARWallCameraModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scalePx, setScalePx] = useState<number>(200);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment', width: 1280, height: 720 } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera stream failed', err);
          setErrorMsg('Camera access is not available to stream your live wall.');
        });
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen]);

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-gold-400 animate-pulse" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Live AR Camera Wall Previewer
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        {errorMsg ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-slate-200 font-semibold">{errorMsg}</p>
            <p>You can use the 3D Room Visualizer tab to test against pre-set room backdrops.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Camera Viewport with Floating Scalable Clock Canvas */}
            <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border border-white/15 bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Floating AR Overlay Canvas */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
                <ClockCanvas config={config} sizePx={scalePx} />
              </div>

              {/* Helper Badge */}
              <div className="absolute bottom-3 left-3 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] text-slate-200 font-mono">
                [ Point camera at your physical room wall ]
              </div>
            </div>

            {/* Controls Scale Slider */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold-400" />
                AR Scale Size:
              </span>
              <input
                type="range"
                min={120}
                max={320}
                value={scalePx}
                onChange={(e) => setScalePx(Number(e.target.value))}
                className="flex-1 accent-gold-400 cursor-pointer"
              />
              <span className="font-mono text-gold-400 font-bold">{scalePx}px</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
