import React, { useState } from 'react';
import { Search, Compass, ArrowRight, Wand2, Filter, Music } from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const CategoriesPage: React.FC = () => {
  const { categories, navigate, setSelectedCategory } = useTuneForgeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');

  // Collect all unique moods from categories
  const allMoods = Array.from(new Set(categories.flatMap((c) => c.moods))).slice(0, 10);

  const filteredCategories = categories.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subGenres.some((sg) => sg.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = 
      selectedMoodFilter === 'all' || c.moods.includes(selectedMoodFilter);

    return matchesSearch && matchesMood;
  });

  const handleForgeWithCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(catId);
    navigate('/generate');
  };

  const handleOpenDetail = (slug: string) => {
    navigate('/kategori', slug);
  };

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>Katalog Kurasi Musik Instrumental</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            18 Kategori Musik dengan Search Intent Pasar AS
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            Setiap kategori dilengkapi daftar sub-genre dan mood yang telah diteliti performanya di algoritma YouTube untuk memastikan retensi tinggi dan potensi CTR &gt;20%.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kategori (contoh: Lofi, Piano, Sleep, Chiptune, dll)..."
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-500 hover:text-slate-900 px-2 py-1 cursor-pointer"
              >
                Reset Cari
              </button>
            )}
          </div>

          {/* Quick Mood Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 text-[11px] font-medium uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter Mood:
            </span>
            <button
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                selectedMoodFilter === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Semua Mood
            </button>
            {allMoods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMoodFilter(mood)}
                className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  selectedMoodFilter === mood
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleOpenDetail(cat.slug)}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.iconEmoji}</span>
                    <div>
                      <h2 className="font-display font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                        {cat.name}
                      </h2>
                      <span className="text-[11px] font-mono text-slate-400">/{cat.slug}</span>
                    </div>
                  </div>
                  <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono shrink-0">
                    {cat.subGenres.length} Sub-Genre
                  </span>
                </div>

                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  {cat.description}
                </p>

                {/* Sub-Genres Preview Tags */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                    Sub-Genre Terverifikasi:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subGenres.slice(0, 3).map((sg, i) => (
                      <span key={i} className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-100">
                        {sg}
                      </span>
                    ))}
                    {cat.subGenres.length > 3 && (
                      <span className="text-[11px] text-slate-400 px-1 py-0.5">
                        +{cat.subGenres.length - 3} lainnya
                      </span>
                    )}
                  </div>
                </div>

                {/* Moods Preview */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                    Mood Dominan:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.moods.map((m, i) => (
                      <span key={i} className="text-[10px] bg-amber-50 text-amber-800 font-medium px-2 py-0.5 rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenDetail(cat.slug)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Detail &amp; Preview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={(e) => handleForgeWithCategory(cat.id, e)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-colors shadow-xs"
                >
                  <Wand2 className="w-3 h-3 text-amber-400" />
                  <span>Pilih &amp; Forge</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
            <Music className="w-8 h-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-display font-bold text-base text-slate-800">Tidak ada kategori yang cocok</h3>
            <p className="text-xs text-slate-500 mt-1">Coba kata kunci lain atau reset filter mood Anda.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedMoodFilter('all'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs rounded-full cursor-pointer"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
