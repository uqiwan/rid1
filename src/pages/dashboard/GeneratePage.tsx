import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Compass, 
  Layers, 
  HelpCircle, 
  ArrowRight, 
  Check, 
  RefreshCw,
  Info,
  Search
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const GeneratePage: React.FC = () => {
  const { 
    categories, 
    selectedCategoryId, 
    selectedSubGenre, 
    selectedMoods, 
    duration,
    useCase,
    optionalKeyword, 
    isGenerating, 
    generationStepMessage,
    setSelectedCategory, 
    setSelectedSubGenre, 
    toggleMood, 
    setDuration,
    setUseCase,
    setOptionalKeyword, 
    forgeNewPackage,
    navigate,
    resetForm
  } = useTuneForgeStore();

  const [categorySearch, setCategorySearch] = useState('');

  const currentCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];

  const filteredCategories = categories.filter((c) => 
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.description.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const sampleKeywords = [
    'rainy night in tokyo',
    'deep coding focus',
    'autumn leaves coffee',
    'starry night camping',
    'morning meditation 432Hz',
    'cyberpunk shibuya alley'
  ];

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !selectedSubGenre || selectedMoods.length === 0) {
      return;
    }
    const newId = await forgeNewPackage();
    navigate(`/generate/result/${newId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Generating Progress Modal Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md animate-spin duration-1000">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-900">
                Membuat Paket Konten YouTube...
              </h3>
              <p className="text-xs font-mono text-amber-700 bg-amber-50 py-1.5 px-3 rounded-md border border-amber-200/80">
                {generationStepMessage || 'Menyiapkan arsitektur output...'}
              </p>
            </div>

            {/* Simulated steps */}
            <div className="space-y-2 pt-2 text-left text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Grounding 18 Knowledge Base Kategori</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Optimasi Search Intent Tier-1 US</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Kompilasi 4 Gaya Prompt Thumbnail &amp; Video Loop</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Forge Engine</span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Forge Paket Konten Musik Baru
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Konfigurasikan kategori, sub-genre, dan mood untuk menghasilkan 7 blok output siap pakai.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="text-xs text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer self-start sm:self-auto"
        >
          Reset Pilihan
        </button>
      </div>

      <form onSubmit={handleForge} className="space-y-8">
        {/* Step 1: 18 Categories Selection */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                Langkah 1 (Wajib)
              </span>
              <h2 className="font-display font-bold text-base text-slate-900">
                Pilih 1 dari 18 Kategori Musik Instrumental
              </h2>
            </div>

            {/* Quick search input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Cari kategori..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
            {filteredCategories.map((cat) => {
              const isSelected = cat.id === selectedCategoryId;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2 relative ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl shrink-0">{cat.iconEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-bold truncate ${isSelected ? 'text-amber-950' : 'text-slate-900'}`}>
                      {cat.name}
                    </p>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {cat.subGenres.length} Genre
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Sub-genre Selection */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              Langkah 2 (Wajib)
            </span>
            <h2 className="font-display font-bold text-base text-slate-900">
              Pilih Sub-Genre untuk: <span className="text-amber-700">{currentCategory.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sub-genre otomatis dimuat dari knowledge base sesuai riset retensi YouTube.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentCategory.subGenres.map((sg) => {
              const isSelected = sg === selectedSubGenre;
              return (
                <button
                  type="button"
                  key={sg}
                  onClick={() => setSelectedSubGenre(sg)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className="text-xs font-medium">{sg}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Moods (1-3 Multi-Select) */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                Langkah 3 (Wajib)
              </span>
              <h2 className="font-display font-bold text-base text-slate-900">
                Pilih Mood Emosional (1 hingga 3 Pilihan)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {selectedMoods.length}/3 Terpilih
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentCategory.moods.map((mood) => {
              const isSelected = selectedMoods.includes(mood);
              return (
                <button
                  type="button"
                  key={mood}
                  onClick={() => toggleMood(mood)}
                  className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs ring-2 ring-amber-400/40'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {mood} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 italic">
            *Minimal 1 mood, maksimal 3 mood untuk menjaga fokus output visual dan audio prompt.
          </p>
        </div>

        {/* Step 4: Video Duration & Use-Case (Opsional Formula Wajib) */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
                Langkah 4 (Opsional — Algoritma & SEO YouTube)
              </span>
              <h2 className="font-display font-bold text-base text-slate-900">
                Durasi Video & Use-Case / Aktivitas Penonton
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Formula: [Mood] + [Genre] + [Aktivitas] + (Durasi)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Durasi */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Target Durasi Video (Jujur sesuai konten):
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['1 Hour', '2 Hours', '3 Hours', '8 Hours', '10 Hours', 'No Mention'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d === 'No Mention' ? '' : d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                      (duration === d || (!duration && d === 'No Mention'))
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Atau ketik kustom: misal '3 Hours', '45 Mins'..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Use-Case / Aktivitas Umum */}
            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1.5">
                Use-Case / Aktivitas Penonton (Keyword Umum High-Volume):
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {['Study & Sleep', 'Deep Work & Coding', 'Relaxing & Stress Relief', 'Focus & Reading', 'Meditation & Calm'].map((uc) => (
                  <button
                    key={uc}
                    type="button"
                    onClick={() => setUseCase(uc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${
                      useCase === uc
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {uc}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder="Atau ketik kustom: misal 'Morning Routine', 'Coffee Break'..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Optional Keyword Context */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Langkah 5 (Opsional)
              </span>
              <h2 className="font-display font-bold text-base text-slate-900">
                Kata Kunci Spesifik / Konteks Tambahan
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {optionalKeyword.length}/120 Karakter
            </span>
          </div>

          <textarea
            value={optionalKeyword}
            onChange={(e) => setOptionalKeyword(e.target.value)}
            maxLength={120}
            rows={2}
            placeholder="Contoh: 'rainy night in tokyo', 'coding focus pomodoro', 'wedding banquet', 'winter snowfall'..."
            className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 leading-relaxed font-mono"
          />

          {/* Sample quick chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Inspirasi Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleKeywords.map((kw, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setOptionalKeyword(kw)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-[11px] text-slate-600 transition-colors cursor-pointer"
                >
                  + {kw}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Forge Button */}
        <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              Siap Mengompilasi 7 Blok Output?
            </h3>
            <p className="text-xs text-slate-400">
              Kategori: <strong className="text-amber-300">{currentCategory.name}</strong> • Sub-genre: <strong className="text-slate-200">{selectedSubGenre}</strong>
            </p>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !selectedSubGenre || selectedMoods.length === 0}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <Wand2 className="w-4 h-4" />
            <span>Forge Content (1 Klik)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
