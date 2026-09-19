import React, { useState } from 'react';
import { verifySerialNumber } from '../lib/firebase';
import { AuthenticCertificate } from '../types/clock';
import { ShieldCheck, Search, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export const SerialAuthenticator: React.FC = () => {
  const [serial, setSerial] = useState('CHRONO-CERT-8842');
  const [cert, setCert] = useState<AuthenticCertificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;
    setIsLoading(true);
    const result = await verifySerialNumber(serial);
    setCert(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-[#11141D]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold font-serif text-slate-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-400" />
            Laser Serial & Certificate of Authenticity Lookup
          </h2>
          <p className="text-xs text-slate-400">
            Verify original ChronoCraft laser-engraved serial numbers and master craftsman hallmark certificates.
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="e.g. CHRONO-CERT-8842..."
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            className="w-full bg-[#0B0D12] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-gold-500"
          />
        </div>
        <button
          type="submit"
          className="py-2.5 px-6 rounded-xl bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors shadow-glow shrink-0"
        >
          {isLoading ? 'Checking Register...' : 'Verify Authenticity'}
        </button>
      </form>

      {cert && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-white/5 to-transparent border border-gold-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              {cert.status === 'AUTHENTIC' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              )}
              <span className="text-sm font-bold text-slate-100 font-serif">
                {cert.status === 'AUTHENTIC' ? 'Official Certificate of Authenticity' : 'Record Not Verified'}
              </span>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                cert.status === 'AUTHENTIC'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              {cert.status}
            </span>
          </div>

          {cert.status === 'AUTHENTIC' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Serial Register Number:</span>
                <span className="text-gold-400 font-bold">{cert.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Master Craftsman Lead:</span>
                <span className="text-slate-100 font-bold">{cert.masterCraftsman}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Crafting Completion Date:</span>
                <span className="text-slate-100">{cert.craftedDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Movement Specification:</span>
                <span className="text-slate-100">{cert.movementSpec}</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              No matching master register record found for serial "{serial}". Please double check your engraved plate or contact support.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
