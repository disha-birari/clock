import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setCapturedUrl(null);
      navigator.mediaDevices
        .getUserMedia({ video: { width: 640, height: 640, facingMode: 'user' } })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn('Camera access denied or unavailable', err);
          setErrorMsg('Camera access is not permitted or unavailable on your device.');
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
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  if (!isOpen) return null;

  const handleTakeSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedUrl(dataUrl);
  };

  const handleConfirmPhoto = () => {
    if (capturedUrl) {
      onCapture(capturedUrl);
      stopStream();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141D] border border-gold-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-gold-400" />
            <h3 className="text-lg font-bold font-serif text-slate-100">
              Live Webcam Photo Snap
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-lg font-bold">
            ✕
          </button>
        </div>

        {errorMsg ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p>{errorMsg}</p>
            <p className="text-[10px] text-slate-400">
              Please use standard file drag & drop or choose a photo from your device gallery instead.
            </p>
          </div>
        ) : capturedUrl ? (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-gold-500 shadow-glow aspect-square">
              <img src={capturedUrl} alt="Captured snap" className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCapturedUrl(null)}
                className="py-2.5 rounded-xl bg-white/10 text-slate-200 text-xs font-bold hover:bg-white/20 flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Snap</span>
              </button>

              <button
                onClick={handleConfirmPhoto}
                className="py-2.5 rounded-xl bg-gold-500 text-black text-xs font-bold uppercase shadow-glow flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Clock</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black aspect-square flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            <button
              onClick={handleTakeSnapshot}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo Snap Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
