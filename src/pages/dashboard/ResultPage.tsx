import React, { useState, useMemo } from 'react';
import { 
  Copy, 
  Check, 
  ArrowLeft, 
  Wand2, 
  RefreshCw, 
  FileText, 
  Type, 
  Radio, 
  Image as ImageIcon, 
  Video
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';
import { YouTubeTitleVariant } from '../../types';
import { scoreYouTubeTitle, generateRefinedTitleVariants } from '../../data/titleFormulaEngine';
import { generateEngineeredThumbnailPrompts } from '../../data/thumbnailPromptEngine';
import { generateGoogleFlowPrompts } from '../../data/googleFlowEngine';
import { getIntroHookTiers } from '../../data/introHookEngine';

interface ResultPageProps {
  packageId?: string;
}

export const ResultPage: React.FC<ResultPageProps> = ({ packageId }) => {
  const { packages, currentPackage, navigate, showToast, regenerateBlockInCurrentPackage } = useTuneForgeStore();

  const pkg = packageId 
    ? packages.find((p) => p.id === packageId) || currentPackage || packages[0]
    : currentPackage || packages[0];

  const defaultStyle = (pkg.preferredThumbnailStyle && pkg.preferredThumbnailStyle !== 'all')
    ? (pkg.preferredThumbnailStyle as 'cinematic' | 'split' | 'minimal' | 'lifestyle')
    : 'cinematic';

  const [activeThumbnailStyle, setActiveThumbnailStyle] = useState<'cinematic' | 'split' | 'minimal' | 'lifestyle'>(defaultStyle);
  const [regeneratingBlock, setRegeneratingBlock] = useState<string | null>(null);

  // Intro Hook Video 3 Tingkat
  const introHookTiers = useMemo(() => {
    return getIntroHookTiers(pkg);
  }, [pkg]);

  // Varian Judul SEO: Tepat 3 Varian (Rekomendasi Utama, Rekomendasi Alternatif 1, Rekomendasi Alternatif 2)
  const resolvedVariants: YouTubeTitleVariant[] = useMemo(() => {
    const rawVariants = (pkg.metadata.titleVariants && pkg.metadata.titleVariants.length > 0)
      ? pkg.metadata.titleVariants.slice(0, 3)
      : generateRefinedTitleVariants({
          categoryName: pkg.categoryName,
          genre: pkg.subGenre,
          moods: pkg.moods,
          duration: pkg.duration,
          useCase: pkg.useCase,
          optionalKeyword: pkg.optionalKeyword
        });

    const labels = [
      'Rekomendasi Utama',
      'Rekomendasi Alternatif 1',
      'Rekomendasi Alternatif 2'
    ];

    return rawVariants.slice(0, 3).map((v, i) => ({
      ...v,
      variantLabel: labels[i],
      isPrimaryRecommendation: i === 0
    }));
  }, [pkg]);

  // Prompt Thumbnail (4 Gaya)
  const resolvedThumbnails = useMemo(() => {
    if (pkg.thumbnailDetails && pkg.thumbnailDetails.cinematic) {
      return {
        prompts: pkg.thumbnailPrompts,
        details: pkg.thumbnailDetails
      };
    }
    return generateEngineeredThumbnailPrompts({
      categoryName: pkg.categoryName,
      genre: pkg.subGenre,
      moods: pkg.moods,
      preferredStyle: pkg.preferredThumbnailStyle,
      duration: pkg.duration,
      useCase: pkg.useCase,
      optionalKeyword: pkg.optionalKeyword
    });
  }, [pkg]);

  // Prompt Google Flow (1 Gambar Terbaik + 1 Video Turunan)
  const resolvedGoogleFlow = useMemo(() => {
    if (pkg.googleFlowDetails && pkg.googleFlowDetails.layers) {
      return pkg.googleFlowDetails;
    }
    return generateGoogleFlowPrompts({
      categoryName: pkg.categoryName,
      genre: pkg.subGenre,
      moods: pkg.moods,
      optionalKeyword: pkg.optionalKeyword,
      variationIndex: 0
    });
  }, [pkg]);

  const singleImagePrompt = (pkg.imagePrompts && pkg.imagePrompts.length > 0 && pkg.imagePrompts[0])
    ? pkg.imagePrompts[0]
    : resolvedGoogleFlow.imagePrompt;

  const singleVideoPrompt = pkg.videoPrompt || resolvedGoogleFlow.videoPrompt;

  const combinedGoogleFlowText = `[PROMPT GAMBAR]\n${singleImagePrompt}\n\n[PROMPT VIDEO]\n${singleVideoPrompt}`;

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

  // Format Markdown Valid Per Blok untuk Notion / Aplikasi Catatan
  const getMarkdownAll = () => {
    const titleLines = resolvedVariants
      .map((v) => `- **${v.variantLabel || 'Varian'}:** ${v.title}`)
      .join('\n');

    const thumbPromptsText = `### 1. Gaya Sinematik (Cinematic Widescreen)
\`\`\`
${resolvedThumbnails.details.cinematic.fullPrompt}
\`\`\`

### 2. Gaya Komposisi Terbelah (Split Composition)
\`\`\`
${resolvedThumbnails.details.split.fullPrompt}
\`\`\`

### 3. Gaya Tipografi Minimalis (Minimal Typography)
\`\`\`
${resolvedThumbnails.details.minimal.fullPrompt}
\`\`\`

### 4. Gaya Gaya Hidup Emosional (Emotional Lifestyle)
\`\`\`
${resolvedThumbnails.details.lifestyle.fullPrompt}
\`\`\``;

    return `# ${pkg.metadata.titleA}

**Kategori:** ${pkg.categoryName} (${pkg.subGenre})  
**Suasana:** ${pkg.moods.join(', ')}  
${pkg.duration ? `**Durasi:** ${pkg.duration}  \n` : ''}${pkg.useCase ? `**Aktivitas:** ${pkg.useCase}  \n` : ''}${pkg.optionalKeyword ? `**Kata Kunci Tambahan:** ${pkg.optionalKeyword}  \n` : ''}
---

## 1. Metadata YouTube

### Varian Judul SEO
${titleLines}

### Deskripsi Video
\`\`\`
${pkg.metadata.description}
\`\`\`

### Tag YouTube
\`\`\`
${pkg.metadata.tags.join(', ')}
\`\`\`

---

## 2. Teks Thumbnail
- **Opsi 1 (Fokus):** ${pkg.thumbnailText.variant1}
- **Opsi 2 (Atmosfer):** ${pkg.thumbnailText.variant2}
- **Opsi 3 (Manfaat):** ${pkg.thumbnailText.variant3}

---

## 3. Intro Hook Video (0–10 Detik)
1. **Hook:** ${introHookTiers.hook}
2. **Sub-judul:** ${introHookTiers.subtitle}
3. **Call to Action:** ${introHookTiers.cta}

---

## 4. Prompt Thumbnail Siap Render (Rasio 16:9)
${thumbPromptsText}

---

## 5. Prompt Gambar AI — Google Flow (1 Gambar Terbaik)
\`\`\`
[PROMPT GAMBAR]
${singleImagePrompt}
\`\`\`

---

## 6. Prompt Video AI — Google Flow (Image-to-Video Loop)
\`\`\`
[PROMPT VIDEO]
${singleVideoPrompt}
\`\`\`
`;
  };

  const thumbnailStyles: Array<{ id: 'cinematic' | 'split' | 'minimal' | 'lifestyle'; label: string }> = [
    { id: 'cinematic', label: 'Sinematik' },
    { id: 'split', label: 'Komposisi Terbelah' },
    { id: 'minimal', label: 'Tipografi Minimalis' },
    { id: 'lifestyle', label: 'Gaya Hidup Emosional' }
  ];

  const currentThumbPrompt = resolvedThumbnails.details[activeThumbnailStyle]?.fullPrompt || resolvedThumbnails.details.cinematic.fullPrompt;

  const allThumbnailPromptsCombined = thumbnailStyles
    .map(s => `[GAYA: ${s.label.toUpperCase()}]\n${resolvedThumbnails.details[s.id]?.fullPrompt || ''}`)
    .join('\n\n');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6 pb-28">
      {/* Bar Atas Sticky: Salin Semua & Navigasi */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Riwayat</span>
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-700 font-medium truncate max-w-xs">
            {pkg.categoryName} • {pkg.subGenre}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors shadow-2xs"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Buat Paket Baru</span>
          </button>

          <CopyButton
            textToCopy={getMarkdownAll()}
            label="Salin Semua Output (Format Markdown)"
            variant="white"
          />
        </div>
      </div>

      {/* Header Halaman Ringkas */}
      <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white font-semibold">
            {pkg.categoryName}
          </span>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-semibold">
            {pkg.subGenre}
          </span>
          {pkg.moods.map((m, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 text-[11px]">
              {m}
            </span>
          ))}
          {pkg.duration && (
            <span className="px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 text-[11px]">
              {pkg.duration}
            </span>
          )}
        </div>
        <h1 className="font-bold text-xl sm:text-2xl text-slate-900 leading-tight">
          {pkg.metadata.titleA}
        </h1>
      </div>

      {/* BLOK 1: Metadata YouTube */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 1: Metadata YouTube
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateRegenerate('Metadata YouTube')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perbarui Metadata"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingBlock === 'Metadata YouTube' ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <CopyButton 
              textToCopy={`Varian Judul:\n${resolvedVariants.map(v => `${v.variantLabel}: ${v.title}`).join('\n')}\n\nDeskripsi:\n${pkg.metadata.description}\n\nTag:\n${pkg.metadata.tags.join(', ')}`} 
              label="Salin Metadata"
            />
          </div>
        </div>

        {/* 3 Varian Judul SEO */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 block">
            Varian Judul SEO:
          </span>
          <div className="space-y-2.5">
            {resolvedVariants.map((v, idx) => (
              <div 
                key={idx} 
                className={`p-3.5 rounded-lg border flex items-start justify-between gap-3 ${
                  v.isPrimaryRecommendation 
                    ? 'bg-amber-50/50 border-amber-300' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="space-y-1 flex-1 min-w-0">
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded ${
                    v.isPrimaryRecommendation 
                      ? 'bg-amber-500 text-slate-950' 
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {v.variantLabel}
                  </span>
                  <p className="font-bold text-sm text-slate-900 leading-snug">
                    {v.title}
                  </p>
                </div>
                <CopyButton textToCopy={v.title} label="Salin" variant="minimal" />
              </div>
            ))}
          </div>
        </div>

        {/* Deskripsi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Deskripsi Video:</span>
            <CopyButton textToCopy={pkg.metadata.description} label="Salin Deskripsi" />
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
              {pkg.metadata.description}
            </pre>
          </div>
        </div>

        {/* Tag */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Tag YouTube (Format Koma):</span>
            <CopyButton textToCopy={pkg.metadata.tags.join(', ')} label="Salin Tag" />
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-xs font-mono text-slate-900 break-all select-all leading-relaxed font-normal">
              {pkg.metadata.tags.join(', ')}
            </p>
          </div>
        </div>
      </section>

      {/* BLOK 2: Teks Thumbnail */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 2: Teks Thumbnail
            </h2>
          </div>
          <CopyButton 
            textToCopy={`Opsi 1 (Fokus): ${pkg.thumbnailText.variant1}\nOpsi 2 (Atmosfer): ${pkg.thumbnailText.variant2}\nOpsi 3 (Manfaat): ${pkg.thumbnailText.variant3}`} 
            label="Salin Semua Teks" 
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between gap-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Opsi 1 (Fokus)</span>
            <p className="font-black text-xl text-slate-900 tracking-tight">
              {pkg.thumbnailText.variant1}
            </p>
            <div className="flex justify-center pt-1">
              <CopyButton textToCopy={pkg.thumbnailText.variant1} label="Salin" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between gap-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Opsi 2 (Atmosfer)</span>
            <p className="font-black text-xl text-slate-900 tracking-tight">
              {pkg.thumbnailText.variant2}
            </p>
            <div className="flex justify-center pt-1">
              <CopyButton textToCopy={pkg.thumbnailText.variant2} label="Salin" />
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between gap-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Opsi 3 (Manfaat)</span>
            <p className="font-black text-xl text-slate-900 tracking-tight">
              {pkg.thumbnailText.variant3}
            </p>
            <div className="flex justify-center pt-1">
              <CopyButton textToCopy={pkg.thumbnailText.variant3} label="Salin" />
            </div>
          </div>
        </div>
      </section>

      {/* BLOK 3: Intro Hook Video (0–10 Detik) - 3 Tingkat Siap Paste */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 3: Intro Hook Video (0–10 Detik)
            </h2>
          </div>
          <CopyButton 
            textToCopy={introHookTiers.fullFormattedText} 
            label="Salin Naskah Lengkap (3 Tingkat)" 
          />
        </div>

        <div className="space-y-3">
          {/* Tingkat 1: Hook */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">1</span>
                <strong className="text-xs text-slate-900 font-bold">
                  Hook (Kalimat Pembuka Relate)
                </strong>
              </div>
              <CopyButton textToCopy={introHookTiers.hook} label="Salin Hook" variant="minimal" />
            </div>
            <p className="text-sm font-semibold text-slate-900 leading-relaxed font-sans select-all">
              "{introHookTiers.hook}"
            </p>
          </div>

          {/* Tingkat 2: Sub-judul */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">2</span>
                <strong className="text-xs text-slate-900 font-bold">
                  Sub-judul (Isi Video &amp; Manfaat)
                </strong>
              </div>
              <CopyButton textToCopy={introHookTiers.subtitle} label="Salin Sub-judul" variant="minimal" />
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed font-sans select-all">
              "{introHookTiers.subtitle}"
            </p>
          </div>

          {/* Tingkat 3: Call to Action */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center font-mono">3</span>
                <strong className="text-xs text-slate-900 font-bold">
                  Call to Action (Ajakan Menonton Sampai Selesai)
                </strong>
              </div>
              <CopyButton textToCopy={introHookTiers.cta} label="Salin CTA" variant="minimal" />
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed font-sans select-all">
              "{introHookTiers.cta}"
            </p>
          </div>
        </div>
      </section>

      {/* BLOK 4: Prompt Thumbnail Siap Render (16:9) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 4: Prompt Thumbnail Siap Render (Rasio 16:9)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton 
              textToCopy={allThumbnailPromptsCombined} 
              label="Salin Semua 4 Gaya" 
            />
          </div>
        </div>

        {/* Pemilih Gaya Sederhana */}
        <div className="flex flex-wrap gap-2">
          {thumbnailStyles.map((style) => {
            const isSelected = activeThumbnailStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => setActiveThumbnailStyle(style.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>

        {/* Kotak Prompt Siap Salin */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Prompt Generator Gambar (Bahasa Inggris • 16:9):
            </span>
            <CopyButton 
              textToCopy={currentThumbPrompt} 
              label="Salin Prompt Ini" 
            />
          </div>
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
            <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
              {currentThumbPrompt}
            </pre>
          </div>
        </div>
      </section>

      {/* BLOK 5: Prompt Gambar AI — Google Flow (1 Gambar Terbaik) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 5: Prompt Gambar AI — Google Flow (1 Gambar Terbaik)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateRegenerate('Prompt Gambar')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perbarui Prompt Gambar"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingBlock === 'Prompt Gambar' ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <CopyButton 
              textToCopy={`[PROMPT GAMBAR]\n${singleImagePrompt}`} 
              label="Salin Prompt Gambar" 
            />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-amber-700 block font-mono">
            [PROMPT GAMBAR]
          </span>
          <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
            {singleImagePrompt}
          </pre>
        </div>
      </section>

      {/* BLOK 6: Prompt Video AI — Google Flow (Image-to-Video Loop) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-slate-900 text-base">
              Blok 6: Prompt Video AI — Google Flow (Image-to-Video Loop)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateRegenerate('Prompt Video')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Perbarui Prompt Video"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingBlock === 'Prompt Video' ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <CopyButton 
              textToCopy={`[PROMPT VIDEO]\n${singleVideoPrompt}`} 
              label="Salin Prompt Video" 
            />
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-amber-700 block font-mono">
            [PROMPT VIDEO]
          </span>
          <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
            {singleVideoPrompt}
          </pre>
        </div>

        {/* Salin Paket Lengkap Google Flow */}
        <div className="pt-2 flex justify-end">
          <CopyButton 
            textToCopy={combinedGoogleFlowText} 
            label="Salin [PROMPT GAMBAR] + [PROMPT VIDEO]" 
          />
        </div>
      </section>

      {/* BLOK 7: DIHAPUS / DISEMBUNYIKAN SEPENUHNYA SESUAI INSTRUKSI */}

      {/* Navigasi Bawah */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Riwayat</span>
        </button>
      </div>
    </div>
  );
};
