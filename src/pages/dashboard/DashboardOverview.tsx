import React from 'react';
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  TrendingUp, 
  History, 
  ArrowRight, 
  Copy, 
  Trash2, 
  Layers,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';

export const DashboardOverview: React.FC = () => {
  const { 
    packages, 
    navigate, 
    setCurrentPackageById, 
    deletePackage, 
    currentUser 
  } = useTuneForgeStore();

  const totalPackages = packages.length;
  const recentPackages = packages.slice(0, 5);

  const handleOpenPackage = (id: string) => {
    setCurrentPackageById(id);
    navigate(`/generate/result/${id}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 text-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Studio Siap Digunakan</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Selamat Datang, {currentUser?.name || 'Kreator'}!
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Hasilkan paket metadata SEO, teks thumbnail ber-CTR tinggi, hook video, dan prompt AI stabil untuk channel YouTube instrumental Anda.
          </p>
        </div>

        <button
          onClick={() => navigate('/generate')}
          className="inline-flex items-center gap-2.5 px-6 py-3 rounded-[10px] bg-[#007AFF] hover:bg-[#0071E3] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0 min-h-[42px]"
        >
          <Wand2 className="w-4 h-4" />
          <span>Forge Paket Baru</span>
        </button>
      </div>

      {/* 4 Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Generate</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">{totalPackages}</p>
          <span className="text-[11px] text-slate-400">Paket tersimpan di akun Anda</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Kategori Favorit</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <p className="font-display font-bold text-base text-slate-900 truncate">Lo-fi &amp; Chill Beats</p>
          <span className="text-[11px] text-slate-400">Sub-genre: Lo-fi Hip-Hop</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Rata-rata Waktu</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-display font-extrabold text-2xl text-slate-900">3.8 Detik</p>
          <span className="text-[11px] text-slate-400">Jauh di bawah target 15 detik</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Potensi CTR Target</span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-display font-extrabold text-2xl text-amber-600">&gt; 20%</p>
          <span className="text-[11px] text-slate-400">Berdasarkan riset audience AS</span>
        </div>
      </div>

      {/* Recent Packages Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="dashboard-block-title font-display font-bold text-base text-slate-900 uppercase">
              5 Riwayat Paket Terakhir
            </h2>
            <p className="text-xs text-slate-500">
              Paket konten yang siap di-copy ke YouTube Studio &amp; AI Generator
            </p>
          </div>

          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Semua Riwayat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentPackages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Judul Utama (Varian A)</th>
                  <th className="px-5 py-3">Kategori / Genre</th>
                  <th className="px-5 py-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(pkg.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <p 
                        onClick={() => handleOpenPackage(pkg.id)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 transition-colors"
                      >
                        {pkg.metadata.titleA}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Hook: "{pkg.introHook.slice(0, 60)}..."
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-[8px] bg-slate-100 text-slate-700 text-[11px] font-medium mr-1.5">
                        {pkg.categoryName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {pkg.subGenre}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                      <CopyButton 
                        textToCopy={pkg.metadata.titleA} 
                        variant="minimal" 
                        label="Salin Judul" 
                      />
                      <button
                        onClick={() => handleOpenPackage(pkg.id)}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-[10px] text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Buka 7 Blok
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-xs">Belum ada paket konten yang digenerate.</p>
            <button
              onClick={() => navigate('/generate')}
              className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs sm:text-sm font-semibold rounded-[10px] transition-all shadow-sm hover:shadow-md cursor-pointer min-h-[42px]"
            >
              <Wand2 className="w-4 h-4" />
              <span>Mulai Generate Pertama</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
