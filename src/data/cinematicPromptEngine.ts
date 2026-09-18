/**
 * TuneForge Cinematic Prompt & Video Animation Engine
 * Specialized for YouTube Instrumental Music, Study Loops, Sleep Soundscapes, and Ambient Beats.
 * Compatible with Google Flow, Midjourney, DALL-E 3, Stable Diffusion (Images)
 * and Google Flow / Veo, Runway ML, Kling AI, Pika Labs, Luma Dream Machine (Videos).
 */

import { CinematicPromptVariant, CinematicVisualBundle, CinematicVariantType } from '../types';

export const UNIVERSAL_NEGATIVE_PROMPT = 
  `ugly, deformed, blurry, pixelated (kecuali pixel art), jpeg artifacts, watermark, tanda tangan, text overlay, logo, border, frame, bad anatomy, duplicate, nsfw, konten tidak pantas, gambar stok korporat generik, pencahayaan datar, tidak ada bayangan, tekstur plastik, terlalu terang, terlalu gelap, overexposed, underexposed`;

export const MANDATORY_IMAGE_MODIFIER = 
  `ultra-detailed, 8K resolution, cinematic color grading, professional photography quality, award-winning composition, rule of thirds, shallow depth of field, volumetric lighting, global illumination, HDR, no watermark, no text overlay, no borders`;

export function getMandatoryVideoModifier(loopSeconds: number = 10): string {
  return `4K cinematic quality, seamless loop, ultra-slow hypnotic movement, no camera shake, smooth motion, ${loopSeconds}-second loop`;
}

interface CategoryKnowledge {
  id: string;
  name: string;
  audience: string;
  mood: string;
  palette: string;
  lighting: string;
  styleRefs: string;
  tags: string[];
  loopSeconds: number;
  variants: {
    Scene: {
      subject: string;
      environment: string;
      lighting: string;
      palette: string;
      mood: string;
      styleRef: string;
      camera: string;
      videoMotionText: string;
      runwayAction: string;
      klingScene: string;
      pikaVerb: string;
      lumaScene: string;
    };
    Subjek: {
      subject: string;
      environment: string;
      lighting: string;
      palette: string;
      mood: string;
      styleRef: string;
      camera: string;
      videoMotionText: string;
      runwayAction: string;
      klingScene: string;
      pikaVerb: string;
      lumaScene: string;
    };
    Abstrak: {
      subject: string;
      environment: string;
      lighting: string;
      palette: string;
      mood: string;
      styleRef: string;
      camera: string;
      videoMotionText: string;
      runwayAction: string;
      klingScene: string;
      pikaVerb: string;
      lumaScene: string;
    };
  };
}

export const CATEGORY_DATABASE: Record<string, CategoryKnowledge> = {
  // 01 — LO-FI & CHILL BEATS
  'cat-01': {
    id: 'cat-01',
    name: '01 — LO-FI & CHILL BEATS',
    audience: '16–32 years old, university students & urban remote workers',
    mood: 'Cozy, nostalgic, intimate, warm, deep focus',
    palette: 'Amber (#E8A427), dark navy (#1A2744), faded lavender (#8B7BAF), warm cream (#F5E6C8)',
    lighting: 'Warm 3000K tungsten lamp, soft neon bleed, rainy city bokeh outside, soft laptop glow',
    styleRefs: 'Studio Ghibli (Whisper of the Heart), Lo-fi Girl YouTube aesthetic, Makoto Shinkai color grading, retro anime illustration',
    tags: ['lofi-hip-hop', 'cozy-aesthetic', 'ghibli-style', 'rainy-window', 'late-night-study', 'warm-tungsten', 'retro-anime'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A quiet Tokyo bedroom studio with an open wooden desk, ceramic coffee mug, and a sleeping calico cat curled atop stacked vintage books',
        environment: 'A panoramic rain-streaked window overlooking a softly blurred neon Tokyo skyline at midnight, pothos ivy trailing down dark walnut shelves, polaroid photos and warm fairy lights strung along textured plaster walls',
        lighting: 'A glowing warm 3000K Edison desk lamp casting an intimate amber pool of light across the desk surface, soft blue-navy city neon bleeding through raindrops, volumetric light rays passing through delicate coffee steam',
        palette: 'Rich amber (#E8A427), midnight navy (#1A2744), muted lavender (#8B7BAF), and soft buttermilk cream (#F5E6C8)',
        mood: 'Nostalgic, peaceful, deeply comforting, and focused',
        styleRef: 'Studio Ghibli Whisper of the Heart interior mood paired with Makoto Shinkai atmospheric depth and high-end anime aesthetic',
        camera: 'Eye-level wide interior cinematic framing, balanced rule of thirds, f/2.0 aperture with creamy city bokeh in the deep background and crisp foreground desk textures',
        videoMotionText: 'Delicate coffee steam rises in an ultra-slow hypnotic spiral from the ceramic mug (4-second loop). Continuous gentle rain rivulets slowly trace down the exterior glass window pane. The sleeping calico cat breathes in an almost imperceptible rhythmic rise and fall of its chest (4-second breath cycle). Distant blurred city neon lights pulse and shift minutely with ethereal bokeh drift.',
        runwayAction: 'Coffee steam slowly curling upwards while raindrops glide down glass',
        klingScene: 'Static locked shot of a rainy Tokyo bedroom with sleeping cat and warm desk lamp',
        pikaVerb: 'Delicate steam slowly curling from hot coffee mug by rainy window',
        lumaScene: 'A peaceful rainy midnight bedroom in Tokyo with soft amber desk lamp lighting. Steam floats gently from a warm cup, raindrops slowly slide down the dark window, and a sleeping cat breathes peacefully.'
      },
      Subjek: {
        subject: 'A vintage cream-and-brass turntable spinning a black vinyl record with delicate needle grooves, placed beside a warm ceramic mug and open notebook with handwritten notes',
        environment: 'A cozy corner desk draped in soft knitted wool throw blanket, an aged acoustic guitar neck resting gently against a weathered wooden bookshelf, faint bokeh of fairy lights in background',
        lighting: 'Directional low-angle warm incandescent glow raking across the vinyl surface, highlighting the micro-grooves and warm golden reflections on brass components',
        palette: 'Warm honey amber, brass gold, deep vinyl obsidian black, and antique parchment cream',
        mood: 'Intimate, tactile, warm, meditative',
        styleRef: 'Fujifilm 35mm film photography texture, Lo-fi Girl desktop aesthetic with rich organic grain and gentle cinematic glow',
        camera: 'Macro tight close-up shot, shallow depth of field f/1.8, razor-sharp focus on the brass tonearm and spinning vinyl label with soft focus falloff on background books',
        videoMotionText: 'The black vinyl record rotates with an ultra-smooth, hypnotic 33 RPM precision cycle. A faint trace of fragrant coffee vapor drifts across the lower corner of the frame. Subtle golden dust motes dance in the warm beam of the desk lamp in a continuous, weightless suspension.',
        runwayAction: 'Vinyl record spinning smoothly on vintage player while ambient dust floats in warm spotlight',
        klingScene: 'Macro close-up of a vintage turntable tonearm and spinning vinyl with soft floating dust particles',
        pikaVerb: 'Smoothly rotating vinyl record on vintage turntable with floating dust motes',
        lumaScene: 'An intimate macro perspective of a spinning vinyl record in a warm studio. Golden light glints off brass hardware while subtle dust motes float peacefully in the illuminated air.'
      },
      Abstrak: {
        subject: 'An ethereal composition of floating retro cassette tapes and translucent vinyl disc rings melting into swirling streams of golden lo-fi sound waves and iridescent water droplets',
        environment: 'A dreamlike nocturnal void bathed in soft atmospheric rain mist, overlapping geometric pastel anime window panes, and luminous neon city bokeh spheres drifting in deep space',
        lighting: 'Bioluminescent lavender and amber rim lighting, soft diffused backlight glowing through translucent plastic cassette shells, radiant volumetric light streaks',
        palette: 'Midnight indigo (#1A2744), luminous amber (#E8A427), vapor lavender (#8B7BAF), and pearlescent cream',
        mood: 'Dreamy, hypnotic, nostalgic, surreal tranquility',
        styleRef: 'Makoto Shinkai sky gradients meets Lo-fi anime concept art and retro-futuristic vapor aesthetic',
        camera: 'Centered geometric abstract composition, high cinematic symmetry, floating spatial layers with extreme depth separation',
        videoMotionText: 'Translucent vinyl rings and cassette ribbons drift and rotate at an ultra-slow meditative pace. Luminous amber bokeh orbs expand and contract softly in a 10-second rhythmic breathing cycle. Floating microscopic raindrops suspend and glisten weightlessly throughout the frame.',
        runwayAction: 'Translucent abstract vinyl rings rotating ultra-slowly in a dreamy atmospheric mist',
        klingScene: 'Abstract ethereal composition of glowing vinyl rings and floating cassette ribbons in cosmic rain mist',
        pikaVerb: 'Glowing abstract vinyl rings drifting smoothly in slow motion through neon bokeh',
        lumaScene: 'An abstract dreamscape where translucent vinyl records and golden light waves float in deep indigo space. Bokeh particles expand like gentle breathing and glowing raindrops hang suspended.'
      }
    }
  },

  // 02 — PIANO INSTRUMENTAL
  'cat-02': {
    id: 'cat-02',
    name: '02 — PIANO INSTRUMENTAL',
    audience: '25–55 years old, classical & jazz lovers, upper-middle class, mindful listeners',
    mood: 'Elegant, introspective, dramatic, luxurious, emotionally profound',
    palette: 'Piano ebony (#0D0D0D), ivory white (#FFFFF0), antique gold (#C9A84C), deep burgundy (#7A1F2E)',
    lighting: 'High-contrast chiaroscuro, single dramatic overhead spotlight, flickering candlelight, soft winter daylight from arched palace window',
    styleRefs: 'Edward Hopper interior solitude, Stanley Kubrick Barry Lyndon cinematography, Hiroshi Sugimoto fine art photography, Yann Tiersen minimalist album visual',
    tags: ['grand-piano', 'steinway', 'chiaroscuro', 'classical-elegance', 'poetic-keys', 'candlelight-ambience', 'cinematic-luxury'],
    loopSeconds: 12,
    variants: {
      Scene: {
        subject: 'A majestic Steinway & Sons Model D concert grand piano with high-gloss ebony lacquer and open lid revealing gleaming brass harp strings',
        environment: 'A grand deserted European conservatory hall with tall arched French windows overlooking a quiet winter rainfall on evergreen gardens, antique Persian rug resting on herringbone oak parquet floors, heavy burgundy velvet drapes framing the tall windows',
        lighting: 'Dramatic single spotlight from above piercing through misty ambient air, casting long romantic shadows, complemented by the soft silvery luminescence of diffused daylight reflecting off the damp window glass',
        palette: 'Piano ebony (#0D0D0D), rich ivory (#FFFFF0), burnished gold (#C9A84C), and regal bordeaux wine (#7A1F2E)',
        mood: 'Solitary, melancholic, grand, contemplative',
        styleRef: 'Stanley Kubrick chiaroscuro composition combined with Hiroshi Sugimoto spatial minimalism and Edward Hopper interior solitude',
        camera: 'Wide architectural cinematic shot, eye-level perspective, rule of thirds placement of the grand piano, extreme textural clarity from polished wood to weathered stonework',
        videoMotionText: 'Fine golden dust motes drift with extreme slowness through the single diagonal sunbeam. Heavy bordeaux velvet curtains sway in an imperceptible, rhythmic breath from a cracked windowpane. Soft shadows along the piano rim breathe in a 12-second cycle between dim and radiant illumination.',
        runwayAction: 'Dust motes floating languidly in a single dramatic spotlight across a grand piano',
        klingScene: 'Static wide shot of a solitary grand piano in a vast conservatory with drifting dust particles and breathing spotlight',
        pikaVerb: 'Ethereal dust particles drifting slowly through spotlight over concert grand piano',
        lumaScene: 'A solitary Steinway grand piano stands in a vast classical European hall. A single spotlight slowly illuminates drifting dust motes in the air, while raindrops fall softly against tall arched windows outside.'
      },
      Subjek: {
        subject: 'An intimate macro perspective of pristine ivory and polished ebony piano keys, with the gold leaf Steinway emblem and delicate handwritten sheet music resting nearby',
        environment: 'The polished fallboard reflecting candle flames and warm room tones, a brass metronome softly out of focus in the background on rich mahogany wood',
        lighting: 'Warm flickering candlelight from vintage brass candelabras dancing across the polished black lacquer and ivory textures, creating rich specular highlights and deep velvety shadows',
        palette: 'Deep lacquer black, warm ivory cream, antique candle flame amber, and mahogany brown',
        mood: 'Intimate, emotional, deeply poetic',
        styleRef: 'High-end Leica 50mm f/1.2 fine art photography, dark academia aesthetic, Yann Tiersen album artwork',
        camera: 'Macro close-up angled across the keyboard, razor-thin depth of field f/1.4 focusing sharply on middle C and neighboring keys with dreamy falloff towards both edges',
        videoMotionText: 'The warm flame of the brass candelabra flickers with organic, desynchronized subtle quivering. Warm amber light reflections shimmer softly across the polished ebony lacquer surface. A single sheet of aged manuscript music paper flutters with an almost imperceptible micro-vibration.',
        runwayAction: 'Candlelight flickering softly with warm reflections shifting over polished piano keys',
        klingScene: 'Macro detail of piano keys under warm flickering candlelight with subtle reflection shifts',
        pikaVerb: 'Gentle candle flame flickering over ivory and ebony piano keys',
        lumaScene: 'A close-up of piano keys bathed in intimate candlelight. The golden flame quivers gently, casting shifting warm reflections on the glossy black wood and aged paper music sheets.'
      },
      Abstrak: {
        subject: 'Sculptural flying geometric ivory keys, gilded brass piano strings, and suspended black lacquer soundboards deconstructed into an impossible architectural spiral',
        environment: 'A vast minimalist obsidian void with calm black water pool below reflecting floating golden musical notes and ethereal light prisms',
        lighting: 'Volumetric golden rim lighting raking across suspended piano wire strings, prismatic light refractions casting rainbow caustics across the dark water surface',
        palette: 'Pure black (#0D0D0D), gleaming brass gold (#C9A84C), crystalline white (#FFFFF0), and iridescent champagne',
        mood: 'Sublime, monumental, transcendental, hypnotic',
        styleRef: 'Zaha Hadid fluid architectural forms blended with Gustav Klimt golden ornamental geometry and Christopher Nolan Interstellar visual elegance',
        camera: 'Slow sweeping centered perspective, mathematical golden ratio spiral composition, pristine symmetry',
        videoMotionText: 'Suspended brass strings vibrate with micro-harmonic wave ripples. The floating ivory keys tilt and drift in an ultra-slow 15-second orbital cycle. Concentric water ripples slowly propagate across the glassy dark floor from a single invisible droplet.',
        runwayAction: 'Gilded piano strings and floating ivory keys slowly orbiting in an architectural void',
        klingScene: 'Abstract slow-motion rotation of architectural piano elements and water reflections in a dark void',
        pikaVerb: 'Floating piano keys and glowing strings vibrating gently in dark architectural space',
        lumaScene: 'An abstract monumental visual of piano strings and keys suspended over mirror-calm dark water. Ripples expand with serene slowness as golden light glimmers off brass wires.'
      }
    }
  },

  // 03 — STUDY, FOCUS & WORK MUSIC
  'cat-03': {
    id: 'cat-03',
    name: '03 — STUDY, FOCUS & WORK MUSIC',
    audience: '18–35 years old, university students & young professionals, productivity enthusiasts',
    mood: 'Focused, clean, serene, Scandinavian-minimalist, disciplined',
    palette: 'Sage green (#8FAF8F), warm off-white (#F9F6F0), solid natural oak (#A07850), slate blue (#4A6FA5)',
    lighting: 'Crisp northern natural daylight (diffused, glare-free), complemented by a minimalist warm matte-white task lamp',
    styleRefs: 'Muji minimalist product design, Kinfolk magazine editorial photography, Japanese stationary catalog, Notion workspace aesthetics',
    tags: ['study-music', 'deep-focus', 'scandinavian-desk', 'kinfolk-minimalism', 'pomodoro-beats', 'clean-workspace', 'natural-light'],
    loopSeconds: 10,
    variants: {
      Scene: {
        subject: 'An immaculate Scandinavian oak study desk with an open aluminum laptop (screen tastefully blurred with clean code), a steaming ceramic mug of matcha, and a matte-black mechanical pencil resting on a dotted leather notebook',
        environment: 'A sun-drenched minimalist home office with a lush potted monstera deliciosa and trailing pothos in terracotta planters, large floor-to-ceiling window overlooking serene misty pine treetops under an overcast morning sky',
        lighting: 'Soft, diffused northern skylight flooding the room with clean neutral illumination, supplemented by the gentle 3500K warm cone of an architect task lamp',
        palette: 'Nordic sage green (#8FAF8F), linen white (#F9F6F0), pale honey oak (#A07850), and muted slate blue (#4A6FA5)',
        mood: 'Ultra-clear, peaceful, distraction-free, mindful productivity',
        styleRef: 'Kinfolk magazine interior spread combined with Muji clean design principles and high-end architectural digest photography',
        camera: 'Eye-level 45-degree angled perspective, wide composition with balanced negative space, razor-sharp focus on the notebook and pen, creamy natural depth of field outside',
        videoMotionText: 'A delicate swirl of steam rises smoothly from the ceramic tea mug in a continuous meditative 4-second loop. Outside the window, soft morning fog and pine tree branches sway with an almost imperceptible breeze. The daylight patch across the oak desk shifts with ultra-slow time-lapse subtlety.',
        runwayAction: 'Subtle steam rising from a ceramic mug on a minimalist wooden study desk',
        klingScene: 'Static shot of a Scandinavian study desk with gentle steam and slowly swaying outdoor pine branches',
        pikaVerb: 'Slow steam curling from hot tea mug on clean wooden study desk',
        lumaScene: 'A serene Scandinavian desk overlooking misty pine trees. Delicate vapor floats from a warm mug, while daylight gently illuminates clean paper notebooks and green houseplants.'
      },
      Subjek: {
        subject: 'A sculpted pair of matte cream wireless studio headphones resting gracefully alongside an open premium linen planner with fountain pen and brass ruler on textured wood grain',
        environment: 'A quiet morning library alcove, smooth concrete wall accent in background with soft out-of-focus green foliage shadows',
        lighting: 'Raking morning sunlight casting graphic, soft-edged shadows across the textured linen cover and the rich wood grain ridges',
        palette: 'Matte chalk cream, sage green leaf, warm brass, and bleached white oak',
        mood: 'Tactile, serene, deliberate, organized',
        styleRef: 'Hasselblad medium format editorial still life, Japanese stationery monograph',
        camera: 'Overhead flat-lay to slight 30-degree isometric angle, extreme macro detail of the leather headphone cushion and fibrous paper texture, shallow depth of field',
        videoMotionText: 'Dappled leaf shadows shift and sway with gentle rhythmic movement across the open planner pages. A faint, slow-moving dust mote floats diagonally across the ray of light. The brass ruler catches a slow, subtle glint as the sun angle changes minutely.',
        runwayAction: 'Dappled leaf shadows gently swaying across an open planner and wireless headphones',
        klingScene: 'Close-up flat lay of headphones and notebook with organic swaying foliage shadows',
        pikaVerb: 'Gentle dappled sunlight and leaf shadows swaying on wooden desk surface',
        lumaScene: 'An overhead still life of headphones and an open planner on oak wood. Soft morning shadows from leaves outside shift slowly across the paper, creating a calming study atmosphere.'
      },
      Abstrak: {
        subject: 'Floating minimalist geometric blocks of frosted glass, polished sage marble, and pale oak cubes arranged in a calming zen balance',
        environment: 'An architectural void of warm linen texture with soft architectural arches and endless soft gradient horizons',
        lighting: 'Diffused studio softbox illumination creating buttery soft ambient occlusion shadows and glowing edges on frosted glass',
        palette: 'Warm off-white (#F9F6F0), frosted sage (#8FAF8F), warm sand (#A07850), and muted sky grey',
        mood: 'Harmonious, weightless, mental clarity, zen order',
        styleRef: 'Dieter Rams Braun design ethos meets 3D architectural minimalism and James Turrell light installations',
        camera: 'Centered isometric architectural perspective, perfectly balanced proportions, clean negative space',
        videoMotionText: 'The frosted glass and marble geometric forms elevate and settle in an ultra-slow 12-second levitation cycle. Soft light gradients slowly pulse through the frosted glass elements like a calm, slow breathing exercise.',
        runwayAction: 'Minimalist marble and frosted glass geometric blocks slowly levitating in ambient light',
        klingScene: 'Calm 3D geometric composition of floating frosted glass and stone blocks breathing slowly',
        pikaVerb: 'Smooth levitation of minimalist frosted glass shapes in soft ambient light',
        lumaScene: 'Abstract geometric blocks of stone and frosted glass float in weightless balance. Gentle light pulses softly through the translucent materials in a hypnotic, meditative rhythm.'
      }
    }
  },

  // 04 — CINEMATIC & FILM SCORE
  'cat-04': {
    id: 'cat-04',
    name: '04 — CINEMATIC & FILM SCORE',
    audience: '22–50 years old, film enthusiasts, Hans Zimmer & Ennio Morricone fans, epic creators',
    mood: 'Epic, monumental, dramatic, heroic, deeply emotional, cinematic',
    palette: 'Teal (#2A7F7F) & rich orange (#D4681A), pitch obsidian shadows (#0A0A0A), storm cloud grey (#4A4A4A)',
    lighting: 'Golden hour (58 minutes before sunset), dramatic rim lighting, majestic god rays breaking through turbulent storm clouds',
    styleRefs: 'Roger Deakins cinematography (Blade Runner 2049, Sicario), Emmanuel Lubezki (The Revenant), Weta Digital matte painting, Unreal Engine 5 high-fidelity render',
    tags: ['cinematic-score', 'epic-orchestral', 'god-rays', 'roger-deakins-style', 'stormy-horizon', 'hans-zimmer-vibes', 'film-trailer'],
    loopSeconds: 15,
    variants: {
      Scene: {
        subject: 'A solitary wanderer in a weathered woolen cloak standing at the precipice of a colossal mountain ridge overlooking an endless jagged canyon',
        environment: 'A vast cinematic mountain landscape with ancient stone monoliths, dramatic cumulonimbus storm clouds gathering in deep valleys below, dramatic distant waterfalls cascading into mist',
        lighting: 'Monumental golden hour god rays piercing through a rift in heavy slate-gray storm clouds, illuminating the valley floor with brilliant golden amber against deep cyan shadows',
        palette: 'Cinematic teal (#2A7F7F), burning amber-orange (#D4681A), basalt black (#0A0A0A), and misty atmospheric fog',
        mood: 'Awe-inspiring, epic, solitary, monumental, emotional triumph',
        styleRef: 'Roger Deakins framing from Blade Runner 2049 combined with Emmanuel Lubezki grand naturalistic landscape cinematography in The Revenant',
        camera: 'Ultra-wide anamorphic 2.39:1 widescreen framing, sweeping cinematic composition with tiny human figure establishing colossal scale, razor-sharp mountain ridgeline',
        videoMotionText: 'Turbulent storm clouds roll through the deep mountain passes in a slow, dramatic time-lapse wave. Majestic volumetric god rays slowly sweep from left to right across the rocky valley floor (15-second cycle). Atmospheric mist drifts continuously across the bottom of the frame while the cloak hem flutters gently in high-altitude wind.',
        runwayAction: 'Massive god rays sweeping across a vast mountain canyon with rolling clouds below',
        klingScene: 'Epic anamorphic shot of mountain peaks with sweeping volumetric god rays and billowing storm clouds',
        pikaVerb: 'God rays sweeping across epic mountain valley with slowly rolling fog',
        lumaScene: 'An epic cinematic vista of jagged mountain peaks at sunset. Golden sunbeams pierce dark storm clouds, illuminating deep canyons while mist rolls slowly across the landscape.'
      },
      Subjek: {
        subject: 'An antique weathered French horn or orchestral cello standing upright amidst cracked volcanic stone, with intricate engravings and aged patina glowing under dramatic rim light',
        environment: 'A windswept black sand beach with dramatic sea stack pillars in the crashing surf, distant glowing embers floating across the dark shore',
        lighting: 'Intense low-angle golden sunset rim light carving the instrument silhouette sharply against dark oceanic blues and storm gray clouds',
        palette: 'Warm copper brass, volcanic black sand, oceanic deep teal, and ember orange',
        mood: 'Heroic, weathered, timeless, battle-tested melody',
        styleRef: 'Weta Digital practical miniature photography combined with Zack Snyder 300 dramatic rim lighting and IMAX fidelity',
        camera: 'Low-angle heroic close-up, Dutch angle tilt, shallow depth of field focusing on the weathered brass valves and scratches with majestic ocean surf blurred behind',
        videoMotionText: 'Fine volcanic sand grains and glowing amber embers drift across the base of the instrument in an ultra-slow wind stream. Distant ocean waves break in the background with majestic slow-motion white foam. The golden rim light flares subtly across the brass curve in a 10-second breath.',
        runwayAction: 'Glowing embers drifting past a weathered orchestral instrument on a stormy beach',
        klingScene: 'Low-angle dramatic hero shot of a cello on black sand beach with drifting embers and crashing slow-motion surf',
        pikaVerb: 'Embers drifting past musical instrument on stormy black sand coast',
        lumaScene: 'A lone musical instrument rests on a dramatic volcanic shore. Sea mist and glowing golden embers drift through the cool air while waves crash in cinematic slow motion behind it.'
      },
      Abstrak: {
        subject: 'A colossal kinetic monolith of interlocking bronze and dark titanium gears and soundwave waveforms rotating in suspended gravity',
        environment: 'An infinite cosmic hall of mirrors with golden light beams intersecting through volumetric fog and floating dust motes',
        lighting: 'High-contrast dual lighting: cold cyan spotlight from below and fiery amber volumetric light from the zenith, casting graphic geometric shadows',
        palette: 'Deep space black (#0A0A0A), blazing tungsten orange (#D4681A), and cool laser teal (#2A7F7F)',
        mood: 'Mysterious, monumental, cerebral, immense power',
        styleRef: 'Denis Villeneuve Dune film aesthetic meets Hans Zimmer cinematic intensity and architectural sci-fi minimalism',
        camera: 'Symmetrical center framing, towering vertical perspective, mathematical precision with extreme depth perspective',
        videoMotionText: 'The colossal geometric monolith rotates with an ultra-slow, hypnotic 60-second mechanical precision. Intersecting light beams pulse gently like a slow heartbeat. Atmospheric dust particles float weightlessly across the beam intersections.',
        runwayAction: 'Monumental geometric bronze monolith rotating ultra-slowly in volumetric light beams',
        klingScene: 'Symmetrical abstract shot of colossal sci-fi monolith rotating slowly with pulsing light shafts',
        pikaVerb: 'Monumental geometric structure rotating smoothly in cinematic volumetric fog',
        lumaScene: 'A colossal bronze monolith rotates with immense weight in a misty void. Shafts of warm orange and cool teal light cut through the darkness, illuminating floating dust in an awe-inspiring loop.'
      }
    }
  },

  // 05 — BIOLA & STRING ENSEMBLE
  'cat-05': {
    id: 'cat-05',
    name: '05 — BIOLA & STRING ENSEMBLE',
    audience: '28–60 years old, Bridgerton/Outlander fans, classical drama and romance lovers',
    mood: 'Emotional, elegant, intense, European romantic, deeply poignant',
    palette: 'Bordeaux wine (#7D1F3A), Venetian gold (#C5A028), rich mahogany (#5C2E0E), warm ivory (#FFFAED)',
    lighting: 'Intimate candlelight primary source, stage footlights, dramatic Caravaggio chiaroscuro with deep velvety shadows',
    styleRefs: 'Johannes Vermeer interior light, Caravaggio chiaroscuro paintings, Netflix Bridgerton production design, Hilary Hahn photography',
    tags: ['violin-solo', 'string-ensemble', 'caravaggio-light', 'romantic-classical', 'bridgerton-aesthetic', 'stradivarius', 'candlelight-strings'],
    loopSeconds: 10,
    variants: {
      Scene: {
        subject: 'An intimate string quartet performing inside an opulent 18th-century European baroque palace salon, with golden music stands and period instruments',
        environment: 'A grand salon with gilded plaster moldings, frescoed ceilings, tall arched mirrors reflecting candelabras, rich deep emerald and ruby velvet drapery, and a polished parquet floor',
        lighting: 'Hundreds of desynchronized flickering beeswax candles on tall crystal chandeliers and gilded sconces casting warm golden light, contrasted with cool moonlight through tall casement windows',
        palette: 'Bordeaux red (#7D1F3A), burnished Venetian gold (#C5A028), deep mahogany (#5C2E0E), and soft candlelight cream (#FFFAED)',
        mood: 'Intensely romantic, aristocratic, emotionally resonant, timeless',
        styleRef: 'Bridgerton ballroom warmth combined with Stanley Kubrick candlelit realism in Barry Lyndon and Vermeer light diffusion',
        camera: 'Medium-wide cinematic master shot, balanced theatrical staging, f/2.0 aperture keeping the string quartet sharp while crystal chandeliers sparkle with creamy bokeh above',
        videoMotionText: 'Hundreds of candle flames dance and flicker organically without synchronization. Golden rosin dust particles float and swirl lazily in the warm air currents above the performers. Deep velvet curtains beside the tall windows flutter gently in a quiet night breeze.',
        runwayAction: 'Candlelight flickering softly over string musicians in an opulent gilded ballroom',
        klingScene: 'Atmospheric wide shot of baroque salon with flickering crystal chandeliers and floating rosin dust',
        pikaVerb: 'Flickering candlelight and floating golden dust in opulent baroque concert room',
        lumaScene: 'An opulent candlelit salon where string instruments gleam in warm golden light. Crystal chandeliers flicker gently, casting dancing refractions on gilded walls while fine rosin dust glints in the air.'
      },
      Subjek: {
        subject: 'A masterwork Stradivarius violin with radiant red-amber varnish, detailed curly maple back grain, carved scroll, and delicate horsehair bow resting across steel strings',
        environment: 'Resting on a plush dark bordeaux velvet cushion beside an aged handwritten Italian musical score on yellowed parchment, with rosin powder dusting the spruce top',
        lighting: 'Dramatic single-source raking candlelight emphasizing the wood grain ripples, f-hole depth, and the luminous amber reflections on the carved arching',
        palette: 'Red-amber violin varnish, bordeaux velvet, aged parchment ivory, and warm beeswax gold',
        mood: 'Intimate, passionate, exquisite craftsmanship, solitary song',
        styleRef: 'Vermeer textured chiaroscuro painting meets high-end violin luthier fine art photography',
        camera: 'Macro low-angle close-up focusing sharply on the violin bridge, strings, and f-hole, with dreamy falloff towards the scroll and background velvet folds',
        videoMotionText: 'Fine particles of golden rosin dust drift weightlessly across the violin strings in a slow micro-current. Candlelight shimmers with organic micro-quivers across the lustrous red-amber varnish. A single strand of bow horsehair vibrates imperceptibly in the still air.',
        runwayAction: 'Warm candlelight glistening across the varnished curves of an antique violin',
        klingScene: 'Macro close-up of a Stradivarius violin under flickering candlelight with floating rosin particles',
        pikaVerb: 'Candlelight shifting over antique violin strings with floating gold dust',
        lumaScene: 'A close-up of an antique Stradivarius violin resting on velvet. Candlelight dances across its rich red-amber varnish, illuminating fine rosin dust that floats peacefully above the strings.'
      },
      Abstrak: {
        subject: 'A soaring spiral of golden f-holes, curving violin ribs, and luminous crystalline strings unwinding like liquid amber ribbon through deep space',
        environment: 'A luxurious dark void filled with suspended golden dust constellations and dark crimson silk ribbons flowing in zero gravity',
        lighting: 'Radiant inner luminescence from the golden curves, rimmed with intense Venetian gold and deep wine-red volumetric spotlights',
        palette: 'Imperial bordeaux (#7D1F3A), Venetian gold leaf (#C5A028), obsidian black, and warm pearl glow',
        mood: 'Transcendent, lyrical, hypnotic, sensory opulence',
        styleRef: 'Art Nouveau Alphonse Mucha sinuous curves combined with Gustav Klimt golden leaf ornamentation and high-end 3D sculptural motion art',
        camera: 'Continuous flowing spiral composition, extreme dynamic range, fluid golden ratio curvature',
        videoMotionText: 'The liquid golden string ribbons oscillate in an ultra-slow 12-second standing wave. Suspended rosin dust motes pulse and drift outward in gentle concentric ripples like visual musical notes.',
        runwayAction: 'Liquid gold musical ribbons and floating string curves undulating in slow motion',
        klingScene: 'Hypnotic abstract flow of golden violin curves and vibrating string ribbons in crimson void',
        pikaVerb: 'Smooth undulating golden ribbons and glowing violin shapes in dark space',
        lumaScene: 'An abstract visual symphony of golden ribbons and violin curves floating through deep crimson space. The ribbons oscillate with serene slowness, shedding tiny sparkling light particles.'
      }
    }
  },

  // 06 — BOSSA NOVA & LATIN INSTRUMENTAL
  'cat-06': {
    id: 'cat-06',
    name: '06 — BOSSA NOVA & LATIN INSTRUMENTAL',
    audience: '28–52 years old, foodies & travelers, Latin music lovers, coastal daydreamers',
    mood: 'Tropical, relaxed, sensual, sunny vacation vibes, effortless charm',
    palette: 'Coral (#E86845), sun yellow (#F5C518), tropical palm green (#3D7A45), cobalt blue (#1A4F8F), warm sand (#D4B483)',
    lighting: 'Crisp tropical midday sunshine casting sharp graphic palm frond shadows, golden late-afternoon beach glow, warm evening terrace lanterns',
    styleRefs: 'Saul Bass graphic design, 1960s vintage Brazilian travel posters, Wes Anderson symmetrical color palettes, João Gilberto album cover aesthetics',
    tags: ['bossa-nova', 'copacabana-vibes', 'latin-guitar', 'tropical-terrace', 'wes-anderson-palette', 'summer-breeze', 'coastal-relax'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A Spanish nylon-string classical guitar resting against a vintage woven rattan chair on a sunlit terrace overlooking the azure ocean',
        environment: 'A whitewashed Rio de Janeiro or Mediterranean terrace lined with hand-painted blue-and-white azulejo tiles, vibrant magenta bougainvillea cascading down white stucco walls, small cafe table with an espresso and fresh oranges, turquoise sea in the horizon',
        lighting: 'Warm golden afternoon tropical sunshine casting dramatic dappled shadows of palm fronds across the terracotta floor tiles and white stucco walls',
        palette: 'Vibrant coral (#E86845), sunshine yellow (#F5C518), lush palm green (#3D7A45), cobalt blue (#1A4F8F), and warm sand (#D4B483)',
        mood: 'Carefree, warm, sun-kissed, romantic vacation serenity',
        styleRef: 'Wes Anderson color harmony and crisp framing mixed with 1960s Rio travel photography and vintage João Gilberto album aesthetics',
        camera: 'Medium-wide terrace shot, eye-level framing with strong leading lines towards the ocean horizon, balanced rule of thirds, f/2.8 crisp foreground and soft ocean bokeh',
        videoMotionText: 'Large green palm leaves and magenta bougainvillea blossoms sway gently in a warm sea breeze (6-second cycle). Dappled sunlight patterns ripple across the terracotta floor and guitar body with hypnotic rhythm. A sheer linen curtain flutters lazily at the doorway.',
        runwayAction: 'Palm fronds swaying gently in sea breeze casting shifting shadows on a sunlit terrace',
        klingScene: 'Static wide shot of sunlit Mediterranean terrace with swaying palm shadows and fluttering linen curtains',
        pikaVerb: 'Breeze swaying palm leaves and colorful flowers on sunny ocean terrace',
        lumaScene: 'A sun-drenched coastal terrace overlooking a turquoise sea. Palm fronds sway in a gentle ocean breeze, casting playful dancing shadows across a classical guitar and terracotta tiles.'
      },
      Subjek: {
        subject: 'An intimate close-up of a classical nylon-string guitar with carved rosette and cedar soundboard, resting on a rustic cafe table beside a small espresso cup and a fresh hibiscus flower',
        environment: 'An outdoor cobblestone courtyard with weathered colonial architecture, sun-baked clay pots, and colorful vintage shutters in the background',
        lighting: 'Golden hour sunlight catching the translucent nylon strings and casting long, warm geometric shadows across the wooden rosette',
        palette: 'Cedar wood amber, hibiscus red-coral, espresso crema tan, and colonial yellow',
        mood: 'Intimate, warm, charming, afternoon leisure',
        styleRef: 'National Geographic travel portraiture style, high-end editorial food and travel photography',
        camera: 'Macro 45-degree angle, shallow depth of field f/1.8 focusing on the delicate wood grain and rosette purfling, creamy blurred cobblestones in background',
        videoMotionText: 'A thin wisp of steam rises and dissipates smoothly from the warm espresso cup. A stray hibiscus petal trembles slightly in a light coastal breeze. The golden sunlight shifts with subtle warmth along the nylon guitar strings.',
        runwayAction: 'Subtle steam rising from espresso cup next to acoustic guitar in golden sunlight',
        klingScene: 'Macro shot of classical guitar and espresso on sunlit cafe table with drifting steam',
        pikaVerb: 'Light breeze stirring flower petal on wooden cafe table with guitar',
        lumaScene: 'A warm close-up of a nylon-string guitar and coffee on a sunny cafe table. A hibiscus petal shivers in the ocean air while steam curls lazily into the golden afternoon light.'
      },
      Abstrak: {
        subject: 'Rhythmic geometric waves of colorful Portuguese azulejo tile patterns transforming into sound waves, overlapping with abstract guitar silhouettes and stylized tropical palm leaves',
        environment: 'A graphic mid-century modern composition of sun circles, beach sand textures, and cobalt ocean horizons',
        lighting: 'Graphic flat-lay sunlight with crisp 45-degree drop shadows, pop-art contrast with rich saturated pigments',
        palette: 'Sunny marigold (#F5C518), seaside cobalt (#1A4F8F), warm terracotta (#E86845), and crisp chalk white',
        mood: 'Joyful, syncopated, rhythmic, design-forward',
        styleRef: 'Saul Bass iconic movie title graphics combined with Matisse cutouts and 1960s Bossa Nova vinyl covers',
        camera: 'Graphic flat perspective, geometric alignment, crisp vector-like sharpness with rich analog print textures',
        videoMotionText: 'The abstract wave patterns undulate in a synchronized, slow Latin samba syncopation (8-second loop). Stylized palm silhouettes sway gently like gentle pendulums. Color blocks breathe in soft, warm tonal transitions.',
        runwayAction: 'Abstract geometric Brazilian tile patterns undulating in rhythmic samba motion',
        klingScene: 'Stylized graphic animation of mid-century Latin shapes and waves pulsing in rhythmic loop',
        pikaVerb: 'Rhythmic pulsing of colorful graphic waves and geometric tropical shapes',
        lumaScene: 'A stylish abstract visual of colorful geometric shapes and tropical waves undulating in slow syncopation. Sunlight patterns glide across stylized tiles in a delightfully cheerful loop.'
      }
    }
  },

  // 07 — COVER INSTRUMENTAL (Pop/Rock Hits)
  'cat-07': {
    id: 'cat-07',
    name: '07 — COVER INSTRUMENTAL (Pop/Rock Hits)',
    audience: '15–45 years old, mainstream pop/rock lovers, viral searchers, modern creators',
    mood: 'Modern, energetic, versatile, polished, magnetic',
    palette: 'Sleek: Pitch black (#0D0D0D), electric cobalt (#0066FF), chrome silver (#C0C0C0) | Energetic: Neon pink (#FF2D55), electric gold (#FFD700), deep ultraviolet (#5C00D4)',
    lighting: 'Dramatic concert stage spotlights, glowing neon typography signs, LED ring lights, laser light beams, wet asphalt street reflections',
    styleRefs: 'Apple Music dynamic artwork, Spotify Canvas loops, Getty Images live concert photography, Zedd & Marshmello music video aesthetics',
    tags: ['pop-instrumental', 'rock-cover', 'spotify-canvas', 'neon-concert', 'electric-guitar', 'stage-lighting', 'viral-beats'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A solo performer POV from a massive concert arena stage, overlooking a silhouetted sea of cheering audience holding glowing smartphone flashlights',
        environment: 'A state-of-the-art concert stadium with towering LED video walls projecting vibrant pulsing abstract waveforms, overhead lighting truss with sweeping laser arrays, stage haze caught in spotlight cones',
        lighting: 'Blinding white-blue spotlights cutting through thick atmospheric stage haze, creating dramatic rim lighting on stage equipment and a deep ocean of twinkling audience lights',
        palette: 'Obsidian black (#0D0D0D), electric blue (#0066FF), laser cyan (#00FFFF), and warm tungsten flashlight glows',
        mood: 'Thrilling, stadium-scale, viral energy, unforgettable arena anthem',
        styleRef: 'IMAX concert film cinematography mixed with Spotify Canvas dynamic visuals and Coldplay/Imagine Dragons stadium production design',
        camera: 'Expansive wide-angle stage POV, low center placement behind a gleaming chrome microphone stand, dramatic one-point perspective extending into the vast arena',
        videoMotionText: 'Volumetric spotlight cones sweep ultra-slowly across the stage haze in a smooth 15-second crisscross pan. Thousands of tiny smartphone lights in the audience twinkle with organic desynchronized shimmers. The giant background LED wall pulses gently with low-frequency color waves.',
        runwayAction: 'Stage spotlights sweeping slowly through atmospheric smoke over an arena crowd',
        klingScene: 'Grand stage POV of a concert arena with sweeping blue light beams and glittering crowd lights',
        pikaVerb: 'Concert spotlights slowly moving through haze over glittering audience lights',
        lumaScene: 'An arena concert stage looking out over thousands of glowing phone lights. Powerful blue and white spotlights cut through stage haze, sweeping across the dark stadium in majestic slow motion.'
      },
      Subjek: {
        subject: 'A sculpted custom electric guitar with high-gloss metallic finish and chrome pickups standing on a stage floor under a single sharp vertical spotlight',
        environment: 'A modern recording studio live room with soundproof wooden diffuser panels, coiled vintage guitar cables, and a glowing vacuum tube amplifier in the background',
        lighting: 'Single stark overhead spotlight casting a tight pool of light with razor-sharp rim highlights tracing the chrome knobs, bridge, and steel guitar strings',
        palette: 'Metallic chrome, deep midnight black, electric blue accent, and glowing tube amber',
        mood: 'Iconic, powerful, sleek, rock and pop mastery',
        styleRef: 'Gibson and Fender luxury catalog photography, high-end commercial automotive lighting techniques',
        camera: 'Low-angle dynamic hero shot, shallow depth of field f/2.0 focusing sharply on the chrome pickup and volume controls with creamy background amplifier glow',
        videoMotionText: 'A thin ribbon of ambient stage haze drifts slowly across the focused beam of light. The vacuum tubes inside the background amplifier pulse with a subtle, warm amber breathing glow. A sharp light glint travels along the top chrome string.',
        runwayAction: 'Thin stage haze drifting through a dramatic vertical spotlight onto an electric guitar',
        klingScene: 'Heroic low-angle shot of electric guitar in spotlight with drifting smoke and pulsing amp tubes',
        pikaVerb: 'Smoke drifting slowly past electric guitar in dramatic studio spotlight',
        lumaScene: 'An electric guitar stands illuminated by a lone overhead spotlight in a sleek studio. Delicate haze drifts through the light beam while chrome hardware glints with cinematic precision.'
      },
      Abstrak: {
        subject: 'A pulsating 3D circular audio waveform equalizer constructed from floating neon light tubes and chrome rods floating in an infinite reflective room',
        environment: 'An infinity mirror chamber with glossy black floor reflecting neon violet and electric blue sound waves infinitely into the distance',
        lighting: 'Radiant neon tube emission, sharp floor reflections, pulsing bass strobe flashes in deep background',
        palette: 'Neon magenta (#FF2D55), electric blue (#0066FF), ultraviolet (#5C00D4), and chrome',
        mood: 'Futuristic, danceable, hypnotic, chart-topping energy',
        styleRef: 'Apple Music spatial audio promotional visual combined with Tron Legacy digital aesthetic and Daft Punk Alive stage geometry',
        camera: 'Centered dynamic perspective, symmetrical composition, extreme optical clarity with mirror floor reflections',
        videoMotionText: 'The 3D neon waveform equalizer bars pulse smoothly in an ultra-slow rhythmic breathing wave. Subtle chromatic aberration ripples outward from the center like ripples on water. Neon light reflections drift across the glossy floor.',
        runwayAction: 'Neon 3D audio waveform bars smoothly pulsating in an infinity mirror room',
        klingScene: 'Symmetrical abstract loop of neon audio equalizer bars breathing in a dark reflective chamber',
        pikaVerb: 'Pulsing neon audio waveforms reflecting on glossy dark floor',
        lumaScene: 'A mesmerizing circular neon audio visualizer pulses in an infinity mirror room. Radiant violet and blue light bars breathe smoothly, casting liquid reflections across the dark glossy floor.'
      }
    }
  },

  // 08 — DRUM, PERCUSSION & BEAT
  'cat-08': {
    id: 'cat-08',
    name: '08 — DRUM, PERCUSSION & BEAT',
    audience: '18–35 years old, drummers, beatmakers, hip-hop producers, fitness & gym community',
    mood: 'Raw, powerful, industrial, visceral, high-impact',
    palette: 'Industrial charcoal (#4A4A4A), rust orange (#B5451B), metallic chrome (#9E9E9E), pitch black (#0A0A0A), electric blue (#0047AB)',
    lighting: 'Single harsh overhead spotlight, strong colored gels (crimson or deep blue), industrial fluorescent glow, dense fog machine atmosphere',
    styleRefs: 'Anton Corbijn high-contrast portraiture, Drumline movie cinematography, Neil Peart live arena photography, Dave Grohl raw rock aesthetics',
    tags: ['drum-kit', 'heavy-percussion', 'industrial-beats', 'high-speed-splash', 'raw-power', 'workout-motivation', 'dramatic-cymbal'],
    loopSeconds: 6,
    variants: {
      Scene: {
        subject: 'A massive professional multi-cymbal drum kit viewed from low front stage angle, with gleaming hammered brass cymbals and stained birch wood shells',
        environment: 'An industrial warehouse rehearsal space with exposed distressed brick walls, acoustic foam panels, metal piping overhead, and stage haze hovering near the floor',
        lighting: 'A single high-intensity overhead tungsten spotlight cutting through dense haze, accented by a strong red gel backlight from behind the bass drum',
        palette: 'Basalt black (#0A0A0A), raw iron (#4A4A4A), cymbal brass gold, and fiery backlight red (#B5451B)',
        mood: 'Intense, thunderous, gritty, visceral motivation',
        styleRef: 'Anton Corbijn gritty rock photography mixed with high-octane sports commercial cinematography',
        camera: 'Low-angle wide perspective looking up at the kit, heroic composition, razor-sharp focus on the snare drum and front ride cymbal with dramatic background falloff',
        videoMotionText: 'Dense stage smoke swirls slowly from behind the bass drum across the industrial concrete floor. Fine water droplets resting on the snare drum head shimmer and micro-ripple in an 80% slow-motion loop. Subtle chrome hardware reflections shift smoothly as overhead lights hum.',
        runwayAction: 'Stage smoke rolling slowly around a drum kit under an intense industrial spotlight',
        klingScene: 'Low-angle industrial shot of a full drum kit with rolling smoke and water droplets vibrating on snare',
        pikaVerb: 'Heavy smoke swirling around drum kit under dramatic overhead spotlight',
        lumaScene: 'A majestic drum kit sits under an industrial spotlight in a brick warehouse. Thick stage haze rolls across the floor while subtle water ripples shimmer on the snare drum head.'
      },
      Subjek: {
        subject: 'An extreme high-speed macro photograph of a drumstick striking a coated snare drum head, captured at the exact moment of impact with water droplets exploding upward in slow motion',
        environment: 'Dark studio environment with dark egg-crate acoustic foam backdrop and subtle blue rim lighting',
        lighting: 'Ultra-fast strobe lighting freezing the water droplets mid-air while warm rim light illuminates the hickory wood grain of the drumstick and brass snare lugs',
        palette: 'Deep shadow black, glowing splash white, warm hickory wood, and electric blue rim',
        mood: 'Explosive power frozen in timeless elegance, visceral impact',
        styleRef: 'Harold Edgerton high-speed stroboscopic photography meets modern Red Bull sports advertising photography',
        camera: 'Extreme macro close-up, 1/8000s freeze-frame aesthetic, razor-sharp focus on the suspended water crown with dreamy shallow background',
        videoMotionText: 'The suspended water droplets hover and pulse in an ultra-slow 80% slow-motion kinetic loop without falling. Tiny air bubbles inside the droplets refract the blue rim light. The drum head skin vibrates with microscopic concentric waves.',
        runwayAction: 'Water droplets suspended in ultra slow motion above a vibrating snare drum head',
        klingScene: 'Macro slow-motion freeze of exploding water droplets over a drumstick hitting snare drum',
        pikaVerb: 'Ultra-slow motion water splash suspended above drumstick hitting drum',
        lumaScene: 'A mesmerizing high-speed macro view of a drumstick impacting a snare drum. Exploding water droplets hang suspended in the air, rippling in ultra-slow motion with brilliant blue rim highlights.'
      },
      Abstrak: {
        subject: 'A kinetic sculpture of concentric spinning brass cymbal discs and heavy iron mechanical pistons pulsing in a synchronized polyrhythmic geometric dance',
        environment: 'An endless industrial clockwork chamber with suspended chains, glowing furnace embers, and deep metallic shadows',
        lighting: 'Molten orange furnace glow from below combined with cold industrial cyan laser rim lights from above',
        palette: 'Cast iron black (#0A0A0A), molten steel orange (#B5451B), burnished brass, and cold industrial steel',
        mood: 'Hypnotic, relentless, mechanical, unstoppable rhythmic drive',
        styleRef: 'Metropolis industrial futurism combined with modern mechanical horology design and kinetic art',
        camera: 'Continuous circular tracking perspective, heavy metallic textures, mathematical rhythm and symmetry',
        videoMotionText: 'The heavy brass discs rotate and pulse in an ultra-slow, hypnotic polyrhythmic rhythm (6-second cycle). Embers and metallic sparks drift slowly through the air like frozen fireworks. Steam vents release a slow, smooth plume in the background.',
        runwayAction: 'Mechanical brass discs and pistons rotating in an ultra-slow hypnotic rhythm',
        klingScene: 'Industrial abstract loop of spinning brass discs and floating embers in dark furnace light',
        pikaVerb: 'Spinning brass discs and mechanical gears moving smoothly in dark factory',
        lumaScene: 'An abstract kinetic sculpture of brass discs and steel pistons pulses with rhythmic precision. Fiery furnace embers float lazily through the air, glinting off polished metallic surfaces.'
      }
    }
  },

  // 09 — ELECTRONIC AMBIENT & SYNTH
  'cat-09': {
    id: 'cat-09',
    name: '09 — ELECTRONIC AMBIENT & SYNTH',
    audience: '20–40 years old, tech workers, sci-fi enthusiasts, gamers, hybrid focus/meditation listeners',
    mood: 'Cosmic, futuristic, hypnotic, vast, transcendent',
    palette: 'Deep space black (#050510), neon violet (#7B2FBE), electric cyan (#00FFFF), hot magenta (#FF00AA), aurora green (#39FF14)',
    lighting: 'Pure neon emission, bioluminescent flora, distant starfields, aurora borealis ribbons, UV blacklight, volumetric deep-space god rays',
    styleRefs: 'Blade Runner 2049 (Roger Deakins), Tron Legacy visual design, Brian Eno ambient album art, Beeple digital environments, Alex Grey sacred geometry',
    tags: ['synthwave-ambient', 'cyberpunk-neon', 'space-nebula', 'blade-runner-vibes', 'aurora-borealis', 'bioluminescent', 'analog-synth'],
    loopSeconds: 12,
    variants: {
      Scene: {
        subject: 'An infinite retro-futuristic synthwave wireframe grid stretching towards a colossal retro grid sun setting over a digital neon horizon',
        environment: 'A vast extraterrestrial lake of liquid mercury reflecting an undulating aurora borealis sky filled with glowing violet and emerald nebulae, distant geometric glass pyramids rising on the horizon',
        lighting: 'Blinding cyan and magenta grid lines casting vibrant reflections across the liquid mercury surface, surrounded by the soft ethereal glow of cosmic gas clouds',
        palette: 'Space obsidian (#050510), electric cyan (#00FFFF), hot synth magenta (#FF00AA), and neon violet (#7B2FBE)',
        mood: 'Hypnotic, nostalgic, limitless, deeply tranquil and contemplative',
        styleRef: 'Blade Runner 2049 visual scale combined with Tron Legacy neon aesthetics and Moebius sci-fi comic landscapes',
        camera: 'Wide panoramic landscape perspective, low camera height just above the reflective grid, perfect central horizon line with majestic vertical scale',
        videoMotionText: 'The neon grid lines undulate with an ultra-slow rolling wave towards the horizon (12-second cycle). Translucent aurora borealis curtains wave smoothly across the sky in a gentle fluid simulation. Tiny digital fireflies float lazily across the camera lens.',
        runwayAction: 'Neon grid lines undulating smoothly towards a giant digital sun beneath aurora borealis',
        klingScene: 'Static perspective of infinite neon synthwave grid with fluid aurora borealis sky and floating digital particles',
        pikaVerb: 'Glowing neon grid lines undulating slowly toward digital horizon under cosmic aurora',
        lumaScene: 'An infinite cyan and magenta synthwave grid stretches across a mirrored lake. In the sky above, emerald aurora ribbons wave smoothly while digital fireflies drift past the camera.'
      },
      Subjek: {
        subject: 'A vintage modular analog synthesizer console with glowing patch cables, tactile brass knobs, and pulsating oscilloscope wave monitors',
        environment: 'A high-tech sound laboratory inside a glass observation dome overlooking a starfield and Earth orbit, with faint nebula clouds glowing outside the curved glass',
        lighting: 'Warm green and amber LED indicators from the modular synth modules contrasting sharply with cool cyan backlight and blue starlight from the window',
        palette: 'Matte black metal, oscilloscope phosphor green, LED ruby red, and cosmic cobalt blue',
        mood: 'Analytical, meditative, futuristic craftsmanship, nocturnal discovery',
        styleRef: 'Stanley Kubrick 2001 A Space Odyssey cockpit aesthetics combined with high-end Moog synthesizer product photography',
        camera: 'Angled macro perspective across the patch bay, f/1.8 shallow depth of field focusing sharply on an illuminated green oscilloscope waveform, patch cables cascading softly',
        videoMotionText: 'The green oscilloscope CRT screen displays a smooth, hypnotic sine wave that pulses and morphs in an ultra-slow continuous loop. Faint starlight drifts across the space window in the background. Indicator LEDs breathe in a gentle, asynchronous heartbeat rhythm.',
        runwayAction: 'Smooth green oscilloscope sine wave pulsating on a vintage modular synthesizer',
        klingScene: 'Macro detail of modular synthesizer with glowing patch cables and pulsing green oscilloscope display',
        pikaVerb: 'Glowing oscilloscope waveform pulsing slowly on retro-futuristic synth panel',
        lumaScene: 'An intimate view of a modular synthesizer in space. A phosphor-green oscilloscope display undulates with a tranquil sine wave while soft starlight shines through the observatory window.'
      },
      Abstrak: {
        subject: 'A glowing 4-dimensional tesseract hypercube of pulsating neon lines suspended and rotating smoothly inside a sacred geometric mandala sphere',
        environment: 'A vast cosmic void filled with floating dust nebula galaxies, intersecting lasers, and sacred geometry light vectors',
        lighting: 'Bioluminescent UV blacklight and neon cyan edge emissions casting sharp geometric volumetric rays across deep space',
        palette: 'Pure void black (#050510), ultraviolet (#7B2FBE), electric cyan (#00FFFF), and aurora green (#39FF14)',
        mood: 'Transcendent, cosmic, mind-expanding, sublime serenity',
        styleRef: 'Alex Grey sacred geometry visions mixed with Brian Eno generative video installations and James Turrell perceptual light spaces',
        camera: 'Centered hypnotic symmetry, infinite depth tunnel, pristine geometric alignment and crystalline optical clarity',
        videoMotionText: 'The glowing tesseract hypercube rotates upon its inner and outer axes in an ultra-slow 60-second full rotation cycle. Concentric geometric mandala rings expand and contract in an imperceptible 12-second breathing rhythm. Cosmic dust motes float through the light vectors.',
        runwayAction: 'Glowing neon tesseract rotating ultra-slowly in a sacred geometric cosmic void',
        klingScene: 'Hypnotic symmetrical rotation of neon 4D hypercube with slowly breathing mandala rings',
        pikaVerb: 'Glowing geometric hypercube rotating smoothly in deep space void',
        lumaScene: 'A radiant neon hypercube rotates with serene geometric perfection in deep space. Concentric rings of cyan and violet light expand softly like breathing, illuminating clouds of stardust.'
      }
    }
  },

  // 10 — GAME, RETRO & CHIPTUNE
  'cat-10': {
    id: 'cat-10',
    name: '10 — GAME, RETRO & CHIPTUNE',
    audience: '16–38 years old, gamers, speedrunners, Nintendo/Sega nostalgia lovers, pixel artists',
    mood: 'Nostalgic, playful, adventurous, charming, retro-futuristic',
    palette: 'Authentic 16-color NES/CGA palette & modern HD-2D rich palette: Forest emerald (#2E6F40), twilight violet (#382B5F), coin gold (#F9C846), sky cyan (#56C2D6), arcade red (#E53935)',
    lighting: 'Crisp pixel-art lighting, CRT monitor phosphor scanline bloom, flickering torchlight, retro arcade neon signs',
    styleRefs: 'Superbrothers Sword & Sworcery, Shovel Knight pixel art, UNDERTALE title screen mood, Stardew Valley cozy farming scenery, Octopath Traveler HD-2D lighting',
    tags: ['pixel-art', 'chiptune-nostalgia', 'hd-2d', 'retro-gaming', 'lofi-rpg', 'sword-and-sworcery', '8bit-cozy'],
    loopSeconds: 6,
    variants: {
      Scene: {
        subject: 'A solitary pixel-art hero with a flowing red cape standing at the ancient stone archway of a mystical fantasy castle overlooking an endless pixel pine valley',
        environment: 'A breathtaking 16-bit dusk landscape with towering purple mountains, a gentle pixel waterfall tumbling into a misty blue river, shooting stars streaking across a deep indigo sky, distant village chimneys puffing tiny smoke pixels',
        lighting: 'Warm orange sunset glow hitting the mountain peaks, cool blue twilight shadows across the valley, soft flickering torch glow from iron sconces at the archway',
        palette: 'Twilight purple (#382B5F), pine emerald (#2E6F40), sunset gold (#F9C846), and night sky cyan (#56C2D6)',
        mood: 'Nostalgic, yearning, epic, cozy adventurous longing',
        styleRef: 'Octopath Traveler modern HD-2D depth combined with Superbrothers Sword & Sworcery painterly pixel aesthetics and Studio Ghibli nature color palette',
        camera: 'Wide panoramic platformer perspective with multi-layered parallax depth, subtle tilt-shift focal depth blurring the extreme foreground and background',
        videoMotionText: 'The hero red cape flutters in an organic 4-frame retro animation cycle. Pixelated waterfall spray tumbles smoothly into the river below. Iron wall torches flicker with randomized 3-frame fire sprites. Distant pixel stars twinkle softly in the violet evening sky.',
        runwayAction: 'Pixel art hero cape fluttering at castle gate overlooking waterfall and twinkling stars',
        klingScene: 'HD-2D pixel art landscape with fluttering cape, flowing waterfall, and flickering wall torches',
        pikaVerb: 'Gentle pixel waterfall flowing and torches flickering in retro RPG landscape',
        lumaScene: 'A charming HD-2D pixel art vista at sunset. A hero cape gently flutters in the mountain breeze, water cascades into a misty river, and warm torches flicker against ancient castle stones.'
      },
      Subjek: {
        subject: 'A classic 1980s retro handheld gaming console or arcade cabinet joystick and glowing buttons bathed in the warm scanline glow of a CRT monitor',
        environment: 'A nostalgic bedroom floor in 1994 with scattered game cartridges, comic books, a glowing lava lamp, and neon posters on wood-paneled walls',
        lighting: 'Warm CRT screen bloom illuminating the plastic console texture with horizontal scanlines, complemented by the ambient magenta and yellow glow of a bedside lava lamp',
        palette: 'Game Boy grey, CRT phosphor cyan, arcade red, and warm tungsten amber',
        mood: 'Deeply comforting, childhood memories, nocturnal gaming peace',
        styleRef: 'Kodak Portra 400 35mm film photography capturing retro 90s nostalgia with authentic CRT scanline bloom',
        camera: 'Macro 45-degree close-up of the directional D-pad and red action buttons, shallow depth of field f/1.8 with the pixelated game title screen reflecting on the glossy lens',
        videoMotionText: 'The CRT screen displays an authentic, gentle scanline roll and faint phosphor flicker. Colored wax inside the background lava lamp rises and morphs in an ultra-slow 8-second cycle. Faint dust motes float through the screen glow.',
        runwayAction: 'CRT screen scanlines glowing softly on retro gaming console with moving lava lamp',
        klingScene: 'Macro shot of retro handheld console under glowing CRT television scanlines and drifting lava lamp',
        pikaVerb: 'CRT television glow and scanlines flickering softly over retro gaming controller',
        lumaScene: 'A nostalgic close-up of a retro handheld console illuminated by a glowing CRT screen. Soft scanlines flicker gently while colorful wax inside a vintage lava lamp floats in the cozy background.'
      },
      Abstrak: {
        subject: 'A floating 3D voxel landscape of floating 8-bit clouds, golden quest coins, and pixelated crystalline trees suspended in an ethereal gradient sky',
        environment: 'An endless isometric sky kingdom with floating grassy islands, rainbow light bridges, and geometric pixel clouds drifting in parallel planes',
        lighting: 'Bright, cheerful morning arcade sunlight with crisp geometric pixel drop shadows and shimmering gold coin sparkles',
        palette: 'Arcade gold (#F9C846), sky blue (#56C2D6), mushroom red (#E53935), and lush green (#2E6F40)',
        mood: 'Whimsical, cheerful, uplifting, pure retro magic',
        styleRef: 'Crossy Road modern voxel art combined with Monument Valley architectural puzzles and Fez game aesthetics',
        camera: 'Isometric 30-degree orthographic perspective, crisp voxel edges, mathematically clean depth planes',
        videoMotionText: 'Floating voxel islands bob gently up and down on an ultra-slow 6-second sine wave cycle. Golden 8-bit coins rotate continuously in place with a smooth glint. Fluffy voxel clouds drift slowly from left to right across the isometric frame.',
        runwayAction: 'Floating 8-bit voxel islands bobbing gently in sky with slowly spinning gold coins',
        klingScene: 'Isometric voxel landscape with bobbing floating islands and rotating golden coins',
        pikaVerb: 'Floating pixel islands bobbing gently in air with spinning gold coins',
        lumaScene: 'An enchanting isometric world of floating voxel islands and pixelated trees. The green islands bob gently in the sky as golden coins rotate smoothly with sparkling highlights.'
      }
    }
  },

  // 11 — GITAR & AKUSTIK INSTRUMENTAL
  'cat-11': {
    id: 'cat-11',
    name: '11 — GITAR & AKUSTIK INSTRUMENTAL',
    audience: '22–48 years old, indie folk lovers, Americana fans, singer-songwriter listeners',
    mood: 'Authentic, warm, intimate, relatable, earthy, soulful',
    palette: 'Spruce wood (#7B5E3A), bourbon amber (#C68E3E), forest sage (#6B7C59), autumn rust (#A8440C), harvest gold (#D4A017)',
    lighting: 'Glowing outdoor golden hour sunlight filtering through tall pine trees, flickering warm campfire glow, soft overcast daylight',
    styleRefs: 'Ryan Adams & Iron and Wine album photography, Fleet Foxes pastoral imagery, Bon Iver winter aesthetics, Chris Burkard outdoor adventure photography, National Geographic folk documentary',
    tags: ['acoustic-guitar', 'fingerstyle-folk', 'campfire-ambience', 'golden-hour-woods', 'rustic-cabin', 'americana', 'earthy-warmth'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A weathered spruce-and-mahogany dreadnought acoustic guitar resting gently on an adirondack wooden chair beside a crackling campfire',
        environment: 'A rustic mountain clearing surrounded by towering autumn aspen trees with golden-yellow leaves, a tranquil alpine lake in the background mirroring snowcapped mountain peaks under twilight',
        lighting: 'Warm orange-red campfire light illuminating the guitar front and chair, balanced with the deep blue twilight sky and golden pink sunset clouds reflecting on the water',
        palette: 'Bourbon amber (#C68E3E), autumn rust (#A8440C), aspen gold (#D4A017), spruce brown (#7B5E3A), and twilight blue',
        mood: 'Deeply grounding, peaceful, soulful, timeless wilderness solitude',
        styleRef: 'Chris Burkard outdoor cinematography combined with Fleet Foxes pastoral folk album imagery and National Geographic landscape photography',
        camera: 'Wide cinematic eye-level framing, rule of thirds placement of the guitar and campfire, f/2.2 shallow depth of field rendering the mountain lake with creamy evening bokeh',
        videoMotionText: 'Campfire flames dance in an organic, soothing multi-layer rhythm with glowing embers floating gently upward into the twilight air. Golden autumn aspen leaves drift down from above in an ultra-slow physics drift. The quiet alpine lake water ripples with soft micro-laps on the shore.',
        runwayAction: 'Campfire flames dancing and glowing embers rising gently beside an acoustic guitar',
        klingScene: 'Static wide shot of campfire and acoustic guitar by an alpine lake with floating sparks and falling leaves',
        pikaVerb: 'Campfire flames flickering gently with glowing sparks rising near acoustic guitar',
        lumaScene: 'A peaceful campfire crackles beside an acoustic guitar by a tranquil mountain lake at dusk. Warm embers float slowly toward the twilight sky while golden autumn leaves drift down through the air.'
      },
      Subjek: {
        subject: 'An intimate macro perspective of steel acoustic guitar strings, weathered brass tuning pegs, and aged spruce soundboard grain, with a worn leather guitar strap draped beside',
        environment: 'A cozy rustic timber cabin interior, aged stone hearth with dying embers, and a hand-knitted woolen blanket resting on the bench',
        lighting: 'Warm, low-raking golden sunlight pouring through a cabin window, highlighting the fibrous spruce wood grain and the worn metal patina of the tuning machines',
        palette: 'Honey spruce, antique brass, deep saddle leather brown, and warm fireplace amber',
        mood: 'Intimate, tactile, heartfelt, handcrafted authenticity',
        styleRef: 'Leica 50mm f/1.4 natural light still life photography, Iron & Wine album artwork texture',
        camera: 'Macro low-angle close-up focused sharply on the guitar headstock and brass pegs, shallow depth of field f/1.8 with background cabin textures softly blurred',
        videoMotionText: 'Warm dust particles drift languidly through the diagonal beam of window sunlight. The soft shadow of a pine tree branch outside the window sways gently across the wooden guitar soundboard in a 6-second loop. A tiny golden ember glints in the background.',
        runwayAction: 'Pine branch shadows gently swaying across an acoustic guitar in warm cabin sunlight',
        klingScene: 'Macro detail of acoustic guitar headstock with drifting sunlit dust motes and swaying branch shadows',
        pikaVerb: 'Warm sunlight and tree shadows swaying gently over acoustic guitar',
        lumaScene: 'An intimate sunlit close-up of an acoustic guitar headstock in a wooden cabin. Golden dust motes float through a warm sunbeam while tree shadows sway peacefully across the polished wood.'
      },
      Abstrak: {
        subject: 'Floating suspended wooden acoustic guitar soundboards, vibrating bronze steel strings, and flying autumn leaves orbiting in a circular sunbeam',
        environment: 'A luminous forest cathedral where soaring tree trunks form natural arches over a carpet of golden pine needles',
        lighting: 'Dramatic volumetric forest god rays breaking through the canopy, illuminating suspended dust and leaves with blazing gold',
        palette: 'Harvest gold (#D4A017), spruce wood (#7B5E3A), forest green (#6B7C59), and sunbeam white',
        mood: 'Organic, transcendent, uplifting, acoustic spiritual harmony',
        styleRef: 'Terrence Malick Tree of Life cinematic poetry meets modern organic architectural installations',
        camera: 'Slow upward-angled perspective looking toward the canopy, mathematical golden ratio spiral arrangement of floating natural elements',
        videoMotionText: 'The suspended bronze strings oscillate in an ultra-slow harmonic wave vibration. Golden maple leaves spiral downward in a weightless 10-second orbital descent. The volumetric sunbeams breathe softly in intensity.',
        runwayAction: 'Volumetric sunbeams shifting through forest canopy over floating acoustic guitar elements',
        klingScene: 'Abstract slow-motion spiral of autumn leaves and vibrating guitar strings in sunlit forest canopy',
        pikaVerb: 'Golden autumn leaves drifting slowly through sunbeams around vibrating guitar strings',
        lumaScene: 'An enchanting vision of golden sunbeams cutting through a misty forest canopy. Suspended guitar strings vibrate in slow motion as golden leaves spiral weightlessly through the warm light.'
      }
    }
  },

  // 12 — JAZZ INSTRUMENTAL
  'cat-12': {
    id: 'cat-12',
    name: '12 — JAZZ INSTRUMENTAL',
    audience: '32–65 years old, sophisticated adults, Blue Note Records fans, NPR listeners',
    mood: 'Sophisticated, cool, sultry, timeless, smoky urban elegance',
    palette: 'Noir black (#0A0A0F), whiskey amber (#C78B3B), tobacco gold (#A07B35), muted rose (#C2857A), vintage burgundy (#8B1F1F)',
    lighting: 'Single overhead conical spotlight, neon sign ambient bleed (emerald or ruby from outside), table candlelight, smoky haze diffusion',
    styleRefs: 'Blue Note Records album covers (Reid Miles design), Herman Leonard jazz photography, The Deuce (HBO) production design, Whiplash cinematography, La La Land jazz club scenes',
    tags: ['jazz-lounge', 'smoky-saxophone', 'blue-note-style', 'herman-leonard', 'whiskey-bar', 'midnight-speakeasy', 'noir-lighting'],
    loopSeconds: 10,
    variants: {
      Scene: {
        subject: 'A classic vintage brass tenor saxophone resting on a velvet-lined stand beside a baby grand piano inside an atmospheric 1950s New York basement speakeasy jazz club',
        environment: 'An intimate jazz lounge with exposed dark brick walls, round wooden tables with red candles in frosted glass, a leather-backed bar with gleaming whiskey bottles in the background, rain streaming down street-level glass windows',
        lighting: 'A single warm conical overhead spotlight cutting through layered cigarette smoke haze, accented by the soft green and ruby neon glow of a street sign visible through the wet window',
        palette: 'Noir black (#0A0A0F), aged whiskey amber (#C78B3B), tobacco gold (#A07B35), and speakeasy velvet burgundy (#8B1F1F)',
        mood: 'Sultry, melancholic, sophisticated, late-night intimacy',
        styleRef: 'Herman Leonard iconic jazz photography combined with Reid Miles Blue Note graphics and Edward Hopper Nighthawks atmospheric isolation',
        camera: 'Medium eye-level shot, atmospheric three-dimensional depth, f/2.0 aperture keeping the brass saxophone razor-sharp while background patrons and bottles dissolve into rich bokeh',
        videoMotionText: 'A delicate veil of blue-gray smoke and haze drifts slowly from left to right across the overhead conical spotlight beam (10-second loop). Outside the street-level window, rain streams continuously down the glass pane. The candle flame on the nearby table flickers with gentle desynchronized rhythm.',
        runwayAction: 'Blue smoke drifting slowly through a conical spotlight over a brass saxophone',
        klingScene: 'Static atmospheric shot of a 1950s jazz club with drifting smoke haze and rain-streaked windows',
        pikaVerb: 'Smooth smoke drifting through spotlight over saxophone in moody jazz lounge',
        lumaScene: 'A moody late-night jazz club in New York. A golden spotlight cuts through gentle layers of blue smoke above a gleaming saxophone, while rain trickles down the dark basement window.'
      },
      Subjek: {
        subject: 'An intimate close-up of a golden brass tenor saxophone bell, intricate hand-engraved floral scrollwork, mother-of-pearl key touches, and condensation droplets on the neck',
        environment: 'A polished mahogany bar counter beside a crystal tumbler of single malt whiskey with a clear ice sphere and a cocktail cherry, glowing neon sign reflection in the spilled liquid',
        lighting: 'Dramatic side-raking spotlight highlighting the engraved metal texture and catching rich golden specular reflections on the brass curves and crystal glass facets',
        palette: 'Warm brass gold, amber whiskey, deep mahogany noir, and cool neon reflections',
        mood: 'Intimate, luxurious, sultry, nocturnal perfection',
        styleRef: 'Francis Wolff photographic archives for Blue Note Records, high-end commercial luxury beverage and instrument photography',
        camera: 'Macro low-angle 45-degree close-up, razor-thin depth of field f/1.4 focused on the engraved saxophone bell engraving with buttery smooth background falloff',
        videoMotionText: 'The ice sphere in the whiskey glass melts with an imperceptible micro-rotation, sending a single condensation bead slowly gliding down the heavy crystal glass. A faint ribbon of cigar smoke curls lazily past the top edge of the frame. Subtle neon reflections pulse in the background.',
        runwayAction: 'A condensation bead sliding down a whiskey glass next to an engraved saxophone bell',
        klingScene: 'Macro detail of engraved saxophone bell and whiskey glass with drifting smoke and melting ice reflection',
        pikaVerb: 'Gentle smoke curling past golden saxophone bell and crystal whiskey glass',
        lumaScene: 'A luxurious close-up of an engraved saxophone bell resting on a dark wood bar. Condensation glints on a crystal glass of amber whiskey while a slow coil of smoke drifts through the warm light.'
      },
      Abstrak: {
        subject: 'Deconstructed floating saxophone keys, brass horns, and stylized musical notes twisting into a dynamic 1950s Blue Note graphic typographic composition',
        environment: 'A stark high-contrast two-tone noir canvas with bold graphic color blocks, abstract bar stripes, and atmospheric smoke silhouettes',
        lighting: 'High-contrast graphic studio lighting with deep velvety shadows and single-color accent rim highlights',
        palette: 'Deep noir black (#0A0A0F), vibrant Blue Note cobalt, warm whiskey amber (#C78B3B), and stark graphic cream',
        mood: 'Improvisational, cool, cerebral, timeless modern art',
        styleRef: 'Reid Miles Blue Note album cover graphic design combined with Piet Mondrian modernism and Herman Leonard high-contrast lighting',
        camera: 'Dynamic angled graphic composition, bold diagonal lines, asymmetrical balance, sharp print-like precision',
        videoMotionText: 'The graphic color blocks and brass saxophone curves slide and realign in an ultra-slow syncopated 10-second jazz improvisation cycle. Faint smoke textures shift across the flat color planes like living paper.',
        runwayAction: 'Graphic Blue Note jazz shapes and brass curves smoothly shifting in syncopated rhythm',
        klingScene: 'Abstract modernist jazz animation of brass curves and graphic color blocks shifting slowly',
        pikaVerb: 'Smooth syncopated movement of abstract jazz shapes and golden brass curves',
        lumaScene: 'An abstract Blue Note-inspired composition of golden brass curves and bold graphic color blocks. The shapes glide with smooth, syncopated jazz elegance across a deep velvety noir background.'
      }
    }
  },

  // 13 — KLASIK & ORKESTRA
  'cat-13': {
    id: 'cat-13',
    name: '13 — KLASIK & ORKESTRA',
    audience: '38–70 years old, classical patrons, PBS/NPR viewers, music conservatory community',
    mood: 'Monumental, prestigious, timeless, majestic, grand',
    palette: 'Imperial gold (#CFB53B), royal burgundy (#7B1B3C), formal black (#0A0A0A), antique white (#F8F4E8), antique bronze (#804A17)',
    lighting: 'Grand multi-tiered crystal chandeliers (warm 2800K), footlights, formal spotlight on conductor podium, natural light from palatial arched windows',
    styleRefs: 'Vienna Musikverein Golden Hall photography, Deutsche Grammophon Herbert von Karajan album covers, Metropolitan Opera production design, Gustav Klimt gold ornamentation',
    tags: ['symphony-orchestra', 'vienna-musikverein', 'grand-chandelier', 'majestical-classical', 'deutsche-grammophon', 'conductor-podium', 'imperial-gold'],
    loopSeconds: 12,
    variants: {
      Scene: {
        subject: 'A full grand symphony orchestra poised in formal concert attire on the gilded stage of the Vienna Musikverein Golden Hall, seen from the conductor podium POV',
        environment: 'A breathtaking imperial concert hall with soaring gold-leaf caryatids, elaborate ceiling frescoes, tiers of red velvet balcony seating, and monumental crystal chandeliers suspended above',
        lighting: 'Radiant warm 2800K illumination from hundreds of crystal chandelier facets casting shimmering golden light across polished violins, brass horns, and sheet music stands',
        palette: 'Imperial gold (#CFB53B), royal burgundy velvet (#7B1B3C), formal tuxedo black (#0A0A0A), and warm antique ivory (#F8F4E8)',
        mood: 'Majestic, solemn, breathtaking, historic cultural grandeur',
        styleRef: 'Vienna Musikverein official archival photography combined with Stanley Kubrick architectural symmetry and Deutsche Grammophon album prestige',
        camera: 'Wide panoramic stage perspective, perfect one-point symmetry from the conductor podium looking toward the orchestra and balcony, razor-sharp architectural clarity',
        videoMotionText: 'The monumental crystal chandeliers sway with an almost imperceptible pendulum breath (30-second full period). Prismatic rainbow refractions slowly dance across the gilded ceiling moldings and velvet boxes. Fine golden dust motes float upward in the warm stage light.',
        runwayAction: 'Crystal chandelier reflections slowly dancing across the gilded walls of a grand concert hall',
        klingScene: 'Symmetrical grand concert hall view with glittering crystal chandeliers and floating golden dust motes',
        pikaVerb: 'Glittering crystal chandeliers and golden dust drifting slowly in grand concert hall',
        lumaScene: 'A breathtaking view of an imperial golden concert hall. Massive crystal chandeliers glimmer with regal majesty, casting slowly shifting prismatic rainbows across gilded balconies and red velvet seats.'
      },
      Subjek: {
        subject: 'An intricate close-up of a conductor baton resting across an antique handwritten Beethoven orchestral score with ink annotations and aged deckled paper edges',
        environment: 'A polished dark walnut music stand on the podium, illuminated by a warm brass reading lamp with the grand concert hall blurred in majestic golden bokeh behind',
        lighting: 'Warm focused illumination from the podium lamp raking across the textured paper fibers and ink flourishes, with shimmering chandelier bokeh in the deep background',
        palette: 'Antique score parchment (#F8F4E8), walnut wood brown, aged ink sepia, and brass lamp gold',
        mood: 'Intellectual, historic, awe-inspiring, creative genius',
        styleRef: 'Leica M11 fine art macro photography, archival museum artifact documentation, classical monograph style',
        camera: 'Macro 30-degree close-up, f/1.8 shallow depth of field focusing sharply on the handwritten notes and baton tip, creamy golden bokeh orbs behind',
        videoMotionText: 'A corner of the aged manuscript page flutters with an ultra-subtle micro-movement from a gentle hall ventilation draft. The golden chandelier bokeh in the background slowly pulses and shifts with microscopic breathing. The brass lamp reflection catches a faint traveling glint.',
        runwayAction: 'Manuscript page corner fluttering gently under a brass lamp with golden hall bokeh',
        klingScene: 'Macro detail of conductor baton on historic music score with shimmering chandelier bokeh',
        pikaVerb: 'Gentle flutter of aged music sheet on podium under warm brass lamp',
        lumaScene: 'An intimate macro perspective of a conductor baton resting on a historic orchestral score. Golden chandelier bokeh glimmers softly in the background as the aged paper moves with delicate grace.'
      },
      Abstrak: {
        subject: 'A monumental cascading spiral of floating golden brass instruments, violin scrolls, and gilded orchestral caryatid statues dissolving into luminous musical staves',
        environment: 'An infinite celestial palace of golden light with soaring neoclassical arches and cosmic mist reflecting imperial chandeliers',
        lighting: 'Ethereal volumetric god rays emanating from a golden dome above, casting radiant amber illumination across suspended instruments',
        palette: 'Imperial gold (#CFB53B), antique bronze (#804A17), ivory marble, and deep space black',
        mood: 'Celestial, transcendent, sublime harmony, eternal music',
        styleRef: 'Gustav Klimt golden phase ornamentation combined with Giovanni Battista Piranesi architectural grandeur and modern cinematic matte painting',
        camera: 'Towering upward low-angle spiral perspective, monumental vertical scale, flawless architectural symmetry and golden ratio geometry',
        videoMotionText: 'The suspended golden instruments rotate in an ultra-slow 20-second celestial orbit. Volumetric sunbeams sweep gently across the classical arches, casting slowly shifting golden caustics across the cosmic mist.',
        runwayAction: 'Golden musical instruments orbiting in a slow spiral beneath volumetric palace sunbeams',
        klingScene: 'Monumental abstract spiral of golden orchestral instruments floating in ethereal palace hall',
        pikaVerb: 'Golden instruments floating in slow motion through majestic celestial sunbeams',
        lumaScene: 'An awe-inspiring abstract spectacle of golden instruments and classical arches floating in celestial light. Beams of sunlight slowly sweep across the hall, illuminating drifting particles of pure gold.'
      }
    }
  },

  // 14 — NEW AGE & MEDITASI
  'cat-14': {
    id: 'cat-14',
    name: '14 — NEW AGE & MEDITASI',
    audience: '28–58 years old, wellness community, yoga practitioners, mindfulness & meditation app users',
    mood: 'Sacred, peaceful, spiritual, healing, transcendent, weightless',
    palette: 'Mist white (#F5F5F0), celestial blue (#C8D8E8), lavender (#C8A8D8), calm sage (#A8C0A8), warm gold (#D4A855), deep indigo (#4A2878)',
    lighting: 'Pre-dawn blue hour light (4–5 AM), diffused morning mist sunlight, altar candlelight, single ethereal god ray through mountain fog, silver moonlight',
    styleRefs: 'Hiroshi Yoshida woodblock water prints, Kawase Hasui misty landscape prints, National Geographic sacred sites photography, Headspace & Calm visual aesthetic',
    tags: ['new-age-meditation', 'tibetan-singing-bowl', 'zen-garden', 'misty-lake', 'sound-healing', 'chakra-balancing', 'mindfulness-432hz'],
    loopSeconds: 10,
    variants: {
      Scene: {
        subject: 'A solitary handcrafted Tibetan singing bowl and a balanced river stone cairn resting on a smooth wooden deck at the edge of a mirror-calm alpine lake',
        environment: 'A breathtaking misty mountain lake at dawn, surrounded by ancient mossy cedar trees, ethereal mist hovering above the glassy water, distant snowcapped peaks bathed in soft rosy alpine glow',
        lighting: 'Soft, diffused pre-dawn twilight with a single ethereal beam of morning golden sunlight breaking through morning fog, illuminating the lake water surface and rising incense smoke',
        palette: 'Ethereal mist white (#F5F5F0), celestial dawn blue (#C8D8E8), lavender (#C8A8D8), sage moss (#A8C0A8), and soft morning gold (#D4A855)',
        mood: 'Profoundly tranquil, sacred, healing, weightless inner silence',
        styleRef: 'Hiroshi Yoshida misty landscape woodblock art combined with modern mindfulness sanctuary photography and National Geographic sacred geography',
        camera: 'Low-angle wide perspective just above the wooden deck, rule of thirds placement of the singing bowl and stone cairn, mirror-like lake reflection filling the lower half of the frame',
        videoMotionText: 'Concentric water ripples propagate with hypnotic slowness from a single droplet across the glassy lake surface (6-second cycle). A delicate plume of temple incense smoke curls upward in an organic fluid simulation. Ground fog flows smoothly over the distant shoreline like slow liquid.',
        runwayAction: 'Gentle incense smoke curling and concentric water ripples expanding on a misty dawn lake',
        klingScene: 'Static wide shot of a peaceful dawn mountain lake with drifting fog and concentric water ripples',
        pikaVerb: 'Concentric water ripples expanding slowly on mirror-calm lake at misty sunrise',
        lumaScene: 'A sacred dawn lake where misty fog glides across mirror-still water. A Tibetan singing bowl rests by the shore as incense smoke rises in a slow spiral and ripples gently expand outward.'
      },
      Subjek: {
        subject: 'An intimate macro perspective of a hand-hammered 7-metal Tibetan singing bowl with Sanskrit mantras, wooden leather mallet, and a blooming pale pink lotus flower floating in clear water',
        environment: 'A zen stone basin surrounded by raked white sand and lush green moss in a quiet Kyoto temple courtyard',
        lighting: 'Gentle diffused morning daylight with soft specular highlights gleaming on the golden bronze rim and water droplets on the lotus petals',
        palette: 'Hammered brass gold (#D4A855), soft lotus pink, deep river stone charcoal, and vibrant temple moss green',
        mood: 'Sacred vibration, mindfulness, purification, eternal stillness',
        styleRef: 'Kawase Hasui Japanese temple print aesthetics combined with fine art macro nature photography',
        camera: 'Macro 45-degree close-up, razor-sharp focus on the hammered rim texture and water droplet on the lotus petal, f/1.8 dreamy water bokeh in background',
        videoMotionText: 'Water surface inside the singing bowl vibrates with microscopic harmonic standing waves in an ultra-slow 4-second breath cycle. A single drop of water drips from the lotus petal, creating tiny circular ripples. A faint incense smoke wisp drifts softly across the background.',
        runwayAction: 'Microscopic standing sound waves vibrating on water inside a golden singing bowl',
        klingScene: 'Macro view of Tibetan singing bowl and blooming lotus with vibrating water surface and drifting smoke',
        pikaVerb: 'Water surface vibrating with gentle acoustic waves inside singing bowl',
        lumaScene: 'A close-up of a hand-hammered Tibetan singing bowl and a blooming lotus flower. The water inside the bowl shimmers with delicate acoustic standing waves while morning light illuminates glistening dew.'
      },
      Abstrak: {
        subject: 'A pulsating multi-layered Sri Yantra sacred geometry mandala constructed of radiant bioluminescent light vectors and ethereal chakra energy vortices',
        environment: 'A vast cosmic temple void of floating crystalline water lotus blossoms and ethereal lavender healing frequency waves',
        lighting: 'Radiant inner bioluminescence pulsing in a 432Hz harmonic breath, with soft volumetric gold and violet light beams',
        palette: 'Celestial lavender (#C8A8D8), healing sage green (#A8C0A8), radiant gold (#D4A855), and deep cosmic indigo (#4A2878)',
        mood: 'Transcendental healing, universal oneness, deep meditative absorption',
        styleRef: 'Alex Grey sacred geometry meets James Turrell light environments and Deepak Chopra visual meditation art',
        camera: 'Symmetrical center-aligned sacred geometric composition, infinite spatial depth, perfectly balanced proportions',
        videoMotionText: 'The sacred mandala geometry pulses and expands in an ultra-slow 8-second rhythmic breathing cycle (4 seconds inhale, 4 seconds exhale). Bioluminescent light particles flow inward along the geometric lines in continuous harmonic convergence.',
        runwayAction: 'Sacred geometric Sri Yantra mandala pulsing in a smooth 4-second breathing cycle',
        klingScene: 'Hypnotic sacred geometry mandala expanding and contracting in rhythmic meditation breath loop',
        pikaVerb: 'Sacred geometry mandala pulsing smoothly in slow breathing meditation cycle',
        lumaScene: 'A radiant sacred geometry mandala pulses in deep cosmic indigo space. The golden and lavender light vectors expand and contract in an ultra-slow breathing rhythm, shedding soothing particles of healing light.'
      }
    }
  },

  // 15 — SERULING & WOODWIND
  'cat-15': {
    id: 'cat-15',
    name: '15 — SERULING & WOODWIND',
    audience: '25–55 years old, world music lovers, Celtic & Native American culture fans, nature enthusiasts',
    mood: 'Natural, folk, spiritual, breathable, ancient, untamed',
    palette: 'Highland heather (#8B5A8B), forest moss (#4A6741), river slate (#7A8A98), ripe wheat (#D4B483), cerulean sky (#4A8FC4), earth ochre (#C4883A)',
    lighting: 'Soft overcast Celtic daylight, glowing forest canopy god rays, golden-gray dawn mist, late afternoon raking light through tall bamboo',
    styleRefs: 'National Geographic indigenous culture photography, Ansel Adams wilderness landscapes, Celtic knotwork illustrations, Kevin Red Star Native American paintings, Enya album visuals, Lord of the Rings New Zealand landscapes',
    tags: ['native-flute', 'celtic-whistle', 'japanese-shakuhachi', 'misty-highlands', 'bamboo-forest', 'world-woodwind', 'sacred-nature'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A solitary flute player in traditional earth-toned attire standing atop a dramatic cliff edge overlooking a vast misty Scottish highland valley or red rock canyon mesa',
        environment: 'An epic windswept natural landscape with ancient Celtic stone circles, wild heather and tall grass undulating across rolling green hills, a winding silver river below, and dramatic storm clouds parting to reveal golden sunlight',
        lighting: 'Dramatic raking late-afternoon golden hour sunlight cutting across misty green ridges, casting long cinematic shadows and illuminating floating airborne moisture',
        palette: 'Highland heather purple (#8B5A8B), lush emerald moss (#4A6741), river slate blue (#7A8A98), and warm earth ochre (#C4883A)',
        mood: 'Ancient, expansive, untamed, deeply evocative of ancestral memory',
        styleRef: 'Lord of the Rings Rohan and Rivendell landscape cinematography combined with Ansel Adams environmental contrast and National Geographic indigenous photography',
        camera: 'Wide panoramic landscape perspective, heroic composition with solitary figure silhouetted against the vast sky, extreme depth of field from mountain stones to distant horizon',
        videoMotionText: 'Tall highland grasses and purple heather flowers undulate in a synchronized, slow wind sweep (6-second wave). Atmospheric valley mist flows smoothly along the riverbed below. Distant birds drift across the horizon in subtle, peaceful flight.',
        runwayAction: 'Highland grass and wild heather undulating in wind as valley fog drifts below',
        klingScene: 'Epic highland vista of windswept grass and mist flowing through valleys past ancient standing stones',
        pikaVerb: 'Wind blowing through tall grass and wild flowers in misty mountain valley',
        lumaScene: 'An epic panoramic Scottish highland vista at sunset. Wild heather and tall grass ripple in a sweeping wind while mountain mist glides peacefully through the valley far below.'
      },
      Subjek: {
        subject: 'An intimate close-up of an artisan-crafted cedar Native American love flute with carved bird totem or a Japanese bamboo Shakuhachi flute with root end',
        environment: 'Resting on a moss-covered river stone beside a crystal-clear mountain brook, with fallen autumn leaves and droplets of clear mountain water glistening on the wood',
        lighting: 'Soft, dappled sunlight filtering through a dense forest canopy, creating dancing light patches and highlighting the natural wood grain and turquoise stone inlay',
        palette: 'Cedar wood red-brown, turquoise blue inlay, vibrant forest moss green, and clear river water crystal',
        mood: 'Organic, sacred, peaceful, handcrafted living music',
        styleRef: 'National Geographic environmental still life photography, Japanese wabi-sabi aesthetic documentation',
        camera: 'Macro low-angle close-up, razor-sharp focus on the carved bird totem and sound hole, f/1.8 creamy blur on the sparkling river water behind',
        videoMotionText: 'Crystal-clear brook water flows continuously over river stones in the background with soothing, seamless motion. Dappled sunlight patterns dance across the polished cedar wood in an 8-second cycle. A single water droplet drips smoothly from the flute tip.',
        runwayAction: 'Crystal brook water flowing smoothly over river stones behind a handcrafted wooden flute',
        klingScene: 'Macro shot of wooden flute on mossy stone with flowing brook water and dancing dappled sunlight',
        pikaVerb: 'Clear stream water flowing peacefully over stones behind handcrafted cedar flute',
        lumaScene: 'A handcrafted cedar flute rests on a mossy stone beside a babbling mountain brook. Dappled sunlight flickers across the rich wood grain as clear water flows in a tranquil, endless loop.'
      },
      Abstrak: {
        subject: 'Sculptural ribbons of carved bamboo flutes, breathing wind soundwaves, and floating sacred eagle feathers spiraling upward into a celestial sky',
        environment: 'An ethereal sky sanctuary with translucent mountain silhouettes and golden sound waves rippling through clouds',
        lighting: 'Radiant sunrise backlighting casting golden rims along floating feathers and translucent bamboo wood fibers',
        palette: 'Warm cedar ochre (#C4883A), sky cerulean (#4A8FC4), river slate (#7A8A98), and sunrise gold',
        mood: 'Breath of life, spiritual freedom, ascending melody, primal transcendence',
        styleRef: 'Native American spiritual art of Kevin Red Star combined with Celtic knotwork geometry and high-end 3D kinetic motion design',
        camera: 'Ascending spiral perspective, fluid organic curves, golden ratio alignment and boundless vertical headroom',
        videoMotionText: 'A single sacred eagle feather descends through the center of the frame in an ultra-slow 10-second swaying arc. Golden soundwave ribbons undulate like gentle wind currents across the sky. Clouds part slowly in the background.',
        runwayAction: 'A single feather drifting down slowly through golden soundwave ribbons and sky clouds',
        klingScene: 'Abstract ascending loop of floating wooden flute spirals and slowly descending sacred feather',
        pikaVerb: 'Single feather swaying slowly downward through golden sunlit clouds',
        lumaScene: 'An abstract vision of woodwind melodies visualized as golden wind ribbons in the clouds. A single feather sways in slow motion through warm sunbeams, bringing a profound sense of peace.'
      }
    }
  },

  // 16 — SLEEP & RELAXATION
  'cat-16': {
    id: 'cat-16',
    name: '16 — SLEEP & RELAXATION',
    audience: '25–60 years old, insomnia sufferers, parents of infants, anxiety management community',
    mood: 'Hypnotic, dreamy, ultra-calm, breath-slowing, deeply safe, cocoon-like',
    palette: 'Midnight blue (#0A1040), moonlight silver (#C8CDD8), dark velvet violet (#1A0A2A), soft lavender (#BDB0CC), ghostly white (#E8EAF0), obsidian (#0A0A12)',
    lighting: 'Luminous full moon through parting clouds (cold silvery-soft), pure starfield luminescence, extremely dim 1% amber bedside lamp glow, bioluminescent underwater glow',
    styleRefs: 'Caspar David Friedrich romantic moonlight paintings, Michael Kenna long-exposure minimalist night photography, Calm & Headspace sleep story visuals',
    tags: ['deep-sleep', 'insomnia-relief', 'moonlight-ocean', 'calm-night-window', 'starry-sky', 'hypnotic-loop', 'delta-waves'],
    loopSeconds: 12,
    variants: {
      Scene: {
        subject: 'A moonlit calm bedroom window with sheer white curtains billowing gently, looking out over a mirror-smooth midnight ocean under a luminous full moon',
        environment: 'A quiet, serene bedroom interior draped in soft navy and lavender shadows, a cozy bed with plush white linen duvet, a single cup of chamomile tea cooling on a bedside table',
        lighting: 'Cool silvery moonlight pouring through the window, painting a shimmering silver light path across the calm sea surface and illuminating the translucent billowing curtains with an ethereal glow',
        palette: 'Midnight blue (#0A1040), moonlight silver (#C8CDD8), dark velvet violet (#1A0A2A), and soft lavender (#BDB0CC)',
        mood: 'Ultra-peaceful, hypnotic, safe, melds into sleep, slowing heart rate',
        styleRef: 'Michael Kenna long-exposure night photography combined with Caspar David Friedrich romantic moonlight paintings and Calm app sleep aesthetic',
        camera: 'Interior perspective looking out through the open French window, balanced framing, f/2.2 aperture keeping curtains and moonlit ocean sharp while bedroom corners dissolve into soft velvety dark',
        videoMotionText: 'Sheer translucent curtains billow in an ultra-slow, hypnotic breathing rhythm (12-second inhale/exhale cycle). The silvery light path on the calm ocean water shimmers with imperceptible micro-waves. A thin veil of silver clouds slowly glides past the luminous full moon.',
        runwayAction: 'Sheer curtains billowing ultra-slowly in moonlight overlooking a calm ocean',
        klingScene: 'Static night bedroom window with slowly billowing curtains and silver moonlight reflecting on ocean',
        pikaVerb: 'Sheer white curtains swaying ultra-slowly in moonlit night breeze by ocean',
        lumaScene: 'A quiet bedroom window overlooking a moonlit sea. Sheer white curtains breathe in an ultra-slow 12-second rhythm as silver moonlight shimmers across calm water, inducing total relaxation.'
      },
      Subjek: {
        subject: 'An intimate close-up of a vintage porcelain teacup with delicate steam rising, beside an old leather-bound book and a softly glowing amber night lamp on a rustic nightstand',
        environment: 'A cozy bedroom corner with a sleeping cat curled up under a thick knitted lavender throw blanket, rain tapping softly against the dark window glass',
        lighting: 'Warm 1% brightness amber incandescent lamp light casting a gentle 2200K cocoon of safety, contrasted with the deep indigo rain tones outside',
        palette: 'Midnight indigo (#0A1040), warm nightstand amber, soft knitted lavender (#BDB0CC), and porcelain cream',
        mood: 'Safe, warm, comforting, childhood bedtime security',
        styleRef: 'Cozy bedtime editorial photography, high-end children book illustration atmosphere, Calm app sleep stories',
        camera: 'Macro eye-level perspective, shallow depth of field f/1.8 focusing on the rim of the teacup and book spine, background bedroom darkness softly diffused',
        videoMotionText: 'The sleeping cat chest rises and falls in an ultra-slow, soothing 4-second breathing cycle. A delicate trace of herbal tea steam curls lazily into the warm lamp glow. Raindrops on the window pane slide slowly downward in a continuous quiet cadence.',
        runwayAction: 'Sleeping cat breathing gently beside a warm night lamp and rain-streaked window',
        klingScene: 'Macro cozy bedroom still life with sleeping cat breathing rhythmically and drifting tea steam',
        pikaVerb: 'Gentle slow breathing of sleeping cat on soft blanket by warm bedside lamp',
        lumaScene: 'A peaceful bedside table bathed in a warm, gentle lamp glow. A sleeping cat breathes softly under a knit blanket while raindrops trickle down the dark window in a calming rhythm.'
      },
      Abstrak: {
        subject: 'A boundless cosmic ocean of floating silver moonbeams, luminous jellyfish orbs, and soft nebula clouds drifting in deep hypnotic weightlessness',
        environment: 'A serene celestial abyss where starlight dissolves into soft indigo mist, with concentric waves of sleep frequency energy expanding outward',
        lighting: 'Ethereal bioluminescent silver and deep violet luminescence pulsing like a slow human breath at 6 breaths per minute',
        palette: 'Deep obsidian night (#0A0A12), celestial silver (#C8CDD8), soft lavender haze (#BDB0CC), and ocean bioluminescence',
        mood: 'Hypnotic surrender, weightless drifting, deep delta sleep induction',
        styleRef: 'Caspar David Friedrich cosmic romanticism meets modern bioluminescent underwater art and slow-tempo ambient visual installations',
        camera: 'Floating zero-gravity perspective, continuous seamless horizon, sublime symmetry and vast spatial comfort',
        videoMotionText: 'The bioluminescent silver particles expand and contract in an ultra-slow 12-second delta breathing rhythm. Stars in the distant background twinkle independently with asynchronous gentle pulses. Soft nebula clouds drift with imperceptible fluidity.',
        runwayAction: 'Bioluminescent silver particles expanding and contracting in a hypnotic slow breathing loop',
        klingScene: 'Hypnotic abstract cosmic ocean with pulsing silver starlight and drifting nebula mist',
        pikaVerb: 'Ethereal glowing silver particles pulsing in slow hypnotic breathing rhythm',
        lumaScene: 'A weightless cosmic ocean where soft silver starlight and lavender nebulae drift in serene silence. Bioluminescent waves expand in an ultra-slow breathing rhythm, carrying the viewer into deep sleep.'
      }
    }
  },

  // 17 — UKULELE & MANDOLIN
  'cat-17': {
    id: 'cat-17',
    name: '17 — UKULELE & MANDOLIN',
    audience: '16–42 years old, positive lifestyle community, Hawaii travelers, folk & acoustic dreamers',
    mood: 'Joyful, wholesome, carefree, colorful, sunny, warmhearted',
    palette: 'Bright sunshine yellow (#FFD700), sky blue (#87CEEB), fresh grass green (#5DBB63), coral pink (#FF8C7F), soft lavender (#DDA0DD), cloud white (#F0F8FF)',
    lighting: 'Brilliant midday tropical sunshine, warm afternoon glow through fruit tree leaves, flattering golden beach hour',
    styleRefs: 'Wes Anderson pastel color palettes, Pixar animated color scripts, vintage 1950s Hawaii travel posters, Studio Ghibli meadow scenes (My Neighbor Totoro), Rob Ryan papercut art',
    tags: ['ukulele-sunny', 'island-vibes', 'hawaiian-beach', 'wholesome-acoustic', 'wes-anderson-palette', 'carefree-summer', 'mandolin-meadow'],
    loopSeconds: 8,
    variants: {
      Scene: {
        subject: 'A handcrafted curly koa wood concert ukulele with a fragrant tropical plumeria flower lei draped across its strings, resting on powdery white beach sand',
        environment: 'A pristine secluded Hawaiian beach with crystal-clear turquoise ocean waves lapping the shore, leaning coconut palm trees, and a faint colorful rainbow arching across distant emerald sea cliffs',
        lighting: 'Radiant golden afternoon tropical sunshine casting soft warm shadows on the white sand, with bright specular sparkles dancing across the turquoise water',
        palette: 'Sunshine yellow (#FFD700), tropical sky blue (#87CEEB), koa wood amber, coral pink (#FF8C7F), and palm green (#5DBB63)',
        mood: 'Pure happiness, optimism, carefree vacation freedom, warmhearted joy',
        styleRef: 'Wes Anderson symmetrical pastel color grading combined with Studio Ghibli vibrant nature scenery and vintage 1950s Hawaii travel posters',
        camera: 'Eye-level wide beach shot, low camera angle just above the white sand, crisp rule of thirds composition with the ocean horizon stretching across the background',
        videoMotionText: 'Turquoise ocean waves lap the white sand shore in a gentle, rhythmic 6-second cycle with sparkling seafoam. Coconut palm fronds overhead sway in a warm island trade wind. A soft golden lens flare pulses gently in the upper corner of the frame.',
        runwayAction: 'Turquoise ocean waves lapping white sand beach next to a ukulele with swaying palms',
        klingScene: 'Static wide shot of Hawaiian beach with ukulele, rhythmic gentle ocean waves, and swaying palm shadows',
        pikaVerb: 'Gentle turquoise ocean waves washing over white sand beside ukulele',
        lumaScene: 'A sunny Hawaiian beach paradise where an artisan koa ukulele rests on warm white sand. Turquoise waves lap gently at the shore while coconut palms sway in a joyful, sun-drenched breeze.'
      },
      Subjek: {
        subject: 'An intimate close-up of a vintage teardrop mandolin with carved spruce top and f-holes resting on a checkered red-and-white picnic blanket with fresh strawberries and wild daisies',
        environment: 'A sunlit wildflower meadow buzzing with butterflies, under the shade of a flowering apple orchard in late spring',
        lighting: 'Bright, warm dappled sunlight filtering through apple blossoms, casting playful flickering light dots across the polished mandolin wood',
        palette: 'Spruce amber, strawberry ruby red, fresh meadow green (#5DBB63), and daisy white',
        mood: 'Wholesome, nostalgic, cheerful, carefree picnic romance',
        styleRef: 'Pixar animated lighting warmth combined with English cottagecore photography and Studio Ghibli spring meadow aesthetics',
        camera: 'Macro 45-degree angle, razor-sharp focus on the mandolin strings and pearloid pickguard, shallow depth of field f/1.8 with soft blurred daisies around',
        videoMotionText: 'A colorful swallowtail butterfly flutters into the frame, rests on a nearby daisy for 4 seconds, and gently flutters away. Dappled sunlight patterns dance across the mandolin strings as tree branches sway above. Wild grass blades sway in a light breeze.',
        runwayAction: 'A butterfly fluttering and landing on a daisy next to a sunlit mandolin in a meadow',
        klingScene: 'Macro detail of picnic blanket and mandolin with dancing dappled sunlight and fluttering butterfly',
        pikaVerb: 'Dappled sunlight dancing on wooden mandolin and picnic blanket in wildflower meadow',
        lumaScene: 'A charming picnic scene in a spring meadow. Dappled sunlight dances across the strings of a mandolin while a butterfly flutters gracefully past fresh strawberries and wild daisies.'
      },
      Abstrak: {
        subject: 'A joyful kaleidoscope of floating plumeria petals, colorful ukulele silhouettes, and vibrant tropical rainbow ribbons undulating in cheerful harmony',
        environment: 'A bright pastel dreamscape with stylized paper-cut cloud layers and glowing sunshine circles',
        lighting: 'High-key cheerful lighting with soft pastel glow, zero dark shadows, warm radiant summer warmth',
        palette: 'Sunny yellow (#FFD700), sky blue (#87CEEB), coral pink (#FF8C7F), and mint green (#5DBB63)',
        mood: 'Playful, vibrant, uplifting, pure childhood delight',
        styleRef: 'Rob Ryan papercut art combined with Wes Anderson graphic color blocks and Pixar short film visual joy',
        camera: 'Centered symmetrical graphic perspective, dynamic layered 2.5D paper cutout planes, crisp vector-like textures',
        videoMotionText: 'Plumeria flower petals drift diagonally across the frame in a continuous playful shower. Colorful rainbow ribbons undulate in a synchronized joyful 8-second wave. The golden sun motif pulses with a warm, gentle breathing glow.',
        runwayAction: 'Colorful plumeria petals drifting down past joyful rainbow ribbons and sun shapes',
        klingScene: 'Playful animated papercut loop of drifting tropical flower petals and undulating rainbow ribbons',
        pikaVerb: 'Colorful flower petals drifting playfully through sunny pastel rainbow shapes',
        lumaScene: 'A delightful abstract wonderland of dancing tropical petals and undulating pastel rainbows. Cheerful sunbeams pulse in a warm, radiant rhythm, spreading boundless optimism.'
      }
    }
  },

  // 18 — WORLD & TRAVEL INSTRUMENTAL
  'cat-18': {
    id: 'cat-18',
    name: '18 — WORLD & TRAVEL INSTRUMENTAL',
    audience: '28–58 years old, travel enthusiasts, National Geographic & Lonely Planet readers, culture explorers',
    mood: 'Adventurous, culturally rich, inspiring, wanderlust, authentic heritage',
    palette: 'Region-specific rich palettes: Saffron (#E58C3A), terracotta (#C86446), cobalt (#1D4E89), temple gold (#D4A017), emerald (#2D6A4F), ruby silk (#9B2226)',
    lighting: 'Location-authentic: Hard midday desert light with deep shadows, mystical temple dawn gold, midnight Nordic sun, diffused Amazonian canopy, misty Celtic coastal overcast',
    styleRefs: 'National Geographic master photography (Steve McCurry, Frans Lanting), vintage Thomas Cook travel posters, Jiro Bevis illustrated maps, Condé Nast Traveler editorial photography',
    tags: ['world-music', 'travel-wanderlust', 'national-geographic', 'morocco-riad', 'bali-temple', 'silk-road', 'celtic-heritage', 'indigenous-culture'],
    loopSeconds: 10,
    variants: {
      Scene: {
        subject: 'An authentic regional string instrument (such as a Turkish Oud, Balinese Gamelan, or Indian Sitar) resting on an ornate mosaic courtyard terrace',
        environment: 'An exotic historic sanctuary: a Marrakech riad with carved stucco arches, hammered copper lanterns, and zellige tiles; or a misty Balinese water palace with lotus ponds, stone dragon carvings, and lush jungle terraces',
        lighting: 'Magical golden hour illumination streaming through carved geometric wooden mashrabiya lattice screens, casting intricate lace-like geometric shadow patterns across terracotta floors and water pools',
        palette: 'Saffron gold (#E58C3A), Moroccan terracotta (#C86446), Fez cobalt blue (#1D4E89), and jungle emerald (#2D6A4F)',
        mood: 'Enchanting, culturally immersive, ancient wanderlust, evocative storytelling',
        styleRef: 'Steve McCurry National Geographic portraiture and architectural photography combined with vintage luxury travel posters and Condé Nast Traveler editorial spreads',
        camera: 'Wide architectural cinematic perspective, dramatic one-point perspective through carved stone arches, razor-sharp tile textures and rich atmospheric depth',
        videoMotionText: 'Intricate geometric shadow patterns shift slowly across the tiled courtyard as the golden sun moves. Water in the central fountain or lotus pool ripples continuously in an ultra-slow, serene loop. A sheer embroidered silk curtain sways gently in the warm desert or tropical breeze.',
        runwayAction: 'Water rippling in an ornate palace courtyard fountain as geometric lattice shadows shift',
        klingScene: 'Static wide shot of an exotic riad courtyard with shimmering water fountain and swaying silk drapery',
        pikaVerb: 'Gentle water ripples in mosaic courtyard pool with shifting geometric sun shadows',
        lumaScene: 'An enchanting Moroccan riad at sunset. Water in a zellige mosaic fountain shimmers gently while intricate geometric shadows from carved lattice screens glide slowly across warm terracotta tiles.'
      },
      Subjek: {
        subject: 'An intimate macro perspective of a classical Indian sitar with carved gourd, bone bridges, and brass drone strings, or an artisan Middle Eastern oud with inlaid mother-of-pearl rosette',
        environment: 'Resting on a handwoven antique Persian rug with intricate tribal patterns, beside a small copper incense burner releasing sweet sandalwood smoke',
        lighting: 'Warm, low-angle raking lantern light highlighting the hand-carved floral inlays, the pearloid iridescence, and the deep aged patina of the tonewood',
        palette: 'Antique copper, mother-of-pearl opal, rich saffron amber, and deep ruby woven wool',
        mood: 'Intimate, mystical, centuries of artisan devotion, soul-stirring heritage',
        styleRef: 'Frans Lanting National Geographic artifact photography, high-end museum ethnographic documentation',
        camera: 'Macro low-angle 45-degree close-up, razor-sharp focus on the mother-of-pearl soundhole purfling and tuned strings, creamy bokeh of woven rug patterns in background',
        videoMotionText: 'A delicate ribbon of fragrant sandalwood smoke rises from the copper burner in a smooth fluid simulation loop. Tiny mother-of-pearl inlays catch and reflect warm candlelight with subtle iridescence. A single brass drone string vibrates with micro-harmonic motion.',
        runwayAction: 'Sandalwood incense smoke curling slowly beside a mother-of-pearl inlaid instrument',
        klingScene: 'Macro detail of hand-carved oud and rising incense smoke on an antique Persian rug',
        pikaVerb: 'Fragrant incense smoke curling past hand-carved wooden instrument with pearl inlays',
        lumaScene: 'An intimate close-up of a handcrafted oud adorned with mother-of-pearl. A thin ribbon of sandalwood incense smoke curls peacefully past the bronze strings in the warm glow of a copper lantern.'
      },
      Abstrak: {
        subject: 'An ancient illuminated world map parchment transforming into golden acoustic contour lines, compass roses, and celestial trade wind currents',
        environment: 'An expansive cosmic explorer study filled with floating brass astrolabes, armillary spheres, and constellations of glowing caravan routes',
        lighting: 'Radiant golden candlelight from antique lanterns casting long navigational vector shadows across aged navigational charts',
        palette: 'Aged parchment sepia, burnished brass (#D4A017), indigo ocean (#1D4E89), and spice saffron (#E58C3A)',
        mood: 'Epic exploration, timeless discovery, boundless horizons, universal human journey',
        styleRef: 'Jiro Bevis illustrative cartography combined with National Geographic historical map art and Renaissance navigational science aesthetics',
        camera: 'Slow sweeping angled perspective, mathematical compass geometry, golden ratio navigational grid lines',
        videoMotionText: 'The golden compass rose and astrolabe rings rotate in an ultra-slow 20-second celestial navigation cycle. Ethereal trade wind currents flow along the ancient maritime routes like liquid gold. Warm candle glow breathes softly in intensity.',
        runwayAction: 'Antique brass astrolabe rings rotating slowly over an ancient map with glowing trade routes',
        klingScene: 'Hypnotic abstract loop of rotating brass compass rings and flowing golden trade wind currents',
        pikaVerb: 'Antique brass compass rings rotating smoothly over glowing world map routes',
        lumaScene: 'An awe-inspiring historical voyage visualized as golden navigational rings and trade winds flowing across an antique world map. Brass astrolabes turn with timeless grace in the warm lantern light.'
      }
    }
  }
};

/**
 * Generate fully formatted, production-ready cinematic prompt bundle for any category
 */
export function generateCinematicVisualBundle(
  categoryId: string,
  categoryName?: string,
  activeVariant: CinematicVariantType = 'Scene'
): CinematicVisualBundle {
  // Match category or fallback to cat-01
  const normalizedId = (categoryId && CATEGORY_DATABASE[categoryId]) 
    ? categoryId 
    : (Object.keys(CATEGORY_DATABASE).find(k => categoryName && CATEGORY_DATABASE[k].name.toLowerCase().includes(categoryName.toLowerCase())) || 'cat-01');

  const cat = CATEGORY_DATABASE[normalizedId];

  const buildVariant = (vType: CinematicVariantType): CinematicPromptVariant => {
    const v = cat.variants[vType];
    const loopSec = cat.loopSeconds;

    // 1. Mandatory Image Prompt Structure:
    // Subjek + Lingkungan + Pencahayaan + Palet Warna + Mood + Referensi Gaya + Komposisi Kamera + Modifier Kualitas
    const imagePrompt = 
      `A masterwork cinematic photograph depicting ${v.subject}. ` +
      `Environment and setting: ${v.environment}. ` +
      `Lighting and illumination: ${v.lighting}. ` +
      `Color palette: dominated by ${v.palette}. ` +
      `Emotional mood and atmosphere: ${v.mood}. ` +
      `Artistic and stylistic references: inspired by ${v.styleRef}. ` +
      `Camera composition: ${v.camera}. ` +
      `${MANDATORY_IMAGE_MODIFIER}`;

    // 2. Mandatory Video Prompt Structure:
    // Animated motion description in English (80–120 words), 80% ultra-slow hypnotic movement, closed by video modifier
    const videoPrompt = 
      `Cinematic animated video loop derived from the master image. ` +
      `Camera execution: Strictly locked-off static camera on a heavy tripod, zero camera shake, no panning, no tilting, no zooming, no cuts. ` +
      `Subject and environmental micro-motion: ${v.videoMotionText} ` +
      `Atmosphere: Hypnotic, soothing, and deeply atmospheric for long-duration music playback. ` +
      `${getMandatoryVideoModifier(loopSec)}`;

    // 3. Platform Specific Prompts:
    // Runway ML: [Subjek] [kata kerja aksi], [deskripsi lingkungan], [perilaku pencahayaan], [atmosfer], [gerakan kamera], [deskriptor kecepatan], kualitas sinematik, 4K, loop [durasi] detik
    const runwayMl = 
      `${v.subject} ${v.runwayAction}, set in ${v.environment}, illuminated by ${v.lighting}, capturing an atmosphere of ${v.mood}, locked-off tripod camera, ultra-slow hypnotic speed, cinematic quality, 4K, loop ${loopSec} seconds.`;

    // Kling AI: Kamera: [gerakan kamera]. Adegan: [deskripsi detail]. Gerak subjek: [gerakan subjek]. Atmosfer: [mood]. Pencahayaan: [perilaku cahaya]. Gaya: [gaya visual]. Durasi: [detik].
    const klingAi = 
      `Kamera: Kamera statis tripod terkunci tanpa getaran, tanpa zoom. Adegan: ${v.klingScene}. Gerak subjek: ${v.videoMotionText}. Atmosfer: ${v.mood}. Pencahayaan: ${v.lighting}. Gaya: ${v.styleRef}, kualitas sinematik 4K. Durasi: ${loopSec} detik loop mulus.`;

    // Pika Labs: [Frasa kata kerja menggambarkan gerakan utama], [deskripsi adegan], [deskripsi pencahayaan], [tag gaya]
    const pikaLabs = 
      `${v.pikaVerb}, ${v.environment}, ${v.lighting}, cinematic, ultra-slow motion, 4K, seamless loop, ${cat.tags.slice(0, 4).join(', ')}`;

    // Luma Dream Machine: [Deskripsi adegan dalam present tense]. [Gerakan kamera]. [Perilaku subjek]. [Elemen atmosfer]. [Deskriptor kualitas visual].
    const lumaDreamMachine = 
      `${v.lumaScene} The camera remains completely still on a locked-off tripod with no panning or motion. Micro-movements occur with hypnotic, ultra-slow calmness. Atmospheric particles and light refractions pulse seamlessly. 4K high-fidelity render, cinematic grade, perfect loop.`;

    // Midjourney: [prompt] --ar 16:9 --v 6.1 --style raw
    const midjourney = `${imagePrompt} --ar 16:9 --v 6.1 --style raw`;

    // DALL-E 3
    const dalle3 = `A masterclass cinematic photograph in 16:9 widescreen format: ${imagePrompt}`;

    // Stable Diffusion
    const stableDiffusion = {
      positive: imagePrompt,
      negative: UNIVERSAL_NEGATIVE_PROMPT,
      cfgScale: 7.0,
      sampler: 'DPM++ 2M Karras',
      steps: 30
    };

    // Google Flow Image & Video
    const googleFlowImage = imagePrompt;
    const googleFlowVideo = videoPrompt;

    // Formatted standardized text as mandated by user:
    const formattedFullText = 
`🎵 KATEGORI: ${cat.name}
🎨 VARIAN: ${vType}

📸 PROMPT GAMBAR:
${imagePrompt}

🎬 PROMPT VIDEO:
${videoPrompt}

🚫 NEGATIVE PROMPT:
${UNIVERSAL_NEGATIVE_PROMPT}

⚙️ SPESIFIKASI TEKNIS:
Resolusi: 3840x2160 (4K) | Rasio: 16:9 | Loop: ${loopSec} detik

🏷️ TAG GAYA:
${cat.tags.join(', ')}`;

    const variantTitleMap: Record<CinematicVariantType, string> = {
      Scene: 'Scene (Lanskap & Lingkungan)',
      Subjek: 'Subjek (Fokus Instrumen & Objek)',
      Abstrak: 'Abstrak (Atmosfer & Geometri)'
    };

    return {
      variantType: vType,
      variantTitle: variantTitleMap[vType],
      categoryTitle: cat.name,
      imagePrompt,
      videoPrompt,
      negativePrompt: UNIVERSAL_NEGATIVE_PROMPT,
      parameters: {
        audience: cat.audience,
        lighting: cat.lighting,
        colorPalette: cat.palette,
        mood: cat.mood,
        styleReference: cat.styleRefs
      },
      technicalSpecs: {
        resolution: '3840x2160 (4K)',
        aspectRatio: '16:9',
        loopSeconds: loopSec
      },
      styleTags: cat.tags,
      formattedFullText,
      platforms: {
        image: {
          googleFlow: googleFlowImage,
          midjourney,
          dalle3,
          flux: `Cinematic 8K composition, highly detailed render: ${googleFlowImage}. Ultra-sharp textures, authentic depth of field, photorealistic ray tracing, cinematic color grade.`,
          imagen: `Photorealistic 4K wide shot, professional camera photography: ${googleFlowImage}. Natural light bounce, cinematic color grading, hyper-detailed textures.`,
          stableDiffusion
        },
        video: {
          googleFlow: googleFlowVideo,
          runwayMl,
          klingAi,
          pikaLabs,
          lumaDreamMachine
        }
      }
    };
  };

  return {
    categoryName: cat.name,
    activeVariant,
    variants: {
      Scene: buildVariant('Scene'),
      Subjek: buildVariant('Subjek'),
      Abstrak: buildVariant('Abstrak')
    }
  };
}
