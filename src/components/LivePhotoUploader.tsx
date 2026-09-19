import React, { useState } from 'react';
import { CameraCaptureModal } from './CameraCaptureModal';
import { Camera, Upload, Link, Image as ImageIcon, Sparkles, Check } from 'lucide-react';

interface LivePhotoUploaderProps {
  onPhotoSelected: (imageDataUrl: string) => void;
  currentPhotoUrl?: string;
  label?: string;
}

export const LivePhotoUploader: React.FC<LivePhotoUploaderProps> = ({
  onPhotoSelected,
  currentPhotoUrl,
  label = 'Add / Replace Photo in Real-Time',
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onPhotoSelected(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onPhotoSelected(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onPhotoSelected(urlInput.trim());
    setUrlInput('');
    setIsUrlInputOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* HTML5 Drag & Drop Target Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-4 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
          isDragging
            ? 'border-gold-400 bg-gold-500/20 scale-105 shadow-glow'
            : 'border-white/20 bg-white/5 hover:border-gold-500/50 hover:bg-white/10'
        }`}
      >
        <ImageIcon className="w-8 h-8 text-gold-400 mb-1 animate-bounce" />
        <span className="text-xs font-bold text-slate-100">{label}</span>
        <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
          Drag & Drop image file anywhere here
        </span>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          {/* 1. Local File Upload */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500 text-black text-xs font-bold cursor-pointer hover:bg-gold-400 shadow-glow transition-transform active:scale-95">
            <Upload className="w-3.5 h-3.5" />
            Upload File
            <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
          </label>

          {/* 2. Webcam Snap */}
          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs font-bold transition-all border border-white/15"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Webcam Snap</span>
          </button>

          {/* 3. Image Link URL */}
          <button
            type="button"
            onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-100 text-xs font-bold transition-all border border-white/15"
          >
            <Link className="w-3.5 h-3.5 text-sky-400" />
            <span>Paste URL</span>
          </button>
        </div>
      </div>

      {/* Paste Image URL Input Box */}
      {isUrlInputOpen && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 p-2 rounded-xl bg-[#0B0D12] border border-white/15">
          <input
            type="url"
            placeholder="Paste public image link (https://...)..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 focus:outline-none font-mono"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-gold-500 text-black text-xs font-bold uppercase"
          >
            Apply URL
          </button>
        </form>
      )}

      {/* Camera Snap Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(imgData) => onPhotoSelected(imgData)}
      />
    </div>
  );
};
