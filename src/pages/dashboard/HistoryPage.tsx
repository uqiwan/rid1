import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Trash2, 
  ExternalLink, 
  Wand2, 
  Copy, 
  Clock, 
  Layers,
  AlertTriangle
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';

export const HistoryPage: React.FC = () => {
  const { 
    packages, 
    deletePackage, 
    setCurrentPackageById, 
    navigate,
    categories,
    showToast 
  } = useTuneForgeStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const filteredPackages = packages.filter((p) => {
    const matchesSearch = 
      p.metadata.titleA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.optionalKeyword && p.optionalKeyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.subGenre.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategoryFilter === 'all' || p.categoryId === selectedCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenResult = (id: string) => {
    setCurrentPackageById(id);
    navigate(`/generate/result/${id}`);
  };

  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Apakah Anda yakin ingin menghapus paket "${title.slice(0, 40)}..." dari riwayat?`)) {
      deletePackage(id);
      showToast('Paket berhasil dihapus');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-amber-500" />
            <span>Riwayat Produksi</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Riwayat Paket Konten
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Semua paket yang pernah Anda generate tersimpan otomatis dan siap dibuka kembali.
          </p>
        </div>

        <button
          onClick={() => navigate('/generate')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-all shadow-sm self-start sm:self-auto"
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          <span>+ Forge Paket Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul, sub-genre, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
          >
            <option value="all">Semua Kategori ({packages.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Capacity tracker */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Menampilkan {filteredPackages.length} dari total {packages.length} paket</span>
        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
          Kapasitas: {packages.length} / 500 paket
        </span>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredPackages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Tanggal</th>
                  <th className="px-5 py-3.5">Judul Utama YouTube</th>
                  <th className="px-5 py-3.5">Kategori &amp; Sub-Genre</th>
                  <th className="px-5 py-3.5">Moods</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPackages.map((pkg) => (
                  <tr 
                    key={pkg.id} 
                    onClick={() => handleOpenResult(pkg.id)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {new Date(pkg.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <p className="font-semibold text-slate-900 line-clamp-1 hover:text-amber-600 transition-colors">
                        {pkg.metadata.titleA}
                      </p>
                      {pkg.optionalKeyword && (
                        <span className="text-[10px] text-blue-600 font-mono mt-0.5 block">
                          Context: "{pkg.optionalKeyword}"
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium">
                          {pkg.categoryName}
                        </span>
                        <span className="text-[11px] text-slate-500 block font-mono">
                          {pkg.subGenre}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {pkg.moods.map((m, i) => (
                          <span key={i} className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                      <CopyButton 
                        textToCopy={pkg.metadata.titleA} 
                        variant="minimal" 
                        label="Salin Judul" 
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenResult(pkg.id);
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors"
                      >
                        Buka Hasil
                      </button>
                      <button
                        onClick={(e) => handleDelete(pkg.id, pkg.metadata.titleA, e)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus paket ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <p className="text-slate-600 text-xs sm:text-sm">
              Tidak ada paket konten yang sesuai dengan filter atau pencarian Anda.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategoryFilter('all'); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-full cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
