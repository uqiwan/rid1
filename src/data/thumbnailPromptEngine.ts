import { YouTubeTitleVariant } from '../types';
import { translateKeywordToEnglish } from '../utils/languageTranslator';

export interface ThumbnailPromptDetail {
  styleName: string; // 'Cinematic Widescreen' | 'Split Composition' | 'Minimal Typography' | 'Emotional Lifestyle'
  styleKey: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  aspectRatio: string; // '16:9'
  targetCTR: string; // '>20%'
  fullPrompt: string; // The complete English prompt for AI image generators closing with 1-sentence click trigger
  renderPrompt: string; // The raw prompt ready for Midjourney / Flux / Imagen / Google Flow AI
  layers: {
    background: string;
    mainSubject: string;
    foreground: string;
    textOverlay: string;
  };
  clickTriggerReason: string; // 1 concise sentence explaining click trigger (curiosity / benefit / color contrast)
  visualRules: {
    contrastPair: string; // e.g. "Deep Midnight Navy Blue & Radiant Warm Amber"
    focusDepth: string; // e.g. "Sharp Subject f/1.8 with foreground bokeh"
    lighting: string; // e.g. "Dramatic single-directional warm spotlight"
    emotion: string; // e.g. "Peaceful, eyes closed in tranquil focus"
    palette: string;
  };
}

export interface ThumbnailGenerationInput {
  categoryName: string;
  genre: string;
  moods: string[];
  preferredStyle?: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  duration?: string;
  useCase?: string;
  optionalKeyword?: string;
}

interface CategoryVisualBlueprint {
  iconicSubject: string;
  instrumentDetail: string;
  locationScene: string;
  complementaryColors: string;
  contrastPairName: string;
  lightingDescription: string;
  emotionalExpression: string;
  foregroundElements: string;
  textVariants: {
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  };
}

function resolveVisualBlueprint(categoryName: string, genre: string, kw: string, primaryMood: string): CategoryVisualBlueprint {
  const c = `${categoryName} ${genre}`.toLowerCase();

  if (c.includes('lofi') || c.includes('lo-fi') || c.includes('chill')) {
    return {
      iconicSubject: 'A solitary young student wearing over-ear studio headphones, head tilted peacefully with eyes gently closed in serene flow state',
      instrumentDetail: 'warm glowing mechanical keyboard, open vintage study notebook, and retro cassette deck',
      locationScene: `cozy rainy Tokyo apartment loft overlooking a misty dusk cityscape with softly glowing neon street reflections`,
      complementaryColors: 'deep midnight navy blue versus intense glowing warm golden-amber',
      contrastPairName: 'Midnight Navy Blue & Radiant Golden-Amber',
      lightingDescription: 'Dramatic single-directional warm tungsten desk lamp casting sharp beam across the workspace against cool twilight shadows',
      emotionalExpression: 'Deep calm, authentic tranquility, eyes shut in total concentration and stress-free flow',
      foregroundElements: 'Curled delicate steam swirling from a handcrafted ceramic mug, out-of-focus window raindrops and warm floating golden dust motes',
      textVariants: {
        cinematic: 'DEEP FOCUS NOW',
        split: 'STUDY IN PEACE',
        minimal: 'FLOW STATE 3H',
        lifestyle: 'NO MORE STRESS'
      }
    };
  }

  if (c.includes('piano') || c.includes('keys')) {
    return {
      iconicSubject: 'Extreme close-up on graceful hands resting on gleaming ebony and ivory keys of a concert grand piano',
      instrumentDetail: 'glossy black lacquered grand piano body catching rim reflections and polished brass foot pedals',
      locationScene: 'a solitary sunlit conservatory hall with tall arched windows looking out toward autumn misty rain',
      complementaryColors: 'deep obsidian charcoal and twilight sapphire against radiant warm champagne gold',
      contrastPairName: 'Obsidian Sapphire & Radiant Champagne Gold',
      lightingDescription: 'Diagonal theatrical warm spotlight slicing through darkness directly illuminating the piano keyboard',
      emotionalExpression: 'Profound peace, contemplative elegance, and soulful musical intimacy',
      foregroundElements: 'Cinematic shallow-focus golden dust particles floating in the light shaft and blurred foreground piano corner',
      textVariants: {
        cinematic: 'PEACEFUL PIANO',
        split: 'CALM YOUR MIND',
        minimal: 'HEALING FREQUENCY',
        lifestyle: 'SLEEP IN MINUTES'
      }
    };
  }

  if (c.includes('study') || c.includes('focus') || c.includes('binaural') || c.includes('alpha')) {
    return {
      iconicSubject: 'Focused young professional with premium matte-black headphones, silhouette illuminated by ambient glow, deep in uninterrupted study',
      instrumentDetail: 'minimalist walnut study desk, analog brass timer, and organized high-contrast notes',
      locationScene: 'high-ceiling modern dark academia library with floor-to-ceiling wooden bookshelves and rain-washed glass walls',
      complementaryColors: 'dark forest emerald and midnight slate contrasted by blazing electric warm amber',
      contrastPairName: 'Forest Emerald & Electric Warm Amber',
      lightingDescription: 'Single focused overhead brass cone spotlight creating high-contrast illumination on the desk workspace',
      emotionalExpression: 'Unshakeable mental clarity, intense flow state, locked-in concentration',
      foregroundElements: 'Soft blurred edge of an open hardbound book and floating optical light motes in f/1.8 shallow depth',
      textVariants: {
        cinematic: 'UNSTOPPABLE FOCUS',
        split: 'DEEP WORK 100%',
        minimal: 'ALPHA BRAIN FLOW',
        lifestyle: 'STUDY WITH ME'
      }
    };
  }

  if (c.includes('cinematic') || c.includes('film') || c.includes('score') || c.includes('epic')) {
    return {
      iconicSubject: 'A lone wanderer in a weathered traveller cloak standing at the precipice of a colossal mist-shrouded mountain summit',
      instrumentDetail: 'glowing ancient cello soundboard resonating with subtle visible golden sonic rings',
      locationScene: 'majestic Nordic fjord under dramatic twilight storm clouds with a cosmic aurora borealis band glowing above',
      complementaryColors: 'stormy dark steel teal and abyssal slate balanced by blinding fiery sunrise orange',
      contrastPairName: 'Stormy Steel Teal & Fiery Sunrise Orange',
      lightingDescription: 'Heroic rim-lighting from behind the horizon with a single golden sunbeam breaking through heavy storm clouds',
      emotionalExpression: 'Awe-inspiring triumph, monumental courage, deep cinematic introspection',
      foregroundElements: 'Dramatic foreground mist, flying atmospheric embers, and out-of-focus jagged rock silhouettes',
      textVariants: {
        cinematic: 'EPIC MOTIVATION',
        split: 'FEEL POWERFUL',
        minimal: 'HEROIC ENERGY',
        lifestyle: 'CONQUER TODAY'
      }
    };
  }

  if (c.includes('biola') || c.includes('string') || c.includes('violin') || c.includes('cello')) {
    return {
      iconicSubject: 'Master violinist holding a vintage polished maple violin, horsehair bow poised with razor-sharp precision on silver strings',
      instrumentDetail: 'hand-carved vintage Italian violin with rich honey varnish and intricate f-hole curves',
      locationScene: 'a dimly lit historic stone chamber with warm candlelight flickering against arched brick walls',
      complementaryColors: 'royal midnight indigo and shadow umber against rich radiant amber and flame gold',
      contrastPairName: 'Midnight Indigo & Radiant Flame Gold',
      lightingDescription: 'Low-angle warm golden lantern light casting dramatic shadows and highlighting the curvature of the violin body',
      emotionalExpression: 'Heartfelt emotional vulnerability, eyes closed in poetic surrender to the melody',
      foregroundElements: 'Fine rosin dust illuminated like stardust in the air and soft blurred violin scroll near lens',
      textVariants: {
        cinematic: 'EMOTIONAL VIOLIN',
        split: 'TEARS & PEACE',
        minimal: 'SOUL STRINGS',
        lifestyle: 'CALM YOUR HEART'
      }
    };
  }

  if (c.includes('bossa') || c.includes('cafe')) {
    return {
      iconicSubject: 'Artisan barista or musician seated at an outdoor sunlit balcony table tuning a nylon-string Spanish guitar with a gentle smile',
      instrumentDetail: 'classical Spanish guitar with blonde cedar top and intricate rosette marquetry',
      locationScene: 'a breezy ocean-view Rio de Janeiro cafe patio bathed in morning golden sunshine overlooking turquoise waves',
      complementaryColors: 'tropical ocean turquoise and deep shade green contrasted with vibrant sunlit mango yellow',
      contrastPairName: 'Ocean Turquoise & Sunlit Mango Yellow',
      lightingDescription: 'Crisp morning directional sunlight casting palm leaf silhouettes across warm terracotta tile floor',
      emotionalExpression: 'Joyful relaxation, carefree warmth, sunny optimism',
      foregroundElements: 'Steaming glass cup of espresso, fresh tropical hibiscus petals in close bokeh blur',
      textVariants: {
        cinematic: 'COZY CAFE VIBE',
        split: 'SUNNY MORNING',
        minimal: 'BOSSA NOVA 3H',
        lifestyle: 'FEEL GOOD NOW'
      }
    };
  }

  if (c.includes('electronic') || c.includes('synthwave') || c.includes('ambient') || c.includes('darksynth')) {
    return {
      iconicSubject: 'Silhouetted synth music producer surrounded by vintage modular analog synthesizers with pulsing patch cables and glowing VU meters',
      instrumentDetail: 'vintage analog synthesizer with illuminated chromatic knobs, pitch wheels, and glowing oscilloscope wave',
      locationScene: 'a rooftop music sanctuary overlooking an expansive 1980s retro-futuristic cyberpunk megacity bathed in neon mist',
      complementaryColors: 'dark midnight violet and cosmic abyss contrasted with blazing electric cyan and hot magenta neon',
      contrastPairName: 'Midnight Violet & Blazing Electric Cyan',
      lightingDescription: 'Dramatic neon key light from the side washing over metallic synthesizer surfaces with sharp color separation',
      emotionalExpression: 'Nocturnal trance, hyper-focused creative flow, futuristic nostalgia',
      foregroundElements: 'Floating chromatic lens flares, subtle atmospheric smoke haze, and glowing bokeh rings in near camera frame',
      textVariants: {
        cinematic: 'CYBERPUNK FLOW',
        split: 'SYNTH DRIVE 80S',
        minimal: 'NIGHT VIBES',
        lifestyle: 'CHILLWAVE RETRO'
      }
    };
  }

  if (c.includes('game') || c.includes('chiptune') || c.includes('8-bit')) {
    return {
      iconicSubject: 'A nostalgic retro gamer or composer sitting in a warm bedroom holding a translucent retro handheld console with screen glow on face',
      instrumentDetail: 'custom wooden synthesizer and vintage 8-bit sound chip hardware with glowing mechanical arcade buttons',
      locationScene: 'a cozy bedroom sanctuary filled with fantasy game concept posters, ambient pixel lamps, and soft dusk window rain',
      complementaryColors: 'deep indigo dusk and charcoal contrasted with radiant sunset purple and neon pixel gold',
      contrastPairName: 'Indigo Dusk & Radiant Pixel Gold',
      lightingDescription: 'Single concentrated screen glow illuminating player facial features against deep shadowy room backdrop',
      emotionalExpression: 'Playful wonder, nostalgic childhood comfort, pure adventurous curiosity',
      foregroundElements: 'Floating micro pixel dust particles, soft foreground blur of a gaming controller cable and coffee mug',
      textVariants: {
        cinematic: 'NOSTALGIA QUEST',
        split: '8-BIT COZY LOOP',
        minimal: 'LEVEL UP FOCUS',
        lifestyle: 'GAME & RELAX'
      }
    };
  }

  if (c.includes('guitar') || c.includes('akustik') || c.includes('fingerstyle')) {
    return {
      iconicSubject: 'Weathered hands of an artisan guitarist fingerpicking brass acoustic guitar strings with micro-detail visible on the fretboard',
      instrumentDetail: 'vintage Martin-style acoustic guitar with rich sunburst finish and polished spruce grain',
      locationScene: 'a rustic timber cabin porch overlooking a tranquil pine forest lake bathed in late afternoon golden hour light',
      complementaryColors: 'earthy deep pine emerald and rustic slate contrasted by warm radiant campfire amber',
      contrastPairName: 'Pine Emerald & Radiant Campfire Amber',
      lightingDescription: 'Dramatic low golden-hour sunbeam striking the guitar body and fingers, casting warm long shadows',
      emotionalExpression: 'Earthy warmth, honest acoustic peace, intimate solace',
      foregroundElements: 'Floating golden pine pollen in the sunbeam, soft out-of-focus wood railing in foreground f/1.8 blur',
      textVariants: {
        cinematic: 'COZY ACOUSTIC',
        split: 'CABIN SUNSET 3H',
        minimal: 'PEACEFUL GUITAR',
        lifestyle: 'WARM COFFEE VIBE'
      }
    };
  }

  if (c.includes('jazz') || c.includes('lounge')) {
    return {
      iconicSubject: 'A charismatic jazz musician holding a glistening vintage gold lacquer tenor saxophone, head tilted gently in deep melodic expression',
      instrumentDetail: 'vintage brass saxophone with intricate hand engravings reflecting warm speakeasy candlelight',
      locationScene: 'an intimate underground Manhattan jazz lounge with velvet booths, brick walls, and gentle dim atmospheric haze',
      complementaryColors: 'deep midnight velvet navy and espresso brown contrasted with lustrous glowing brass gold',
      contrastPairName: 'Velvet Navy & Lustrous Brass Gold',
      lightingDescription: 'Low dramatic rim lighting from a hanging Edison bulb creating a warm halo around musician shoulders',
      emotionalExpression: 'Sophisticated cool, melancholic romance, effortless musical mastery',
      foregroundElements: 'Delicate whiskey glass with amber ice cubes in close optical blur, subtle curls of atmospheric smoke',
      textVariants: {
        cinematic: 'MIDNIGHT JAZZ',
        split: 'COZY SPEAKEASY',
        minimal: 'SMOOTH LOUNGE',
        lifestyle: 'SLOW DOWN & CHILL'
      }
    };
  }

  if (c.includes('klasik') || c.includes('classical') || c.includes('masterpiece')) {
    return {
      iconicSubject: 'Hands of a virtuoso maestro poised over an illuminated sheet music stand with antique quill and inkwell nearby',
      instrumentDetail: 'handcrafted baroque wooden instrument with rich historic patina and golden tuning pegs',
      locationScene: 'an opulent European historic palace library with soaring gilded ceiling frescoes and tall marble arches',
      complementaryColors: 'deep Prussian royal blue and antique marble gray contrasted with luminous regal gold',
      contrastPairName: 'Prussian Blue & Luminous Regal Gold',
      lightingDescription: 'Single theatrical ray of celestial afternoon sunlight breaking through high cathedral window',
      emotionalExpression: 'Transcendent intellectual clarity, noble contemplation, timeless beauty',
      foregroundElements: 'Floating illuminated dust motes in the sun ray, blurred corner of leather-bound antique tome',
      textVariants: {
        cinematic: 'MASTERPIECE BRAIN',
        split: 'TIMELESS FOCUS',
        minimal: 'BAROQUE CLARITY',
        lifestyle: 'STUDY LIKE MOZART'
      }
    };
  }

  if (c.includes('new age') || c.includes('meditasi') || c.includes('healing') || c.includes('432hz')) {
    return {
      iconicSubject: 'Serene silhouette in lotus meditation posture beside a tranquil reflective water sanctuary under a soft dawn sky',
      instrumentDetail: 'gleaming hammered Tibetan singing bowl with delicate concentric light rings on water surface',
      locationScene: 'a minimalist Zen bamboo pavilion overlooking a misty mountain temple at sunrise with floating lotus flowers',
      complementaryColors: 'deep spiritual indigo and dawn violet contrasted with glowing warm champagne starlight',
      contrastPairName: 'Spiritual Indigo & Warm Champagne Gold',
      lightingDescription: 'Soft ethereal rim glow outlining the meditating figure from the rising morning sun behind misty mountain ridge',
      emotionalExpression: 'Deep inner stillness, profound stress release, weightless spiritual relief',
      foregroundElements: 'Smooth river stones in water with soft foreground bokeh, thin fragrant incense smoke ribbon curling upward',
      textVariants: {
        cinematic: 'HEAL YOUR MIND',
        split: '432Hz MIRACLE TONE',
        minimal: 'RELEASE ANXIETY',
        lifestyle: 'DEEP PEACE NOW'
      }
    };
  }

  if (c.includes('seruling') || c.includes('flute') || c.includes('shakuhachi')) {
    return {
      iconicSubject: 'A solitary monk or flute player in natural linen garments playing a traditional carved bamboo Shakuhachi with complete composure',
      instrumentDetail: 'authentic dark mottled bamboo flute with bound silk chord and smooth mouth hole',
      locationScene: 'a quiet mountain forest path surrounded by ancient moss-covered cedar trees and drifting morning mist',
      complementaryColors: 'deep moss emerald and misty slate contrasted with delicate sunrise salmon-gold',
      contrastPairName: 'Moss Emerald & Sunrise Salmon-Gold',
      lightingDescription: 'Dramatic filtered sunlight piercing through thick forest canopy in single distinct crepuscular rays',
      emotionalExpression: 'Zen absolute stillness, breathing harmony, serene solitary oneness with nature',
      foregroundElements: 'Gentle falling cedar needles and micro droplets of dew in soft foreground optical blur',
      textVariants: {
        cinematic: 'ZEN SANCTUARY',
        split: 'PEACEFUL FOREST',
        minimal: 'BREATHE & RELEASE',
        lifestyle: 'CALM MEDITATION'
      }
    };
  }

  if (c.includes('sleep') || c.includes('tidur') || c.includes('delta') || c.includes('relaxation')) {
    return {
      iconicSubject: 'A peaceful sleeper in cozy weighted linen blankets, head resting comfortably on plush down pillow, facial tension completely melted away',
      instrumentDetail: 'softly glowing bedside salt lantern casting a gentle circular pool of warm amber light',
      locationScene: 'a dark, comforting midnight bedroom with heavy rain trickling peacefully down a wide glass window overlooking dark pine hills',
      complementaryColors: 'deep midnight ultramarine and velvety obsidian against warm glowing amber-candlelight',
      contrastPairName: 'Midnight Ultramarine & Warm Candle Amber',
      lightingDescription: 'Single low-intensity warm bedside light source illuminating the sleeping face while room dissolves into soft dark shadows',
      emotionalExpression: 'Total physical surrender, deep restorative slumber, complete freedom from insomnia and worry',
      foregroundElements: 'Soft blurred edge of the duvet and gentle rain droplet bokeh reflecting against the dark glass',
      textVariants: {
        cinematic: 'SLEEP IN 10 MIN',
        split: '8 HOURS DEEP SLEEP',
        minimal: 'FALL ASLEEP FAST',
        lifestyle: 'INSOMNIA RELIEF'
      }
    };
  }

  if (c.includes('ukulele') || c.includes('sunny') || c.includes('island')) {
    return {
      iconicSubject: 'A smiling, relaxed traveler seated on a warm driftwood log by the beach, happily strumming a koa wood ukulele',
      instrumentDetail: 'figured Hawaiian curly koa wood ukulele with gleaming abalone shell purfling',
      locationScene: 'a golden hour tropical beach with gentle pastel pink and turquoise ocean waves lapping the clean white shore',
      complementaryColors: 'tropical ocean turquoise and deep shade teal balanced by radiant sunset mango-coral',
      contrastPairName: 'Ocean Turquoise & Sunset Mango-Coral',
      lightingDescription: 'Direct warm golden-hour sunset light casting rich long shadows and lighting up smiling facial contours',
      emotionalExpression: 'Carefree joy, genuine optimism, sun-drenched holiday happiness',
      foregroundElements: 'Soft blurred foreground palm frond framing the upper corner and gentle warm ocean spray bokeh',
      textVariants: {
        cinematic: 'SUNNY DAY VIBE',
        split: 'HAPPY UKULELE',
        minimal: 'ISLAND PEACE',
        lifestyle: 'FEEL GOOD MUSIC'
      }
    };
  }

  if (c.includes('celtic') || c.includes('world') || c.includes('heritage')) {
    return {
      iconicSubject: 'A skilled Celtic harpist in emerald wool tunic gently plucking brass harp strings beside a historic mossy stone ruin',
      instrumentDetail: 'hand-carved Celtic lever harp with engraved knotwork along the wooden pillar',
      locationScene: 'the Scottish highlands at sunset with heather-covered rolling hills and dramatic low-flying clouds',
      complementaryColors: 'highland heather purple and deep peat moss emerald contrasted with fiery sunset gold',
      contrastPairName: 'Heather Purple & Fiery Sunset Gold',
      lightingDescription: 'Low horizon sunburst cutting across the grassy knoll illuminating the harp strings in bright gold',
      emotionalExpression: 'Soul-stirring nostalgia, ancient folklore pride, deep emotional resonance',
      foregroundElements: 'Blowing wild highland grass and airborne seed pods softly blurred in the immediate camera plane',
      textVariants: {
        cinematic: 'CELTIC DREAMS',
        split: 'ANCIENT MAGIC',
        minimal: 'SOUL OF HIGHLANDS',
        lifestyle: 'PEACEFUL FOLK'
      }
    };
  }

  if (c.includes('drum') || c.includes('percussion') || c.includes('tribal')) {
    return {
      iconicSubject: 'Athletic percussionist with focused intense gaze, arms mid-swing striking a colossal traditional Japanese taiko drum with wooden bachi sticks',
      instrumentDetail: 'giant dark wood taiko drum with thick stretched rawhide skin and forged black iron studs',
      locationScene: 'a dramatic minimalist dojo pavilion surrounded by mist and torches flickering in dusk shadows',
      complementaryColors: 'deep shadow charcoal and obsidian slate contrasted with blazing volcanic flame crimson and gold',
      contrastPairName: 'Shadow Charcoal & Volcanic Flame Crimson',
      lightingDescription: 'High-contrast single-directional torchlight casting muscular edge highlights and striking shadows',
      emotionalExpression: 'Relentless power, primal focus, unbreakable discipline and determination',
      foregroundElements: 'Flying micro sweat droplets frozen in mid-air and rising sparks from torchlight in f/1.8 shallow depth',
      textVariants: {
        cinematic: 'UNSTOPPABLE BEATS',
        split: 'WARRIOR FOCUS',
        minimal: 'RAW POWER 3H',
        lifestyle: 'WORKOUT MOTIVATION'
      }
    };
  }

  // Default fallback covering any general instrumental music genre
  return {
    iconicSubject: `A peaceful listener or musician with over-ear studio headphones, eyes closed in profound relaxation and harmony with ${genre}`,
    instrumentDetail: `handcrafted acoustic instrument and warm illuminated audio equipment suited for ${genre}`,
    locationScene: `an atmospheric sanctuary reflecting ${primaryMood.toLowerCase()} mood, warm architectural interior with rain-streaked window overlooking dusk scenery`,
    complementaryColors: 'deep midnight navy blue versus intense radiant warm golden-amber',
    contrastPairName: 'Midnight Navy Blue & Radiant Warm Amber',
    lightingDescription: 'Dramatic single-directional warm key lighting streaming from an arched window against cool ambient shadows',
    emotionalExpression: 'Authentic peace, stress-free tranquility, serene mental clarity',
    foregroundElements: 'Curled delicate steam rising from a cup, floating golden dust motes in the light shaft, shallow f/1.8 optical bokeh',
    textVariants: {
      cinematic: 'DEEP RELAXATION',
      split: 'CALM YOUR MIND',
      minimal: 'PEACEFUL MUSIC',
      lifestyle: 'INSTANT CALM'
    }
  };
}

/**
 * Builds high-converting AI thumbnail prompts adhering strictly to the 4 Mandatory Composition Layers:
 * 1. Background: Atmospheric setting/location matching mood, dominant complementary tone, directional lighting
 * 2. Main Subject: Largest focal subject (expressive face, iconic instrument, category artifact)
 * 3. Foreground: Near-camera depth elements (particles, steam, falling leaves, blurred framing)
 * 4. Text Overlay: 3-5 bold sans-serif words with contrast stroke/shadow positioned safely away from bottom-right video duration badge
 * + 1 concise sentence explaining click trigger (curiosity / benefit / color contrast for CTR >20%)
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
  const translatedKw = translateKeywordToEnglish(input.optionalKeyword);
  const kw = translatedKw || 'Deep Session';
  const primaryMood = input.moods[0] || 'Peaceful';
  const secondaryMood = input.moods[1] || 'Cozy';
  const genre = input.genre || input.categoryName;
  const bp = resolveVisualBlueprint(input.categoryName, genre, kw, primaryMood);

  // 1. Cinematic Widescreen
  const cinematicLayers = {
    background: `${bp.locationScene}, dominant ${bp.complementaryColors}, ${bp.lightingDescription}`,
    mainSubject: `${bp.iconicSubject}, ultra-sharp 8k focal point positioned along the rule-of-thirds, authentic ${bp.emotionalExpression.toLowerCase()}, crisp edge separation from background`,
    foreground: `${bp.foregroundElements}, f/1.8 shallow depth-of-field creating intense 3D cinematic depth`,
    textOverlay: `Top-left quadrant text graphic overlay reading "${bp.textVariants.cinematic}", 3–5 bold heavyweight sans-serif words in high-contrast bright warm white with 4px dark outer stroke and deep shadow, positioned safely away from bottom-right video duration badge`
  };

  const cinematicRender = `A high-converting 16:9 YouTube thumbnail photograph for ${input.categoryName} (${genre}). [Layer 1 - Background]: ${cinematicLayers.background}. [Layer 2 - Main Subject]: ${cinematicLayers.mainSubject}. [Layer 3 - Foreground]: ${cinematicLayers.foreground}. [Layer 4 - Text Overlay]: ${cinematicLayers.textOverlay}. Visual rules: powerful complementary color contrast (${bp.contrastPairName}), single razor-sharp focal point with cinematic background/foreground blur, dramatic directional key lighting, authentic emotional expression, masterclass composition, highly clickable on mobile feeds --ar 16:9 --v 6.1`;
  const cinematicReason = `Striking complementary contrast of ${bp.contrastPairName} instantly halts the scroll in mobile feeds, while the "${bp.textVariants.cinematic}" text overlay provides an immediate benefit promise backed by an authentic emotional subject that builds viewer empathy.`;
  const cinematicFull = `${cinematicRender} Click Trigger: ${cinematicReason}`;

  // 2. Split Composition
  const splitLayers = {
    background: `Split-screen visual storytelling collage. Left quadrant: atmospheric macro environment of ${kw} in cool shadow tones. Right quadrant: warm sanctuary highlighting ${bp.instrumentDetail}`,
    mainSubject: `Dual-focal contrast balance. Left side: intense close-up on ${bp.iconicSubject}. Right side: razor-sharp macro shot of ${genre} instrument with illuminated details catching warm highlights`,
    foreground: `Cinematic vertical divider light-streak and near-camera floating bokeh spheres creating multi-planar stereoscopic depth across both halves`,
    textOverlay: `Upper-third bold graphic sticker reading "${bp.textVariants.split}", ultra-thick modern geometric sans-serif lettering, high-visibility bright yellow-gold with thick black contour and drop shadow for 100% legibility on small smartphone screens`
  };

  const splitRender = `A split-frame 16:9 YouTube thumbnail engineered for maximum CTR >20% on AI image generators. [Layer 1 - Background]: ${splitLayers.background}. [Layer 2 - Main Subject]: ${splitLayers.mainSubject}. [Layer 3 - Foreground]: ${splitLayers.foreground}. [Layer 4 - Text Overlay]: ${splitLayers.textOverlay}. Visual rules: high dynamic tension between cool shadows and burning warm highlights, razor-sharp focus on primary subjects, clean separation without clutter, margins strictly safe from YouTube UI duration badges --ar 16:9 --style raw`;
  const splitReason = `The split-screen composition activates a visual curiosity gap through direct contrast between atmospheric environment and instrument warmth, engineered to push CTR above 20%.`;
  const splitFull = `${splitRender} Click Trigger: ${splitReason}`;

  // 3. Minimal Typography
  const minimalLayers = {
    background: `Studio-grade dark minimalist backdrop featuring ${bp.locationScene} faded into deep vignette, 65% clean negative space, dramatic single-directional diagonal light cone`,
    mainSubject: `Single heroic centerpiece: ultra-detailed ${bp.instrumentDetail}, casting subtle crystal reflection on polished surface, extreme focal sharpness with macro texture`,
    foreground: `Delicate atmospheric haze and micro light motes catching the solitary spotlight ray in front of the camera lens, extreme f/1.4 optical bokeh`,
    textOverlay: `Dominant editorial typographic layout with 3–5 words reading "${bp.textVariants.minimal}", huge heavy impact sans-serif font in blazing cyan-white with deep black ambient occlusion shadow, occupying the spacious negative space on the left half without touching bottom-right badge area`
  };

  const minimalRender = `Minimalist editorial 16:9 YouTube thumbnail engineered for AI image generation. [Layer 1 - Background]: ${minimalLayers.background}. [Layer 2 - Main Subject]: ${minimalLayers.mainSubject}. [Layer 3 - Foreground]: ${minimalLayers.foreground}. [Layer 4 - Text Overlay]: ${minimalLayers.textOverlay}. Visual rules: 65% clean negative space, single sharp heroic spotlight, high tonal contrast ratio (>15:1), stark visual hierarchy, instantly readable at 120px mobile thumbnail scale --ar 16:9`;
  const minimalReason = `Expansive negative space and high-contrast typography allow this thumbnail to immediately stand out in cluttered YouTube feeds, captivating listeners seeking calm and deep focus.`;
  const minimalFull = `${minimalRender} Click Trigger: ${minimalReason}`;

  // 4. Emotional Lifestyle
  const lifestyleLayers = {
    background: `Authentic cozy sanctuary during dusk ${kw}, warm fairy lights softly blurred in background, twilight window reflections visible in sheer curtains`,
    mainSubject: `${bp.iconicSubject}, wearing cozy knitwear, face illuminated in warm golden ambient glow, displaying authentic ${bp.emotionalExpression.toLowerCase()}`,
    foreground: `Close-range foreground blur featuring ${bp.foregroundElements}, creating intimate warmth and framing the viewer gaze directly toward the subject`,
    textOverlay: `Eye-level bold headline text reading "${bp.textVariants.lifestyle}", 3–5 words in vibrant sunset amber font with double black stroke and modern drop shadow, positioned on the clean upper third`
  };

  const lifestyleRender = `An authentic emotional lifestyle 16:9 YouTube thumbnail prompt. [Layer 1 - Background]: ${lifestyleLayers.background}. [Layer 2 - Main Subject]: ${lifestyleLayers.mainSubject}. [Layer 3 - Foreground]: ${lifestyleLayers.foreground}. [Layer 4 - Text Overlay]: ${lifestyleLayers.textOverlay}. Visual rules: authentic human emotion and relatable relief, warm golden hour ambient glow contrasting against cool twilight shadows, shallow depth of field, genuine intimacy that invites clicks --ar 16:9 --q 2`;
  const lifestyleReason = `An authentic, peaceful facial expression triggers mirror-neuron empathy in stressed or tired viewers, converting browse impressions into high-intent clicks above 20% CTR.`;
  const lifestyleFull = `${lifestyleRender} Click Trigger: ${lifestyleReason}`;

  const details: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', ThumbnailPromptDetail> = {
    cinematic: {
      styleName: 'Cinematic Widescreen',
      styleKey: 'cinematic',
      aspectRatio: '16:9',
      targetCTR: '>21.5%',
      fullPrompt: cinematicFull,
      renderPrompt: cinematicRender,
      layers: cinematicLayers,
      clickTriggerReason: cinematicReason,
      visualRules: {
        contrastPair: bp.contrastPairName,
        focusDepth: 'Razor-Sharp Subject (f/1.8) with Foreground & Background Optical Blur',
        lighting: bp.lightingDescription,
        emotion: bp.emotionalExpression,
        palette: bp.complementaryColors
      }
    },
    split: {
      styleName: 'Split Composition',
      styleKey: 'split',
      aspectRatio: '16:9',
      targetCTR: '>20.8%',
      fullPrompt: splitFull,
      renderPrompt: splitRender,
      layers: splitLayers,
      clickTriggerReason: splitReason,
      visualRules: {
        contrastPair: `${bp.contrastPairName} (Dual-Tone Tension)`,
        focusDepth: 'Dual-Focal Sharpness & Foreground Bokeh Spheres',
        lighting: 'Dual-Tone Contrast Lighting (Cool Shadows vs Warm Highlights)',
        emotion: 'Curiosity Gap & Deep Flow State Immersion',
        palette: bp.complementaryColors
      }
    },
    minimal: {
      styleName: 'Minimal Typography',
      styleKey: 'minimal',
      aspectRatio: '16:9',
      targetCTR: '>20.2%',
      fullPrompt: minimalFull,
      renderPrompt: minimalRender,
      layers: minimalLayers,
      clickTriggerReason: minimalReason,
      visualRules: {
        contrastPair: 'Dark Slate vs Blazing White-Cyan',
        focusDepth: 'Hero Centerpiece Sharp, 65% Negative Space Bokeh Blur',
        lighting: 'Single-Directional Diagonal Cone Spotlight',
        emotion: 'Refined Elegance, Zero Distraction & Mental Clarity',
        palette: 'Monochrome Slate & High-Luminance Accent'
      }
    },
    lifestyle: {
      styleName: 'Emotional Lifestyle',
      styleKey: 'lifestyle',
      aspectRatio: '16:9',
      targetCTR: '>22.4%',
      fullPrompt: lifestyleFull,
      renderPrompt: lifestyleRender,
      layers: lifestyleLayers,
      clickTriggerReason: lifestyleReason,
      visualRules: {
        contrastPair: 'Twilight Dusk Blue vs Cozy Warm Tungsten',
        focusDepth: 'Foreground Steaming Mug Blur, Sharp Face',
        lighting: 'Warm Ambient Lantern & Window Dusk Glow',
        emotion: bp.emotionalExpression,
        palette: 'Warm Amber & Twilight Indigo'
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
