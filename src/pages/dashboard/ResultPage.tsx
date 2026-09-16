import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  Wand2, 
  RefreshCw, 
  Sparkles, 
  Clock, 
  FileText, 
  Type, 
  Radio, 
  Image as ImageIcon, 
  Video, 
  Settings2,
  ExternalLink,
  Share2,
  Award,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';
import { YouTubeTitleVariant } from '../../types';
import { scoreYouTubeTitle } from '../../data/titleFormulaEngine';

interface ResultPageProps {
  packageId?: string;
}

export const ResultPage: React.FC<ResultPageProps> = ({ packageId }) => {
  const { packages, currentPackage, navigate, showToast, regenerateBlockInCurrentPackage } = useTuneForgeStore();

  const pkg = packageId 
    ? packages.find((p) => p.id === packageId) || currentPackage || packages[0]
    : currentPackage || packages[0];

  const [activeThumbnailStyle, setActiveThumbnailStyle] = useState<'cinematic' | 'split' | 'minimal' | 'lifestyle'>('cinematic');
  const [regeneratingBlock, setRegeneratingBlock] = useState<string | null>(null);
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState<number | null>(null);

  // Compute or read variants
  const resolvedVariants: YouTubeTitleVariant[] = (pkg.metadata.titleVariants && pkg.metadata.titleVariants.length > 0)
    ? pkg.metadata.titleVariants
    : [
        scoreYouTubeTitle(pkg.metadata.titleA, {
          categoryName: pkg.categoryName,
          genre: pkg.subGenre,
          moods: pkg.moods,
          duration: pkg.duration,
          useCase: pkg.useCase,
          optionalKeyword: pkg.optionalKeyword
        }),
        scoreYouTubeTitle(pkg.metadata.titleB, {
          categoryName: pkg.categoryName,
          genre: pkg.subGenre,
          moods: pkg.moods,
          duration: pkg.duration,
          useCase: pkg.useCase,
          optionalKeyword: pkg.optionalKeyword
        }),
        scoreYouTubeTitle(pkg.metadata.titleC, {
          categoryName: pkg.categoryName,
          genre: pkg.subGenre,
          moods: pkg.moods,
          duration: pkg.duration,
          useCase: pkg.useCase,
          optionalKeyword: pkg.optionalKeyword
        })
      ];

  const handleSimulateRegenerate = async (blockName: string) => {
    setRegeneratingBlock(blockName);
    try {
      await regenerateBlockInCurrentPackage(blockName);
    } catch {
      showToast(`${blockName} diperbarui`);
    } finally {
      setRegeneratingBlock(null);
    }
  };

  const getMarkdownAll = () => {
    const titlesMd = resolvedVariants
      .map((v, i) => `#### Varian ${String.fromCharCode(65 + i)} (Skor: ${v.score}/100)${v.isPrimaryRecommendation ? ' [REKOMENDASI UTAMA]' : ''}\n${v.title}\n*Alasan:* ${v.reason}\n*Breakdown:* SEO: ${v.breakdown.seoKeyword}/35 | CTR: ${v.breakdown.ctrPotential}/30 | Kejujuran: ${v.breakdown.contentHonesty}/20 | Kepatuhan: ${v.breakdown.formulaCompliance}/15`)
      .join('\n\n');

    return `# ${pkg.metadata.titleA}
Category: ${pkg.categoryName} (${pkg.subGenre})
Moods: ${pkg.moods.join(', ')}
${pkg.duration ? `Duration: ${pkg.duration}\n` : ''}${pkg.useCase ? `Use-Case: ${pkg.useCase}\n` : ''}${pkg.optionalKeyword ? `Context: ${pkg.optionalKeyword}\n` : ''}
---
## 1. YOUTUBE METADATA
### Judul Teruji Algoritma & SEO:
${titlesMd}

### Description:
${pkg.metadata.description}

### Tags:
${pkg.metadata.tags.join(', ')}

---
## 2. THUMBNAIL TEXT (CTR >20%)
- Variant 1: ${pkg.thumbnailText.variant1}
- Variant 2: ${pkg.thumbnailText.variant2}
- Variant 3: ${pkg.thumbnailText.variant3}

---
## 3. INTRO HOOK (0-10s)
"${pkg.introHook}"

---
## 4. THUMBNAIL PROMPTS (4 STYLES)
### Cinematic Widescreen:
${pkg.thumbnailPrompts.cinematic}

### Split / Kolase:
${pkg.thumbnailPrompts.split}

### Minimal Typography:
${pkg.thumbnailPrompts.minimal}

### Emotional Lifestyle:
${pkg.thumbnailPrompts.lifestyle}

---
## 5. AI IMAGE PROMPTS (3 ALTERNATIF BASE SCENE MANDIRI)
(Pilih 1 alternatif gambar berdiri sendiri untuk dianimasikan dengan prompt video Blok 6)
${pkg.imagePrompts.map((p, i) => `[Alternatif ${i + 1}]\n${p}`).join('\n\n')}

---
## 6. AI VIDEO PROMPT (SEAMLESS LOOP)
${pkg.videoPrompt}

---
## 7. TECHNICAL NOTES
${pkg.technicalNotes}
`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Sticky Top Bar for Copying All and Navigation */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Riwayat</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-xs font-mono text-slate-500 truncate max-w-xs">
            ID: {pkg.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Forge Baru</span>
          </button>

          {/* STICKY COPY ALL BUTTON (Markdown format) */}
          <CopyButton
            textToCopy={getMarkdownAll()}
            label="Copy Semua Output (Format Markdown)"
            variant="amber"
          />
        </div>
      </div>

      {/* Package Header Banner */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[11px] font-semibold">
            {pkg.categoryName}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-medium font-mono">
            {pkg.subGenre}
          </span>
          {pkg.moods.map((m, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 text-[10px]">
              {m}
            </span>
          ))}
          {pkg.duration && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
              ⏱️ {pkg.duration}
            </span>
          )}
          {pkg.useCase && (
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-semibold">
              🎯 {pkg.useCase}
            </span>
          )}
          {pkg.optionalKeyword && (
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono">
              Konteks: "{pkg.optionalKeyword}"
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
          {pkg.metadata.titleA}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {new Date(pkg.createdAt).toLocaleString('id-ID')}
          </span>
          <span>•</span>
          <span>Waktu Generate: <strong>{(pkg.generationMs / 1000).toFixed(1)}s</strong></span>
          <span>•</span>
          <span>Engine: <code className="text-slate-700 font-mono">{pkg.model}</code></span>
        </div>
      </div>

      {/* THE 7 DISTINCT OUTPUT CARDS */}
      <div className="space-y-7">
        
        {/* CARD 1: YouTube Metadata */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 01</span>
              <FileText className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Metadata YouTube (Judul A/B/C, Deskripsi, Tags)
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSimulateRegenerate('Metadata YouTube')}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-xs cursor-pointer transition-colors"
                title="Regenerate blok ini"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${regeneratingBlock === 'Metadata YouTube' ? 'animate-spin text-amber-400' : ''}`} />
              </button>
              <CopyButton 
                textToCopy={`Title A: ${pkg.metadata.titleA}\nTitle B: ${pkg.metadata.titleB}\nTitle C: ${pkg.metadata.titleC}\n\nDescription:\n${pkg.metadata.description}\n\nTags:\n${pkg.metadata.tags.join(', ')}`} 
                label="Salin Blok Metadata"
                variant="light" 
              />
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5 bg-slate-50/50">
            {/* Titles Variants with Formula Scoring */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                      Varian Judul SEO & Algoritma YouTube ({resolvedVariants.length} Opsi Teruji):
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Formula: [Keyword Niche/Mood] + [Genre/Instrumen] + [Aktivitas Umum] + (Durasi)
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
                  Bobot: SEO 35% • CTR 30% • Kejujuran 20% • Kepatuhan 15%
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {resolvedVariants.map((v, idx) => {
                  const isExpanded = showFormulaBreakdown === idx;
                  const scoreBadgeColor = v.score >= 90 
                    ? 'bg-emerald-500 text-white' 
                    : v.score >= 80 
                    ? 'bg-amber-500 text-slate-950' 
                    : 'bg-slate-700 text-white';

                  return (
                    <div 
                      key={idx} 
                      className={`p-3.5 bg-white rounded-xl border transition-all ${
                        v.isPrimaryRecommendation 
                          ? 'border-amber-400/80 shadow-xs ring-1 ring-amber-300' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                            <span className="text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded font-mono">
                              VARIAN {String.fromCharCode(65 + idx)}
                            </span>
                            
                            {v.isPrimaryRecommendation && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-mono">
                                <Sparkles className="w-2.5 h-2.5" /> REKOMENDASI UTAMA
                              </span>
                            )}

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${scoreBadgeColor}`}>
                              SKOR: {v.score}/100
                            </span>

                            <span className="text-[10px] font-mono text-slate-500">
                              {v.title.length} Karakter
                            </span>
                          </div>

                          <p className="font-bold text-slate-900 text-sm leading-snug">
                            {v.title}
                          </p>

                          <p className="text-[11px] text-slate-600 mt-1 italic">
                            💡 {v.reason}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setShowFormulaBreakdown(isExpanded ? null : idx)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1"
                            title="Lihat rincian skor"
                          >
                            <span>Analisis</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                          <CopyButton textToCopy={v.title} variant="minimal" />
                        </div>
                      </div>

                      {/* Expandable Breakdown Drawer */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50/80 p-2.5 rounded-lg text-[11px]">
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">SEO & Keyword</span>
                            <strong className="text-slate-900 font-mono">{v.breakdown.seoKeyword}/35</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Potensi CTR</span>
                            <strong className="text-slate-900 font-mono">{v.breakdown.ctrPotential}/30</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Kejujuran Konten</span>
                            <strong className="text-slate-900 font-mono">{v.breakdown.contentHonesty}/20</strong>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[10px] uppercase font-bold">Kepatuhan Formula</span>
                            <strong className="text-slate-900 font-mono">{v.breakdown.formulaCompliance}/15</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Deskripsi YouTube SEO:
                </span>
                <CopyButton textToCopy={pkg.metadata.description} label="Salin Deskripsi" />
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-xs">
                <pre className="text-black font-mono text-xs font-medium overflow-x-auto whitespace-pre-wrap leading-relaxed">
                  {pkg.metadata.description}
                </pre>
              </div>
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Tags YouTube ({pkg.metadata.tags.length} Tag Relevan):
                </span>
                <CopyButton textToCopy={pkg.metadata.tags.join(', ')} label="Salin Semua Tag (Koma)" />
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-xs space-y-3">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-black font-semibold break-all select-all">
                  {pkg.metadata.tags.join(', ')}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.metadata.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-slate-300 text-black text-xs font-mono font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Thumbnail Text Variants */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 02</span>
              <Type className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Teks Thumbnail (Target CTR &gt; 20%)
              </h2>
            </div>
            <CopyButton 
              textToCopy={`${pkg.thumbnailText.variant1}\n${pkg.thumbnailText.variant2}\n${pkg.thumbnailText.variant3}`} 
              label="Salin Semua Opsi Teks" 
              variant="light"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
            <p className="text-xs text-slate-600 font-medium">
              Disarankan menggunakan huruf tebal tanpa kait (Bold Sans-Serif) dengan outer drop shadow halus.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-xs text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">Opsi 1 (Fokus)</span>
                <p className="font-display font-black text-2xl text-black tracking-tight">
                  {pkg.thumbnailText.variant1}
                </p>
                <div className="flex justify-center pt-1">
                  <CopyButton textToCopy={pkg.thumbnailText.variant1} label="Salin Teks" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-xs text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">Opsi 2 (Atmosfer)</span>
                <p className="font-display font-black text-2xl text-black tracking-tight">
                  {pkg.thumbnailText.variant2}
                </p>
                <div className="flex justify-center pt-1">
                  <CopyButton textToCopy={pkg.thumbnailText.variant2} label="Salin Teks" />
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-xs text-center space-y-3">
                <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">Opsi 3 (Benefit)</span>
                <p className="font-display font-black text-2xl text-black tracking-tight">
                  {pkg.thumbnailText.variant3}
                </p>
                <div className="flex justify-center pt-1">
                  <CopyButton textToCopy={pkg.thumbnailText.variant3} label="Salin Teks" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Intro Hook Video */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 03</span>
              <Radio className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Intro Hook Video (0–10 Detik Pertama)
              </h2>
            </div>
            <CopyButton textToCopy={pkg.introHook} label="Salin Naskah Hook" variant="light" />
          </div>

          <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
            <div className="p-5 bg-white rounded-xl border border-slate-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <p className="font-display text-base sm:text-lg font-bold text-black italic leading-relaxed">
                "{pkg.introHook}"
              </p>
              <CopyButton textToCopy={pkg.introHook} label="Salin Hook" className="shrink-0" />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Gunakan sebagai teks animasi pembuka di layar (on-screen text) atau voiceover intro halus untuk mengunci retensi penonton.
            </p>
          </div>
        </div>

        {/* CARD 4: 4 Thumbnail Prompts */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 04</span>
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Prompt Thumbnail (4 Varian Gaya Siap Render)
              </h2>
            </div>
            <CopyButton 
              textToCopy={pkg.thumbnailPrompts[activeThumbnailStyle]} 
              label={`Salin Gaya ${activeThumbnailStyle.toUpperCase()}`}
              variant="light" 
            />
          </div>

          <div className="p-5 sm:p-6 space-y-4 bg-slate-50/50">
            {/* Style Selector Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveThumbnailStyle('cinematic')}
                className={`px-3.5 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-xs ${
                  activeThumbnailStyle === 'cinematic'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                1. Cinematic Widescreen
              </button>
              <button
                type="button"
                onClick={() => setActiveThumbnailStyle('split')}
                className={`px-3.5 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-xs ${
                  activeThumbnailStyle === 'split'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                2. Split / Kolase Kontras
              </button>
              <button
                type="button"
                onClick={() => setActiveThumbnailStyle('minimal')}
                className={`px-3.5 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-xs ${
                  activeThumbnailStyle === 'minimal'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                3. Minimal Typography
              </button>
              <button
                type="button"
                onClick={() => setActiveThumbnailStyle('lifestyle')}
                className={`px-3.5 py-2 rounded-lg font-bold cursor-pointer transition-colors shadow-xs ${
                  activeThumbnailStyle === 'lifestyle'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                }`}
              >
                4. Emotional Lifestyle
              </button>
            </div>

            <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-300 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-mono">
                  Prompt Siap Paste ke Midjourney / Imagen / Flux (16:9):
                </span>
                <CopyButton textToCopy={pkg.thumbnailPrompts[activeThumbnailStyle]} label="Salin Prompt Ini" />
              </div>
              <p className="font-mono text-xs text-black font-semibold leading-relaxed whitespace-pre-wrap">
                {pkg.thumbnailPrompts[activeThumbnailStyle]}
              </p>
            </div>
          </div>
        </div>

        {/* CARD 5: AI Image Prompts */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 05</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <h2 className="font-display font-bold text-sm sm:text-base text-white">
                  Prompt Gambar AI (3 Alternatif Base Scene Mandiri)
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Setiap opsi adalah 1 scene utuh berdiri sendiri (bukan urutan scene 1–3). Pilih 1 gambar terbaik untuk dianimasikan di Blok 06.
                </p>
              </div>
            </div>
            <CopyButton 
              textToCopy={pkg.imagePrompts.join('\n\n')} 
              label="Salin 3 Alternatif Gambar" 
              variant="light"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
            {pkg.imagePrompts.map((imgPrompt, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-slate-300 shadow-xs flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-950 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                      Alternatif #{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium">
                      Single Base Scene (Siap di-loop)
                    </span>
                  </div>
                  <p className="font-mono text-black font-semibold leading-relaxed pt-0.5">{imgPrompt}</p>
                </div>
                <CopyButton textToCopy={imgPrompt} variant="minimal" />
              </div>
            ))}
          </div>
        </div>

        {/* CARD 6: AI Video Prompt (Seamless Loop) */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 06</span>
              <Video className="w-4 h-4 text-amber-400" />
              <div>
                <h2 className="font-display font-bold text-sm sm:text-base text-white">
                  Prompt Video AI (Google Flow AI / Veo Seamless Loop)
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Gunakan gambar pilihan dari Blok 05 sebagai input image-to-video, lalu masukkan prompt ini.
                </p>
              </div>
            </div>
            <CopyButton textToCopy={pkg.videoPrompt} label="Salin Prompt Video" variant="light" />
          </div>

          <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
            <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-300 shadow-xs flex items-start justify-between gap-4">
              <div className="font-mono text-black text-xs font-semibold leading-relaxed flex-1">
                {pkg.videoPrompt}
              </div>
              <CopyButton textToCopy={pkg.videoPrompt} variant="minimal" />
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Dirancang khusus untuk menganimasikan 1 gambar terpilih dengan aturan kamera statis dan pergerakan mikro terisolasi, agar video dapat di-loop berkali-kali secara mulus menjadi video panjang (1–8 jam).
            </p>
          </div>
        </div>

        {/* CARD 7: Technical Notes */}
        <div className="bg-slate-50/70 rounded-2xl border-2 border-slate-300 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-amber-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded text-xs tracking-wider">BLOK 07</span>
              <Settings2 className="w-4 h-4 text-amber-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Catatan Teknis &amp; Pre-Upload Checklist
              </h2>
            </div>
            <CopyButton textToCopy={pkg.technicalNotes} label="Salin Catatan Teknis" variant="light" />
          </div>

          <div className="p-5 sm:p-6 bg-slate-50/50 space-y-3">
            <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-300 shadow-xs flex items-start justify-between gap-4">
              <pre className="text-black font-mono text-xs font-semibold whitespace-pre-wrap leading-relaxed flex-1">
                {pkg.technicalNotes}
              </pre>
              <CopyButton textToCopy={pkg.technicalNotes} variant="minimal" />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action bar */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate('/history')}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Kembali ke Tabel Riwayat
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium cursor-pointer transition-all shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Forge Paket Baru Lainnya</span>
          </button>
        </div>
      </div>
    </div>
  );
};
