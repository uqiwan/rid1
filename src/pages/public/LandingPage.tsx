import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Compass, 
  ShieldCheck, 
  Layers, 
  Sliders, 
  Copy, 
  Eye, 
  Play, 
  Wand2,
  TrendingUp,
  FileCode2,
  Clock
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { SAMPLE_LOFI_PACKAGE } from '../../data/categories';
import { CopyButton } from '../../components/ui/CopyButton';

export const LandingPage: React.FC = () => {
  const { navigate, categories, setSelectedCategory } = useTuneForgeStore();
  const [activePreviewTab, setActivePreviewTab] = useState<'metadata' | 'thumbnail' | 'hook' | 'prompts' | 'video' | 'notes'>('metadata');

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate('/generate');
  };

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/80 bg-gradient-to-b from-slate-50/70 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Studio Konten YouTube Musik Instrumental Berbasis AI</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.15]">
              Ubah Satu Kategori Musik Menjadi <span className="text-amber-600">Satu Paket Konten Lengkap</span> Siap Upload.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Dirancang khusus untuk target audience Tier-1 Amerika Serikat dengan target CTR &gt;20%. Dapatkan 7 blok output dalam &lt;15 detik: metadata SEO, teks thumbnail, intro hook, 4 prompt visual, dan prompt video loop.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('/generate')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg cursor-pointer group"
              >
                <Wand2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Mulai Forge Konten Gratis</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/kategori')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors border border-slate-200 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-slate-500" />
                <span>Jelajahi 18 Kategori Musik</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-2xl mx-auto">
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <p className="text-[11px] text-slate-500 font-medium">Target CTR</p>
                <p className="text-lg font-bold font-display text-slate-900">&gt; 20%</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <p className="text-[11px] text-slate-500 font-medium">Waktu Generate</p>
                <p className="text-lg font-bold font-display text-slate-900">&lt; 15 Detik</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <p className="text-[11px] text-slate-500 font-medium">Kategori Riset</p>
                <p className="text-lg font-bold font-display text-slate-900">18 Kategori</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200/80">
                <p className="text-[11px] text-slate-500 font-medium">Output Blok</p>
                <p className="text-lg font-bold font-display text-slate-900">7 Blok Lengkap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-Step Production Workflow */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Alur Kerja Cepat</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
              Dari 1 Klik ke 1 Paket Siap Publish di YouTube
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Tidak perlu lagi pusing riset kata kunci berjam-jam atau menebak prompt AI video yang mulus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/90 relative">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Pilih Kategori &amp; Mood
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Tentukan 1 dari 18 kategori musik kurasi (Lo-fi, Piano, Study, dll), pilih sub-genre spesifik, dan tandai 1–3 mood yang diinginkan.
              </p>
            </div>

            <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/90 relative">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Tambahkan Konteks (Opsional)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Masukkan frasa situasi penonton jika ada, contoh: <span className="font-mono text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">"rainy night"</span> atau <span className="font-mono text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200">"coding focus"</span>.
              </p>
            </div>

            <div className="p-6 bg-slate-50/70 rounded-xl border border-slate-200/90 relative">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 mb-2">
                Tekan Forge &amp; Salin 7 Blok
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Dapatkan 7 blok terpisah dalam bahasa Inggris native: paste prompt ke Google Flow AI (Veo/Imagen) dan paste metadata ke YouTube Studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Sample Preview (The 7 Output Blocks) */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                <Eye className="w-3.5 h-3.5" /> Preview Hasil Nyata
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Contoh Paket Konten: Lo-fi &amp; Chill Beats
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Setiap blok dilengkapi tombol salin mandiri untuk kemudahan alur kerja cepat.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <CopyButton 
                textToCopy={JSON.stringify(SAMPLE_LOFI_PACKAGE, null, 2)}
                label="Salin Contoh JSON"
              />
              <button
                onClick={() => navigate('/generate')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Buat Sendiri</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation for Preview */}
          <div className="flex overflow-x-auto gap-2 pb-2 mb-4 border-b border-slate-200 text-xs">
            <button
              onClick={() => setActivePreviewTab('metadata')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'metadata'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              1. Metadata YouTube (Judul &amp; Tags)
            </button>
            <button
              onClick={() => setActivePreviewTab('thumbnail')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'thumbnail'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              2. Teks Thumbnail CTR
            </button>
            <button
              onClick={() => setActivePreviewTab('hook')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'hook'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              3. Intro Hook (0-10s)
            </button>
            <button
              onClick={() => setActivePreviewTab('prompts')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'prompts'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              4. 4 Prompt Thumbnail
            </button>
            <button
              onClick={() => setActivePreviewTab('video')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'video'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              5 &amp; 6. Prompt Visual &amp; Video Loop
            </button>
            <button
              onClick={() => setActivePreviewTab('notes')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer ${
                activePreviewTab === 'notes'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              7. Catatan Teknis
            </button>
          </div>

          {/* Active Tab Content Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            {activePreviewTab === 'metadata' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blok 1 — 3 Varian Judul YouTube (Search Intent AS)
                  </span>
                  <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.metadata.titleA} label="Salin Judul A" />
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded mr-2">VARIAN A</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LOFI_PACKAGE.metadata.titleA}</span>
                    </div>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.metadata.titleA} variant="minimal" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded mr-2">VARIAN B</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LOFI_PACKAGE.metadata.titleB}</span>
                    </div>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.metadata.titleB} variant="minimal" />
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded mr-2">VARIAN C</span>
                      <span className="font-semibold text-slate-900">{SAMPLE_LOFI_PACKAGE.metadata.titleC}</span>
                    </div>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.metadata.titleC} variant="minimal" />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Deskripsi YouTube Terstruktur</span>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.metadata.description} label="Salin Deskripsi" />
                  </div>
                  <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {SAMPLE_LOFI_PACKAGE.metadata.description}
                  </pre>
                </div>
              </div>
            )}

            {activePreviewTab === 'thumbnail' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blok 2 — Teks Thumbnail (Optimasi CTR &gt; 20%)
                  </span>
                  <span className="text-xs text-slate-500">Mudah dibaca di layar HP &lt;120px</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center space-y-2">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest block">Opsi 1 (Fokus)</span>
                    <p className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                      {SAMPLE_LOFI_PACKAGE.thumbnailText.variant1}
                    </p>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailText.variant1} />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Opsi 2 (Atmosfer)</span>
                    <p className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                      {SAMPLE_LOFI_PACKAGE.thumbnailText.variant2}
                    </p>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailText.variant2} />
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">Opsi 3 (Benefit)</span>
                    <p className="font-display font-extrabold text-xl text-slate-900 tracking-tight">
                      {SAMPLE_LOFI_PACKAGE.thumbnailText.variant3}
                    </p>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailText.variant3} />
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'hook' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blok 3 — Intro Hook Video (0–10 Detik Pertama)
                  </span>
                  <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.introHook} label="Salin Teks Hook" />
                </div>
                <div className="p-4 bg-slate-900 text-amber-200 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Audio / Voiceover / Teks On-Screen Hook:</p>
                  <p className="font-display text-base sm:text-lg italic leading-relaxed text-white">
                    "{SAMPLE_LOFI_PACKAGE.introHook}"
                  </p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Menjaga retensi penonton di atas 3 menit pertama dengan memberikan janji suasana yang langsung terpenuhi.
                </p>
              </div>
            )}

            {activePreviewTab === 'prompts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blok 4 — Prompt Thumbnail 4 Varian Gaya
                  </span>
                  <span className="text-xs text-slate-500">Siap paste ke Midjourney / Imagen</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">1. Gaya Cinematic Widescreen</span>
                      <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailPrompts.cinematic} />
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed">
                      {SAMPLE_LOFI_PACKAGE.thumbnailPrompts.cinematic}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">2. Gaya Split / Kolase Kontras</span>
                      <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailPrompts.split} />
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed">
                      {SAMPLE_LOFI_PACKAGE.thumbnailPrompts.split}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">3. Gaya Minimal Typography</span>
                      <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailPrompts.minimal} />
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed">
                      {SAMPLE_LOFI_PACKAGE.thumbnailPrompts.minimal}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-800">4. Gaya Emotional Lifestyle</span>
                      <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.thumbnailPrompts.lifestyle} />
                    </div>
                    <p className="font-mono text-xs text-slate-600 leading-relaxed">
                      {SAMPLE_LOFI_PACKAGE.thumbnailPrompts.lifestyle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'video' && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Blok 6 — Prompt Video AI (Google Flow AI / Veo Seamless Loop)
                    </span>
                    <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.videoPrompt} label="Salin Prompt Video" />
                  </div>
                  <div className="mt-3 p-4 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs leading-relaxed">
                    {SAMPLE_LOFI_PACKAGE.videoPrompt}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Blok 5 — 3 Alternatif Prompt Gambar (Base Scene Mandiri)
                    </span>
                    <span className="text-[11px] text-slate-400">Pilih 1 scene untuk di-loop di Blok 6</span>
                  </div>
                  <div className="space-y-2">
                    {SAMPLE_LOFI_PACKAGE.imagePrompts.map((imgPrompt, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-3 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-mono mr-2">
                            OPSI #{idx + 1}
                          </span>
                          <span className="font-mono text-slate-700">{imgPrompt}</span>
                        </div>
                        <CopyButton textToCopy={imgPrompt} variant="minimal" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Blok 7 — Catatan Teknis &amp; Pre-Upload Checklist
                  </span>
                  <CopyButton textToCopy={SAMPLE_LOFI_PACKAGE.technicalNotes} label="Salin Catatan" />
                </div>
                <pre className="p-4 bg-slate-50 text-slate-800 rounded-lg font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-200">
                  {SAMPLE_LOFI_PACKAGE.technicalNotes}
                </pre>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. 18 Categories Showcase Grid */}
      <section className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600">Database Kurasi</span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
                Katalog 18 Kategori Musik Terverifikasi
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Setiap kategori didukung oleh riset sub-genre dan search intent penonton YouTube Amerika Serikat.
              </p>
            </div>
            <button
              onClick={() => navigate('/kategori')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-amber-600 transition-colors"
            >
              <span>Lihat Semua Detail (18 Kategori)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.slice(0, 6).map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="p-5 rounded-xl border border-slate-200/90 bg-white hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{cat.iconEmoji}</span>
                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {cat.subGenres.length} Genre
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{cat.moods.slice(0, 2).join(', ')}</span>
                  </div>
                  <span className="font-medium text-amber-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Forge <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/kategori')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium cursor-pointer transition-colors"
            >
              <span>Buka Seluruh 18 Kategori &amp; Moods</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">Siap Naikkan CTR YouTube Anda?</span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Tinggalkan Riset Manual 3 Jam. Hasilkan Konten dalam 15 Detik.
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            TuneForge menjembatani kreasi audio instrumental Anda dengan algoritma visual dan search intent YouTube Amerika Serikat.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/generate')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm transition-all shadow-md cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Forge Konten Pertama Anda Sekarang</span>
            </button>
            <button
              onClick={() => navigate('/cara-kerja')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium transition-colors border border-slate-700 cursor-pointer"
            >
              <span>Pelajari Alur Lengkap</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
