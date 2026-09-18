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
  Video,
  Layers,
  Sparkles,
  Palette,
  Sun,
  ShieldAlert,
  Film,
  SlidersHorizontal,
  Target,
  AlertTriangle,
  Smartphone,
  Eye,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';
import { YouTubeTitleVariant, CinematicVariantType } from '../../types';
import { scoreYouTubeTitle, generateRefinedTitleVariants } from '../../data/titleFormulaEngine';
import { 
  generateEngineeredThumbnailPrompts,
  generateComprehensiveThumbnailPlatformPrompt,
  THUMBNAIL_UNIVERSAL_NEGATIVE_PROMPT 
} from '../../data/thumbnailPromptEngine';
import { 
  TEXT_POSITION_OPTIONS, 
  COLOR_PALETTE_PRESETS,
  TextPositionCode,
  ColorPaletteCode,
  CustomColorInput,
  validatePaletteContrast,
  validateCompositionPosition,
  validateCategoryColorTone
} from '../../data/thumbnailSettingsEngine';
import { generateGoogleFlowPrompts } from '../../data/googleFlowEngine';
import { getIntroHookTiers } from '../../data/introHookEngine';
import { generateCinematicVisualBundle, UNIVERSAL_NEGATIVE_PROMPT } from '../../data/cinematicPromptEngine';

interface ResultPageProps {
  packageId?: string;
}

export const ResultPage: React.FC<ResultPageProps> = ({ packageId }) => {
  const { packages, currentPackage, navigate, showToast, regenerateBlockInCurrentPackage, setCinematicVariant } = useTuneForgeStore();

  const pkg = packageId 
    ? packages.find((p) => p.id === packageId) || currentPackage || packages[0]
    : currentPackage || packages[0];

  const defaultStyle = (pkg.preferredThumbnailStyle && pkg.preferredThumbnailStyle !== 'all')
    ? (pkg.preferredThumbnailStyle as 'cinematic' | 'split' | 'minimal' | 'lifestyle')
    : 'cinematic';

  const [activeThumbnailStyle, setActiveThumbnailStyle] = useState<'cinematic' | 'split' | 'minimal' | 'lifestyle'>(defaultStyle);
  const [thumbPlatformTab, setThumbPlatformTab] = useState<'google-flow' | 'chatgpt' | 'general'>('google-flow');
  const [customSimulatorText, setCustomSimulatorText] = useState<string | null>(null);
  const [regeneratingBlock, setRegeneratingBlock] = useState<string | null>(null);

  // New Thumbnail Override States: Posisi Teks & Kombinasi Warna
  const [textPosition, setTextPosition] = useState<TextPositionCode>(
    (pkg.textPosition as TextPositionCode) || 'POS-AUTO'
  );
  const [colorPalette, setColorPalette] = useState<ColorPaletteCode>(
    (pkg.colorPalette as ColorPaletteCode) || 'PAL-AUTO'
  );
  const [customColors, setCustomColors] = useState<CustomColorInput>(
    pkg.customColors || { dominant: '#0A0A14', accent: '#C9A030', textZone: '#0D1020' }
  );

  // Platform selection states for visual generation
  const [imagePlatform, setImagePlatform] = useState<'standard' | 'midjourney' | 'flux' | 'imagen'>('standard');
  const [videoPlatform, setVideoPlatform] = useState<'googleFlow' | 'runway' | 'kling' | 'luma' | 'pika'>('googleFlow');

  // Cinematic Visual Bundle (Scene, Subjek, Abstrak across all 18 categories)
  const cinematicBundle = useMemo(() => {
    return pkg.cinematicVisualBundle || generateCinematicVisualBundle(pkg.categoryId, pkg.categoryName, 'Scene');
  }, [pkg]);

  const activeVisualVariant: CinematicVariantType = cinematicBundle.activeVariant || 'Scene';
  const currentVariantData = cinematicBundle.variants[activeVisualVariant] || cinematicBundle.variants.Scene;

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

  // Prompt Thumbnail (4 Gaya CTR Tinggi dengan dukungan Override Posisi Teks & Palet Warna)
  const resolvedThumbnails = useMemo(() => {
    return generateEngineeredThumbnailPrompts({
      categoryName: pkg.categoryName,
      genre: pkg.subGenre,
      moods: pkg.moods,
      preferredStyle: pkg.preferredThumbnailStyle,
      duration: pkg.duration,
      useCase: pkg.useCase,
      optionalKeyword: pkg.optionalKeyword,
      textPosition,
      colorPalette,
      customColors
    });
  }, [pkg, textPosition, colorPalette, customColors]);

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

  // Active Image Prompt according to chosen platform (Standard, Midjourney v6, Flux.1, Imagen 3)
  const singleImagePrompt = useMemo(() => {
    const imgPlat = currentVariantData.platforms?.image;
    if (imagePlatform === 'midjourney') return imgPlat?.midjourney || currentVariantData.imagePrompt;
    if (imagePlatform === 'flux') return imgPlat?.flux || currentVariantData.imagePrompt;
    if (imagePlatform === 'imagen') return imgPlat?.imagen || currentVariantData.imagePrompt;
    return currentVariantData.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[0]) || resolvedGoogleFlow.imagePrompt;
  }, [imagePlatform, currentVariantData, pkg, resolvedGoogleFlow]);

  // Active Video Prompt according to chosen platform (Google Flow, Runway, Kling, Luma, Pika)
  const singleVideoPrompt = useMemo(() => {
    const vidPlat = currentVariantData.platforms?.video;
    if (videoPlatform === 'runway') return vidPlat?.runwayMl || currentVariantData.videoPrompt;
    if (videoPlatform === 'kling') return vidPlat?.klingAi || currentVariantData.videoPrompt;
    if (videoPlatform === 'luma') return vidPlat?.lumaDreamMachine || currentVariantData.videoPrompt;
    if (videoPlatform === 'pika') return vidPlat?.pikaLabs || currentVariantData.videoPrompt;
    return currentVariantData.videoPrompt || pkg.videoPrompt || resolvedGoogleFlow.videoPrompt;
  }, [videoPlatform, currentVariantData, pkg, resolvedGoogleFlow]);

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

## 5. Prompt Gambar AI — Sinematik (${activeVisualVariant}: ${currentVariantData.variantTitle || activeVisualVariant})
- **Target Audience:** ${currentVariantData.parameters?.audience || pkg.categoryName}
- **Lighting:** ${currentVariantData.parameters?.lighting || 'Cinematic lighting'}
- **Color Palette:** ${currentVariantData.parameters?.colorPalette || 'Curated tone'}
- **Style Reference:** ${currentVariantData.parameters?.styleReference || 'Cinematic aesthetic'}

\`\`\`
[PROMPT GAMBAR]
${singleImagePrompt}
\`\`\`

---

## 6. Prompt Video AI — Image-to-Video Loop (Locked-Off Tripod)
- **Platform:** ${videoPlatform}
- **Kamera:** Locked-off tripod, zero pan/tilt/zoom/shake
- **Motion:** 80% slow-motion cyclical micro-movement, 10s seamless loop

\`\`\`
[PROMPT VIDEO]
${singleVideoPrompt}
\`\`\`

---

## Universal Negative Prompt
\`\`\`
${UNIVERSAL_NEGATIVE_PROMPT}
\`\`\`
`;
  };

  const thumbnailStyles: Array<{ 
    id: 'cinematic' | 'split' | 'minimal' | 'lifestyle'; 
    label: string;
    subLabel: string;
    targetCTR: string;
  }> = [
    { id: 'cinematic', label: 'Sinematik', subLabel: 'Gaya 1 • Rule of Thirds & Chiaroscuro', targetCTR: '>21.8%' },
    { id: 'split', label: 'Komposisi Terbelah', subLabel: 'Gaya 2 • Split-Frame & Contrast', targetCTR: '>20.9%' },
    { id: 'minimal', label: 'Tipografi Minimalis', subLabel: 'Gaya 3 • 70% Ruang Kosong Teks', targetCTR: '>22.5%' },
    { id: 'lifestyle', label: 'Gaya Hidup', subLabel: 'Gaya 4 • Organik & Relatable', targetCTR: '>22.1%' }
  ];

  const currentThumbDetail = resolvedThumbnails.details[activeThumbnailStyle] || resolvedThumbnails.details.cinematic;

  const activeSimulatorText = customSimulatorText || 
    (currentThumbDetail.recommendedText?.bestOption === 'OPSI 2' ? currentThumbDetail.recommendedText.option2 :
     currentThumbDetail.recommendedText?.bestOption === 'OPSI 3' ? currentThumbDetail.recommendedText.option3 :
     currentThumbDetail.recommendedText?.option1) || 
    pkg.thumbnailText.variant1;

  const platformLabelMap: Record<'google-flow' | 'chatgpt' | 'general', string> = {
    'google-flow': 'Google Flow',
    'chatgpt': 'ChatGPT',
    'general': 'Versi General'
  };

  const activePaletteData = useMemo(() => {
    if (colorPalette !== 'PAL-AUTO' && colorPalette !== 'PAL-CUSTOM' && COLOR_PALETTE_PRESETS[colorPalette]) {
      const p = COLOR_PALETTE_PRESETS[colorPalette];
      return {
        code: p.code,
        name: p.name,
        label: p.label,
        dominant: p.dominant,
        accent: p.accent,
        textZone: p.textZone
      };
    }
    if (colorPalette === 'PAL-CUSTOM' && customColors?.dominant) {
      return {
        code: 'PAL-CUSTOM',
        name: 'Kustom Hex',
        label: `Kustom [${customColors.dominant}]`,
        dominant: { name: `Dominan (${customColors.dominant})`, hex: customColors.dominant },
        accent: { name: `Aksen (${customColors.accent || '#E27230'})`, hex: customColors.accent || '#E27230' },
        textZone: { name: `Zona Teks (${customColors.textZone || '#0D0D15'})`, hex: customColors.textZone || '#0D0D15' }
      };
    }
    return {
      code: 'PAL-AUTO',
      name: currentThumbDetail.ctrPalette?.dominant?.name || 'Rekomendasi Otomatis',
      label: 'PAL-AUTO — Rekomendasi Otomatis',
      dominant: currentThumbDetail.ctrPalette?.dominant || { name: 'Deep Navy', hex: '#0A0A14' },
      accent: currentThumbDetail.ctrPalette?.accent || { name: 'Warm Amber', hex: '#C9A030' },
      textZone: {
        name: currentThumbDetail.ctrPalette?.textZone?.type || 'Deep Tone',
        hex: currentThumbDetail.ctrPalette?.textZone?.hex || '#0D1020'
      }
    };
  }, [colorPalette, customColors, currentThumbDetail]);

  const activeWarnings = useMemo(() => {
    const list: string[] = [];
    const compWarn = validateCompositionPosition(textPosition, activeThumbnailStyle, currentThumbDetail.styleName, pkg.categoryId);
    if (compWarn) list.push(compWarn);

    if (colorPalette !== 'PAL-AUTO') {
      const contWarn = validatePaletteContrast({
        dominant: activePaletteData.dominant.hex,
        accent: activePaletteData.accent.hex,
        textZone: activePaletteData.textZone.hex
      });
      if (contWarn) list.push(contWarn);
    }

    if (colorPalette === 'PAL-CUSTOM' && customColors?.dominant) {
      const toneWarn = validateCategoryColorTone(pkg.categoryId, pkg.categoryName, customColors.dominant);
      if (toneWarn) list.push(toneWarn);
    }
    return list;
  }, [textPosition, activeThumbnailStyle, currentThumbDetail.styleName, pkg.categoryId, pkg.categoryName, colorPalette, activePaletteData, customColors]);

  const activeThumbnailTextToDisplay = useMemo(() => {
    return generateComprehensiveThumbnailPlatformPrompt({
      platform: thumbPlatformTab,
      detail: currentThumbDetail,
      overlayText: activeSimulatorText,
      categoryName: pkg.categoryName,
      duration: pkg.duration,
      textPosition,
      colorPalette,
      customColors,
      appliedPrompt: currentThumbDetail.rawPrompt,
      activePalette: activePaletteData,
      warnings: activeWarnings
    });
  }, [thumbPlatformTab, currentThumbDetail, activeSimulatorText, pkg.categoryName, pkg.duration, textPosition, colorPalette, customColors, activePaletteData, activeWarnings]);

  const allThumbnailPromptsCombined = useMemo(() => {
    return thumbnailStyles
      .map(s => {
        const det = resolvedThumbnails.details[s.id];
        if (!det) return '';
        const p = generateComprehensiveThumbnailPlatformPrompt({
          platform: thumbPlatformTab,
          detail: det,
          overlayText: activeSimulatorText,
          categoryName: pkg.categoryName,
          duration: pkg.duration,
          textPosition,
          colorPalette,
          customColors,
          appliedPrompt: det.rawPrompt,
          activePalette: activePaletteData,
          warnings: activeWarnings
        });
        return `[GAYA: ${s.label.toUpperCase()} — TARGET CTR: ${s.targetCTR}]\n${p}`;
      })
      .join('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
  }, [thumbnailStyles, resolvedThumbnails, thumbPlatformTab, activeSimulatorText, pkg.categoryName, pkg.duration, textPosition, colorPalette, customColors, activePaletteData, activeWarnings]);

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

      {/* BLOK 4: Prompt Thumbnail YouTube CTR Tinggi (Pasar US Tier 1) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Header Blok 4 Ringkas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Blok 4: Prompt Thumbnail YouTube CTR Tinggi
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                CTR {currentThumbDetail.targetCTR}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSimulateRegenerate('Prompt Thumbnail')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              title="Perbarui Prompt Thumbnail"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${regeneratingBlock === 'Prompt Thumbnail' ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <CopyButton 
              textToCopy={allThumbnailPromptsCombined} 
              label="Salin Semua 4 Gaya" 
            />
          </div>
        </div>

        {/* SETELAN OVERRIDE: [POSISI TEKS] (7 Opsi) & [KOMBINASI WARNA] (10 Preset + Auto/Custom) */}
        <div className="p-2.5 bg-slate-50/90 rounded-xl border border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Dropdown Posisi Teks */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-600" />
                  Posisi:
                </span>
                <select
                  value={textPosition}
                  onChange={(e) => setTextPosition(e.target.value as TextPositionCode)}
                  className="text-xs font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  {Object.entries(TEXT_POSITION_OPTIONS).map(([code, opt]) => (
                    <option key={code} value={code}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown Palet Warna */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3 h-3 text-amber-600" />
                  Palet:
                </span>
                <select
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value as ColorPaletteCode)}
                  className="text-xs font-bold bg-white border border-slate-300 text-slate-900 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  <option value="PAL-AUTO">PAL-AUTO — Rekomendasi Otomatis</option>
                  {Object.entries(COLOR_PALETTE_PRESETS).map(([code, pal]) => (
                    <option key={code} value={code}>
                      {pal.label} ({pal.dominant.name} / {pal.accent.name})
                    </option>
                  ))}
                  <option value="PAL-CUSTOM">PAL-CUSTOM — Kustom Hex Sendiri</option>
                </select>
              </div>

              {/* Color Swatch Badge */}
              <div 
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-slate-200 shadow-2xs" 
                title={`Dominan: ${activePaletteData.dominant.hex}, Aksen: ${activePaletteData.accent.hex}, Zona Teks: ${activePaletteData.textZone.hex}`}
              >
                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: activePaletteData.dominant.hex }} />
                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: activePaletteData.accent.hex }} />
                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: activePaletteData.textZone.hex }} />
                <span className="text-[10px] font-mono font-bold text-slate-700 ml-1">{activePaletteData.code}</span>
              </div>
            </div>

            {/* Tombol Reset ke Rekomendasi Otomatis jika dioverride */}
            {(textPosition !== 'POS-AUTO' || colorPalette !== 'PAL-AUTO') && (
              <button
                type="button"
                onClick={() => {
                  setTextPosition('POS-AUTO');
                  setColorPalette('PAL-AUTO');
                }}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md cursor-pointer transition-colors self-start sm:self-auto flex items-center gap-1 shadow-2xs"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset ke Rekomendasi Otomatis
              </button>
            )}
          </div>

          {/* Form Input Custom Hex jika PAL-CUSTOM dipilih */}
          {colorPalette === 'PAL-CUSTOM' && (
            <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Hex Dominan (60%):</label>
                <input 
                  type="text"
                  value={customColors.dominant}
                  onChange={(e) => setCustomColors({ ...customColors, dominant: e.target.value })}
                  placeholder="#0A0A14"
                  className="w-full text-xs font-mono font-semibold px-2 py-1 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Hex Aksen (15%):</label>
                <input 
                  type="text"
                  value={customColors.accent || ''}
                  onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                  placeholder="#C9A030"
                  className="w-full text-xs font-mono font-semibold px-2 py-1 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Hex Zona Teks (25%):</label>
                <input 
                  type="text"
                  value={customColors.textZone || ''}
                  onChange={(e) => setCustomColors({ ...customColors, textZone: e.target.value })}
                  placeholder="#0D1020"
                  className="w-full text-xs font-mono font-semibold px-2 py-1 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Alert Box Validasi & Peringatan Kontras / Komposisi */}
          {activeWarnings.length > 0 && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-1 shadow-2xs">
              <div className="font-bold flex items-center gap-1.5 text-amber-800 text-[11px]">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Validasi Optimasi CTR TuneForge:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 font-medium">
                {activeWarnings.map((warn, idx) => (
                  <li key={idx} className="leading-snug">{warn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 1. Pemilih 4 Gaya Thumbnail (Padat & Ringkas) */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {thumbnailStyles.map((style) => {
              const isSelected = activeThumbnailStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    setActiveThumbnailStyle(style.id);
                    setCustomSimulatorText(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs truncate">
                      {style.label}
                    </span>
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
                    ) : (
                      <span className="text-[9px] font-bold text-slate-500 shrink-0 ml-1">
                        {style.targetCTR}
                      </span>
                    )}
                  </div>
                  <div className={`text-[10px] mt-0.5 truncate ${
                    isSelected ? 'text-amber-400 font-semibold' : 'text-slate-500'
                  }`}>
                    {isSelected ? `Target ${style.targetCTR}` : style.subLabel}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Grid Padat: Teks Overlay (Kiri) & Simulator 1/2 Bidang (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Sisi Kiri: 3 Kartu Teks Overlay yang Direkomendasikan (6-kolom) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-500" />
                Teks Overlay (Klik untuk Terapkan):
              </span>
            </div>

            <div className="space-y-1.5">
              {currentThumbDetail.recommendedText && [
                {
                  id: 'OPSI 1',
                  type: 'FOKUS',
                  text: currentThumbDetail.recommendedText.option1,
                  isBest: currentThumbDetail.recommendedText.bestOption === 'OPSI 1'
                },
                {
                  id: 'OPSI 2',
                  type: 'ATMOSFER',
                  text: currentThumbDetail.recommendedText.option2,
                  isBest: currentThumbDetail.recommendedText.bestOption === 'OPSI 2'
                },
                {
                  id: 'OPSI 3',
                  type: 'MANFAAT',
                  text: currentThumbDetail.recommendedText.option3,
                  isBest: currentThumbDetail.recommendedText.bestOption === 'OPSI 3'
                }
              ].map((opt) => {
                const isSelected = activeSimulatorText === opt.text;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setCustomSimulatorText(opt.text)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50/80 ring-2 ring-amber-400/80 shadow-2xs'
                        : opt.isBest
                          ? 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/60'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          opt.isBest ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {opt.id} ({opt.type})
                        </span>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-amber-800">
                            ✓ Aktif
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        "{opt.text}"
                      </div>
                    </div>
                    <CopyButton textToCopy={opt.text} label="Salin" variant="minimal" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sisi Kanan: Simulator 1/2 Bidang (Setengah Bidang Kompak, Posisi & Warna Sinkron) (6-kolom) */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                Preview Mobile (320×180px)
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Eye className="w-3 h-3 text-emerald-600" /> Lolos 0.3s ✓
              </span>
            </div>

            {/* Kartu Simulator Visual Setengah Bidang */}
            {(() => {
              // Posisi Zona Teks styling
              let alignClass = 'justify-start items-start pt-2';
              let widthClass = 'max-w-[85%] text-left pl-1';
              let zoneOverlay = 'bg-radial from-transparent via-transparent to-black/50 inset-0';
              let focalSide = 'bottom-3 right-14';

              if (textPosition === 'POS-A') {
                alignClass = 'justify-center items-start';
                widthClass = 'max-w-[50%] text-left pl-1';
                zoneOverlay = 'bg-gradient-to-r from-black/85 via-black/45 to-transparent w-1/2 inset-y-0 left-0';
                focalSide = 'right-6 top-1/2 -translate-y-1/2';
              } else if (textPosition === 'POS-B') {
                alignClass = 'justify-center items-end';
                widthClass = 'max-w-[50%] text-left pr-2';
                zoneOverlay = 'bg-gradient-to-l from-black/85 via-black/45 to-transparent w-1/2 inset-y-0 right-0';
                focalSide = 'left-6 top-1/2 -translate-y-1/2';
              } else if (textPosition === 'POS-C') {
                alignClass = 'justify-start items-start pt-1';
                widthClass = 'max-w-[88%] text-left pl-1';
                zoneOverlay = 'bg-gradient-to-b from-black/85 via-black/40 to-transparent h-2/5 inset-x-0 top-0';
                focalSide = 'bottom-4 left-1/2 -translate-x-1/2';
              } else if (textPosition === 'POS-D') {
                alignClass = 'justify-end items-start pb-6';
                widthClass = 'max-w-[65%] text-left pl-1';
                zoneOverlay = 'bg-gradient-to-t from-black/85 via-black/40 to-transparent h-2/5 inset-x-0 bottom-0';
                focalSide = 'top-3 left-1/2 -translate-x-1/2';
              } else if (textPosition === 'POS-E') {
                alignClass = 'justify-center items-start pl-3';
                widthClass = 'max-w-[52%] text-left';
                zoneOverlay = 'bg-gradient-to-r from-black/85 via-black/45 to-transparent w-3/5 inset-y-0 left-0';
                focalSide = 'right-6 top-1/2 -translate-y-1/2';
              } else if (textPosition === 'POS-F') {
                alignClass = 'justify-center items-center';
                widthClass = 'max-w-[85%] text-center';
                zoneOverlay = 'bg-black/60 inset-0';
                focalSide = 'hidden';
              }

              return (
                <div 
                  className="w-full aspect-video rounded-xl overflow-hidden relative border-2 border-slate-800 shadow-sm flex flex-col justify-between p-3 select-none transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${activePaletteData.dominant.hex} 0%, ${activePaletteData.textZone.hex} 55%, ${activePaletteData.dominant.hex} 100%)`
                  }}
                >
                  {/* Clean text zone overlay */}
                  <div className={`absolute pointer-events-none ${zoneOverlay}`} />

                  {/* Focal point glow representing balance */}
                  {focalSide !== 'hidden' && (
                    <div 
                      className={`absolute w-14 h-14 rounded-full blur-xl opacity-35 pointer-events-none ${focalSide}`}
                      style={{ backgroundColor: activePaletteData.accent.hex }}
                    />
                  )}

                  {/* Text Overlay Box with Dynamic Alignment */}
                  <div className={`relative z-10 w-full flex-1 flex flex-col ${alignClass}`}>
                    <div className={`space-y-1 ${widthClass}`}>
                      <div className="flex items-center gap-1">
                        <span 
                          className="inline-block px-1.5 py-0.5 rounded text-slate-950 text-[8px] font-black tracking-wider uppercase shadow-xs"
                          style={{ backgroundColor: activePaletteData.accent.hex }}
                        >
                          CTR 16:9
                        </span>
                        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-black/65 text-slate-200 border border-white/10">
                          {textPosition}
                        </span>
                      </div>
                      <h4 className="text-white font-black text-xs sm:text-sm leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] tracking-tight font-sans line-clamp-2">
                        {activeSimulatorText}
                      </h4>
                    </div>
                  </div>

                  {/* Footer Info: Style & Palette Name + Safe Timestamp Badge */}
                  <div className="flex items-end justify-between w-full z-10 pt-1">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono px-2 py-0.5 rounded bg-black/75 text-slate-200 backdrop-blur-xs border border-white/10 truncate max-w-[65%]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activePaletteData.accent.hex }} />
                      <span className="truncate">{currentThumbDetail.styleName}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-300 font-bold truncate">{activePaletteData.code}</span>
                    </div>
                    <div className="bg-black/95 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white/10">
                      {pkg.duration || '3:00:00'}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* 3. Format Tampilan: 3 Format Saja (Google Flow, ChatGPT, Versi General) & Prompt Box */}
        <div className="space-y-2.5 pt-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide mr-1">
                Format:
              </span>
              {[
                { id: 'google-flow', label: 'Google Flow' },
                { id: 'chatgpt', label: 'ChatGPT' },
                { id: 'general', label: 'Versi General' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setThumbPlatformTab(tab.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    thumbPlatformTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-xs ring-2 ring-amber-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tombol Copy Siap Pakai Langsung */}
            <div className="flex items-center gap-2">
              <CopyButton 
                textToCopy={activeThumbnailTextToDisplay} 
                label={`Salin Prompt ${platformLabelMap[thumbPlatformTab]}`}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              />
              <CopyButton 
                textToCopy={activeSimulatorText} 
                label="Salin Teks Saja" 
                variant="minimal"
              />
            </div>
          </div>

          {/* Kotak Prompt Aktif Lengkap (Fokus Pada Teks yang Siap di-Copy) */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1.5 border-b border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{platformLabelMap[thumbPlatformTab]}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300 truncate max-w-[160px]">{currentThumbDetail.styleName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 truncate max-w-[180px]">"{activeSimulatorText}"</span>
              </div>
              <span className="text-[10px] text-slate-400">
                16:9 • Siap Paste
              </span>
            </div>
            <pre className="text-xs font-mono text-slate-100 whitespace-pre-wrap leading-relaxed select-all max-h-56 overflow-y-auto pr-1">
              {activeThumbnailTextToDisplay}
            </pre>
          </div>
        </div>
      </section>

      {/* KONTROL VISUAL SINEMATIK: Pilihan Varian & Parameter Kreatif */}
      <section className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <h2 className="font-bold text-white text-base">
                Engine Visual Sinematik (18 Kategori Terkurasi)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pilih varian komposisi visual untuk channel musik Anda. Mendukung ekspor langsung ke Google Flow, Midjourney v6, Runway Gen-3, Kling AI, Luma &amp; Pika.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
            {(['Scene', 'Subjek', 'Abstrak'] as CinematicVariantType[]).map((vType) => {
              const isSelected = activeVisualVariant === vType;
              const vLabel = vType === 'Scene' ? 'Scene (Atmosfer)' : vType === 'Subjek' ? 'Subjek (Instrumen)' : 'Abstrak (Konsep)';
              return (
                <button
                  key={vType}
                  type="button"
                  onClick={() => setCinematicVariant(vType)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {vLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Parameter Kreatif & Creative Direction Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Audiens
            </span>
            <p className="text-slate-200 font-sans text-xs truncate" title={currentVariantData.parameters?.audience || pkg.categoryName}>
              {currentVariantData.parameters?.audience || pkg.categoryName}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> Lighting
            </span>
            <p className="text-slate-200 font-sans text-xs truncate" title={currentVariantData.parameters?.lighting || 'Cinematic lighting'}>
              {currentVariantData.parameters?.lighting || 'Cinematic lighting'}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Palette className="w-3 h-3 text-amber-400" /> Palet Warna
            </span>
            <p className="text-slate-200 font-sans text-xs truncate" title={currentVariantData.parameters?.colorPalette || 'Curated tone'}>
              {currentVariantData.parameters?.colorPalette || 'Curated tone'}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-amber-400" /> Mood Visual
            </span>
            <p className="text-slate-200 font-sans text-xs truncate" title={currentVariantData.parameters?.mood || 'Atmospheric'}>
              {currentVariantData.parameters?.mood || 'Atmospheric'}
            </p>
          </div>

          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Film className="w-3 h-3 text-amber-400" /> Style Ref
            </span>
            <p className="text-slate-200 font-sans text-xs truncate" title={currentVariantData.parameters?.styleReference || 'Cinematic'}>
              {currentVariantData.parameters?.styleReference || 'Cinematic'}
            </p>
          </div>
        </div>
      </section>

      {/* BLOK 5: Prompt Gambar AI — Google Flow (1 Gambar Terbaik) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Blok 5: Prompt Gambar AI — Google Flow (1 Gambar Terbaik)
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Varian Aktif: <strong className="text-slate-800 font-bold">{activeVisualVariant}</strong> ({currentVariantData.variantTitle || activeVisualVariant}) • Formula 8 Elemen Lengkap
              </span>
            </div>
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

        {/* Platform Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Platform Render:</span>
          {[
            { id: 'standard', label: 'Standard / Google Flow' },
            { id: 'midjourney', label: 'Midjourney v6 (--ar 16:9)' },
            { id: 'flux', label: 'Flux.1' },
            { id: 'imagen', label: 'Imagen 3' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setImagePlatform(p.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                imagePlatform === p.id
                  ? 'bg-amber-500/15 text-amber-900 font-bold border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 block font-mono">
              [PROMPT GAMBAR]
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              150–250 kata • Subjek + Lingkungan + Pencahayaan + Palet + Mood + Gaya + Kamera + Modifier Kualitas
            </span>
          </div>
          <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
            {singleImagePrompt}
          </pre>
        </div>
      </section>

      {/* BLOK 6: Prompt Video AI — Google Flow (Image-to-Video Loop) */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-amber-500" />
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Blok 6: Prompt Video AI — Google Flow (Image-to-Video Loop)
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Turunan dari Prompt Gambar • Kamera Tripod Statis • 80% Gerakan Mikro Lambat • Loop Mulus 10 Detik
              </span>
            </div>
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

        {/* Video Platform Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Platform Render:</span>
          {[
            { id: 'googleFlow', label: 'Google Flow AI (Standard)' },
            { id: 'runway', label: 'Runway Gen-3 Alpha' },
            { id: 'kling', label: 'Kling AI' },
            { id: 'luma', label: 'Luma Dream' },
            { id: 'pika', label: 'Pika 2.0' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setVideoPlatform(p.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                videoPlatform === p.id
                  ? 'bg-amber-500/15 text-amber-900 font-bold border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 block font-mono">
              [PROMPT VIDEO]
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              80–120 kata • Zero Pan/Tilt/Zoom • 80% Slow Motion • Continuous 10s Loop
            </span>
          </div>
          <pre className="text-xs font-mono text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
            {singleVideoPrompt}
          </pre>
        </div>

        {/* Universal Negative Prompt Card */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Universal Negative Prompt (Midjourney / Runway / Flux)
            </span>
            <CopyButton 
              textToCopy={UNIVERSAL_NEGATIVE_PROMPT} 
              label="Salin Negative Prompt" 
            />
          </div>
          <pre className="text-[11px] font-mono text-amber-950 whitespace-pre-wrap select-all leading-tight">
            {UNIVERSAL_NEGATIVE_PROMPT}
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

      {/* Navigasi Bawah (Statis "Forge Paket Baru" disembunyikan sesuai instruksi) */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <button
          onClick={() => navigate('/history')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Riwayat</span>
        </button>
      </div>

      {/* Floating Action Button (FAB): Forge Paket Baru */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40">
        <button
          onClick={() => navigate('/generate')}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xl hover:shadow-2xl border border-slate-700/60 cursor-pointer transition-all duration-200 group"
          title="Forge Paket Konten Baru"
        >
          <Wand2 className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">Forge Paket Baru</span>
        </button>
      </div>
    </div>
  );
};
