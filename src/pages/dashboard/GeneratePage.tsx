import React, { useState, useEffect } from 'react';
import { 
  Wand2, 
  Check, 
  Search, 
  X, 
  Clock, 
  Activity, 
  RotateCcw
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { GeneratedOutputBlocks } from '../../components/dashboard/GeneratedOutputBlocks';

interface GeneratePageProps {
  packageId?: string;
}

export const GeneratePage: React.FC<GeneratePageProps> = ({ packageId }) => {
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
    currentPackage,
    packages,
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
  const [loadingLongWait, setLoadingLongWait] = useState(false);

  // If packageId is provided in URL, prioritize that package; otherwise use currentPackage
  const displayedPkg = React.useMemo(() => {
    if (packageId) {
      const found = packages.find((p) => p.id === packageId);
      if (found) return found;
    }
    return currentPackage || (packages.length > 0 ? packages[0] : null);
  }, [packageId, packages, currentPackage]);

  // If packageId was opened, sync left panel inputs with that package for convenience
  useEffect(() => {
    if (packageId && displayedPkg) {
      if (displayedPkg.categoryId) setSelectedCategory(displayedPkg.categoryId);
      if (displayedPkg.subGenre) setSelectedSubGenre(displayedPkg.subGenre);
      if (displayedPkg.duration) setDuration(displayedPkg.duration);
      if (displayedPkg.useCase) setUseCase(displayedPkg.useCase);
      if (displayedPkg.optionalKeyword) setOptionalKeyword(displayedPkg.optionalKeyword);
    }
  }, [packageId]);

  // Tampilkan pesan jika proses memakan waktu lebih dari 5 detik
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      setLoadingLongWait(false);
      timer = setTimeout(() => {
        setLoadingLongWait(true);
      }, 5000);
    } else {
      setLoadingLongWait(false);
    }
    return () => clearTimeout(timer);
  }, [isGenerating]);

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
    { value: '1 Hour', label: '1 Jam' },
    { value: '2 Hours', label: '2 Jam' },
    { value: '3 Hours', label: '3 Jam' },
    { value: '8 Hours', label: '8 Jam' },
    { value: '10 Hours', label: '10 Jam' },
    { value: '', label: 'Tanpa Durasi' }
  ];

  const activityOptions = [
    'Study & Work',
    'Deep Sleep',
    'Relax & Stress Relief',
    'Focus & Reading',
    'Meditation & Calm'
  ];

  const thumbnailStyles = [
    { id: 'all', label: 'Semua Gaya', tag: '4 Formula' },
    { id: 'cinematic', label: 'Sinematik', tag: 'CTR >21.8%' },
    { id: 'split', label: 'Komposisi Terbelah', tag: 'CTR >20.9%' },
    { id: 'minimal', label: 'Tipografi Minimalis', tag: 'CTR >22.5%' },
    { id: 'lifestyle', label: 'Gaya Hidup', tag: 'CTR >22.1%' }
  ];

  const isFormValid = Boolean(selectedCategoryId && selectedSubGenre && selectedMoods.length > 0);

  const handleForge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isGenerating) return;
    const newId = await forgeNewPackage();
    if (newId) {
      navigate(`/generate/result/${newId}`);
    }
  };

  const handleQuickSample = async () => {
    setSelectedCategory('cat-01');
    setSelectedSubGenre('Lo-fi Hip-Hop Study');
    setDuration('1 Hour');
    setUseCase('Study & Work');
    setOptionalKeyword('Rain in Tokyo');
    const newId = await forgeNewPackage();
    if (newId) {
      navigate(`/generate/result/${newId}`);
    }
  };

  return (
    <div className="min-h-full bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* macOS Loading Overlay */}
      {isGenerating && (
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(20px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            style={{
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              padding: 'var(--space-8)',
              maxWidth: '360px',
              width: '100%',
            }}
            className="text-center space-y-4"
          >
            {/* Inline macOS Spinner SVG */}
            <div className="flex justify-center">
              <svg
                className="animate-spin w-8 h-8 text-[var(--accent-blue)]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>

            <div className="space-y-1">
              <h3
                style={{
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--weight-semibold)',
                  color: 'var(--text-primary)',
                }}
                className="m-0"
              >
                Memproses Paket Konten...
              </h3>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                }}
                className="m-0"
              >
                {generationStepMessage || 'Menyiapkan arsitektur output YouTube...'}
              </p>
              {loadingLongWait && (
                <p
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                  }}
                  className="m-0 pt-1 italic text-amber-600 dark:text-amber-400"
                >
                  Sedang memproses, mohon tunggu...
                </p>
              )}
            </div>

            <span className="macos-badge text-[11px]">
              Gemini 3.8 Flash
            </span>
          </div>
        </div>
      )}

      {/* WRAPPER UTAMA: kontainer dua kolom (.app-layout) */}
      <div className="app-layout">
        
        {/* PANEL KIRI: semua input, setelan, tombol generate */}
        <aside className="panel-left">
          <form onSubmit={handleForge} className="panel-left__inner">
            
            {/* Header Ringkas Panel Kiri */}
            <div className="flex items-center justify-between gap-2 pb-1">
              <div>
                <h1 className="block__title text-sm sm:text-base font-semibold text-[var(--text-primary)]">
                  Parameter Musik
                </h1>
                <p className="block__description text-[11px] sm:text-xs">
                  Konfigurasi untuk menghasilkan 7 blok paket aset YouTube.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary text-xs py-1 px-2.5 min-h-[32px]"
                title="Reset Pilihan"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* BLOK 1: Kategori Musik */}
            <section className="block" id="block-1">
              <div className="block__header">
                <div>
                  <h2 className="block__title">Kategori Musik</h2>
                  <p className="block__description">Pilih satu dari 18 kategori musik terkurasi.</p>
                </div>

                {/* Pencarian Kategori (Disembunyikan) */}
                <div className="relative w-36 sm:w-44 shrink-0" style={{ display: 'none' }}>
                  <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Cari..."
                    className="macos-input pl-8 py-1 text-xs"
                  />
                  {categorySearch && (
                    <button
                      type="button"
                      onClick={() => setCategorySearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Daftar 18 Kategori — 1 Kolom Vertikal Penuh & SISTEM WARNA VARIASI SIKLIKAL */}
              <div className="grid grid-cols-1 gap-2 max-h-72 overflow-y-auto pr-1 w-full">
                {filteredCategories.map((cat, idx) => {
                  const isSelected = cat.id === selectedCategoryId;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[46px] w-full flex items-center justify-between px-3.5 py-2.5 text-left`}
                    >
                      <span className="whitespace-normal text-left break-words font-medium text-xs sm:text-sm leading-snug">{cat.name}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 var-accent shrink-0 ml-2 font-bold" />
                      ) : (
                        <span className="w-2 h-2 rounded-full var-accent bg-current opacity-60 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BLOK 2: Sub-Genre */}
            <section className="block" id="block-2">
              <div className="block__header">
                <div>
                  <h2 className="block__title">Sub-Genre</h2>
                  <p className="block__description">
                    Sub-spesialisasi untuk {currentCategory.name}.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentCategory.subGenres.map((sg, idx) => {
                  const isSelected = sg === selectedSubGenre;
                  return (
                    <button
                      type="button"
                      key={sg}
                      onClick={() => setSelectedSubGenre(sg)}
                      className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[46px]`}
                    >
                      <span className="truncate font-medium">{sg}</span>
                      {isSelected ? (
                        <Check className="w-3.5 h-3.5 var-accent shrink-0 ml-1 font-bold" />
                      ) : (
                        <span className="w-2 h-2 rounded-full var-accent bg-current opacity-60 shrink-0 ml-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BLOK 3: Suasana (Mood) */}
            <section className="block" id="block-3">
              <div className="block__header">
                <div>
                  <h2 className="block__title">Suasana (Mood)</h2>
                  <p className="block__description">
                    Pilih 1–3 emosi utama pendengar.
                  </p>
                </div>
                <span className="macos-badge text-[11px]">
                  {selectedMoods.length}/3 Terpilih
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {currentCategory.moods.map((mood, idx) => {
                  const isSelected = selectedMoods.includes(mood);
                  return (
                    <button
                      type="button"
                      key={mood}
                      onClick={() => toggleMood(mood)}
                      className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[38px] px-3.5 py-2`}
                    >
                      <span className="font-medium">{mood}</span>
                      {isSelected ? (
                        <Check className="w-3 h-3 var-accent shrink-0 ml-1.5 font-bold" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full var-accent bg-current opacity-60 shrink-0 ml-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* BLOK 4: Input / Setelan Saja */}
            <section className="block" id="block-4-input">
              <div className="block__header">
                <div>
                  <h2 className="block__title">Setelan &amp; Gaya Visual</h2>
                  <p className="block__description">
                    Target CTR &gt;20% dengan formula komposisi visual teruji.
                  </p>
                </div>
              </div>

              {/* Gaya Thumbnail */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-[var(--text-secondary)]">
                  Gaya Thumbnail Utama:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {thumbnailStyles.map((style, idx) => {
                    const isSelected = selectedThumbnailStyle === style.id;
                    return (
                      <button
                        type="button"
                        key={style.id}
                        onClick={() => setSelectedThumbnailStyle(style.id as any)}
                        className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[60px] flex flex-col justify-between items-start`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] var-accent font-mono font-bold">
                            {style.tag}
                          </span>
                          {isSelected ? (
                            <Check className="w-3.5 h-3.5 var-accent shrink-0 font-bold" />
                          ) : (
                            <span className="text-[10px] var-accent font-mono opacity-80">{style.tag}</span>
                          )}
                        </div>
                        <span className="text-xs font-semibold mt-1">
                          {style.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Durasi Video & Aktivitas */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                {/* Durasi */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">
                      Durasi Video
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {durationOptions.map((opt, idx) => {
                      const isSelected = (duration === opt.value) || (!duration && opt.value === '');
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setDuration(opt.value)}
                          className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[36px] px-3.5 py-1.5`}
                        >
                          <span className="font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aktivitas Pendengar */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    <span className="text-xs font-medium text-[var(--text-primary)]">
                      Aktivitas Pendengar
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {activityOptions.map((act, idx) => {
                      const isSelected = useCase === act;
                      return (
                        <button
                          key={act}
                          type="button"
                          onClick={() => setUseCase(act)}
                          className={`var-option var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[36px] px-3.5 py-1.5`}
                        >
                          <span className="font-medium">{act}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Konteks Tambahan */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-primary)]">
                      Konteks Tambahan (Opsional)
                    </span>
                    <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                      {optionalKeyword.length}/80
                    </span>
                  </div>
                  <input
                    type="text"
                    value={optionalKeyword}
                    onChange={(e) => setOptionalKeyword(e.target.value.replace(/[<>{}[\]\\]/g, ''))}
                    maxLength={80}
                    placeholder="Misal: 'Rain in Tokyo', 'Midnight Studio'..."
                    className="macos-input text-xs py-1.5"
                  />
                  <div className="flex flex-wrap items-center gap-1 pt-0.5">
                    {sampleKeywords.slice(0, 3).map((kw, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setOptionalKeyword(kw)}
                        className="btn-secondary text-[10px] py-0.5 px-1.5 font-normal"
                      >
                        + {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Tombol Generate — Selalu di bawah semua input (.generate-bar) */}
            <div className="generate-bar">
              <button
                type="submit"
                disabled={!isFormValid || isGenerating}
                className="btn-primary min-h-[44px] flex items-center justify-center gap-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>{isGenerating ? 'Memproses Paket...' : 'Generate Paket Konten'}</span>
              </button>
            </div>
          </form>
        </aside>

        {/* PANEL KANAN: semua area output hasil generate */}
        <main className="panel-right">
          <GeneratedOutputBlocks 
            pkg={displayedPkg} 
            onQuickSample={handleQuickSample} 
          />
        </main>

      </div>
    </div>
  );
};
