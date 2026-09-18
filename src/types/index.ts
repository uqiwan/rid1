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
  preferredThumbnailStyle?: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  thumbnailDetails?: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', {
    styleName: string;
    styleKey: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
    aspectRatio: string;
    targetCTR: string;
    fullPrompt: string;
    renderPrompt?: string;
    formattedBlock?: string;
    categoryTitle?: string;
    styleTitle?: string;
    ctrStrategy?: string;
    rawPrompt?: string;
    recommendedText?: {
      option1: string;
      option2: string;
      option3: string;
      bestOption: string;
      bestReason: string;
    };
    compositionGuide?: {
      focalPoint: string;
      textZone: string;
      keyContrast: string;
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
      midjourney: string;
      dalle3: string;
      stableDiffusion: {
        positive: string;
        negative: string;
        cfgScale: number;
        sampler: string;
        steps: number;
      };
    };
    layers: {
      background: string;
      mainSubject: string;
      foreground: string;
      textOverlay: string;
    };
    clickTriggerReason: string;
    visualRules: {
      contrastPair: string;
      focusDepth: string;
      lighting: string;
      emotion: string;
      palette?: string;
    };
  }>;
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
