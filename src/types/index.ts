export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconEmoji: string;
  sortOrder: number;
  isActive: boolean;
  subGenres: string[];
  moods: string[];
  samplePackage?: ContentPackage;
}

export interface YouTubeTitleVariant {
  title: string;
  score: number;
  reason: string;
  isPrimaryRecommendation?: boolean;
  variantLabel?: 'Rekomendasi Utama' | 'Rekomendasi Alternatif 1' | 'Rekomendasi Alternatif 2' | string;
  breakdown: {
    seoKeyword: number;
    ctrPotential: number;
    contentHonesty: number;
    formulaCompliance: number;
  };
}

export interface ContentPackage {
  id: string;
  userId: string;
  categoryId: string;
  categoryName: string;
  subGenre: string;
  moods: string[];
  duration?: string;
  useCase?: string;
  optionalKeyword?: string;
  textPosition?: string;
  colorPalette?: string;
  customColors?: { dominant: string; accent?: string; textZone?: string };
  createdAt: string;
  generationMs: number;
  model: string;
  
  // 7 Output Blocks
  metadata: {
    titleA: string;
    titleB: string;
    titleC: string;
    titleVariants?: YouTubeTitleVariant[];
    description: string;
    tags: string[];
  };
  thumbnailText: {
    variant1: string;
    variant2: string;
    variant3: string;
  };
  introHook: string;
  introHookDetails?: {
    hook: string;
    subtitle: string;
    cta: string;
  };
  thumbnailPrompts: {
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  };
  thumbnailPromptsDual?: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', {
    promptA: string;
    promptB: string;
  }>;
  preferredThumbnailStyle?: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  thumbnailDetails?: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', ThumbnailPromptDetail>;
  googleFlowDetails?: {
    compositionTitle?: string;
    imagePrompt: string;
    videoPrompt: string;
    layers: {
      background: string;
      mainSubject: string;
      foreground: string;
      lightingAndGrading?: string;
      lightingAndColor?: string;
    };
    cyclicMotions?: string[];
    cameraRule?: string;
    loopSpec?: string;
    videoRules?: {
      cameraRule: string;
      cyclicalMotions: string[];
      loopDuration: string;
      noJumpCutNote: string;
    };
    variationIndex?: number;
  };
  cinematicVisualBundle?: CinematicVisualBundle;
  imagePrompts: string[];
  videoPrompt: string;
  technicalNotes: string;
}

export type TuneForgePackage = ContentPackage;

export type CinematicVariantType = 'Scene' | 'Subjek' | 'Abstrak';

export interface CinematicPlatformPrompts {
  image: {
    googleFlow: string;
    midjourney: string;
    dalle3: string;
    flux?: string;
    imagen?: string;
    stableDiffusion: {
      positive: string;
      negative: string;
      cfgScale: number;
      sampler: string;
      steps: number;
    };
  };
  video: {
    googleFlow: string;
    runwayMl: string;
    klingAi: string;
    pikaLabs: string;
    lumaDreamMachine: string;
  };
}

export interface CinematicPromptVariant {
  variantType: CinematicVariantType;
  variantTitle: string;
  categoryTitle: string;
  imagePrompt: string;
  videoPrompt: string;
  negativePrompt: string;
  parameters?: {
    audience: string;
    lighting: string;
    colorPalette: string;
    mood: string;
    styleReference: string;
  };
  technicalSpecs: {
    resolution: string;
    aspectRatio: string;
    loopSeconds: number;
  };
  styleTags: string[];
  formattedFullText: string;
  platforms: CinematicPlatformPrompts;
}

export interface CinematicVisualBundle {
  categoryName: string;
  activeVariant: CinematicVariantType;
  variants: Record<CinematicVariantType, CinematicPromptVariant>;
}

export interface User {
  id: string;
  googleSub: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLoginAt: string;
}

export interface PromptTemplate {
  id: string;
  categoryId: string;
  categoryName: string;
  style: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  promptText: string;
  referenceMeta?: {
    hook?: string;
    tags?: string[];
  };
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export interface ThumbnailPromptDetail {
  styleName: string;
  styleKey: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  aspectRatio: string;
  targetCTR: string;
  fullPrompt: string; // The complete boxed ASCII dual output format (v1.1)
  renderPrompt?: string;
  promptA: string; // Prompt Versi A (dengan zona teks untuk Canva/Editor)
  promptB: string; // Prompt Versi B (full frame visual penuh tanpa zona teks)
  modifierA: string;
  modifierB: string;
  formattedBlock: string;
  categoryTitle?: string;
  styleTitle?: string;
  ctrStrategy?: string;
  rawPrompt: string;
  categorySpecialNote?: string;
  recommendedText?: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: 'OPSI 1' | 'OPSI 2' | 'OPSI 3';
    bestReason: string;
  };
  compositionGuide?: {
    focalPoint: string;
    textZone: string;
    keyContrast: string;
    versionB?: {
      focalPoint: string;
      fullFrame: string;
    };
  };
  ctrPalette?: {
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { type: string; hex: string };
  };
  antiPatterns?: string[];
  technicalSpecs?: {
    aspectRatio: string;
    generateResolution: string;
    testResolution: string;
    platforms: string;
  };
  platformPrompts?: {
    standard: string;
    standardA?: string;
    standardB?: string;
    midjourney: string;
    midjourneyA?: string;
    midjourneyB?: string;
    dalle3: string;
    dalle3A?: string;
    dalle3B?: string;
    stableDiffusion: {
      positive: string;
      negative: string;
      cfgScale: number;
      sampler: string;
      steps: number;
    };
  };
  layers?: {
    background: string;
    mainSubject: string;
    foreground: string;
    textOverlay: string;
  };
  clickTriggerReason?: string;
  visualRules?: {
    contrastPair: string;
    focusDepth: string;
    lighting: string;
    emotion: string;
    palette?: string;
  };
}
