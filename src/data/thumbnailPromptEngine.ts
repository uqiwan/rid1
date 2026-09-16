import { YouTubeTitleVariant } from '../types';

export interface ThumbnailPromptDetail {
  styleName: string; // 'Cinematic Widescreen' | 'Split Composition' | 'Minimal Typography' | 'Emotional Lifestyle'
  styleKey: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  aspectRatio: string; // '16:9'
  targetCTR: string; // '>10%'
  fullPrompt: string; // The complete English prompt for Google Flow AI / Midjourney / Imagen 3
  layers: {
    background: string;
    mainSubject: string;
    foreground: string;
    textOverlay: string;
  };
  clickTriggerReason: string; // 1 concise sentence explaining curiosity / benefit / color contrast click trigger
  visualRules: {
    contrastPair: string; // e.g. "Deep Navy Blue & Warm Glowing Amber"
    focusDepth: string; // e.g. "Sharp Subject f/1.8 with foreground bokeh"
    lighting: string; // e.g. "Dramatic single-directional warm spotlight"
    emotion: string; // e.g. "Peaceful, eyes closed in tranquil focus"
  };
}

export interface ThumbnailGenerationInput {
  categoryName: string;
  genre: string;
  moods: string[];
  duration?: string;
  useCase?: string;
  optionalKeyword?: string;
}

/**
 * Builds high-converting Google Flow AI thumbnail prompts adhering strictly to the 4 Mandatory Composition Layers:
 * 1. Background: Atmospheric mood/location, dominant tone, directional lighting
 * 2. Main Subject: Largest focal subject (face, instrument, iconic category artifact)
 * 3. Foreground: Near-camera depth elements (particles, steam/smoke, blurred foliage, bokeh frame)
 * 4. Text Overlay: 3-5 bold sans-serif words with contrast stroke/shadow positioned safely away from video duration badge
 * + 1 concise sentence explaining click trigger (curiosity/benefit/color contrast)
 */
export function generateEngineeredThumbnailPrompts(input: ThumbnailGenerationInput): {
  prompts: {
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  };
  details: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', ThumbnailPromptDetail>;
} {
  const kw = input.optionalKeyword?.trim() || 'Midnight Focus';
  const primaryMood = input.moods[0] || 'Peaceful';
  const secondaryMood = input.moods[1] || 'Cozy';
  const genre = input.genre || input.categoryName;
  const useCase = input.useCase?.trim() || 'Study & Deep Sleep';

  // Determine complementary color palette and iconic subject based on genre/category
  const isLofiOrChill = genre.toLowerCase().includes('lofi') || genre.toLowerCase().includes('lo-fi') || genre.toLowerCase().includes('chill');
  const isPiano = genre.toLowerCase().includes('piano') || genre.toLowerCase().includes('classical');
  const isAmbientOrSleep = genre.toLowerCase().includes('ambient') || genre.toLowerCase().includes('sleep') || genre.toLowerCase().includes('meditation');
  const isAcousticOrGuitar = genre.toLowerCase().includes('guitar') || genre.toLowerCase().includes('acoustic');
  const isNature = genre.toLowerCase().includes('rain') || genre.toLowerCase().includes('nature') || genre.toLowerCase().includes('waterfall');

  // Specific instrument & subject mapping
  let iconicSubject = 'A solitary young student wearing over-ear studio headphones, eyes closed in peaceful concentration, bathed in single-directional illumination';
  let instrumentDetail = 'illuminated vintage mechanical keyboard and open study notebook';
  let complementaryColors = 'deep midnight navy blue versus intense warm golden-amber';
  let textSampleA = 'DEEP FOCUS NOW';
  let textSampleB = 'INSTANT SLEEP 3H';
  let textSampleC = 'STUDY & RELAX';
  let textSampleD = 'NO MORE STRESS';

  if (isPiano) {
    iconicSubject = 'Close-up on hands gracefully resting on gleaming ebony and ivory grand piano keys, illuminated by a warm diagonal spotlight beam';
    instrumentDetail = 'glossy wooden grand piano body reflecting ambient golden dust';
    complementaryColors = 'deep obsidian black and twilight purple against rich radiant gold';
    textSampleA = 'PEACEFUL PIANO';
    textSampleB = 'CALM YOUR MIND';
    textSampleC = 'HEALING FREQUENCY';
    textSampleD = 'SLEEP IN MINUTES';
  } else if (isAmbientOrSleep) {
    iconicSubject = 'A serene silhouette meditating beside an expansive window looking into a cosmic twilight sky with soft glowing crescent moon';
    instrumentDetail = 'glowing singing bowl with ethereal resonating light rings';
    complementaryColors = 'ultramarine indigo and deep violet balanced by glowing warm cyan and starlight gold';
    textSampleA = 'DEEP SLEEP FAST';
    textSampleB = 'CLEAR YOUR HEAD';
    textSampleC = 'RELEASE ALL ANXIETY';
    textSampleD = '99% DEEP RELAX';
  } else if (isAcousticOrGuitar) {
    iconicSubject = 'Warm artisan acoustic guitar with golden spruce wood grain, fingers plucking brass strings in crystal-sharp detail';
    instrumentDetail = 'vintage acoustic guitar soundhole reflecting campfire or hearth ember glow';
    complementaryColors = 'earthy forest emerald and dark slate versus warm radiant ember orange';
    textSampleA = 'COZY ACOUSTIC VIBE';
    textSampleB = 'MORNING COFFEE FLOW';
    textSampleC = 'WARM CABIN FOCUS';
    textSampleD = 'PEACEFUL GUITAR';
  } else if (isNature) {
    iconicSubject = 'Glass sanctuary window with cascading crystalline raindrops reflecting a solitary glowing lantern and lush drenched rainforest ferns';
    instrumentDetail = 'antique brass storm lantern casting focused warm circular halo';
    complementaryColors = 'dark rainy teal and stormy charcoal paired with glowing amber candlelight';
    textSampleA = 'HEAVY RAIN SLEEP';
    textSampleB = 'INSTANT STRESS RELIEF';
    textSampleC = 'NATURAL WHITE NOISE';
    textSampleD = 'COZY RAIN CABIN';
  }

  // Build Layered Prompts
  // 1. Cinematic Widescreen
  const cinematicLayers = {
    background: `Atmospheric ${kw} architectural sanctuary reflecting ${primaryMood.toLowerCase()} mood, deep navy blue and charcoal tones, dramatic single-directional warm golden beam streaming from a tall rain-streaked window`,
    mainSubject: `${iconicSubject}, ultra-sharp 8k focal point centered in the rule of thirds, authentic serene emotional expression, rim lighting outlining shoulders`,
    foreground: `Cinematic out-of-focus near-camera floating golden dust particles and delicate curled steam rising from a porcelain cup, f/1.8 shallow depth of field creating intense optical depth`,
    textOverlay: `Top-left quadrant text graphic overlay reading "${textSampleA}", bold heavyweight sans-serif typography, high-contrast bright warm-white font with 3px solid black stroke and 40% soft drop shadow, completely safe from bottom-right timestamp badge`
  };

  const cinematicFull = `A high-converting 16:9 YouTube thumbnail photograph optimized for Google Flow AI image generator. [Background]: ${cinematicLayers.background}. [Main Subject]: ${cinematicLayers.mainSubject}. [Foreground]: ${cinematicLayers.foreground}. [Text Overlay]: ${cinematicLayers.textOverlay}. Visual rules: intense complementary color contrast (midnight navy blue vs radiant warm amber), extreme focal sharpness on main subject with heavy cinematic background blur, 35mm lens, award-winning lighting, masterclass composition, highly clickable on mobile feeds --ar 16:9 --v 6.1`;

  const cinematicReason = `Kontras komplementer navy-amber yang ekstrem langsung melompat di feed mobile, sementara teks "${textSampleA}" memberikan janji manfaat instan dengan subjek ekspresif yang membangun empati penonton.`;

  // 2. Split Composition
  const splitLayers = {
    background: `Split-screen visual collage. Left half: High-mood macro environment of ${kw} in cool indigo shadows. Right half: Warm amber cozy sanctuary featuring ${instrumentDetail}`,
    mainSubject: `Dual-focal contrast storytelling. Left: expressive close-up profile with eyes gently closed in ${secondaryMood.toLowerCase()} flow state. Right: sharp macro shot of ${genre} instrument with illuminated soundwaves or glowing strings`,
    foreground: `Thin cinematic vertical light split beam with glowing bokeh spheres in the near-camera plane creating a multi-layered 3D stereoscopic depth`,
    textOverlay: `Centered or top-left bold punchy typography reading "${textSampleB}", ultra-thick modern geometric sans-serif, electric yellow-orange lettering with thick black outline and deep drop shadow for extreme small-screen legibility`
  };

  const splitFull = `A split-frame 16:9 YouTube thumbnail designed for maximum CTR >10% on Google Flow AI. [Background]: ${splitLayers.background}. [Main Subject]: ${splitLayers.mainSubject}. [Foreground]: ${splitLayers.foreground}. [Text Overlay]: ${splitLayers.textOverlay}. Visual rules: dramatic duel between cool shadow tones and burning warm highlights, razor-sharp focus on both quadrants, cinematic depth separation, zero visual clutter, safe margins from YouTube UI overlays --ar 16:9 --style raw`;

  const splitReason = `Komposisi split-screen memicu rasa penasaran visual (curiosity gap) melalui perbandingan langsung suasana dingin vs kehangatan musik, diperkuat teks berdaya pikat tinggi.`;

  // 3. Minimal Typography
  const minimalLayers = {
    background: `Studio-grade minimalist dark obsidian slate backdrop, soft diagonal spotlight cone cutting through the darkness with a rich vignette gradient`,
    mainSubject: `Single hyper-detailed iconic centerpiece: glowing ${genre} artifact (${instrumentDetail}) casting subtle mirror reflection on polished wet black marble`,
    foreground: `Delicate atmospheric haze and micro dust motes catching the direct spotlight ray in front of the lens, f/1.4 extreme bokeh`,
    textOverlay: `Dominant graphic editorial layout with 3–5 words reading "${textSampleC}", huge heavy impact sans-serif font in blazing cyan-white with deep black ambient occlusion shadow, occupying the spacious negative space on the left half`
  };

  const minimalFull = `Minimalist editorial 16:9 YouTube thumbnail engineered for Google Flow AI. [Background]: ${minimalLayers.background}. [Main Subject]: ${minimalLayers.mainSubject}. [Foreground]: ${minimalLayers.foreground}. [Text Overlay]: ${minimalLayers.textOverlay}. Visual rules: 60% clean negative space, single sharp heroic spotlight, high tonal contrast ratio (>15:1), stark visual hierarchy, instantly readable at 120px mobile thumbnail scale --ar 16:9`;

  const minimalReason = `Ruang negatif yang lapang dan kontras tipografi raksasa membuat thumbnail ini tampak sangat elegan dan menonjol di tengah feed YouTube yang padat dan ramai.`;

  // 4. Emotional Lifestyle
  const lifestyleLayers = {
    background: `Authentic cozy room or creative sanctuary during dusk ${kw}, warm tungsten fairy lights blurred in the background, soft rainy twilight visible through sheer window curtains`,
    mainSubject: `Relatable human creator or listener wrapped in an oversized warm knit blanket, head tilted peacefully with eyes shut, listening through retro headphones with a gentle, relaxed smile`,
    foreground: `Warm ceramic mug on wooden tabletop with thick swirling steam in the close foreground blur, soft out-of-focus Monstera plant leaf framing the camera edge`,
    textOverlay: `Eye-level bold headline sticker graphic reading "${textSampleD}", high-visibility bright sunset-amber font with double black stroke and modern drop shadow, positioned on the clean upper third`
  };

  const lifestyleFull = `An emotional lifestyle 16:9 YouTube thumbnail prompt for Google Flow AI. [Background]: ${lifestyleLayers.background}. [Main Subject]: ${lifestyleLayers.mainSubject}. [Foreground]: ${lifestyleLayers.foreground}. [Text Overlay]: ${lifestyleLayers.textOverlay}. Visual rules: authentic human emotion with relatable peace and relief, warm golden hour ambient glow contrasting against twilight blue window, shallow depth of field, genuine intimacy that invites clicks --ar 16:9 --q 2`;

  const lifestyleReason = `Ekspresi wajah yang tenang dan damai memicu cermin emosi (mirror neuron) pada penonton yang sedang stres atau mencari ketenangan, mendorong rasio klik organik di atas 10%.`;

  const details: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', ThumbnailPromptDetail> = {
    cinematic: {
      styleName: 'Cinematic Widescreen',
      styleKey: 'cinematic',
      aspectRatio: '16:9',
      targetCTR: '>12.5%',
      fullPrompt: cinematicFull,
      layers: cinematicLayers,
      clickTriggerReason: cinematicReason,
      visualRules: {
        contrastPair: 'Midnight Navy Blue & Intense Warm Golden-Amber',
        focusDepth: 'Sharp Subject (f/1.8) dengan Foreground Dust Blur',
        lighting: 'Dramatis Satu Arah (Window Spotlight)',
        emotion: 'Ekspresi Tenang & Damai (Eyes Closed Concentration)'
      }
    },
    split: {
      styleName: 'Split Composition',
      styleKey: 'split',
      aspectRatio: '16:9',
      targetCTR: '>11.8%',
      fullPrompt: splitFull,
      layers: splitLayers,
      clickTriggerReason: splitReason,
      visualRules: {
        contrastPair: 'Cool Indigo Shadows vs Radiant Flame Amber',
        focusDepth: 'Dual Macro Depth & Bokeh Foreground',
        lighting: 'Pencahayaan Kontras Dua Nada (Dual-Tone)',
        emotion: 'Flow State & Introspektif Mendalam'
      }
    },
    minimal: {
      styleName: 'Minimal Typography',
      styleKey: 'minimal',
      aspectRatio: '16:9',
      targetCTR: '>10.4%',
      fullPrompt: minimalFull,
      layers: minimalLayers,
      clickTriggerReason: minimalReason,
      visualRules: {
        contrastPair: 'Obsidian Slate vs Blazing White-Gold',
        focusDepth: 'Hero Object Sharp, 60% Negative Space Blur',
        lighting: 'Spotlight Mengerucut Diagonal',
        emotion: 'Elegan, Bersih, dan Bebas Distraksi'
      }
    },
    lifestyle: {
      styleName: 'Emotional Lifestyle',
      styleKey: 'lifestyle',
      aspectRatio: '16:9',
      targetCTR: '>13.2%',
      fullPrompt: lifestyleFull,
      layers: lifestyleLayers,
      clickTriggerReason: lifestyleReason,
      visualRules: {
        contrastPair: 'Twilight Dusk Blue vs Cozy Warm Tungsten',
        focusDepth: 'Foreground Steaming Mug Blur, Sharp Face',
        lighting: 'Warm Ambient Lantern & Window Dusk Glow',
        emotion: 'Senyum Damai & Kelegaan Emosional Nyata'
      }
    }
  };

  return {
    prompts: {
      cinematic: cinematicFull,
      split: splitFull,
      minimal: minimalFull,
      lifestyle: lifestyleFull
    },
    details
  };
}
