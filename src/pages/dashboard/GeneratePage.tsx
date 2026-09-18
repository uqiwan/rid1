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
  const [loadingLongWait, setLoadingLongWait] = useState(false);

  // 2D: Tampilkan pesan khusus jika proses memakan waktu lebih dari 5 detik
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
    navigate(`/generate/result/${newId}`);
  };

  return (
    <div className="min-h-full bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* macOS Loading Overlay */}
      {isGenerating && (
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.25)',
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
            {/* Inline macOS 14px Spinner SVG */}
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

      {/* Main Content Form Container (Max Width 780px per Bagian 5B) */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6)',
        }}
        className="space-y-5"
      >
        {/* Header Halaman Ringkas */}
        <div className="flex items-center justify-between gap-3 pb-1">
          <div>
            <h1
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--text-primary)',
              }}
              className="m-0 tracking-tight"
            >
              Forge Paket Konten Musik
            </h1>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
              }}
              className="mt-1 m-0"
            >
              Konfigurasi parameter musik untuk menghasilkan paket aset YouTube lengkap.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="btn-secondary text-xs"
            title="Reset Pilihan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <form onSubmit={handleForge} className="space-y-5">
          {/* BLOK: Kategori Musik */}
          <section className="macos-card space-y-4">
            <div className="macos-card-header">
              <div>
                <h2 className="macos-card-title">Kategori Musik</h2>
                <p className="macos-card-desc">Pilih satu dari 18 kategori musik terkurasi.</p>
              </div>

              {/* Pencarian Kategori */}
              <div className="relative w-48 shrink-0">
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

            {/* Grid 18 Kategori (Clean macOS buttons, no loud emojis) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {filteredCategories.map((cat) => {
                const isSelected = cat.id === selectedCategoryId;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                      borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      fontSize: 'var(--text-xs)',
                      padding: '10px 12px',
                    }}
                    className="border text-left cursor-pointer transition-colors flex items-center justify-between hover:bg-[var(--bg-inset)] min-h-[44px]"
                  >
                    <span className="truncate">{cat.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[var(--accent-blue)] shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* BLOK: Sub-Genre */}
          <section className="macos-card space-y-4">
            <div className="macos-card-header">
              <div>
                <h2 className="macos-card-title">Sub-Genre</h2>
                <p className="macos-card-desc">
                  Sub-spesialisasi musik untuk {currentCategory.name}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {currentCategory.subGenres.map((sg) => {
                const isSelected = sg === selectedSubGenre;
                return (
                  <button
                    type="button"
                    key={sg}
                    onClick={() => setSelectedSubGenre(sg)}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                      borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      fontSize: 'var(--text-xs)',
                      padding: '10px 14px',
                    }}
                    className="border text-left cursor-pointer transition-colors flex items-center justify-between hover:bg-[var(--bg-inset)] min-h-[44px]"
                  >
                    <span className="truncate">{sg}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[var(--accent-blue)] shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* BLOK: Suasana (Mood) */}
          <section className="macos-card space-y-4">
            <div className="macos-card-header">
              <div>
                <h2 className="macos-card-title">Suasana (Mood)</h2>
                <p className="macos-card-desc">
                  Pilih 1–3 emosi utama pendengar.
                </p>
              </div>
              <span className="macos-badge text-[11px]">
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
                    style={{
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--bg-base)',
                      borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      fontSize: 'var(--text-xs)',
                      padding: '6px 14px',
                    }}
                    className="border cursor-pointer transition-colors flex items-center gap-1.5 hover:bg-[var(--bg-inset)]"
                  >
                    <span>{mood}</span>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* BLOK: Gaya Thumbnail */}
          <section className="macos-card space-y-4">
            <div className="macos-card-header">
              <div>
                <h2 className="macos-card-title">Gaya Thumbnail</h2>
                <p className="macos-card-desc">
                  Target CTR &gt;20% dengan formula komposisi visual teruji.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {thumbnailStyles.map((style) => {
                const isSelected = selectedThumbnailStyle === style.id;
                return (
                  <button
                    type="button"
                    key={style.id}
                    onClick={() => setSelectedThumbnailStyle(style.id as any)}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                      borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      padding: '10px 12px',
                    }}
                    className="border text-left cursor-pointer transition-colors flex flex-col justify-between min-h-[64px] hover:bg-[var(--bg-inset)]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] text-[var(--text-secondary)] font-mono">
                        {style.tag}
                      </span>
                      {isSelected && (
                        <Check className="w-3 h-3 text-[var(--accent-blue)]" />
                      )}
                    </div>
                    <span className="text-xs font-semibold mt-2">
                      {style.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* BLOK: Durasi Video & Aktivitas Pendengar */}
          <section className="macos-card space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Durasi */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <h3
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-primary)',
                    }}
                    className="m-0"
                  >
                    Durasi Video
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {durationOptions.map((opt) => {
                    const isSelected = (duration === opt.value) || (!duration && opt.value === '');
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                          borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                          color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                          fontSize: 'var(--text-xs)',
                          padding: '6px 10px',
                        }}
                        className="border cursor-pointer transition-colors hover:bg-[var(--bg-inset)]"
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
                  placeholder="Kustom (misal: '45 Menit', '4 Jam')..."
                  className="macos-input text-xs py-1.5"
                />
              </div>

              {/* Aktivitas Pendengar */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <h3
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-primary)',
                    }}
                    className="m-0"
                  >
                    Aktivitas Pendengar
                  </h3>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {activityOptions.map((act) => {
                    const isSelected = useCase === act;
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => setUseCase(act)}
                        style={{
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                          borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                          color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                          fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                          fontSize: 'var(--text-xs)',
                          padding: '6px 10px',
                        }}
                        className="border cursor-pointer transition-colors hover:bg-[var(--bg-inset)]"
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
                  placeholder="Kustom (misal: 'Journaling', 'Morning Routine')..."
                  className="macos-input text-xs py-1.5"
                />
              </div>
            </div>
          </section>

          {/* BLOK: Konteks Tambahan */}
          <section className="macos-card space-y-3">
            <div className="macos-card-header mb-2">
              <div>
                <h2 className="macos-card-title">Konteks Tambahan (Opsional)</h2>
                <p className="macos-card-desc">Kata kunci suasana atau elemen visual spesifik.</p>
              </div>
              <span className="text-[11px] text-[var(--text-tertiary)] font-mono">
                {optionalKeyword.length}/80
              </span>
            </div>

            <input
              type="text"
              value={optionalKeyword}
              onChange={(e) => setOptionalKeyword(e.target.value.replace(/[<>{}[\]\\]/g, ''))}
              maxLength={80}
              placeholder="Contoh: 'Rain in Tokyo', 'Minimalist Cozy Workspace', 'Midnight Studio'..."
              className="macos-input text-xs py-2"
            />

            {/* Quick Inspiration Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-[var(--text-secondary)] mr-1">Inspirasi:</span>
              {sampleKeywords.map((kw, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setOptionalKeyword(kw)}
                  className="btn-secondary text-[11px] py-0.5 px-2 font-normal"
                >
                  + {kw}
                </button>
              ))}
            </div>
          </section>

          {/* Aksi Utama (Varian 1 Primary Button) */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="btn-secondary"
            >
              Reset Pilihan
            </button>

            <button
              type="submit"
              disabled={!isFormValid || isGenerating}
              className="btn-primary"
            >
              <Wand2 className="w-4 h-4" />
              <span>{isGenerating ? 'Memproses...' : 'Forge Konten Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
