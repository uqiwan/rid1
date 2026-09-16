import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Search, 
  X, 
  Clock, 
  Activity, 
  Tag, 
  Palette, 
  Smile, 
  Music, 
  Layers
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';

export const GeneratePage: React.FC = () => {
  const { 
    categories, 
    selectedCategoryId, 
    selectedSubGenre, 
    selectedMoods, 
    selectedThumbnailStyle,
    duration,
    useCase,
    optionalKeyword, 
    isGenerating, 
    generationStepMessage,
    setSelectedCategory, 
    setSelectedSubGenre, 
    toggleMood, 
    setSelectedThumbnailStyle,
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
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const sampleKeywords = [
    'Rain in Tokyo',
    'Late Night Coding',
    'Cozy Coffee Shop',
    'Deep Meditation',
    'Autumn & Sunset'
  ];

  const durationOptions = [
    { value: '1 Hour', label: '1 Hour' },
    { value: '2 Hours', label: '2 Hours' },
    { value: '3 Hours', label: '3 Hours' },
    { value: '8 Hours', label: '8 Hours' },
    { value: '10 Hours', label: '10 Hours' },
    { value: '', label: 'No Duration' }
  ];

  const activityOptions = [
    'Study & Work',
    'Deep Sleep',
    'Relax & Stress Relief',
    'Focus & Reading',
    'Meditation & Calm'
  ];

  const thumbnailStyles = [
    { id: 'all', label: 'Semua Gaya', tag: '4 Varian' },
    { id: 'cinematic', label: 'Sinematik', tag: 'Widescreen' },
    { id: 'split', label: 'Komposisi Terbelah', tag: 'Dua Suasana' },
    { id: 'minimal', label: 'Tipografi Minimalis', tag: 'Ruang Negatif' },
    { id: 'lifestyle', label: 'Gaya Hidup', tag: 'Emosi Nyata' }
  ];

  const isFormValid = Boolean(selectedCategoryId && selectedSubGenre && selectedMoods.length > 0);

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isGenerating) return;
    const newId = await forgeNewPackage();
    navigate(`/generate/result/${newId}`);
  };

  return (
    <div className="min-h-full bg-[#F5F5F7] text-slate-900 pb-28">
      {/* macOS Style Loading Modal */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-slate-200/80 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-md">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-semibold text-lg text-slate-900">
                Memproses Paket Konten...
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {generationStepMessage || 'Menyiapkan arsitektur output YouTube...'}
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Model: Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
        {/* Header Bersih & Ringkas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h1 className="font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Forge Paket Konten Musik
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Pilih konfigurasi musik untuk menghasilkan paket konten YouTube siap pakai.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="self-start sm:self-auto text-xs font-semibold text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 shadow-2xs transition-colors cursor-pointer"
          >
            Reset Pilihan
          </button>
        </div>

        <form onSubmit={handleForge} className="space-y-6">
          {/* SECTION 1: Kategori Musik */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-slate-900 text-base">
                  1. Kategori Musik
                </h2>
              </div>

              {/* Pencarian Kategori Cepat */}
              <div className="relative max-w-xs w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  placeholder="Cari kategori..."
                  className="w-full pl-8 pr-8 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
                />
                {categorySearch && (
                  <button
                    type="button"
                    onClick={() => setCategorySearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Grid 18 Kategori Tombol Besar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {filteredCategories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 min-h-[58px] ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-xl shrink-0 leading-none">{cat.iconEmoji}</span>
                    <span className={`text-xs font-semibold leading-snug line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 2: Sub-Genre */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-base">
                2. Sub-Genre: <span className="text-slate-500 font-normal">{currentCategory.name}</span>
              </h2>
            </div>

            {/* Tombol Sub-Genre Besar & Mudah Diklik */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {currentCategory.subGenres.map((sg) => {
                const isSelected = sg === selectedSubGenre;
                return (
                  <button
                    type="button"
                    key={sg}
                    onClick={() => setSelectedSubGenre(sg)}
                    className={`px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between min-h-[50px] ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-semibold">{sg}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 3: Suasana (Mood) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-slate-900 text-base">
                  3. Suasana (Mood)
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {selectedMoods.length}/3 Terpilih
              </span>
            </div>

            {/* Pills Mood Besar */}
            <div className="flex flex-wrap gap-2.5">
              {currentCategory.moods.map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <button
                    type="button"
                    key={mood}
                    onClick={() => toggleMood(mood)}
                    className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{mood}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 4: Gaya Thumbnail */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-base">
                4. Gaya Thumbnail
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {thumbnailStyles.map((style) => {
                const isSelected = selectedThumbnailStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setSelectedThumbnailStyle(style.id as any)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[74px] ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {style.tag}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <span className="font-bold text-xs sm:text-sm mt-2">
                      {style.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* SECTION 5: Video Duration & Listener Activity */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Duration */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    5. Video Duration
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {durationOptions.map((opt) => {
                    const isSelected = (duration === opt.value) || (!duration && opt.value === '');
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Or custom duration (e.g. '45 Minutes', '4 Hours')..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>

              {/* Listener Activity */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    6. Listener Activity
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activityOptions.map((act) => {
                    const isSelected = useCase === act;
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setUseCase(act)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {act}
                      </button>
                    );
                  })}
                </div>

                <input
                  type="text"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  placeholder="Or custom activity (e.g. 'Journaling & Writing', 'Morning Flow')..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
                />
              </div>
            </div>
          </section>

          {/* SECTION 7: Additional Context (Optional) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <h2 className="font-bold text-slate-900 text-base">
                  7. Additional Context (Optional)
                </h2>
              </div>
              <span className="text-xs text-slate-400">
                {optionalKeyword.length}/120
              </span>
            </div>

            <input
              type="text"
              value={optionalKeyword}
              onChange={(e) => setOptionalKeyword(e.target.value)}
              maxLength={120}
              placeholder="e.g. 'Rain in Tokyo', 'Minimalist Cozy Workspace', 'Midnight Studio'..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-slate-900 transition-all"
            />

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1">Inspiration:</span>
              {sampleKeywords.map((kw, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setOptionalKeyword(kw)}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 transition-colors cursor-pointer"
                >
                  + {kw}
                </button>
              ))}
            </div>
          </section>

          {/* Hidden submit trigger to support pressing Enter in text inputs */}
          <button
            type="submit"
            disabled={!isFormValid || isGenerating}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          />
        </form>
      </div>

      {/* Tombol Mengambang "Forge Konten Baru" — Selalu terlihat di semua kondisi scroll */}
      <aside aria-label="Aksi Cepat Forge" className="fixed bottom-6 right-6 z-40 print:hidden">
        <button
          type="button"
          id="btn-floating-forge-generate"
          onClick={handleForge}
          disabled={!isFormValid || isGenerating}
          className={`group inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xl transition-all border cursor-pointer ${
            isFormValid && !isGenerating
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/35 hover:-translate-y-0.5 active:scale-95 border-amber-400/60'
              : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
          }`}
          title="Forge Konten Baru"
        >
          <Wand2 className={`w-4 h-4 transition-transform ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12'}`} />
          <span>{isGenerating ? 'Memproses...' : 'Forge Konten Baru'}</span>
        </button>
      </aside>
    </div>
  );
};
