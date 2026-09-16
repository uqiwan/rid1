import React from 'react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  const navigate = useTuneForgeStore((s) => s.navigate);

  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/50 py-12 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-amber-400 font-bold text-xs">
                TF
              </div>
              <span className="font-display font-bold text-slate-900 text-sm tracking-tight">TuneForge</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">v1.0 MVP</span>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-sm">
              Studio otomasi konten YouTube musik instrumental berbasis AI yang dirancang khusus untuk audience Tier-1 Amerika Serikat dengan fokus CTR &gt;20% dan retensi tinggi.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-500" /> Output Siap Paste</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 18 Kategori Kurasi</span>
              <span className="inline-flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-blue-500" /> 7 Blok Terstruktur</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Navigasi Utama</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/')} className="hover:text-slate-900 transition-colors">Beranda</button></li>
              <li><button onClick={() => navigate('/fitur')} className="hover:text-slate-900 transition-colors">7 Modul Output</button></li>
              <li><button onClick={() => navigate('/kategori')} className="hover:text-slate-900 transition-colors">Katalog 18 Kategori</button></li>
              <li><button onClick={() => navigate('/cara-kerja')} className="hover:text-slate-900 transition-colors">Cara Kerja & Integrasi</button></li>
              <li><button onClick={() => navigate('/faq')} className="hover:text-slate-900 transition-colors">Pertanyaan Umum (FAQ)</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-slate-900 text-xs uppercase tracking-wider mb-3">Area Kerja</h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigate('/dashboard')} className="hover:text-slate-900 transition-colors">Dasbor Kreator</button></li>
              <li><button onClick={() => navigate('/generate')} className="hover:text-slate-900 transition-colors">Forge Paket Konten</button></li>
              <li><button onClick={() => navigate('/history')} className="hover:text-slate-900 transition-colors">Riwayat Paket</button></li>
              <li><button onClick={() => navigate('/profile')} className="hover:text-slate-900 transition-colors">Profil Saya</button></li>
              <li><button onClick={() => navigate('/admin/dashboard')} className="hover:text-slate-900 text-amber-600 transition-colors">Portal Admin</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} TuneForge Studio. Hak cipta dilindungi. Dirancang untuk Kreator Musik YouTube.</p>
          <div className="flex items-center gap-6">
            <span>Standar YouTube -14 LUFS</span>
            <span>Google Flow AI Ready</span>
            <span>Dukungan Bahasa Indonesia UI & English Output</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
