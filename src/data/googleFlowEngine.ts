/**
 * Google Flow (Image-to-Video) Engine for Instrumental Music
 * Targeted at US / Tier-1 Audience.
 *
 * Requirements:
 * 1. Image Prompt:
 *    - Layer 1: Background (location, time, weather, mood-aligned color palette)
 *    - Layer 2: Main subject (iconic category instrument/object, primary sharp focal point)
 *    - Layer 3: Foreground (depth elements: steam/smoke, water droplets on glass, dust particles, foliage)
 *    - Layer 4: Lighting & color grading (rich contrast, dramatic single-directional light)
 *    - Closing: "photorealistic / cinematic detail, aspect ratio 16:9"
 *
 * 2. Video Prompt (Derivative from Image Prompt for Google Flow image-to-video):
 *    - Strictly locked-off static camera (no pan, no zoom, no camera movement, no cut)
 *    - Minimum 2 subtle cyclical motions relevant to the scene
 *    - Seamless 10-second loop with zero jump-cuts
 *    - High-retention visual dynamism in a calm static setting
 */

import { translateKeywordToEnglish } from '../utils/languageTranslator';

export interface GoogleFlowPromptResult {
  imagePrompt: string;
  videoPrompt: string;
  layers: {
    background: string;
    mainSubject: string;
    foreground: string;
    lightingAndGrading: string;
  };
  cyclicMotions: string[];
  cameraRule: string;
  loopSpec: string;
  variationIndex: number;
}

export interface GoogleFlowEngineInput {
  categoryName: string;
  genre: string;
  moods: string[];
  optionalKeyword?: string;
  variationIndex?: number;
}

interface SceneArchetype {
  backgrounds: Array<{
    location: string;
    timeWeather: string;
    palette: string;
  }>;
  subjects: Array<{
    instrument: string;
    description: string;
    focalDetails: string;
  }>;
  foregrounds: Array<{
    depthElements: string;
    opticalFocus: string;
  }>;
  lightings: Array<{
    direction: string;
    contrastMood: string;
  }>;
  videoMotions: Array<{
    motion1: string;
    motion2: string;
    motion3?: string;
  }>;
}

export function generateGoogleFlowPrompts(input: GoogleFlowEngineInput): GoogleFlowPromptResult {
  const { categoryName, genre, moods, optionalKeyword, variationIndex = 0 } = input;
  const translatedKw = translateKeywordToEnglish(optionalKeyword);
  const kw = (translatedKw && translatedKw.trim().length > 0) ? translatedKw.trim() : 'ambient sanctuary';
  const primaryMood = moods[0] || 'Deep Focus';
  const secondaryMood = moods[1] || 'Peaceful';

  const archetype = resolveSceneArchetype(categoryName, genre, kw, primaryMood, secondaryMood);
  
  // Select variation based on variationIndex
  const varIdx = Math.abs(variationIndex) % archetype.backgrounds.length;
  const bg = archetype.backgrounds[varIdx];
  const sub = archetype.subjects[varIdx % archetype.subjects.length];
  const fg = archetype.foregrounds[varIdx % archetype.foregrounds.length];
  const lit = archetype.lightings[varIdx % archetype.lightings.length];
  const mot = archetype.videoMotions[varIdx % archetype.videoMotions.length];

  // 1. Background Layer
  const layerBackground = `Location & Environment: ${bg.location}, ${bg.timeWeather}. Color palette dominated by ${bg.palette} tailored for a ${primaryMood.toLowerCase()} and ${secondaryMood.toLowerCase()} atmosphere.`;

  // 2. Main Subject Layer
  const layerMainSubject = `Primary Focal Point: ${sub.instrument}, ${sub.description}. Razor-sharp macro focus on ${sub.focalDetails}, isolated with shallow depth of field (f/1.8).`;

  // 3. Foreground Depth Layer
  const layerForeground = `Foreground Depth Elements: ${fg.depthElements}, positioned close to the camera lens with ${fg.opticalFocus} creating three-dimensional spatial immersion.`;

  // 4. Lighting & Color Grading Layer
  const layerLightingAndGrading = `Lighting & Color Grading: ${lit.direction}. Rich contrast, deep cinematic shadows, and subtle specular highlights creating ${lit.contrastMood}.`;

  // Final Integrated Image Prompt (Closing with exact mandatory phrase)
  const imagePrompt = `[IMAGE PROMPT - Google Flow Base Image]\n` +
    `${layerBackground} ` +
    `${layerMainSubject} ` +
    `${layerForeground} ` +
    `${layerLightingAndGrading} ` +
    `photorealistic / cinematic detail, aspect ratio 16:9`;

  // Video Prompt (Derivative from the image prompt)
  const cameraRule = `Locked-off tripod camera (strictly no panning, no tilting, no zoom, no camera movement, no cuts).`;
  const cyclicMotions = [mot.motion1, mot.motion2];
  if (mot.motion3) cyclicMotions.push(mot.motion3);

  const loopSpec = `Continuous seamless 10-second loop cycle with identical start and end frames, zero jump-cuts, zero morphing artifacts.`;

  const videoPrompt = `[VIDEO PROMPT - Google Flow Image-to-Video Loop]\n` +
    `Animate the base image with subtle, hypnotic micro-movements engineered for an infinite instrumental music stream. ` +
    `${cameraRule} ` +
    `Isolated cyclical micro-motions: ` +
    `1. ${mot.motion1}. ` +
    `2. ${mot.motion2}. ` +
    (mot.motion3 ? `3. ${mot.motion3}. ` : '') +
    `All motion occurs at natural, gentle velocity while the primary subject (${sub.instrument}) remains stable and razor-sharp. ` +
    `${loopSpec}`;

  return {
    imagePrompt,
    videoPrompt,
    layers: {
      background: layerBackground,
      mainSubject: layerMainSubject,
      foreground: layerForeground,
      lightingAndGrading: layerLightingAndGrading
    },
    cyclicMotions,
    cameraRule,
    loopSpec,
    variationIndex: varIdx
  };
}

function resolveSceneArchetype(
  categoryName: string,
  genre: string,
  kw: string,
  primaryMood: string,
  secondaryMood: string
): SceneArchetype {
  const c = `${categoryName} ${genre}`.toLowerCase();

  // 1. Lo-fi & Chill Beats
  if (c.includes('lofi') || c.includes('lo-fi') || c.includes('chill')) {
    return {
      backgrounds: [
        {
          location: `A cozy top-floor apartment loft overlooking rainy Tokyo city streets filled with soft neon reflections`,
          timeWeather: `at midnight during a steady gentle drizzle`,
          palette: `deep indigo blue, warm amber tungsten, and soft neon magenta`
        },
        {
          location: `A warm artisan coffee shop corner with rain-streaked window panes overlooking a quiet Brooklyn avenue (${kw})`,
          timeWeather: `during late autumn twilight with mist hanging in the air`,
          palette: `rich espresso brown, warm walnut wood, and glowing golden yellow`
        },
        {
          location: `A minimalist study sanctuary with cedar bookshelves and an open balcony overlooking a misty coastal city`,
          timeWeather: `at dusk with overcast lilac skies`,
          palette: `slate charcoal, muted lavender, and warm glowing desk lamp amber`
        }
      ],
      subjects: [
        {
          instrument: `a vintage analog cassette deck and over-ear studio headphones`,
          description: `resting on a rustic wooden study desk beside an open diary and vintage mechanical keyboard`,
          focalDetails: `the spinning magnetic cassette reels and golden brushed aluminum knobs catching warm reflections`
        },
        {
          instrument: `a classic Roland SP-404 sampler with glowing illuminated pads`,
          description: `centered on an oak workspace next to vinyl records and a potted succulent`,
          focalDetails: `tactile rubber pads and LED readout displaying smooth bpm counter`
        },
        {
          instrument: `a handcrafted ceramic coffee mug and vintage fountain pen`,
          description: `resting on handwritten music manuscript notes on a dark cherrywood desk`,
          focalDetails: `intricate wood grain and polished metallic nib catching desk lamp glint`
        }
      ],
      foregrounds: [
        {
          depthElements: `Delicate wisps of steam rising from a hot mug and tiny water condensation beads on a window pane`,
          opticalFocus: `creamy optical bokeh blur in the immediate camera plane`
        },
        {
          depthElements: `Trailing raindrops sliding down the glass surface and out-of-focus Monstera leaves framing the left border`,
          opticalFocus: `soft foreground separation (f/1.8)`
        },
        {
          depthElements: `Gentle warm golden dust motes drifting in the beam of an Edison bulb lamp`,
          opticalFocus: `subtle optical dust particles near the camera lens`
        }
      ],
      lightings: [
        {
          direction: `A single-directional warm tungsten cone desk lamp casting a focused pool of golden light from the upper-left, leaving the rest of the room in rich velvet shadows`,
          contrastMood: `high-contrast cozy warmth with deep clean black levels`
        },
        {
          direction: `Dramatic cool twilight window backlight paired with a warm amber reading spotlight creating strong rim-lighting along the instrument edges`,
          contrastMood: `cinematic two-tone complementary color separation`
        },
        {
          direction: `Soft diffuse desk illumination balanced with distant neon city bokeh reflections trickling across the wooden tabletop`,
          contrastMood: `mellow contemplative atmospheric depth`
        }
      ],
      videoMotions: [
        {
          motion1: `Delicate steam continuously curling and softly dissipating upward from the hot coffee mug`,
          motion2: `Steady raindrops slowly sliding and leaving smooth wet trails down the dark window glass in the background`,
          motion3: `Distant colorful neon city lights gently pulsing in soft circular bokeh`
        },
        {
          motion1: `Tiny warm dust motes floating and lazily drifting through the diagonal tungsten light cone`,
          motion2: `Subtle rhythmic tape reel rotation on the vintage cassette player`,
          motion3: `Water droplets intermittently dripping from the window ledge outside`
        },
        {
          motion1: `Soft breeze causing sheer linen window curtains to sway in a gentle, hypnotic wave`,
          motion2: `Curling aromatic steam rising in smooth laminar swirls`,
          motion3: `Rain streaks shimmering as distant vehicle headlights glide past outside`
        }
      ]
    };
  }

  // 2. Piano & Solo Keys
  if (c.includes('piano') || c.includes('keys')) {
    return {
      backgrounds: [
        {
          location: `A cavernous sunlit neoclassical conservatory hall with towering arched stone windows looking out onto rain-drenched autumn foliage (${kw})`,
          timeWeather: `in the peaceful quiet of early morning mist`,
          palette: `deep obsidian black, pale ivory, and radiant warm champagne gold`
        },
        {
          location: `An intimate dimly lit library room with floor-to-ceiling mahogany bookshelves and a crackling fireplace`,
          timeWeather: `on a chilly winter evening during snowfall`,
          palette: `deep burgundy, warm mahogany, and flickering fire amber`
        },
        {
          location: `A serene glass greenhouse studio surrounded by lush wet ferns and distant mountain peaks`,
          timeWeather: `at golden hour with low-angled sunbeams`,
          palette: `emerald moss green, misty mountain slate, and warm honey gold`
        }
      ],
      subjects: [
        {
          instrument: `a majestic Steinway concert grand piano with polished black lacquer`,
          description: `angled diagonally across the room with open fallboard showcasing gleaming ebony and ivory keys`,
          focalDetails: `the delicate grain of the ivory keys and brass piano pedals catching sharp specular highlights`
        },
        {
          instrument: `a minimalist vintage upright felt piano with warm honey wood casing`,
          description: `positioned near an expansive bay window with open sheet music on the wooden stand`,
          focalDetails: `the subtle texture of dampening felt pads inside the open cabinet and polished brass hinges`
        },
        {
          instrument: `a modern custom acoustic grand piano with raw natural cedar finish`,
          description: `standing proudly on polished marble tiles reflecting the majestic ceiling architecture`,
          focalDetails: `the high-tension piano strings catching crisp golden rim-lighting`
        }
      ],
      foregrounds: [
        {
          depthElements: `A swirling cascade of golden dust particles floating in the sunbeam and the soft blurred curvature of the piano body edge`,
          opticalFocus: `pronounced shallow depth of field (f/1.8)`
        },
        {
          depthElements: `Fine rain droplets trickling across an arched conservatory glass pane in the foreground`,
          opticalFocus: `soft blurred water refraction near lens`
        },
        {
          depthElements: `The softly blurred corner of an antique sheet music stand and a single dried autumn leaf on the polished floor`,
          opticalFocus: `cinematic foreground framing`
        }
      ],
      lightings: [
        {
          direction: `A dramatic single-directional shaft of golden morning light cutting diagonally from the high arched window across the piano keys, leaving the vast hall in moody atmospheric chiaroscuro`,
          contrastMood: `reverent cinematic contrast with deep shadow rolloff`
        },
        {
          direction: `Soft indirect ambient daylight through rain-washed glass supplemented by the warm golden glow of a nearby bronze floor lamp`,
          contrastMood: `intimate emotional warmth and clean tonal gradations`
        },
        {
          direction: `Low-angle sunset rays striking the glossy piano lid and keys, creating a dazzling golden halo around the instrument`,
          contrastMood: `poetic luminescence and golden hour brilliance`
        }
      ],
      videoMotions: [
        {
          motion1: `Golden atmospheric dust particles drifting and tumbling slowly in the diagonal sunbeam`,
          motion2: `Delicate rain streaks sliding down the tall arched window glass in the background`,
          motion3: `Subtle shimmering light refraction gliding across the polished black lacquer of the piano lid`
        },
        {
          motion1: `Faint hypnotic flame flickers from the background fireplace reflecting on the polished floor`,
          motion2: `Gentle snowfall drifting steadily past the dark window panes outside`,
          motion3: `Microscopic dust motes hovering peacefully in the warm lamp light`
        },
        {
          motion1: `Fern fronds outside the window swaying gently in a soft mountain breeze`,
          motion2: `Sunbeam intensity breathing very subtly in a slow 10-second harmonic cycle`,
          motion3: `Rain droplets rolling down the greenhouse glass pane`
        }
      ]
    };
  }

  // 3. Study & Deep Focus / Binaural / Alpha Waves
  if (c.includes('study') || c.includes('focus') || c.includes('binaural') || c.includes('alpha') || c.includes('pomodoro')) {
    return {
      backgrounds: [
        {
          location: `A dark academia university library with multi-tiered walnut book arches, green banker lamps, and spiral wrought-iron staircases (${kw})`,
          timeWeather: `during a quiet midnight thunderstorm with steady window rain`,
          palette: `deep forest green, midnight charcoal, and warm antique brass`
        },
        {
          location: `A high-end minimalist Scandinavian home office with floor-to-ceiling glass looking out over mist-shrouded pine forests`,
          timeWeather: `at crisp autumn dawn with rising fog`,
          palette: `matte black, light ash wood, and cool misty slate gray`
        },
        {
          location: `An architectural loft study with exposed brick walls, industrial drafting tables, and warm Edison bulb arrays`,
          timeWeather: `during a serene late-night coding session`,
          palette: `deep slate navy, warm terracotta brick, and glowing filament amber`
        }
      ],
      subjects: [
        {
          instrument: `a pair of premium matte-black audiophile open-back headphones and an analog brass hourglass timer`,
          description: `centered on a dark walnut desk alongside an open leather-bound research notebook and brass pen`,
          focalDetails: `fine golden sand trickling through the narrow glass neck of the timer and micro-textured headphone mesh`
        },
        {
          instrument: `a vintage mechanical metronome and high-end DAC amplifier with glowing warm tubes`,
          description: `resting on an organized minimalist desk with architectural blue-prints`,
          focalDetails: `the glowing vacuum tubes emitting amber luminescence and brushed metal volume dials`
        },
        {
          instrument: `an artisan brass astrolabe and minimalist analog desk clock with exposed gears`,
          description: `placed beside an open encyclopedia and steaming cup of matcha green tea`,
          focalDetails: `gleaming gear teeth and laser-engraved degree markings on the brass dial`
        }
      ],
      foregrounds: [
        {
          depthElements: `Out-of-focus edge of a leather book cover and fine optical dust motes illuminated in the desk spotlight`,
          opticalFocus: `clean foreground blur with zero visual noise`
        },
        {
          depthElements: `Translucent steam rising from a dark ceramic mug and raindrops on the corner of the desk window`,
          opticalFocus: `soft atmospheric depth separation`
        },
        {
          depthElements: `The blurred silhouette of a potted bonsai tree branch framing the upper frame`,
          opticalFocus: `natural cinematic framing (f/1.8)`
        }
      ],
      lightings: [
        {
          direction: `A single overhead green glass banker lamp casting an intense, focused cone of warm illumination onto the workspace while the background library retreats into deep scholarly darkness`,
          contrastMood: `laser-focused high contrast designed for prolonged flow state`
        },
        {
          direction: `Directional cool morning window light intersecting with a warm LED desk strip creating crisp edge highlights on all metal and wood surfaces`,
          contrastMood: `pristine modern contrast with clinical clarity`
        },
        {
          direction: `Soft ambient warm tungsten lighting from a hanging industrial pendant directly over the desk`,
          contrastMood: `deep cozy concentration with gentle shadows`
        }
      ],
      videoMotions: [
        {
          motion1: `Fine golden sand grains steadily flowing downward through the glass hourglass in a seamless cycle`,
          motion2: `Gentle rain droplets streaking across the dark background window glass`,
          motion3: `Microscopic dust motes slowly drifting through the focused light cone`
        },
        {
          motion1: `Subtle rhythmic pulse of the warm vacuum tubes glowing on the headphone amplifier`,
          motion2: `Light mist drifting slowly across the background pine forest outside the window`,
          motion3: `Faint wisps of steam gently rising from the hot tea cup`
        },
        {
          motion1: `A single smooth metronome pendulum arm gently oscillating in an unhurried, hypnotic cadence`,
          motion2: `Rain streaks trickling down the glass pane at a calming tempo`,
          motion3: `Warm filament glow in the Edison bulb softly breathing with electrical warmth`
        }
      ]
    };
  }

  // 4. Cinematic & Film Score
  if (c.includes('cinematic') || c.includes('film') || c.includes('score') || c.includes('epic')) {
    return {
      backgrounds: [
        {
          location: `A colossal jagged Nordic mountain summit towering above a sea of rolling clouds, with a distant celestial aurora borealis ribbon glowing in the heavens (${kw})`,
          timeWeather: `at twilight during the transition between stormy sunset and starry cosmos`,
          palette: `abyssal midnight teal, stormy slate gray, and blazing fiery gold`
        },
        {
          location: `An ancient stone cathedral ruin overgrown with ivy on a wind-swept cliff overlooking crashing ocean waves`,
          timeWeather: `under dramatic thunderclouds with shafts of godly sunlight breaking through`,
          palette: `weathered stone gray, turbulent ocean navy, and radiant heavenly amber`
        },
        {
          location: `A futuristic orbital space observatory observation deck overlooking the rings of Saturn and swirling cosmic nebula clouds`,
          timeWeather: `in the infinite stillness of deep space`,
          palette: `deep cosmic void black, electric starlight cyan, and radiant solar gold`
        }
      ],
      subjects: [
        {
          instrument: `a heroic master cello and brass French horn with hand-engraved motifs`,
          description: `resting on an ancient stone dais overlooking the majestic mountain abyss`,
          focalDetails: `the richly varnished spruce soundboard catching dramatic rim-light and the gleaming brass bell of the horn`
        },
        {
          instrument: `a colossal orchestral timpani drum with polished copper kettle and thick wooden mallets`,
          description: `positioned on a weathered stone terrace overlooking the raging stormy sea`,
          focalDetails: `the hammered copper surface reflecting the dramatic lightning sky and taut calfskin drum head`
        },
        {
          instrument: `an ancient weathered Celtic war harp with intricate knotwork engravings`,
          description: `standing steadfast on a mist-covered grassy knoll against the towering sky`,
          focalDetails: `the taut silver strings vibrating with subtle tension and golden Celtic inlays catching sunlight`
        }
      ],
      foregrounds: [
        {
          depthElements: `Rolling atmospheric mist wisps curling across the foreground rock ledge and floating glowing embers/sparks`,
          opticalFocus: `heroic wide-angle depth with razor subject isolation`
        },
        {
          depthElements: `Fine ocean spray and out-of-focus jagged granite boulders framing the base of the frame`,
          opticalFocus: `rugged cinematic depth`
        },
        {
          depthElements: `Floating micro cosmic stardust motes and the curved reinforced glass frame of the observatory window`,
          opticalFocus: `epic spatial grandeur`
        }
      ],
      lightings: [
        {
          direction: `A blinding shaft of golden sunrise breaking through heavy storm clouds directly striking the instrument, creating a blazing golden rim-light against the dark abyssal sky`,
          contrastMood: `monumental heroic contrast that commands awe and deep emotion`
        },
        {
          direction: `Dramatic theatrical chiaroscuro with flashes of distant lightning illuminating the clouds and warm lantern light on the stone dais`,
          contrastMood: `intense cinematic tension and majestic depth`
        },
        {
          direction: `Cool cosmic starlight from the nebula on the left balanced by warm golden planetary reflection from the right`,
          contrastMood: `breathtaking dual-toned interstellar luminescence`
        }
      ],
      videoMotions: [
        {
          motion1: `Rolling waves of mountain mist gently cascading down the valleys in the far background`,
          motion2: `Tiny glowing embers and stardust particles slowly rising and drifting through the light beam`,
          motion3: `Celestial aurora band undulating in a slow, hypnotic green and gold wave in the upper sky`
        },
        {
          motion1: `Ocean waves rolling and breaking against the distant sea cliffs in smooth continuous rhythm`,
          motion2: `Shafts of sunlight slowly shifting across the storm clouds in the background`,
          motion3: `Delicate wisps of sea mist drifting across the foreground terrace`
        },
        {
          motion1: `Cosmic nebula dust slowly rotating in an infinite majestic drift`,
          motion2: `Subtle twinkle and shimmer along the crystalline planetary rings`,
          motion3: `Faint reflection of starlight gently moving across the polished instrument body`
        }
      ]
    };
  }

  // 5. Biola & Strings Ensemble
  if (c.includes('biola') || c.includes('string') || c.includes('violin') || c.includes('cello')) {
    return {
      backgrounds: [
        {
          location: `A candlelit baroque stone chamber with arched brick alcoves, velvet tapestries, and antique oil paintings (${kw})`,
          timeWeather: `at midnight during a quiet snowfall visible through tall stained glass windows`,
          palette: `deep royal burgundy, shadow umber, and warm candlelight gold`
        },
        {
          location: `An open sun-drenched European palace balcony overlooking a misty valley of cypress trees and ancient vineyards`,
          timeWeather: `during late afternoon golden hour`,
          palette: `terracotta rose, cypress emerald, and warm radiant champagne amber`
        },
        {
          location: `A moody historic music salon with dark oak parquetry and velvet armchairs`,
          timeWeather: `in the quiet stillness of an autumn twilight rainstorm`,
          palette: `midnight indigo, aged mahogany, and warm glowing wall sconce amber`
        }
      ],
      subjects: [
        {
          instrument: `a mastercrafted 17th-century Stradivarius-style violin and pernambuco bow with real horsehair`,
          description: `resting on an open antique velvet case atop a polished mahogany table`,
          focalDetails: `the delicate carved scroll, honey-amber varnish craquelure, and micro-grooved silver strings`
        },
        {
          instrument: `a deep resonant cello with rich flamed maple back and ebony fingerboard`,
          description: `leaning gently against an antique wrought-iron music stand with handwritten orchestral sheets`,
          focalDetails: `the graceful f-holes and the warm golden reflections catching the cello endpin`
        },
        {
          instrument: `a chamber string quartet ensemble set (two violins, viola, and cello) gathered gracefully`,
          description: `arranged in an elegant semi-circle under a crystal chandelier`,
          focalDetails: `the glistening varnish on the wooden instruments catching multi-faceted crystal light glints`
        }
      ],
      foregrounds: [
        {
          depthElements: `Fine rosin dust particles dancing in the candlelight and the soft blurred curvature of an antique candlestick`,
          opticalFocus: `romantic shallow focus (f/1.8)`
        },
        {
          depthElements: `Out-of-focus velvet drapery edge and falling snow flurries outside the window`,
          opticalFocus: `intimate tactile depth`
        },
        {
          depthElements: `A single dropped sheet of vintage music parchment blurred in the immediate foreground`,
          opticalFocus: `poetic atmospheric framing`
        }
      ],
      lightings: [
        {
          direction: `Warm golden illumination from a cluster of beeswax pillar candles casting soft, flickering key light directly onto the violin wood while shadows dance softly across the stone wall`,
          contrastMood: `deeply romantic and emotionally vulnerable chiaroscuro`
        },
        {
          direction: `Low-angled golden hour sunbeam streaming across the floorboards, cutting through the shadows and setting the varnished wood ablaze with golden highlights`,
          contrastMood: `warm radiant serenity with luminous amber sheen`
        },
        {
          direction: `Soft dual-point lighting: cool blue moonlight from the window pane balanced with warm amber chandelier light`,
          contrastMood: `poetic visual harmony with rich chromatic contrast`
        }
      ],
      videoMotions: [
        {
          motion1: `Gentle, hypnotic candle flames softly flickering and casting dancing golden reflections on the violin body`,
          motion2: `Microscopic golden rosin dust motes drifting lazily through the candle glow`,
          motion3: `Snowflakes drifting quietly past the dark stained glass window in the background`
        },
        {
          motion1: `Sunbeams gently shifting across the polished wooden floorboards`,
          motion2: `Light breeze causing the sheer lace curtains to billow in slow, rhythmic waves`,
          motion3: `Distant cypress leaves outside trembling in the warm afternoon air`
        },
        {
          motion1: `Raindrops sliding smoothly down the dark window glass in the background`,
          motion2: `Subtle shimmering glints on the crystal chandelier droplets`,
          motion3: `Warm candle smoke softly curling upward into the dark shadows`
        }
      ]
    };
  }

  // 6. Guitar & Acoustic Fingerstyle
  if (c.includes('guitar') || c.includes('akustik') || c.includes('fingerstyle')) {
    return {
      backgrounds: [
        {
          location: `A cozy timber log cabin porch overlooking a pristine alpine lake surrounded by pine forests and distant snow-capped peaks (${kw})`,
          timeWeather: `at dusk as the campfire begins to glow under a starry sky`,
          palette: `deep pine evergreen, rustic timber cedar, and glowing campfire orange`
        },
        {
          location: `A sunlit sunroom with rustic terracotta tiles, sprawling potted ferns, and open French doors leading to a blooming countryside garden`,
          timeWeather: `on a warm lazy Sunday afternoon`,
          palette: `warm earth terracotta, botanical leaf green, and sun-kissed honey gold`
        },
        {
          location: `An intimate craftsman woodworking studio filled with acoustic guitar tonewoods, brass tools, and curling wood shavings`,
          timeWeather: `during a peaceful morning coffee break`,
          palette: `natural spruce blonde, aged rosewood, and warm morning sun gold`
        }
      ],
      subjects: [
        {
          instrument: `a premium handcrafted Martin-style acoustic dreadnought guitar with rich sunburst spruce top`,
          description: `propped gently against a rustic cedar chair with an open capo clamped on the fretboard`,
          focalDetails: `the intricate mother-of-pearl rosette inlay, polished bronze strings, and hand-rubbed nitrocellulose lacquer`
        },
        {
          instrument: `a classical nylon-string Spanish guitar with blonde cedar soundboard`,
          description: `resting horizontally across a weathered oak bench beside an empty coffee cup`,
          focalDetails: `the carved slotted headstock, ornate wooden binding, and bone saddle catching sun glints`
        },
        {
          instrument: `a modern custom 12-string acoustic guitar with dark flamed koa wood body`,
          description: `standing on a wooden floor stand with an open leather guitar strap draped beside it`,
          focalDetails: `the luminous golden koa wood curls and gleaming gold Grover tuning pegs`
        }
      ],
      foregrounds: [
        {
          depthElements: `Delicate embers from a stone fire pit drifting in the twilight air and soft blurred wooden railing`,
          opticalFocus: `warm rustic shallow focus (f/1.8)`
        },
        {
          depthElements: `Out-of-focus fern fronds and a cup of warm tea on the edge of the table`,
          opticalFocus: `peaceful organic depth`
        },
        {
          depthElements: `Curling pine wood shavings on the workbench in soft foreground bokeh blur`,
          opticalFocus: `artisan craftsman depth`
        }
      ],
      lightings: [
        {
          direction: `Warm golden campfire light dancing from the bottom-left casting dynamic flicker onto the guitar body, countered by deep twilight blue sky behind the forest canopy`,
          contrastMood: `comforting campfire intimacy with rich warm-cool contrast`
        },
        {
          direction: `Golden hour sunlight filtering through garden foliage, dappling across the spruce guitar top with natural organic patterns`,
          contrastMood: `nostalgic summer warmth and tranquil serenity`
        },
        {
          direction: `Directional morning window light casting a crisp beam across the workshop bench and guitar neck`,
          contrastMood: `clean organic textures and sharp tonal clarity`
        }
      ],
      videoMotions: [
        {
          motion1: `Tiny warm campfire embers lazily floating and rising upward into the twilight night sky`,
          motion2: `Gentle ripples expanding across the calm surface of the alpine lake in the distance`,
          motion3: `Pine tree branches swaying very slightly in the gentle evening breeze`
        },
        {
          motion1: `Dappled sunlight patterns slowly shifting across the acoustic guitar body`,
          motion2: `Gentle breeze swaying the garden greenery outside the open French doors`,
          motion3: `Wisps of warm steam drifting from the ceramic coffee cup`
        },
        {
          motion1: `Golden dust particles floating gracefully in the workshop window light shaft`,
          motion2: `Subtle shimmer of heat rising from a nearby woodstove in the background`,
          motion3: `Gentle motion of tree leaves casting moving shadows on the bench`
        }
      ]
    };
  }

  // 7. Electronic, Synthwave & Ambient
  if (c.includes('electronic') || c.includes('synthwave') || c.includes('ambient') || c.includes('darksynth')) {
    return {
      backgrounds: [
        {
          location: `A futuristic penthouse studio overlooking a sprawling 1980s retro-futuristic cyberpunk megacity shrouded in midnight mist and glowing neon signs (${kw})`,
          timeWeather: `at 2 AM during a light neon drizzle`,
          palette: `deep obsidian black, electric neon cyan, and hot magenta violet`
        },
        {
          location: `A serene space habitat ambient chamber with circular observation portals framing a slowly rotating planet and cosmic star cluster`,
          timeWeather: `in the timeless silence of deep orbit`,
          palette: `cosmic deep space blue, starlight silver, and soft bioluminescent teal`
        },
        {
          location: `An analog synthesizer laboratory with floor-to-ceiling modular patch panels, oscilloscopes, and glowing vacuum tubes`,
          timeWeather: `during a nocturnal electronic composition flow`,
          palette: `matte industrial charcoal, glowing LED amber, and neon emerald green`
        }
      ],
      subjects: [
        {
          instrument: `a classic Roland Juno-106 analog synthesizer and vintage Moog synthesizer`,
          description: `arranged on a brushed steel studio desk with colorful patch cables plugged in`,
          focalDetails: `illuminated red LED buttons, smooth pitch bend bender, and glowing analog audio meters`
        },
        {
          instrument: `a modular Eurorack synthesizer cabinet with glowing multi-color patch cables`,
          description: `standing upright with illuminated green oscilloscope screen showing a smooth sine wave`,
          focalDetails: `knurled aluminum rotary dials, glowing patch jacks, and smooth phosphor wave display`
        },
        {
          instrument: `a futuristic touch-haptic glass sound synthesizer console`,
          description: `resting on an ultra-minimalist floating desk with glowing soundwave ribbons`,
          focalDetails: `translucent holographic interface rings and subtle chromatic aberrations on glass`
        }
      ],
      foregrounds: [
        {
          depthElements: `Soft circular neon bokeh rings and floating atmospheric haze particles catching pink and cyan light`,
          opticalFocus: `cinematic anamorphic lens flare depth (f/1.8)`
        },
        {
          depthElements: `Rain streaks on the exterior futuristic glass window with chromatic light dispersion`,
          opticalFocus: `crisp technological bokeh`
        },
        {
          depthElements: `Curling patch cables in soft foreground blur framing the lower third of the frame`,
          opticalFocus: `immersive studio depth`
        }
      ],
      lightings: [
        {
          direction: `Dramatic split neon lighting: blazing electric cyan key light from the city window balanced by hot magenta accent rim-light across the synthesizer knobs and keys`,
          contrastMood: `hyper-stylized retro-futuristic contrast with deep obsidian blacks`
        },
        {
          direction: `Soft ambient bioluminescent glow radiating from the synthesizer panels and starlight reflection from the planetary curve`,
          contrastMood: `ethereal weightless glow and cosmic serenity`
        },
        {
          direction: `Sharp directional beam from an overhead desk LED arm cutting through subtle studio smoke haze`,
          contrastMood: `moody focused electronic trance atmosphere`
        }
      ],
      videoMotions: [
        {
          motion1: `Soft rhythmic pulse of the synthesizer LED indicators and VU meter needles gently swaying`,
          motion2: `Fine raindrops sliding down the neon-lit panoramic city window in the background`,
          motion3: `Distant futuristic skyline neon signs softly breathing and shimmering in colorful bokeh`
        },
        {
          motion1: `Phosphor sine wave on the oscilloscope screen moving in a continuous, hypnotic liquid wave`,
          motion2: `Distant planet slowly rotating against the field of static cosmic stars in the background`,
          motion3: `Subtle atmospheric dust particles illuminated by the glowing LED panels`
        },
        {
          motion1: `Smooth horizontal scanline glow pulsing softly across the digital display panels`,
          motion2: `Faint smoke haze drifting slowly through the neon light beams`,
          motion3: `Reflections of glowing patch cables gently shimmering on the polished desktop`
        }
      ]
    };
  }

  // 8. Sleep & Deep Relaxation (8 Hours)
  if (c.includes('sleep') || c.includes('relaxation') || c.includes('delta')) {
    return {
      backgrounds: [
        {
          location: `A tranquil dark sanctuary bedroom with floor-to-ceiling glass looking out into a misty midnight pine forest with heavy soothing rainfall (${kw})`,
          timeWeather: `at midnight during an unbroken torrential rainstorm`,
          palette: `deepest midnight navy, dark forest pine, and faint warm candle amber`
        },
        {
          location: `A cozy secluded mountain cabin bedroom with dark timber walls, plush duvet, and large skylight looking up into gentle rain`,
          timeWeather: `during a peaceful deep night downpour`,
          palette: `dark charcoal slate, warm cedar brown, and soft moonlight blue`
        },
        {
          location: `A minimalist Zen pavilion bedroom overlooking a dark reflective koi pond under gently falling autumn rain`,
          timeWeather: `in the dead of night with distant fog`,
          palette: `abyssal ink black, dark river stone, and pale ivory luminescence`
        }
      ],
      subjects: [
        {
          instrument: `a single handcrafted wax pillar candle with a steady, soothing golden flame and an antique Tibetan singing bowl`,
          description: `resting on a dark wooden nightstand beside a ceramic cup of chamomile lavender tea`,
          focalDetails: `the gentle pool of melted wax, radiant golden flame halo, and hammered bronze patina of the singing bowl`
        },
        {
          instrument: `a minimalist bedside water fountain with dark slate tiers and a resting polished stone`,
          description: `placed on a dark slate tabletop beside an unread hardbound book with ribbon bookmark`,
          focalDetails: `the glass-like sheen of water gliding over the dark slate and soft water droplets`
        },
        {
          instrument: `an artisan acoustic wind chime with bamboo tubes and a delicate dark brass gong`,
          description: `hanging inside the sheltered window cove catching distant moonlight`,
          focalDetails: `smooth bamboo nodes and silk cord catching subtle moonlight glint`
        }
      ],
      foregrounds: [
        {
          depthElements: `Heavy rain streams washing down the dark window pane and soft blurred edge of a plush velvet duvet`,
          opticalFocus: `ultra-gentle soothing shallow focus (f/1.8)`
        },
        {
          depthElements: `Out-of-focus window rain droplets and faint wisps of lavender tea steam`,
          opticalFocus: `dreamy sleepy atmosphere`
        },
        {
          depthElements: `Soft sheer linen bed curtain framing the corner with delicate motion blur`,
          opticalFocus: `cocoon-like intimate protection`
        }
      ],
      lightings: [
        {
          direction: `Ultra-low key lighting: a single warm candle flame casting a tiny island of soothing golden light into the surrounding peaceful darkness, with subtle cool moonlight washing the window rain`,
          contrastMood: `deep, sleep-inducing darkness that eliminates all eye fatigue`
        },
        {
          direction: `Extremely dim warm nightstand illumination balanced with the blue ambient wash of rainy midnight glass`,
          contrastMood: `serene cocoon of safety with zero harsh transients`
        },
        {
          direction: `Soft indirect moonlight filtering through rain-streaked skylight glass onto dark wooden textures`,
          contrastMood: `monochromatic tranquil slumber atmosphere`
        }
      ],
      videoMotions: [
        {
          motion1: `Heavy raindrops continuously cascading and washing down the window glass in smooth hypnotic sheets`,
          motion2: `The single candle flame gently and rhythmically breathing in an unhurried, peaceful cycle`,
          motion3: `Distant mist in the pine forest outside slowly rolling through the trees`
        },
        {
          motion1: `Continuous, gentle flow of water trickling silently over the dark slate fountain tiers`,
          motion2: `Rain stream patterns sliding across the glass window pane in unbroken rhythm`,
          motion3: `Faint curl of herbal tea steam softly dissolving into the dark bedroom air`
        },
        {
          motion1: `Rain ripples continuously expanding and merging on the dark pond surface outside`,
          motion2: `Slow, heavy water drops falling from the cabin eaves into the night darkness`,
          motion3: `A single bamboo chime slowly swaying in a 10-second subtle pendulum motion`
        }
      ]
    };
  }

  // 9. Default / Universal Tier-1 Instrumental Archetype
  return {
    backgrounds: [
      {
        location: `An artisan music sanctuary with floor-to-ceiling panoramic glass windows looking out over a peaceful scenic valley (${kw})`,
        timeWeather: `at dusk during a tranquil gentle rainstorm`,
        palette: `midnight navy, rich walnut wood, and glowing warm golden amber`
      },
      {
        location: `A historic sunlit stone library and conservatory with arched windows and tranquil garden views`,
        timeWeather: `during early morning mist with sunlight breaking through`,
        palette: `weathered stone slate, rich forest green, and radiant champagne gold`
      },
      {
        location: `A cozy minimalist studio sanctuary with cedar walls, open bookshelves, and lush potted greenery`,
        timeWeather: `in the peaceful quiet of late twilight`,
        palette: `dark charcoal, warm amber tungsten, and soft botanical emerald`
      }
    ],
    subjects: [
      {
        instrument: `the iconic handcrafted instrument of ${genre} (${categoryName})`,
        description: `centered gracefully on an artisan wooden table with open music manuscript and studio headphones`,
        focalDetails: `the tactile craftsmanship of the instrument, polished wood and brass accents catching sharp specular glints`
      },
      {
        instrument: `an artisan acoustic instrument resting on an antique velvet armchair`,
        description: `positioned beside a steaming mug of tea and glowing desk lamp`,
        focalDetails: `the resonant soundboard and delicate strings or keys under razor-sharp macro focus`
      },
      {
        instrument: `a master instrument placed in a pool of warm spotlight on a dark wooden stage`,
        description: `surrounded by subtle atmospheric haze and sheet music`,
        focalDetails: `the lustrous finish and intricate structural curves highlighted with precision rim-lighting`
      }
    ],
    foregrounds: [
      {
        depthElements: `Translucent steam rising from a warm mug and rain droplets trickling down the window glass in the foreground plane`,
        opticalFocus: `soft optical separation and creamy bokeh (f/1.8)`
      },
      {
        depthElements: `Golden atmospheric dust motes floating in the light shaft and blurred foreground plant leaf`,
        opticalFocus: `cinematic shallow depth of field`
      },
      {
        depthElements: `Water condensation on glass and out-of-focus wooden table edge`,
        opticalFocus: `immersive three-dimensional framing`
      }
    ],
    lightings: [
      {
        direction: `A dramatic single-directional warm spotlight cutting across the workspace from the side, casting rich long shadows and highlighting the instrument's authentic textures`,
        contrastMood: `cinematic chiaroscuro with deep velvet blacks and luminous highlights`
      },
      {
        direction: `Soft natural window light paired with an interior warm amber lamp creating gentle two-tone chromatic contrast`,
        contrastMood: `peaceful serene clarity with zero visual fatigue`
      },
      {
        direction: `Low-angle sunset rays striking the instrument body, casting radiant golden rim-lights along every edge`,
        contrastMood: `warm emotional resonance and poetic atmosphere`
      }
    ],
    videoMotions: [
      {
        motion1: `Delicate wisps of steam curling and dissipating upward in a rhythmic 10-second cycle`,
        motion2: `Steady raindrops slowly sliding and leaving wet trails down the dark window glass in the background`,
        motion3: `Fine golden dust particles lazily dancing through the focused light beam`
      },
      {
        motion1: `Faint ripples of rain water sliding across the glass window surface`,
        motion2: `Gentle warm light intensity breathing subtly in a hypnotic harmonic cycle`,
        motion3: `Soft leaves outside the window swaying gently in the cool breeze`
      },
      {
        motion1: `Tiny luminous atmospheric dust motes drifting across the warm light beam`,
        motion2: `Delicate steam rising in smooth swirls from the hot beverage`,
        motion3: `Reflections of outdoor rain streaks shimmering across the polished tabletop`
      }
    ]
  };
}
