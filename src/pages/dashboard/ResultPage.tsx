import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Layers, 
  Sliders, 
  Eye, 
  Palette, 
  AlertTriangle,
  RotateCcw,
  FileDown
} from 'lucide-react';
import { useTuneForgeStore } from '../../store/useTuneForgeStore';
import { CopyButton } from '../../components/ui/CopyButton';
import { OutputArea } from '../../components/ui/OutputArea';
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
import { 
  generateGoogleFlowPrompts 
} from '../../data/googleFlowEngine';
import { UNIVERSAL_NEGATIVE_PROMPT } from '../../data/cinematicPromptEngine';
import { getIntroHookTiers } from '../../data/introHookEngine';

interface ResultPageProps {
  packageId?: string;
}

export const ResultPage: React.FC<ResultPageProps> = ({ packageId }) => {
  const { 
    currentPackage, 
    packages, 
    navigate,
    regenerateBlockInCurrentPackage
  } = useTuneForgeStore();

  const [regeneratingBlock, setRegeneratingBlock] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States Blok 4: Thumbnail
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

  // States Blok 5 & 6: Platform selectors
  const [imagePlatform, setImagePlatform] = useState<'standard' | 'midjourney' | 'flux' | 'imagen'>('standard');
  const [videoPlatform, setVideoPlatform] = useState<'google-flow' | 'runway' | 'kling' | 'luma' | 'pika'>('google-flow');
  const [activeVisualVariant, setActiveVisualVariant] = useState<'scene' | 'subject' | 'abstract'>('scene');

  const pkg = currentPackage || packages.find((p) => p.id === packageId) || packages[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!pkg) {
    return (
      <div className="min-h-full flex items-center justify-center p-6 bg-[var(--bg-base)] text-[var(--text-primary)]">
        <div className="macos-card text-center max-w-md p-8 space-y-4">
          <h2 className="macos-card-title text-base">Paket Konten Tidak Ditemukan</h2>
          <p className="macos-card-desc">Belum ada paket yang dibuat atau tautan tidak valid.</p>
          <button 
            onClick={() => navigate('/generate')} 
            className="btn-primary mx-auto"
          >
            Mulai Forge Baru
          </button>
        </div>
      </div>
    );
  }

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

## 2. Intro Hook Video (0–10 Detik)
1. **Hook:** ${introHookTiers.hook}
2. **Sub-judul:** ${introHookTiers.subtitle}
3. **Call to Action:** ${introHookTiers.cta}

---

## 3. Prompt Thumbnail YouTube
### Prompt A (Dengan Zona Teks)
\`\`\`
${promptAToDisplay}
\`\`\`

### Prompt B (Full Frame Tanpa Teks)
\`\`\`
${promptBToDisplay}
\`\`\`

---

## 4. Prompt Gambar AI
\`\`\`
${singleImagePrompt}
\`\`\`

---

## 5. Prompt Video AI
\`\`\`
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

  const allThumbnailPromptsCombined = useMemo(() => {
    return thumbnailStyles
      .map(s => {
        const det = resolvedThumbnails.details[s.id];
        if (!det) return '';
        const pA = generateComprehensiveThumbnailPlatformPrompt({
          platform: thumbPlatformTab,
          version: 'A',
          detail: det,
          overlayText: activeSimulatorText,
          categoryName: pkg.categoryName,
          duration: pkg.duration,
          textPosition,
          colorPalette,
          customColors,
          appliedPrompt: det.promptA || det.rawPrompt,
          activePalette: activePaletteData,
          warnings: activeWarnings
        });
        const pB = generateComprehensiveThumbnailPlatformPrompt({
          platform: thumbPlatformTab,
          version: 'B',
          detail: det,
          overlayText: activeSimulatorText,
          categoryName: pkg.categoryName,
          duration: pkg.duration,
          textPosition,
          colorPalette,
          customColors,
          appliedPrompt: det.promptB,
          activePalette: activePaletteData,
          warnings: activeWarnings
        });
        return `[GAYA: ${s.label.toUpperCase()} — TARGET CTR: ${s.targetCTR}]\n\n--- PROMPT A (DENGAN ZONA TEKS) ---\n${pA}\n\n--- PROMPT B (FULL FRAME TANPA TEKS) ---\n${pB}`;
      })
      .join('\n\n---\n\n');
  }, [thumbnailStyles, resolvedThumbnails, thumbPlatformTab, activeSimulatorText, pkg.categoryName, pkg.duration, textPosition, colorPalette, customColors, activePaletteData, activeWarnings]);

  return (
    <div className="min-h-full bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="macos-card py-2 px-3 shadow-lg flex items-center gap-2 text-xs">
            <Check className="w-3.5 h-3.5 text-[var(--accent-green)]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sticky Bar Navigasi & Aksi Salin Semua */}
      <div
        style={{
          backgroundColor: 'var(--bg-overlay)',
          backdropFilter: 'blur(20px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
          borderBottom: '1px solid var(--border-subtle)',
          height: '52px',
        }}
        className="sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between"
      >
        <div className="max-w-[780px] w-full mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/generate')}
            className="btn-secondary text-xs py-1.5 px-2.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Form</span>
          </button>

          <div className="flex items-center gap-2">
            <CopyButton
              textToCopy={getMarkdownAll()}
              label="Salin Format Markdown"
              className="text-xs py-1.5 px-3"
            />
          </div>
        </div>
      </div>

      {/* Main Container (Max Width 780px per Bagian 5B) */}
      <div
        style={{
          maxWidth: '780px',
          margin: '0 auto',
          padding: 'var(--space-8) var(--space-6)',
        }}
        className="space-y-5"
      >
        {/* Header Paket Konten */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4) var(--space-5)',
          }}
          className="space-y-2.5"
        >
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

          <h1
            style={{
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--text-primary)',
            }}
            className="m-0 tracking-tight leading-snug"
          >
            {pkg.metadata.titleA}
          </h1>

          <p
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}
            className="m-0"
          >
            Paket konten musik lengkap siap pakai untuk produksi YouTube.
          </p>
        </div>

        {/* BLOK 1: Metadata YouTube */}
        <section className="macos-card space-y-4">
          <div className="macos-card-header">
            <div>
              <h2 className="macos-card-title">Metadata YouTube</h2>
              <p className="macos-card-desc">
                Judul SEO, deskripsi terstruktur, dan tag video.
              </p>
            </div>
            <CopyButton
              textToCopy={`JUDUL UTAMA:\n${pkg.metadata.titleA}\n\nDESKRIPSI:\n${pkg.metadata.description}\n\nTAGS:\n${pkg.metadata.tags.join(', ')}`}
              label="Salin Metadata"
            />
          </div>

          {/* 3 Varian Judul SEO */}
          <div className="space-y-2">
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--weight-medium)',
                color: 'var(--text-secondary)',
              }}
            >
              Varian Judul SEO
            </div>
            <div className="space-y-1.5">
              {resolvedVariants.map((v, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-inset)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                  }}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className={v.isPrimaryRecommendation ? 'macos-badge macos-badge-accent shrink-0' : 'macos-badge shrink-0'}
                    >
                      {v.variantLabel || `Opsi ${i + 1}`}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-xs)',
                        fontWeight: v.isPrimaryRecommendation ? 'var(--weight-medium)' : 'var(--weight-regular)',
                        color: 'var(--text-primary)',
                      }}
                      className="truncate"
                    >
                      {v.title}
                    </span>
                  </div>
                  <CopyButton textToCopy={v.title} label="Salin" />
                </div>
              ))}
            </div>
          </div>

          {/* Deskripsi Video */}
          <OutputArea
            label="Deskripsi Video"
            content={pkg.metadata.description}
            copyLabel="Salin Deskripsi"
            maxHeight="160px"
          />

          {/* Tag YouTube */}
          <OutputArea
            label="Tag YouTube (Format Koma)"
            content={pkg.metadata.tags.join(', ')}
            copyLabel="Salin Tag"
            maxHeight="90px"
          />
        </section>

        {/* BLOK 3: Intro Hook Video (0–10 Detik) */}
        <section className="macos-card space-y-4">
          <div className="macos-card-header">
            <div>
              <h2 className="macos-card-title">Intro Hook Video (0–10 Detik)</h2>
              <p className="macos-card-desc">
                Struktur naskah pembuka untuk mempertahankan retensi audiens awal.
              </p>
            </div>
            <CopyButton
              textToCopy={`1. HOOK (0-3s): ${introHookTiers.hook}\n2. SUB-JUDUL (3-7s): ${introHookTiers.subtitle}\n3. CALL TO ACTION (7-10s): ${introHookTiers.cta}`}
              label="Salin Naskah"
            />
          </div>

          <div className="space-y-2">
            {[
              { level: '1', title: 'Hook (0–3 Detik)', text: introHookTiers.hook },
              { level: '2', title: 'Sub-judul (3–7 Detik)', text: introHookTiers.subtitle },
              { level: '3', title: 'Call to Action (7–10 Detik)', text: introHookTiers.cta },
            ].map((tier) => (
              <div
                key={tier.level}
                style={{
                  backgroundColor: 'var(--bg-inset)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 12px',
                }}
                className="flex items-start justify-between gap-3"
              >
                <div className="space-y-0.5 flex-1 min-w-0">
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {tier.title}
                  </span>
                  <p
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-primary)',
                      lineHeight: 'var(--leading-normal)',
                    }}
                    className="m-0"
                  >
                    "{tier.text}"
                  </p>
                </div>
                <CopyButton textToCopy={tier.text} label="Salin" />
              </div>
            ))}
          </div>
        </section>

        {/* BLOK 4: Prompt Thumbnail YouTube (Dual Prompt) */}
        <section className="macos-card space-y-4">
          <div className="macos-card-header">
            <div>
              <h2 className="macos-card-title">Prompt Thumbnail YouTube</h2>
              <p className="macos-card-desc">
                Formula visual CTR tinggi dengan sistem Dual Prompt.
              </p>
            </div>
            <CopyButton
              textToCopy={allThumbnailPromptsCombined}
              label="Salin Semua Gaya"
            />
          </div>

          {/* Kontrol Format & Penyesuaian Komposisi */}
          <div
            style={{
              backgroundColor: 'var(--bg-inset)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px 12px',
            }}
            className="space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Format Platform Selector */}
              <div className="flex items-center gap-1">
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    marginRight: '4px',
                  }}
                >
                  Platform:
                </span>
                {(['google-flow', 'chatgpt', 'general'] as const).map((p) => {
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
                      style={{
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isSelected ? 'var(--bg-base)' : 'transparent',
                        color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                        fontSize: 'var(--text-xs)',
                        padding: '3px 8px',
                        border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                        boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                      }}
                      className="cursor-pointer transition-colors"
                    >
                      {labels[p]}
                    </button>
                  );
                })}
              </div>

              {/* Posisi Teks & Palet */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Posisi:
                  </span>
                  <select
                    value={textPosition}
                    onChange={(e) => setTextPosition(e.target.value as TextPositionCode)}
                    className="macos-input py-0.5 px-2 text-xs"
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
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Palet:
                  </span>
                  <select
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value as ColorPaletteCode)}
                    className="macos-input py-0.5 px-2 text-xs"
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

          {/* 4 Gaya Thumbnail Selector */}
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
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--bg-base)',
                    borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                    color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    fontSize: 'var(--text-xs)',
                    padding: '8px 10px',
                  }}
                  className="border text-left cursor-pointer transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{style.label}</span>
                  <span className="text-[10px] opacity-70 ml-1 font-mono">{style.targetCTR}</span>
                </button>
              );
            })}
          </div>

          {/* DUAL PROMPT OUTPUT (OutputArea 3D Standard) */}
          <div className="space-y-3 pt-1">
            {/* Prompt A */}
            <OutputArea
              label="Prompt A — Dengan Zona Teks (Overlay Canva/Photoshop)"
              content={promptAToDisplay}
              copyLabel="Salin Prompt A"
              maxHeight="160px"
            />

            {/* Prompt B */}
            <OutputArea
              label="Prompt B — Full Frame (Tanpa Zona Teks)"
              content={promptBToDisplay}
              copyLabel="Salin Prompt B"
              maxHeight="160px"
            />
          </div>
        </section>

        {/* BLOK 5: Prompt Gambar AI */}
        <section className="macos-card space-y-4">
          <div className="macos-card-header">
            <div>
              <h2 className="macos-card-title">Prompt Gambar AI</h2>
              <p className="macos-card-desc">
                Formula visual 8 elemen untuk latar gambar 16:9 beresolusi tinggi.
              </p>
            </div>
            <CopyButton
              textToCopy={singleImagePrompt}
              label="Salin Prompt Gambar"
            />
          </div>

          {/* Variasi Visual (Scene, Subjek, Abstrak) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginRight: '4px' }}>
                Fokus Visual:
              </span>
              {(['scene', 'subject', 'abstract'] as const).map((v) => {
                const isSelected = activeVisualVariant === v;
                const labels = { scene: 'Lanskap', subject: 'Karakter', abstract: 'Minimalis' };
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setActiveVisualVariant(v)}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.12)' : 'var(--bg-inset)',
                      borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      fontSize: 'var(--text-xs)',
                      padding: '3px 8px',
                    }}
                    className="border cursor-pointer transition-colors"
                  >
                    {labels[v]}
                  </button>
                );
              })}
            </div>

            {/* Platform Generator */}
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginRight: '4px' }}>
                Generator:
              </span>
              {(['standard', 'midjourney', 'flux', 'imagen'] as const).map((p) => {
                const isSelected = imagePlatform === p;
                const labels = { standard: 'Standard', midjourney: 'Midjourney', flux: 'Flux.1', imagen: 'Imagen 3' };
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setImagePlatform(p)}
                    style={{
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--bg-base)' : 'transparent',
                      color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                      fontSize: 'var(--text-xs)',
                      padding: '3px 8px',
                      border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    }}
                    className="cursor-pointer transition-colors"
                  >
                    {labels[p]}
                  </button>
                );
              })}
            </div>
          </div>

          <OutputArea
            label={`Prompt Gambar (${imagePlatform.toUpperCase()})`}
            content={singleImagePrompt}
            copyLabel="Salin"
            maxHeight="160px"
          />
        </section>

        {/* BLOK 6: Prompt Video AI (Image-to-Video Loop) */}
        <section className="macos-card space-y-4">
          <div className="macos-card-header">
            <div>
              <h2 className="macos-card-title">Prompt Video AI (Image-to-Video Loop)</h2>
              <p className="macos-card-desc">
                Instruksi kamera terkunci (locked tripod) dan mikro-gerak seamless loop 10 detik.
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

          {/* Video Platform Switcher */}
          <div className="flex flex-wrap items-center gap-1">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginRight: '4px' }}>
              Platform Video:
            </span>
            {(['google-flow', 'runway', 'kling', 'luma', 'pika'] as const).map((p) => {
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
                  style={{
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'rgba(0, 122, 255, 0.12)' : 'var(--bg-inset)',
                    borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-subtle)',
                    color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                    fontSize: 'var(--text-xs)',
                    padding: '3px 8px',
                  }}
                  className="border cursor-pointer transition-colors"
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>

          <OutputArea
            label={`Prompt Video Loop (${videoPlatform.toUpperCase()})`}
            content={singleVideoPrompt}
            copyLabel="Salin Prompt Video"
            maxHeight="150px"
          />

          <OutputArea
            label="Universal Negative Prompt (Gunakan di semua platform AI)"
            content={UNIVERSAL_NEGATIVE_PROMPT}
            copyLabel="Salin Negative Prompt"
            maxHeight="100px"
          />
        </section>

        {/* Aksi Navigasi Bawah */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="btn-secondary"
          >
            Lihat Riwayat Paket
          </button>

          <button
            type="button"
            onClick={() => navigate('/generate')}
            className="btn-primary"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Forge Paket Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
