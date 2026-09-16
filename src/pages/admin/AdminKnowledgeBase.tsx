import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Layers, 
  Sparkles,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { Category } from '../../types';

export const AdminKnowledgeBase: React.FC = () => {
  const { categories, fetchCategories, addCategory, updateCategory, deleteCategory, navigate, showToast } = useTuneForgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formEmoji, setFormEmoji] = useState('🎵');
  const [formDesc, setFormDesc] = useState('');
  const [formSubGenres, setFormSubGenres] = useState('');
  const [formMoods, setFormMoods] = useState('');

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormEmoji('🎵');
    setFormDesc('');
    setFormSubGenres('Lo-fi Study, Chillhop, Midnight Ambience');
    setFormMoods('Cozy, Focus, Chill');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormEmoji(cat.iconEmoji);
    setFormDesc(cat.description);
    setFormSubGenres(cat.subGenres.join(', '));
    setFormMoods(cat.moods.join(', '));
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSlug) return;

    const subGenresArray = formSubGenres.split(',').map((s) => s.trim()).filter(Boolean);
    const moodsArray = formMoods.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: formName,
        slug: formSlug,
        iconEmoji: formEmoji,
        description: formDesc,
        subGenres: subGenresArray,
        moods: moodsArray
      });
      showToast(`Kategori "${formName}" berhasil diperbarui`);
    } else {
      addCategory({
        name: formName,
        slug: formSlug,
        iconEmoji: formEmoji,
        description: formDesc,
        subGenres: subGenresArray,
        moods: moodsArray,
        sortOrder: categories.length + 1,
        isActive: true
      });
      showToast(`Kategori "${formName}" berhasil ditambahkan`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Hapus kategori "${name}" dari knowledge base?`)) {
      deleteCategory(id);
      showToast(`Kategori "${name}" dihapus`);
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Admin Dashboard</span>
          </button>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Knowledge Base 18 Kategori Musik
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Entitas database kategori, sub-genre, dan mood yang menjadi referensi sistem grounding prompt AI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsLoading(true);
              fetchCategories().finally(() => {
                setIsLoading(false);
                showToast('Knowledge Base disinkronkan dari database');
              });
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Database</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Tambah Kategori Baru</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari dalam knowledge base (nama, slug, sub-genre)..."
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Bersihkan
          </button>
        )}
      </div>

      {/* Table of Categories */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Kategori &amp; Slug</th>
                <th className="px-5 py-3.5">Deskripsi Singkat</th>
                <th className="px-5 py-3.5">Sub-Genres Terdaftar</th>
                <th className="px-5 py-3.5">Moods Terdaftar</th>
                <th className="px-5 py-3.5 text-right">Aksi CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cat.iconEmoji}</span>
                      <div>
                        <span className="font-semibold text-slate-900 block">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">/{cat.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed">
                      {cat.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cat.subGenres.slice(0, 3).map((sg, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
                          {sg}
                        </span>
                      ))}
                      {cat.subGenres.length > 3 && (
                        <span className="text-[10px] text-slate-400">
                          +{cat.subGenres.length - 3} lagi
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cat.moods.slice(0, 3).map((m, i) => (
                        <span key={i} className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-full">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right space-x-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      title="Edit kategori"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      title="Hapus kategori"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900">
                {editingCategory ? 'Edit Kategori Knowledge Base' : 'Tambah Kategori Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="font-semibold text-slate-700 block mb-1">Nama Kategori</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value);
                      if (!editingCategory) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                      }
                    }}
                    placeholder="Contoh: Lo-fi & Chill Beats"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Emoji Icon</label>
                  <input
                    type="text"
                    required
                    value={formEmoji}
                    onChange={(e) => setFormEmoji(e.target.value)}
                    placeholder="🎧"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-base"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  placeholder="lofi-chill-beats"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deskripsi &amp; Search Intent Target</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Deskripsi singkat karakteristik musik dan tujuan pendengar..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Daftar Sub-Genres (Pisahkan dengan Koma)
                </label>
                <textarea
                  rows={2}
                  value={formSubGenres}
                  onChange={(e) => setFormSubGenres(e.target.value)}
                  placeholder="Sub-genre 1, Sub-genre 2, Sub-genre 3..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Daftar Moods (Pisahkan dengan Koma)
                </label>
                <input
                  type="text"
                  value={formMoods}
                  onChange={(e) => setFormMoods(e.target.value)}
                  placeholder="Cozy, Focus, Late Night, Chill..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg cursor-pointer transition-colors"
                >
                  {editingCategory ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
