import { Category, ContentPackage } from '../types';

export const SAMPLE_LOFI_PACKAGE: ContentPackage = {
  id: 'pkg-lofi-001',
  userId: 'usr-demo',
  categoryId: 'cat-01',
  categoryName: 'Lo-fi & Chill Beats',
  subGenre: 'Lo-fi Hip-Hop Study',
  moods: ['Cozy', 'Focus', 'Late Night'],
  optionalKeyword: 'rainy night in tokyo',
  duration: '3 Hours',
  useCase: 'Study & Sleep',
  createdAt: '2025-11-14T08:30:00Z',
  generationMs: 3840,
  model: 'gemini-3.8-flash',
  
  // 1. YouTube Metadata
  metadata: {
    titleA: 'Rainy Night Lo-fi Piano — Relaxing Music for Study & Sleep (3 Hours)',
    titleB: 'Tokyo Rain Lo-fi Beats — Deep Focus Music for Study & Coding (1 Hour)',
    titleC: 'Midnight Rainy Night — Calm Background Music for Relaxing & Sleep (3 Hours)',
    titleVariants: [
      {
        title: 'Rainy Night Lo-fi Piano — Relaxing Music for Study & Sleep (3 Hours)',
        score: 98,
        reason: 'Formula sempurna: kombinasi keyword niche piano/lofi, search volume tinggi YouTube, panjang 68 karakter, dan 100% jujur sesuai durasi.',
        isPrimaryRecommendation: true,
        breakdown: {
          seoKeyword: 35,
          ctrPotential: 29,
          contentHonesty: 20,
          formulaCompliance: 14
        }
      },
      {
        title: 'Tokyo Rain Lo-fi Beats — Deep Focus Music for Study & Coding (1 Hour)',
        score: 94,
        reason: 'Search intent kuat pada aktivitas penonton (study & coding) dengan genre lo-fi beats yang jelas.',
        isPrimaryRecommendation: false,
        breakdown: {
          seoKeyword: 33,
          ctrPotential: 28,
          contentHonesty: 19,
          formulaCompliance: 14
        }
      },
      {
        title: 'Midnight Rainy Night — Calm Background Music for Relaxing & Sleep (3 Hours)',
        score: 91,
        reason: 'Sangat efektif untuk niche sleep soundscape dengan keyword background music bervolume tinggi.',
        isPrimaryRecommendation: false,
        breakdown: {
          seoKeyword: 32,
          ctrPotential: 26,
          contentHonesty: 20,
          formulaCompliance: 13
        }
      },
      {
        title: 'Cozy Rain Lo-fi Piano — Instrumental Study Music for Focus (No Lyrics)',
        score: 89,
        reason: 'Keyword No Lyrics meningkatkan watch time penonton yang membutuhkan fokus tanpa distraksi vokal.',
        isPrimaryRecommendation: false,
        breakdown: {
          seoKeyword: 31,
          ctrPotential: 26,
          contentHonesty: 19,
          formulaCompliance: 13
        }
      },
      {
        title: 'Rainy Night Lo-fi Beats Session — Stress Relief Music to Unwind (3 Hours)',
        score: 87,
        reason: 'Target keyword relaksasi dan stress relief dengan retensi tinggi untuk putar di latar belakang.',
        isPrimaryRecommendation: false,
        breakdown: {
          seoKeyword: 30,
          ctrPotential: 25,
          contentHonesty: 19,
          formulaCompliance: 13
        }
      }
    ],
    description: `Relax, study, or unwind with peaceful lo-fi hip hop beats set against a tranquil rainy night in Tokyo. Perfectly timed 1-hour seamless loop engineered for zero-distraction deep work, pomodoro sessions, and late-night coding.

Timestamps:
00:00 - Midnight Drizzle
14:20 - Steam from the Coffee Mug
28:45 - Neon Reflections on Pavement
45:10 - Quiet Alleyway Melodies
58:30 - Gentle Closing Loop

Produced & Curated for high-retention focus sessions. No harsh transitions, balanced master at -14 LUFS.
#lofi #chillbeats #studywithme #rainambience #lofihiphop`,
    tags: [
      'lofi beats',
      'lofi hip hop',
      'study music',
      'tokyo rain lofi',
      'relaxing beats',
      'music for studying',
      'no lyrics instrumental',
      'rain sound effect',
      'cozy lofi coffee',
      'pomodoro music',
      'coding beats',
      'late night lofi'
    ]
  },

  // 2. Thumbnail Text Variants (CTR > 20%)
  thumbnailText: {
    variant1: 'STUDY & CHILL 📚',
    variant2: 'RAIN IN TOKYO 🌧️',
    variant3: 'DEEP FOCUS ⚡'
  },

  // 3. Intro Hook Video (0-10s)
  introHook: 'Rain outside, warm amber light inside — press play, let this continuous loop run, and slip into effortless deep focus for the next hour.',

  // 4. 4-Style Thumbnail Prompts
  thumbnailPrompts: {
    cinematic: 'Cinematic widescreen photograph, 16:9 aspect ratio, 35mm lens f/1.8 depth of field. A young student seen from behind sitting at a wooden desk beside a rain-streaked apartment window overlooking Tokyo night skyline with blurred neon reflections. A warm amber desk lamp softly illuminates an open vintage notebook, ceramic coffee cup with gentle steam curling up, and glowing mechanical keyboard. Masterpiece, moody atmosphere, color graded in warm amber and deep navy cyan tones, high contrast, clean negative space on the left third for bold typography placement.',
    split: 'Split composition 16:9 YouTube thumbnail layout. Left side: Macro close-up of a steaming hot ceramic mug of matcha latte resting on a mahogany wooden table with rain drops trickling on window glass in the background. Right side: Wide angle aesthetic corner of a cozy Tokyo bedroom with fairy string lights, cassette tape player, and a sleeping orange cat curled on an armchair. Vibrant warm color palette, ultra-sharp detail, high dynamic range, editorial layout.',
    minimal: 'Minimalist high-contrast aesthetic graphic photo, 16:9 ratio. Clean studio flat lay over dark textured slate table: vintage brass headphones, open leather journal with fountain pen, single glowing amber desk lamp beam cutting diagonally across darkness. Stark lighting, hyper-clean negative space occupying 60% of the canvas for text overlay, elegant Japanese minimalism, award-winning art direction.',
    lifestyle: 'Authentic cozy lifestyle photography, 16:9 ratio. Overhead angle of an aesthetic work-from-home desk setup during a stormy rainy evening. Soft ambient glow from multiple warm light sources, steaming mug of tea, mechanical keyboard with subtle backlight, acoustic guitar leaning against wooden bookshelf in soft background blur. Inviting, melancholic, intimate, relatable, hyper-realistic film grain.'
  },

  // 5. Image Prompts (Hanya 1 Gambar Terbaik untuk Google Flow Base Scene)
  imagePrompts: [
    'Background: High-rise minimalist apartment in Shibuya Tokyo at 2:00 AM, continuous gentle rainfall streaming down expansive floor-to-ceiling glass window, blurred neon signage in muted cyan and deep indigo reflecting across wet exterior glass. Main subject: Centered dark mahogany study desk with illuminated vintage brass gooseneck lamp casting warm 2700K golden illumination on studio headphones, open cream-colored notebook, and mechanical keyboard in razor-sharp focus (f/1.8). Foreground: Delicate translucent wisps of aromatic steam curling upward from a warm ceramic coffee mug, with macro raindrops slowly beading on the interior window sill. Lighting & color grading: Directional warm tungsten chiaroscuro cutting across atmospheric twilight blue shadows, rich color separation, deep blacks. photorealistic / cinematic detail, aspect ratio 16:9'
  ],

  // 6. Video Prompt (Turunan dari Prompt Gambar untuk Google Flow Image-to-Video)
  videoPrompt: 'Locked-off static camera strictly mounted on a stable tripod, no panning, no camera tilt, no zooming, no camera shake, zero cuts. Delicate cyclical micro-motion strictly isolated to translucent steam rising from the ceramic coffee mug in continuous gentle spirals, rain droplets slowly tracing downward paths along the exterior window glass, and tiny golden dust motes floating lazily through the warm desk lamp beam. Perfectly seamless 10-second loop cycle with identical first and last frame physics, zero jump-cuts, flawless continuous motion for multi-hour playback.',

  // Google Flow Details (4 Lapisan Komposisi & Spesifikasi Loop)
  googleFlowDetails: {
    compositionTitle: 'Nocturnal Study Desk & Rainy Shibuya Window',
    variationIndex: 0,
    layers: {
      background: 'High-rise minimalist apartment in Shibuya Tokyo at 2:00 AM, continuous gentle rainfall streaming down expansive floor-to-ceiling glass window, blurred neon signage in muted cyan and deep indigo reflecting across wet exterior glass.',
      mainSubject: 'Centered dark mahogany study desk with illuminated vintage brass gooseneck lamp casting warm 2700K golden illumination on studio headphones, open cream-colored notebook, and mechanical keyboard in razor-sharp focus (f/1.8).',
      foreground: 'Delicate translucent wisps of aromatic steam curling upward from a warm ceramic coffee mug, with macro raindrops slowly beading on the interior window sill.',
      lightingAndColor: 'Directional warm tungsten chiaroscuro cutting across atmospheric twilight blue shadows, rich color separation, deep blacks.'
    },
    imagePrompt: 'Background: High-rise minimalist apartment in Shibuya Tokyo at 2:00 AM, continuous gentle rainfall streaming down expansive floor-to-ceiling glass window, blurred neon signage in muted cyan and deep indigo reflecting across wet exterior glass. Main subject: Centered dark mahogany study desk with illuminated vintage brass gooseneck lamp casting warm 2700K golden illumination on studio headphones, open cream-colored notebook, and mechanical keyboard in razor-sharp focus (f/1.8). Foreground: Delicate translucent wisps of aromatic steam curling upward from a warm ceramic coffee mug, with macro raindrops slowly beading on the interior window sill. Lighting & color grading: Directional warm tungsten chiaroscuro cutting across atmospheric twilight blue shadows, rich color separation, deep blacks. photorealistic / cinematic detail, aspect ratio 16:9',
    videoRules: {
      cameraRule: 'Completely static locked-off tripod camera. Strictly zero pan, tilt, zoom, or camera shake.',
      cyclicalMotions: [
        'Translucent steam curling upward from ceramic coffee mug in endless gentle loop',
        'Raindrops steadily tracing downward paths along exterior window glass',
        'Faint golden dust motes floating through warm desk lamp light beam'
      ],
      loopDuration: '10 seconds seamless loop',
      noJumpCutNote: 'Perfect loop physics with identical start and end frames, zero jump-cut or frame popping.'
    },
    videoPrompt: 'Locked-off static camera strictly mounted on a stable tripod, no panning, no camera tilt, no zooming, no camera shake, zero cuts. Delicate cyclical micro-motion strictly isolated to translucent steam rising from the ceramic coffee mug in continuous gentle spirals, rain droplets slowly tracing downward paths along the exterior window glass, and tiny golden dust motes floating lazily through the warm desk lamp beam. Perfectly seamless 10-second loop cycle with identical first and last frame physics, zero jump-cuts, flawless continuous motion for multi-hour playback.'
  },

  // 7. Technical Notes
  technicalNotes: `• Resolution: 16:9 (3840x2160 4K or 1920x1080 Full HD)
• Framerate: 30 fps (Cinematic smooth motion)
• Audio Loudness Target: -14 LUFS Integrated (-1.0 dB True Peak) for YouTube normalization compliance
• Video Loop Engine: Export 10s seamless clip, duplicate 60 times in timeline for 10-minute base block, export 1-hour master file
• Pre-Upload Checklist:
  ✓ Title variant tested against character limit (<70 chars before cutoff on mobile)
  ✓ First 3 lines of description contain primary keywords (no lyrics, study music, rain)
  ✓ Thumbnail text rendered in heavy bold sans-serif with subtle outer drop shadow for 100% legibility on mobile screens (<120px display)
  ✓ Video tagged with top 10 search intent tags (lofi, study beats, rain ambience)`
};

export const CATEGORIES_DATA: Category[] = [
  {
    id: 'cat-01',
    name: 'Lo-fi & Chill Beats',
    slug: 'lofi-chill-beats',
    description: 'Beats santai bergaya hip-hop lo-fi untuk menemani belajar, coding, dan kerja panjang tanpa distraksi lirik.',
    iconEmoji: '🎧',
    sortOrder: 1,
    isActive: true,
    subGenres: ['Lo-fi Hip-Hop Study', 'Chillhop Melodic', 'Lo-fi Rain & Ambience', 'Lo-fi Coffee Shop', 'Midnight Tokyo Lofi', 'Anime Nostalgia Beats'],
    moods: ['Cozy', 'Focus', 'Late Night', 'Chill', 'Nostalgia', 'Melancholic', 'Dreamy'],
    samplePackage: SAMPLE_LOFI_PACKAGE
  },
  {
    id: 'cat-02',
    name: 'Piano & Solo Keys',
    slug: 'piano-solo-keys',
    description: 'Komposisi piano solo yang lembut, intim, dan emosional untuk relaksasi mendalam dan membaca buku.',
    iconEmoji: '🎹',
    sortOrder: 2,
    isActive: true,
    subGenres: ['Neoclassical Piano', 'Romantic Solo Piano', 'Minimalist Felt Piano', 'Cinematic Sad Piano', 'Gentle Morning Keys'],
    moods: ['Emotional', 'Peaceful', 'Intimate', 'Reflective', 'Calm', 'Heartfelt'],
    samplePackage: {
      ...SAMPLE_LOFI_PACKAGE,
      id: 'pkg-piano-002',
      categoryId: 'cat-02',
      categoryName: 'Piano & Solo Keys',
      subGenre: 'Neoclassical Piano',
      moods: ['Emotional', 'Peaceful'],
      optionalKeyword: 'autumn leaves rain',
      metadata: {
        titleA: 'Peaceful Piano Music for Deep Focus & Reading 🎹 [1 Hour Calming Loop]',
        titleB: 'Gentle Solo Piano for Stress Relief & Anxiety [Soft Felt Piano No Lyrics]',
        titleC: 'Autumn Rain & Calming Piano 🍂 Beautiful Relaxing Instrumentals',
        description: 'Immerse yourself in gentle felt piano compositions crafted for deep peace, stress reduction, and mindful reading.',
        tags: ['piano music', 'peaceful piano', 'relaxing piano', 'study piano', 'reading music', 'stress relief']
      },
      thumbnailText: {
        variant1: 'PEACEFUL PIANO 🎹',
        variant2: 'DEEP CALM 🌿',
        variant3: 'STRESS RELIEF 🕊️'
      }
    }
  },
  {
    id: 'cat-03',
    name: 'Study & Deep Focus',
    slug: 'study-deep-focus',
    description: 'Frekuensi binaural, ambient drone, dan rhythm stabil yang dirancang untuk memicu gelombang Alpha otak.',
    iconEmoji: '🧠',
    sortOrder: 3,
    isActive: true,
    subGenres: ['Alpha Waves 10Hz', 'Binaural Study Beats', 'Deep Work Synth Drone', 'Pomodoro 50/10 Focus Loop', 'Dark Academia Classical'],
    moods: ['Intense Focus', 'Clarity', 'Flow State', 'Analytical', 'Unstoppable'],
  },
  {
    id: 'cat-04',
    name: 'Cinematic & Film Score',
    slug: 'cinematic-film-score',
    description: 'Aransemen orkestra epik, trailer tension, dan lanskap suara megah yang membakar semangat serta imajinasi.',
    iconEmoji: '🎬',
    sortOrder: 4,
    isActive: true,
    subGenres: ['Epic Hybrid Orchestral', 'Emotional Cello & Brass', 'Sci-Fi Space Ambient', 'Nordic Viking Drums', 'Action Motivation Beats'],
    moods: ['Epic', 'Heroic', 'Suspenseful', 'Inspiring', 'Triumphant', 'Mysterious'],
  },
  {
    id: 'cat-05',
    name: 'Biola & Strings Ensemble',
    slug: 'biola-strings',
    description: 'Gesekan dawai biola solo hingga orkestra cello yang menyayat hati, penuh keanggunan dan kedalaman rasa.',
    iconEmoji: '🎻',
    sortOrder: 5,
    isActive: true,
    subGenres: ['Solo Violin Virtuoso', 'Melancholic Cello Solos', 'Chamber String Quartet', 'Modern Cinematic Strings'],
    moods: ['Sad', 'Poetic', 'Majestic', 'Warm', 'Haunting'],
  },
  {
    id: 'cat-06',
    name: 'Bossa Nova & Cafe Beats',
    slug: 'bossa-nova-cafe',
    description: 'Petikan gitar nilon bernuansa Rio de Janeiro dan ketukan ringan khas kafe pagi tepi pantai yang ceria.',
    iconEmoji: '☕',
    sortOrder: 6,
    isActive: true,
    subGenres: ['Traditional Brazilian Bossa', 'Cafe Jazz & Bossa Nova', 'Sunrise Acoustic Bossa', 'Bossa Lounge Chillout'],
    moods: ['Sunny', 'Relaxed', 'Uplifting', 'Cozy', 'Charming'],
  },
  {
    id: 'cat-07',
    name: 'Cover Instrumental Pop & Hits',
    slug: 'cover-instrumental',
    description: 'Reimajinasi lagu-lagu populer dunia dalam format petikan akustik, piano lembut, atau aransemen biola.',
    iconEmoji: '✨',
    sortOrder: 7,
    isActive: true,
    subGenres: ['Acoustic Fingerstyle Covers', 'Chill Piano Pop Hits', 'Orchestral Cinematic Covers', 'Lofi Hip Hop Song Re-edits'],
    moods: ['Familiar', 'Nostalgic', 'Uplifting', 'Warm', 'Sing-Along Energy'],
  },
  {
    id: 'cat-08',
    name: 'Drum, Percussion & Tribal',
    slug: 'drum-percussion',
    description: 'Ritme perkusi energetik, ketukan taiko, dan beat tribal yang memompa motivasi gym, lari, serta produktivitas tinggi.',
    iconEmoji: '🥁',
    sortOrder: 8,
    isActive: true,
    subGenres: ['Japanese Taiko Power', 'African Tribal Rhythms', 'Hybrid Cinematic Percussion', 'Body Workout Stomp Beats'],
    moods: ['Energetic', 'Powerful', 'Adrenaline', 'Primal', 'Relentless'],
  },
  {
    id: 'cat-09',
    name: 'Electronic, Synthwave & Ambient',
    slug: 'electronic-synthwave',
    description: 'Synth analog 80-an bernuansa retro futuristik, cyberpunk neon, dan ambient soundscape luar angkasa.',
    iconEmoji: '🌌',
    sortOrder: 9,
    isActive: true,
    subGenres: ['Chillwave 80s', 'Darksynth Cyberpunk', 'Space Ambient Drones', 'Liquid Drum & Bass (No Vocals)'],
    moods: ['Futuristic', 'Hypnotic', 'Nocturnal', 'Ethereal', 'Driving'],
  },
  {
    id: 'cat-10',
    name: 'Game Music & 8-Bit Chiptune',
    slug: 'game-chiptune',
    description: 'Melodi nostalgia era GameBoy/SNES hingga RPG adventure orchestral yang disukai gamer dan programmer.',
    iconEmoji: '👾',
    sortOrder: 10,
    isActive: true,
    subGenres: ['8-Bit Chiptune Retro', 'Fantasy RPG Village Themes', 'Tavern Medieval Lute', 'Cozy Farming Sim Loops'],
    moods: ['Adventurous', 'Playful', 'Heroic', 'Nostalgic', 'Curious'],
  },
  {
    id: 'cat-11',
    name: 'Gitar Akustik & Fingerstyle',
    slug: 'gitar-akustik',
    description: 'Petikan senar baja dan kayu alami yang hangat, menemani waktu santai sore, berkendara, atau kemping.',
    iconEmoji: '🎸',
    sortOrder: 11,
    isActive: true,
    subGenres: ['Modern Percussive Fingerstyle', 'Folk Warm Acoustic', 'Campfire Ambient Guitar', 'Spanish Classical Nylon'],
    moods: ['Earthy', 'Heartwarming', 'Freedom', 'Reflective', 'Sunny'],
  },
  {
    id: 'cat-12',
    name: 'Jazz & Smooth Lounge',
    slug: 'jazz-smooth-lounge',
    description: 'Alunan saksofon beludru, piano jazz santai, dan nuansa klub malam mewah New York berlampu remang.',
    iconEmoji: '🎷',
    sortOrder: 12,
    isActive: true,
    subGenres: ['Smooth Midnight Jazz', 'Coffee Barista Bebop', 'Rainy Speakeasy Lounge', 'Autumn Walk Saxophone'],
    moods: ['Sophisticated', 'Romantic', 'Mellow', 'Cool', 'Sensual'],
  },
  {
    id: 'cat-13',
    name: 'Musik Klasik Masterpiece',
    slug: 'musik-klasik',
    description: 'Karya abadi Mozart, Chopin, Vivaldi, dan Bach yang terbukti meningkatkan konsentrasi dan kecerdasan auditori.',
    iconEmoji: '🎼',
    sortOrder: 13,
    isActive: true,
    subGenres: ['Mozart for Brain Power', 'Chopin Nocturnes for Sleep', 'Vivaldi Four Seasons Suites', 'Baroque Focus for Study'],
    moods: ['Timeless', 'Noble', 'Intellectual', 'Serene', 'Refined'],
  },
  {
    id: 'cat-14',
    name: 'New Age, Meditasi & Healing',
    slug: 'new-age-meditation',
    description: 'Frekuensi 432Hz dan 528Hz penyembuh DNA, Tibetan singing bowls, dan gelombang suara untuk mindfulness serta yoga.',
    iconEmoji: '🧘',
    sortOrder: 14,
    isActive: true,
    subGenres: ['432Hz Miracle Tone', 'Tibetan Singing Bowls', 'Chakra Balancing Ambient', 'Reiki Energy Healing Waves'],
    moods: ['Spiritual', 'Transcendent', 'Deep Peace', 'Healing', 'Weightless'],
  },
  {
    id: 'cat-15',
    name: 'Seruling & Flute Sanctuary',
    slug: 'seruling-flute',
    description: 'Nada buluh bambu Shakuhachi Jepang, seruling Native American, dan flute Celtic di hutan pegunungan yang hening.',
    iconEmoji: '🎋',
    sortOrder: 15,
    isActive: true,
    subGenres: ['Japanese Zen Shakuhachi', 'Native American Cedar Flute', 'Irish Celtic Tin Whistle', 'Bansuri Indian Meditation'],
    moods: ['Zen', 'Mystical', 'Pure', 'Breezy', 'Solitary'],
  },
  {
    id: 'cat-16',
    name: 'Sleep & Deep Relaxation (8 Hours)',
    slug: 'sleep-relaxation',
    description: 'Musik pengantar tidur frekuensi Delta tanpa ketukan, dirancang khusus untuk audience penderita insomnia.',
    iconEmoji: '🌙',
    sortOrder: 16,
    isActive: true,
    subGenres: ['Delta Waves 2Hz', 'Rain & Thunder Black Screen', 'Subtle Ocean Waves Ambient', 'Night Forest Cricket Slumber'],
    moods: ['Drowsy', 'Total Surrender', 'Weightless Calm', 'Silent', 'Safe'],
  },
  {
    id: 'cat-17',
    name: 'Ukulele & Sunny Island Vibes',
    slug: 'ukulele-sunny',
    description: 'Petikan ceria 4 senar khas kepulauan tropis Hawaii yang memancarkan optimisme, liburan, dan senyuman.',
    iconEmoji: '🌺',
    sortOrder: 17,
    isActive: true,
    subGenres: ['Hawaiian Sunshine Strumming', 'Acoustic Island Roadtrip', 'Whistling Happy Day Ukulele', 'Beachside Sunset Ukulele'],
    moods: ['Cheerful', 'Carefree', 'Joyful', 'Sunny', 'Warmhearted'],
  },
  {
    id: 'cat-18',
    name: 'World, Celtic & Heritage',
    slug: 'world-celtic',
    description: 'Dawai harpa Celtic, bagpipe Skotlandia, hingga petikan pipa Tiongkok yang membangkitkan keagungan sejarah masa lalu.',
    iconEmoji: '🏰',
    sortOrder: 18,
    isActive: true,
    subGenres: ['Celtic Highlands Harp', 'Nordic Pagan Ambient', 'Ancient Silk Road Guzheng', 'Middle Eastern Oud & Mirage'],
    moods: ['Ancient', 'Mythological', 'Soul-Stirring', 'Timeless', 'Epic Folk'],
  }
];

export const INITIAL_HISTORY_PACKAGES: ContentPackage[] = [];
