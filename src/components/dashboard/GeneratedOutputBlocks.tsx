import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Layers, 
  Palette, 
  RotateCcw,
  Volume2,
  FileDown,
  Info,
  Check
} from 'lucide-react';
import { TuneForgePackage } from '../../types';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../ui/CopyButton';
import { OutputArea } from '../ui/OutputArea';
import { 
  generateEngineeredThumbnailPrompts,
  generateComprehensiveThumbnailPlatformPrompt
} from '../../data/thumbnailPromptEngine';
import {
  validateCompositionPosition,
  validatePaletteContrast,
  validateCategoryColorTone,
  COLOR_PALETTE_PRESETS,
  type TextPositionCode,
  type ColorPaletteCode
} from '../../data/thumbnailSettingsEngine';
import { generateGoogleFlowPrompts } from '../../data/googleFlowEngine';
import { UNIVERSAL_NEGATIVE_PROMPT } from '../../data/cinematicPromptEngine';
import { getIntroHookTiers } from '../../data/introHookEngine';

interface GeneratedOutputBlocksProps {
  pkg: TuneForgePackage | null;
  onQuickSample?: () => void;
}

const VARIATION_COLORS = [
  {
    name: 'blue',
    borderColor: 'rgba(0, 122, 255, 0.45)',
    textColor: '#007AFF',
    badgeBg: 'rgba(0, 122, 255, 0.08)',
    badgeBorder: 'rgba(0, 122, 255, 0.25)',
    cardBg: 'rgba(0, 122, 255, 0.02)',
  },
  {
    name: 'amber',
    borderColor: 'rgba(217, 119, 6, 0.45)',
    textColor: '#D97706',
    badgeBg: 'rgba(217, 119, 6, 0.08)',
    badgeBorder: 'rgba(217, 119, 6, 0.25)',
    cardBg: 'rgba(217, 119, 6, 0.02)',
  },
  {
    name: 'emerald',
    borderColor: 'rgba(5, 150, 105, 0.45)',
    textColor: '#059669',
    badgeBg: 'rgba(5, 150, 105, 0.08)',
    badgeBorder: 'rgba(5, 150, 105, 0.25)',
    cardBg: 'rgba(5, 150, 105, 0.02)',
  },
  {
    name: 'purple',
    borderColor: 'rgba(124, 58, 237, 0.45)',
    textColor: '#7C3AED',
    badgeBg: 'rgba(124, 58, 237, 0.08)',
    badgeBorder: 'rgba(124, 58, 237, 0.25)',
    cardBg: 'rgba(124, 58, 237, 0.02)',
  },
];

const EmptyOutputBlock: React.FC<{ onQuickSample?: () => void }> = ({ onQuickSample }) => {
  return (
    <div 
      className="output-block has-content text-center py-12 px-6"
      style={{
        border: '1px dashed var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)'
      }}
    >
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-inset)] border border-[var(--border-subtle)] flex items-center justify-center mx-auto text-[var(--accent-blue)]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="output-block__title text-base font-semibold text-[var(--text-primary)]">
            Siap Men-generate Paket Konten
          </h3>
          <p className="output-text text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
            Atur kategori musik, sub-genre, dan suasana di panel kiri, lalu klik <strong>Generate</strong> untuk menghasilkan 7 blok paket aset YouTube lengkap secara instan.
          </p>
        </div>
        {onQuickSample && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onQuickSample}
              className="btn-secondary text-xs py-2 px-4 mx-auto"
            >
              Gunakan Sampel Cepat (Lo-Fi Study Beats)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const GeneratedOutputContent: React.FC<{ pkg: TuneForgePackage; onQuickSample?: () => void }> = ({ pkg, onQuickSample }) => {
  const { regenerateBlockInCurrentPackage } = useTuneForgeStore();

  const [regeneratingBlock, setRegeneratingBlock] = useState<string | null>(null);

  // Blok 4 Thumbnail states
  const [activeThumbnailStyle, setActiveThumbnailStyle] = useState<'cinematic' | 'split' | 'minimal' | 'lifestyle'>('cinematic');
  const [thumbPlatformTab, setThumbPlatformTab] = useState<'google-flow' | 'chatgpt' | 'general'>('google-flow');
  const [textPosition, setTextPosition] = useState<TextPositionCode>('POS-AUTO');
  const [colorPalette, setColorPalette] = useState<ColorPaletteCode>('PAL-AUTO');
  const [customColors, setCustomColors] = useState<{ dominant: string; accent?: string; textZone?: string }>({
    dominant: '#0A0A14',
    accent: '#C9A030',
    textZone: '#0D1020'
  });
  const [customSimulatorText, setCustomSimulatorText] = useState<string | null>(null);

  // Blok 5 & 6 Platform selectors
  const [imagePlatform, setImagePlatform] = useState<'google-flow' | 'midjourney' | 'flux' | 'imagen'>('google-flow');
  const [videoPlatform, setVideoPlatform] = useState<'google-flow' | 'runway' | 'kling' | 'luma' | 'pika'>('google-flow');
  const [activeVisualVariant, setActiveVisualVariant] = useState<'scene' | 'subject' | 'abstract'>('scene');

  // Hook 3 Tingkat
  const introHookTiers = useMemo(() => {
    return getIntroHookTiers(pkg);
  }, [pkg]);

  // Visual Variants Data
  const visualVariants = useMemo(() => {
    const bundle = pkg.cinematicVisualBundle;
    if (bundle && bundle.variants) {
      return [
        {
          variantType: 'scene' as const,
          variantTitle: bundle.variants.Scene?.variantTitle || 'Fokus Lanskap / Ruang Arsitektural',
          imagePrompt: bundle.variants.Scene?.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
          videoPrompt: bundle.variants.Scene?.videoPrompt || pkg.videoPrompt || '',
          parameters: bundle.variants.Scene?.parameters || { audience: pkg.categoryName, lighting: 'Ambient', colorPalette: 'Curated', styleReference: 'Cinematic' },
          platforms: bundle.variants.Scene?.platforms || {
            image: { standard: '', midjourney: '', flux: '', imagen: '' },
            video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
          }
        },
        {
          variantType: 'subject' as const,
          variantTitle: bundle.variants.Subjek?.variantTitle || 'Fokus Karakter / Objek Utama',
          imagePrompt: bundle.variants.Subjek?.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[1]) || (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
          videoPrompt: bundle.variants.Subjek?.videoPrompt || pkg.videoPrompt || '',
          parameters: bundle.variants.Subjek?.parameters || { audience: pkg.categoryName, lighting: 'Chiaroscuro', colorPalette: 'Curated', styleReference: 'Cinematic' },
          platforms: bundle.variants.Subjek?.platforms || {
            image: { standard: '', midjourney: '', flux: '', imagen: '' },
            video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
          }
        },
        {
          variantType: 'abstract' as const,
          variantTitle: bundle.variants.Abstrak?.variantTitle || 'Fokus Minimalis / Visual Abstrak',
          imagePrompt: bundle.variants.Abstrak?.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[2]) || (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
          videoPrompt: bundle.variants.Abstrak?.videoPrompt || pkg.videoPrompt || '',
          parameters: bundle.variants.Abstrak?.parameters || { audience: pkg.categoryName, lighting: 'Soft diffused', colorPalette: 'Curated', styleReference: 'Cinematic' },
          platforms: bundle.variants.Abstrak?.platforms || {
            image: { standard: '', midjourney: '', flux: '', imagen: '' },
            video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
          }
        }
      ];
    }
    return [
      {
        variantType: 'scene' as const,
        variantTitle: 'Fokus Lanskap / Ruang Arsitektural',
        imagePrompt: (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
        videoPrompt: pkg.videoPrompt || '',
        parameters: { audience: pkg.categoryName, lighting: 'Ambient', colorPalette: 'Curated', styleReference: 'Cinematic' },
        platforms: {
          image: { standard: '', midjourney: '', flux: '', imagen: '' },
          video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
        }
      },
      {
        variantType: 'subject' as const,
        variantTitle: 'Fokus Karakter / Objek Utama',
        imagePrompt: (pkg.imagePrompts && pkg.imagePrompts[1]) || (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
        videoPrompt: pkg.videoPrompt || '',
        parameters: { audience: pkg.categoryName, lighting: 'Chiaroscuro', colorPalette: 'Curated', styleReference: 'Cinematic' },
        platforms: {
          image: { standard: '', midjourney: '', flux: '', imagen: '' },
          video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
        }
      },
      {
        variantType: 'abstract' as const,
        variantTitle: 'Fokus Minimalis / Visual Abstrak',
        imagePrompt: (pkg.imagePrompts && pkg.imagePrompts[2]) || (pkg.imagePrompts && pkg.imagePrompts[0]) || '',
        videoPrompt: pkg.videoPrompt || '',
        parameters: { audience: pkg.categoryName, lighting: 'Soft diffused', colorPalette: 'Curated', styleReference: 'Cinematic' },
        platforms: {
          image: { standard: '', midjourney: '', flux: '', imagen: '' },
          video: { googleFlow: '', runwayMl: '', klingAi: '', lumaDreamMachine: '', pikaLabs: '' }
        }
      }
    ];
  }, [pkg]);

  const currentVariantData = useMemo(() => {
    return visualVariants.find(v => v.variantType === activeVisualVariant) || visualVariants[0];
  }, [visualVariants, activeVisualVariant]);

  // 3 Varian Judul SEO
  const resolvedVariants = useMemo(() => {
    if (pkg.metadata.titleVariants && pkg.metadata.titleVariants.length >= 3) {
      return pkg.metadata.titleVariants;
    }
    const fallbackList = [
      { formulaId: 'F1', title: pkg.metadata.titleA },
      { formulaId: 'F2', title: pkg.metadata.titleB },
      { formulaId: 'F3', title: `${pkg.categoryName} - ${pkg.subGenre} for ${pkg.useCase || 'Focus'}` }
    ];
    const labels = ['Rekomendasi Utama', 'Alternatif 1', 'Alternatif 2'];
    return fallbackList.map((v, i) => ({
      ...v,
      variantLabel: labels[i],
      isPrimaryRecommendation: i === 0
    }));
  }, [pkg]);

  // Prompt Thumbnail
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

  const singleImagePrompt = useMemo(() => {
    const imgPlat = currentVariantData.platforms?.image;
    if (imagePlatform === 'google-flow') {
      return (imgPlat as any)?.googleFlow || currentVariantData.imagePrompt || resolvedGoogleFlow.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[0]) || '';
    }
    if (imagePlatform === 'midjourney') return imgPlat?.midjourney || currentVariantData.imagePrompt;
    if (imagePlatform === 'flux') return imgPlat?.flux || currentVariantData.imagePrompt;
    if (imagePlatform === 'imagen') return imgPlat?.imagen || currentVariantData.imagePrompt;
    return currentVariantData.imagePrompt || (pkg.imagePrompts && pkg.imagePrompts[0]) || resolvedGoogleFlow.imagePrompt;
  }, [imagePlatform, currentVariantData, pkg, resolvedGoogleFlow]);

  const singleVideoPrompt = useMemo(() => {
    const vidPlat = currentVariantData.platforms?.video;
    if (videoPlatform === 'runway') return vidPlat?.runwayMl || currentVariantData.videoPrompt;
    if (videoPlatform === 'kling') return vidPlat?.klingAi || currentVariantData.videoPrompt;
    if (videoPlatform === 'luma') return vidPlat?.lumaDreamMachine || currentVariantData.videoPrompt;
    if (videoPlatform === 'pika') return vidPlat?.pikaLabs || currentVariantData.videoPrompt;
    return currentVariantData.videoPrompt || pkg.videoPrompt || resolvedGoogleFlow.videoPrompt;
  }, [videoPlatform, currentVariantData, pkg, resolvedGoogleFlow]);

  const combinedGoogleFlowText = `[PROMPT GAMBAR]\n${singleImagePrompt}\n\n[PROMPT VIDEO]\n${singleVideoPrompt}`;

  const thumbnailStyles: Array<{ 
    id: 'cinematic' | 'split' | 'minimal' | 'lifestyle'; 
    label: string;
    subLabel: string;
    targetCTR: string;
  }> = [
    { id: 'cinematic', label: 'Sinematik', subLabel: 'Rule of Thirds & Chiaroscuro', targetCTR: '>21.8%' },
    { id: 'split', label: 'Komposisi Terbelah', subLabel: 'Split-Frame & Kontras', targetCTR: '>20.9%' },
    { id: 'minimal', label: 'Tipografi Minimalis', subLabel: 'Ruang Kosong Teks', targetCTR: '>22.5%' },
    { id: 'lifestyle', label: 'Gaya Hidup', subLabel: 'Organik & Relatable', targetCTR: '>22.1%' }
  ];

  const currentThumbDetail = resolvedThumbnails.details[activeThumbnailStyle] || resolvedThumbnails.details.cinematic;

  const activeSimulatorText = customSimulatorText || 
    (currentThumbDetail.recommendedText?.bestOption === 'OPSI 2' ? currentThumbDetail.recommendedText.option2 :
     currentThumbDetail.recommendedText?.bestOption === 'OPSI 3' ? currentThumbDetail.recommendedText.option3 :
     currentThumbDetail.recommendedText?.option1) || 
    pkg.thumbnailText.variant1;

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

  const promptAToDisplay = useMemo(() => {
    return generateComprehensiveThumbnailPlatformPrompt({
      platform: thumbPlatformTab,
      version: 'A',
      detail: currentThumbDetail,
      overlayText: activeSimulatorText,
      categoryName: pkg.categoryName,
      duration: pkg.duration,
      textPosition,
      colorPalette,
      customColors,
      appliedPrompt: currentThumbDetail.promptA || currentThumbDetail.rawPrompt,
      activePalette: activePaletteData,
      warnings: activeWarnings
    });
  }, [thumbPlatformTab, currentThumbDetail, activeSimulatorText, pkg.categoryName, pkg.duration, textPosition, colorPalette, customColors, activePaletteData, activeWarnings]);

  const promptBToDisplay = useMemo(() => {
    return generateComprehensiveThumbnailPlatformPrompt({
      platform: thumbPlatformTab,
      version: 'B',
      detail: currentThumbDetail,
      overlayText: activeSimulatorText,
      categoryName: pkg.categoryName,
      duration: pkg.duration,
      textPosition,
      colorPalette,
      customColors,
      appliedPrompt: currentThumbDetail.promptB,
      activePalette: activePaletteData,
      warnings: activeWarnings
    });
  }, [thumbPlatformTab, currentThumbDetail, activeSimulatorText, pkg.categoryName, pkg.duration, textPosition, colorPalette, customColors, activePaletteData, activeWarnings]);

  const handleRegenerate = async (blockName: string) => {
    setRegeneratingBlock(blockName);
    try {
      await regenerateBlockInCurrentPackage(blockName);
    } finally {
      setRegeneratingBlock(null);
    }
  };

  const getMarkdownAll = () => {
    const titleLines = resolvedVariants
      .map((v) => `- **${v.variantLabel || 'Varian'}:** ${v.title}`)
      .join('\n');

    return `# ${pkg.metadata.titleA}

**Kategori:** ${pkg.categoryName} (${pkg.subGenre})
**Suasana:** ${pkg.moods.join(', ')}
${pkg.duration ? `**Durasi:** ${pkg.duration}\n` : ''}${pkg.useCase ? `**Aktivitas:** ${pkg.useCase}\n` : ''}

---

## 1. Metadata YouTube
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

## 2. Teks Thumbnail CTR
1. ${pkg.thumbnailText.variant1}
2. ${pkg.thumbnailText.variant2}
3. ${pkg.thumbnailText.variant3}

---

## 3. Intro Hook Video (0–10 Detik)
1. **Hook:** ${introHookTiers.hook}
2. **Sub-judul:** ${introHookTiers.subtitle}
3. **Call to Action:** ${introHookTiers.cta}

---

## 4. Prompt Thumbnail YouTube
### Full Frame
\`\`\`
${promptBToDisplay}
\`\`\`

### Teks Overlay
\`\`\`
${promptAToDisplay}
\`\`\`

---

## 5. Prompt Gambar AI
\`\`\`
${singleImagePrompt}
\`\`\`

---

## 6. Prompt Video AI
\`\`\`
${singleVideoPrompt}
\`\`\`

---

## 7. Universal Negative Prompt
\`\`\`
${UNIVERSAL_NEGATIVE_PROMPT}
\`\`\`
`;
  };

  return (
    <>
      {/* Header Info Paket Konten */}
      <div
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
        }}
        className="space-y-2.5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="macos-badge macos-badge-accent">
              {pkg.categoryName}
            </span>
            <span className="macos-badge">
              {pkg.subGenre}
            </span>
            {pkg.duration && (
              <span className="macos-badge">
                {pkg.duration}
              </span>
            )}
            {pkg.useCase && (
              <span className="macos-badge">
                {pkg.useCase}
              </span>
            )}
          </div>

          <CopyButton
            textToCopy={getMarkdownAll()}
            label="Salin Format Markdown"
            className="text-xs py-1.5 px-3"
          />
        </div>

        <h1 className="output-block__title text-base sm:text-lg font-semibold text-[var(--text-primary)]">
          {pkg.metadata.titleA}
        </h1>
      </div>

      {/* OUTPUT BLOK 1: Metadata YouTube */}
      <div className="output-block has-content" id="output-1">
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">1. METADATA YOUTUBE</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              Judul rekomendasi CTR, deskripsi SEO terstruktur, dan tag koma.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleRegenerate('metadata')}
              disabled={Boolean(regeneratingBlock)}
              className="btn-secondary text-xs py-1 px-2.5"
              title="Regenerate Metadata"
            >
              <RotateCcw className={`w-3 h-3 ${regeneratingBlock === 'metadata' ? 'animate-spin' : ''}`} />
              <span>{regeneratingBlock === 'metadata' ? 'Memproses...' : 'Ulangi'}</span>
            </button>
            <CopyButton
              textToCopy={`JUDUL:\n${pkg.metadata.titleA}\n\nDESKRIPSI:\n${pkg.metadata.description}\n\nTAGS:\n${pkg.metadata.tags.join(', ')}`}
              label="Salin Metadata"
            />
          </div>
        </div>

        {/* 3 Varian Judul SEO — SISTEM WARNA VARIASI SIKLIKAL */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-[var(--text-secondary)]">
            Varian Judul SEO (Formula CTR):
          </div>
          <div className="space-y-2">
            {resolvedVariants.map((v, i) => {
              const vIdx = i % 4;
              return (
                <div
                  key={i}
                  className={`var-card-${vIdx} flex items-center justify-between gap-3 min-h-[46px] transition-colors rounded-[10px] p-2.5 sm:px-3.5`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={`var-badge-${vIdx} macos-badge font-bold shrink-0 border px-2 py-0.5 rounded-[6px]`}
                    >
                      {v.variantLabel || `Opsi ${i + 1}`}
                    </span>
                    <span className="output-text text-xs sm:text-sm truncate font-medium text-slate-900">
                      {v.title}
                    </span>
                  </div>
                  <CopyButton textToCopy={v.title} label="Salin" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Deskripsi Video */}
        <OutputArea
          label="Deskripsi Video YouTube"
          content={pkg.metadata.description}
          copyLabel="Salin Deskripsi"
        />

        {/* Tag YouTube */}
        <OutputArea
          label="Tag YouTube (Format Koma)"
          content={pkg.metadata.tags.join(', ')}
          copyLabel="Salin Tag"
        />
      </div>

      {/* OUTPUT BLOK 2: Teks Thumbnail CTR > 20% */}
      <div className="output-block has-content" id="output-2">
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">2. TEKS THUMBNAIL CTR &gt; 20%</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              3 formula teks visual pendek (1–3 kata) untuk menarik perhatian klik instan.
            </p>
          </div>
          <CopyButton
            textToCopy={`1. ${pkg.thumbnailText.variant1}\n2. ${pkg.thumbnailText.variant2}\n3. ${pkg.thumbnailText.variant3}`}
            label="Salin Semua Teks"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            { label: 'Opsi 1 (Fokus Emosi)', text: pkg.thumbnailText.variant1 },
            { label: 'Opsi 2 (Manfaat/Kondisi)', text: pkg.thumbnailText.variant2 },
            { label: 'Opsi 3 (Minimalis)', text: pkg.thumbnailText.variant3 }
          ].map((item, idx) => {
            const vIdx = idx % 4;
            return (
              <div
                key={idx}
                className={`var-card-${vIdx} flex flex-col justify-between gap-2.5 min-h-[72px] rounded-[10px] p-3 sm:px-3.5`}
              >
                <div className="flex items-center justify-between">
                  <span 
                    className={`text-[11px] font-bold font-mono tracking-wide uppercase var-${vIdx} var-accent`}
                  >
                    {item.label}
                  </span>
                  <CopyButton textToCopy={item.text} label="Salin" />
                </div>
                <div className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                  "{item.text}"
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OUTPUT BLOK 3: Intro Hook Video (0–10 Detik) */}
      <div className="output-block has-content" id="output-3">
        {/* OUTPUT BLOK 3: Intro Hook Video (0-10s) — POIN 5 */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">3. INTRO HOOK VIDEO (0–10 DETIK)</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              Struktur naskah pembuka audio-visual untuk mengunci retensi pemirsa.
            </p>
          </div>
          <CopyButton
            textToCopy={`1. HOOK (0-3s): ${introHookTiers.hook}\n2. SUB-JUDUL (3-7s): ${introHookTiers.subtitle}\n3. CALL TO ACTION (7-10s): ${introHookTiers.cta}`}
            label="Salin Naskah"
          />
        </div>

        {/* POIN 5: Keterangan level adalah teks biasa tanpa kotak, teks siap copy dalam kotak agak tinggi bersudut rounded dengan warna pembeda */}
        <div className="space-y-4 pt-1">
          {[
            { level: '1', title: 'Tingkat 1: Hook (0–3 Detik)', text: introHookTiers.hook },
            { level: '2', title: 'Tingkat 2: Sub-judul (3–7 Detik)', text: introHookTiers.subtitle },
            { level: '3', title: 'Tingkat 3: Call to Action (7–10 Detik)', text: introHookTiers.cta },
          ].map((tier, idx) => {
            const vIdx = idx % 4;
            return (
              <div key={tier.level} className="space-y-1.5">
                {/* Keterangan: Teks biasa, TANPA kotak */}
                <div className="flex items-center justify-between px-0.5">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider var-${vIdx} var-accent`}
                  >
                    {tier.title}
                  </span>
                </div>

                {/* Teks siap copy: Kotak agak tinggi, sudut rounded 10px, padding vertikal nyaman, dengan warna pembeda */}
                <div
                  className={`var-card-${vIdx} flex items-center justify-between gap-3 min-h-[50px] transition-colors rounded-[10px] p-3 sm:px-3.5`}
                >
                  <p className="output-text text-xs sm:text-sm font-medium m-0 flex-1 leading-relaxed text-slate-800">
                    "{tier.text}"
                  </p>
                  <CopyButton textToCopy={tier.text} label="Salin" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OUTPUT BLOK 4: Prompt Thumbnail YouTube (Dual Prompt) */}
      <div className="output-block has-content" id="output-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">4. PROMPT THUMBNAIL YOUTUBE</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              Formula visual CTR tinggi dengan sistem Dual Prompt (Prompt A &amp; Prompt B).
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={`[PROMPT A]\n${promptAToDisplay}\n\n[PROMPT B]\n${promptBToDisplay}`}
              label="Salin Prompt A + B"
            />
          </div>
        </div>

        {/* Format Platform & Kontrol Komposisi (POIN 6 — Variasi Platform Kotak Agak Tinggi Rounded dengan Warna Pembeda) */}
        <div
          style={{
            backgroundColor: 'var(--bg-inset)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '12px 14px',
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Format Platform Selector — POIN 6 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1">
                Platform:
              </span>
              {(['google-flow', 'chatgpt', 'general'] as const).map((p, idx) => {
                const isSelected = thumbPlatformTab === p;
                const labels = {
                  'google-flow': 'Google Flow',
                  'chatgpt': 'ChatGPT',
                  'general': 'Umum'
                };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setThumbPlatformTab(p)}
                    className={`btn-variation var-${idx % 4} ${isSelected ? 'is-selected' : ''}`}
                  >
                    <span>{labels[p]}</span>
                  </button>
                );
              })}
            </div>

            {/* Posisi Teks & Palet */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Posisi:</span>
                <select
                  value={textPosition}
                  onChange={(e) => setTextPosition(e.target.value as TextPositionCode)}
                  className="macos-input py-1 px-2 text-xs"
                >
                  <option value="POS-AUTO">Otomatis</option>
                  <option value="POS-LEFT-THIRD">Kiri (Rule of Thirds)</option>
                  <option value="POS-RIGHT-THIRD">Kanan</option>
                  <option value="POS-BOTTOM-BAR">Bawah</option>
                  <option value="POS-TOP-BANNER">Atas</option>
                  <option value="POS-CENTER-SPLIT">Pusat Terbelah</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs text-[var(--text-secondary)]">Palet:</span>
                <select
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value as ColorPaletteCode)}
                  className="macos-input py-1 px-2 text-xs"
                >
                  <option value="PAL-AUTO">Otomatis</option>
                  {Object.entries(COLOR_PALETTE_PRESETS).map(([code, pal]) => (
                    <option key={code} value={code}>
                      {pal.name}
                    </option>
                  ))}
                  <option value="PAL-CUSTOM">Kustom Hex</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Hex Inputs if selected */}
          {colorPalette === 'PAL-CUSTOM' && (
            <div className="pt-2 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-[var(--text-secondary)] block mb-0.5">Hex Dominan</label>
                <input 
                  type="text"
                  value={customColors.dominant}
                  onChange={(e) => setCustomColors({ ...customColors, dominant: e.target.value })}
                  className="macos-input py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-secondary)] block mb-0.5">Hex Aksen</label>
                <input 
                  type="text"
                  value={customColors.accent || ''}
                  onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                  className="macos-input py-1 text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-[var(--text-secondary)] block mb-0.5">Hex Zona Teks</label>
                <input 
                  type="text"
                  value={customColors.textZone || ''}
                  onChange={(e) => setCustomColors({ ...customColors, textZone: e.target.value })}
                  className="macos-input py-1 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* Peringatan Kontras / Komposisi */}
          {activeWarnings.length > 0 && (
            <div
              style={{
                backgroundColor: 'rgba(255, 149, 0, 0.08)',
                borderColor: 'rgba(255, 149, 0, 0.3)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 10px',
              }}
              className="border text-xs text-[var(--accent-orange)] space-y-0.5"
            >
              {activeWarnings.map((warn, idx) => (
                <p key={idx} className="m-0 leading-tight">• {warn}</p>
              ))}
            </div>
          )}
        </div>

        {/* 4 Gaya Thumbnail Selector — Format Kotak Agak Tinggi Rounded dengan Warna Pembeda */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {thumbnailStyles.map((style, idx) => {
            const isSelected = activeThumbnailStyle === style.id;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setActiveThumbnailStyle(style.id);
                  setCustomSimulatorText(null);
                }}
                className={`btn-variation var-${idx % 4} ${isSelected ? 'is-selected' : ''} min-h-[48px] px-3 py-2.5 flex items-center justify-between text-left`}
              >
                <div className="flex flex-col">
                  <span className="text-[10px] var-accent font-mono font-bold">
                    {style.targetCTR}
                  </span>
                  <span className="text-xs font-semibold mt-0.5 truncate">
                    {style.label}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 var-accent shrink-0 ml-1 font-bold" />
                )}
              </button>
            );
          })}
        </div>

        {/* DUAL PROMPT WRAPPER: Full Frame (kiri/default) dan Teks Overlay (kanan) */}
        <div className="dual-prompt-wrapper">
          {/* OPSI KIRI (DEFAULT): Full Frame */}
          <div className="flex-1 min-w-0">
            <OutputArea
              label="Full Frame"
              content={promptBToDisplay}
              copyLabel="Salin Full Frame"
            />
          </div>

          {/* OPSI KANAN: Teks Overlay */}
          <div className="flex-1 min-w-0">
            <OutputArea
              label="Teks Overlay"
              content={promptAToDisplay}
              copyLabel="Salin Teks Overlay"
            />
          </div>
        </div>
      </div>

      {/* OUTPUT BLOK 5: Prompt Gambar AI */}
      <div className="output-block has-content" id="output-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">5. PROMPT GAMBAR AI</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              Formula visual sinematik 16:9 untuk background YouTube beresolusi tinggi.
            </p>
          </div>
          <CopyButton
            textToCopy={singleImagePrompt}
            label="Salin Prompt Gambar"
          />
        </div>

        {/* Variasi Visual & Platform (POIN 7 — Fokus dan Generator Format Kotak Agak Tinggi Rounded dengan Warna Pembeda) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-[var(--bg-inset)] rounded-[10px] border border-[var(--border-subtle)]">
          {/* Fokus Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1">
              Fokus:
            </span>
            {(['scene', 'subject', 'abstract'] as const).map((v, idx) => {
              const isSelected = activeVisualVariant === v;
              const labels = { scene: 'Lanskap', subject: 'Karakter', abstract: 'Minimalis' };
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => setActiveVisualVariant(v)}
                  className={`btn-variation var-${idx % 4} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span>{labels[v]}</span>
                </button>
              );
            })}
          </div>

          {/* Generator Selector — Google Flow sebagai pilihan default (posisi paling kiri) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1">
              Generator:
            </span>
            {(['google-flow', 'midjourney', 'flux', 'imagen'] as const).map((p, idx) => {
              const isSelected = imagePlatform === p;
              const labels = { 'google-flow': 'Google Flow', midjourney: 'Midjourney', flux: 'Flux.1', imagen: 'Imagen 3' };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setImagePlatform(p)}
                  className={`btn-variation var-${idx % 4} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span>{labels[p]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <OutputArea
          label={`Prompt Gambar (${imagePlatform === 'google-flow' ? 'GOOGLE FLOW' : imagePlatform.toUpperCase()})`}
          content={singleImagePrompt}
          copyLabel="Salin"
        />
      </div>

      {/* OUTPUT BLOK 6: Prompt Video AI (Image-to-Video Loop) */}
      <div className="output-block has-content" id="output-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="output-block__title uppercase font-bold">6. PROMPT VIDEO AI LOOP (LOCKED TRIPOD)</h2>
            <p className="output-text text-xs text-[var(--text-secondary)] mt-0.5">
              Instruksi kamera terkunci statis dan mikro-gerak seamless loop 10 detik.
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <CopyButton
              textToCopy={combinedGoogleFlowText}
              label="Salin Gambar + Video"
            />
            <CopyButton
              textToCopy={singleVideoPrompt}
              label="Salin Video"
            />
          </div>
        </div>

        {/* Video Platform Switcher — POIN 8: Variasi Platform Video Kotak Agak Tinggi Rounded dengan Warna Pembeda */}
        <div className="p-3 bg-[var(--bg-inset)] rounded-[10px] border border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide mr-1">
              Platform Video:
            </span>
            {(['google-flow', 'runway', 'kling', 'luma', 'pika'] as const).map((p, idx) => {
              const isSelected = videoPlatform === p;
              const labels = {
                'google-flow': 'Google Flow',
                'runway': 'Runway Gen-3',
                'kling': 'Kling AI',
                'luma': 'Luma Dream Machine',
                'pika': 'Pika Labs'
              };
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setVideoPlatform(p)}
                  className={`btn-variation var-${idx % 4} ${isSelected ? 'is-selected' : ''}`}
                >
                  <span>{labels[p]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <OutputArea
          label={`Prompt Video Loop (${videoPlatform.toUpperCase()})`}
          content={singleVideoPrompt}
          copyLabel="Salin Prompt Video"
        />

        <OutputArea
          label="Universal Negative Prompt (Semua Generator AI)"
          content={UNIVERSAL_NEGATIVE_PROMPT}
          copyLabel="Salin Negative Prompt"
        />
      </div>

      {/* OUTPUT BLOK 7: Catatan Teknis & Audio Mastering (Disembunyikan dengan display: none) */}
      <div className="output-block has-content" id="output-7" style={{ display: 'none' }}>
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[var(--accent-blue)]" />
            <h2 className="output-block__title uppercase font-bold">7. CATATAN TEKNIS &amp; AUDIO MASTERING</h2>
          </div>
          <span className="macos-badge macos-badge-accent text-[10px]">
            YouTube Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="var-card-0 rounded-[10px] p-3 space-y-1">
            <div className="text-[11px] font-bold var-0 var-accent uppercase">Standar Loudness</div>
            <div className="text-sm font-bold text-[#007AFF] font-mono">-14 LUFS (±1)</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Integrated loudness optimal untuk codec YouTube tanpa attenuasi paksa.</div>
          </div>

          <div className="var-card-1 rounded-[10px] p-3 space-y-1">
            <div className="text-[11px] font-bold var-1 var-accent uppercase">True Peak Ceiling</div>
            <div className="text-sm font-bold text-[#7C3AED] font-mono">-1.0 dBFS Max</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Mencegah inter-sample clipping saat encoding YouTube Opus/AAC.</div>
          </div>

          <div className="var-card-2 rounded-[10px] p-3 space-y-1">
            <div className="text-[11px] font-bold var-2 var-accent uppercase">Resolusi Master</div>
            <div className="text-sm font-bold text-[#0D9488] font-mono">48 kHz / 24-bit WAV</div>
            <div className="text-[10px] text-[var(--text-secondary)]">Sinkronisasi audio video 100% akurat tanpa resampling drift.</div>
          </div>
        </div>
      </div>

      {/* BLOK QUOTE (Posisi Paling Bawah Halaman) */}
      <div 
        id="output-quote"
        className="w-full py-5 px-3 flex flex-col items-center justify-center text-center space-y-2.5 my-2"
      >
        {/* 1. Teks Arab */}
        <div 
          className="text-2xl sm:text-3xl md:text-4xl text-[var(--text-primary)] leading-[2] tracking-wide font-normal"
          style={{ 
            fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', serif",
            direction: 'rtl'
          }}
        >
          وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ
        </div>

        {/* 2. Terjemahan dengan Efek Stabilo / Fluorescent */}
        <p className="text-sm sm:text-base text-[var(--text-primary)] max-w-xl mx-auto leading-relaxed">
          <span 
            className="inline px-2 py-0.5 rounded-[3px] font-medium"
            style={{ 
              backgroundColor: 'rgba(250, 204, 21, 0.38)',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone'
            }}
          >
            &ldquo;Dan bahwa manusia hanya memperoleh apa yang telah diusahakannya.&rdquo;
          </span>
        </p>

        {/* 3. Sumber */}
        <p className="text-xs text-[var(--text-secondary)] font-mono opacity-85">
          (QS. An-Najm: 39)
        </p>
      </div>
    </>
  );
};

export const GeneratedOutputBlocks: React.FC<GeneratedOutputBlocksProps> = ({ pkg, onQuickSample }) => {
  if (!pkg) {
    return <EmptyOutputBlock onQuickSample={onQuickSample} />;
  }
  return <GeneratedOutputContent key={pkg.id} pkg={pkg} onQuickSample={onQuickSample} />;
};
