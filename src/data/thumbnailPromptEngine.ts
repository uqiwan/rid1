import { translateKeywordToEnglish } from '../utils/languageTranslator';
import {
  TextPositionCode,
  TEXT_POSITION_OPTIONS,
  ColorPaletteCode,
  COLOR_PALETTE_PRESETS,
  CustomColorInput,
  applyPositionAndColorToPrompt,
  validateCompositionPosition,
  validatePaletteContrast,
  validateCategoryColorTone
} from './thumbnailSettingsEngine';

export interface ThumbnailPromptDetail {
  styleName: string; // 'Sinematik' | 'Komposisi Terbelah' | 'Tipografi Minimalis' | 'Gaya Hidup'
  styleKey: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  aspectRatio: string; // '16:9'
  targetCTR: string; // '>20%'
  fullPrompt: string; // The complete English prompt for AI image generators
  renderPrompt?: string; // Prompt without commentary
  formattedBlock: string; // Complete boxed ASCII output format matching the mandatory standard
  categoryTitle: string;
  styleTitle: string;
  ctrStrategy: string;
  rawPrompt: string;
  recommendedText: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: 'OPSI 1' | 'OPSI 2' | 'OPSI 3';
    bestReason: string;
  };
  compositionGuide: {
    focalPoint: string;
    textZone: string;
    keyContrast: string;
  };
  ctrPalette: {
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { type: string; hex: string };
  };
  antiPatterns: string[];
  technicalSpecs: {
    aspectRatio: string;
    generateResolution: string;
    testResolution: string;
    platforms: string;
  };
  platformPrompts: {
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
}

export interface ThumbnailGenerationInput {
  categoryName: string;
  genre?: string;
  moods?: string[];
  preferredStyle?: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  preferredTextOption?: 'OPSI 1' | 'OPSI 2' | 'OPSI 3' | 'recommendation';
  duration?: string;
  useCase?: string;
  optionalKeyword?: string;
}

export const THUMBNAIL_MANDATORY_MODIFIERS =
  'thumbnail composition optimized, high contrast focal point, clean zones for text overlay, readable at 320x180 pixels, strong color blocking, single dominant focal point, professional YouTube thumbnail quality, no watermark, no text, no border, no logo';

export const THUMBNAIL_UNIVERSAL_NEGATIVE_PROMPT =
  'blurry focal point, multiple competing focal points, text in image, watermark, logo, border, frame, cluttered composition, too many elements, flat lighting, stock photo generic feel, bad composition, centered composition without breathing room, pixelated, jpeg artifacts, too dark to see at small size, too bright without contrast, over-saturated without focus, cartoon clipart, 3D render, nsfw, violence';

export interface CategoryThumbnailBlueprint {
  id: string;
  name: string;
  ctrPsychology: string;
  visualHook: string;
  bestStyle: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
  textOptions: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: 'OPSI 1' | 'OPSI 2' | 'OPSI 3';
    bestReason: string;
  };
  compositionGuide: {
    focalPoint: string;
    textZone: string;
    keyContrast: string;
  };
  ctrPalette: {
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { type: string; hex: string };
  };
  antiPatterns: [string, string, string, string, string];
  stylePrompts: {
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  };
}

export const THUMBNAIL_CATEGORIES_DATABASE: Record<string, CategoryThumbnailBlueprint> = {
  'cat-01': {
    id: 'cat-01',
    name: '01 — LO-FI & CHILL BEATS',
    ctrPsychology: 'Cozy escapism + productivity association: audience clicks because they crave being inside this calm sanctuary while working, studying, or winding down.',
    visualHook: '2D anime-style illustration of a young woman studying at a wooden desk near a rain-streaked window with soft bokeh city lights outside.',
    bestStyle: 'lifestyle',
    textOptions: {
      option1: 'Lo-fi Hip Hop Radio 🎵',
      option2: 'Late Night Study Vibes 🌧️',
      option3: '1 Hour Chill Beats — Study & Relax',
      bestOption: 'OPSI 2',
      bestReason: 'Audience lo-fi membeli mood dan atmosfer santai, bukan sekadar klaim fitur teknis.'
    },
    compositionGuide: {
      focalPoint: 'Siluet / ilustrasi gadis dan lampu meja amber hangat di 1/3 kiri frame',
      textZone: '2/3 kanan frame (jendela dengan bokeh lampu kota yang lembut dan flat)',
      keyContrast: 'Interior hangat amber tungsten vs eksterior malam navy gelap'
    },
    ctrPalette: {
      dominant: { name: 'Navy Gelap', hex: '#1A2744' },
      accent: { name: 'Amber Tungsten', hex: '#E8A427' },
      textZone: { type: 'Gelap', hex: '#0D1A2E' }
    },
    antiPatterns: [
      'Foto manusia nyata menggantikan ilustrasi 2D — merusak "lo-fi anime aesthetic" yang telah dikondisikan di YouTube',
      'Background putih atau terang — bertentangan total dengan mood cozy malam hari',
      'Terlalu banyak pernak-pernik di area jendela — menghancurkan zona tenang untuk teks overlay',
      'Warna neon keras yang menyilaukan (merah menyala, hijau stabilo) — bukan palet lo-fi',
      'Pose subjek menghadap langsung ke kamera — melanggar rasa privasi dan keintiman personal'
    ],
    stylePrompts: {
      lifestyle: `2D illustrated anime-style scene, young woman seen from behind sitting at a wooden study desk near a large rain-streaked window, warm amber Edison lamp casting intimate glow on left side, gentle steam rising from ceramic mug, small pothos plant on corner shelf, city lights glowing as soft bokeh orbs through rain-covered glass, deep navy blue room with amber and lavender accents, Studio Ghibli color palette with Makoto Shinkai atmospheric light quality, cozy and intimate mood, subject positioned on left one-third, large softly-lit bokeh window occupying right two-thirds as clean text zone, illustrated style not photographic, soft grain texture, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic 2D anime illustration, cozy bedroom corner at night seen through window from outside, warm Edison lamp glow visible through rain-streaked glass, silhouette of girl at desk with glowing laptop, bokeh city lights in far background, deep navy and purple tones with amber warm accent, condensation droplets on glass in sharp focus, dreamy atmospheric quality, rule of thirds composition with window frame on left, open dark sky on right as text zone, Makoto Shinkai inspired, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition 2D anime lo-fi aesthetic. Left half: intimate close-up on steaming ceramic mug beside glowing vintage cassette player and warm desk lamp in amber light. Right half: deep rainy midnight window looking out at distant blurred Tokyo cityscape, providing a clean flat navy blue backdrop dedicated for text overlay. High dynamic contrast between warm indoor haven and cool rainy night exterior, Studio Ghibli color tones, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist 2D lo-fi illustration. Solitary vintage desk lamp illuminating a steaming mug of tea on dark wooden surface in lower left quadrant. Rest of the frame is an expansive 70% calm dark midnight blue wash with subtle soft raindrops on window glass creating high-contrast negative space for headline text. Clean Japanese minimalist design, Makoto Shinkai night palette, no clutter, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-02': {
    id: 'cat-02',
    name: '02 — PIANO INSTRUMENTAL',
    ctrPsychology: 'Prestige signal + dramatic anticipation: extreme chiaroscuro contrast between ivory keys and pitch-black emptiness conveys high artistic pedigree and emotional depth.',
    visualHook: 'Extreme close-up macro of Steinway grand piano keys from a low side angle with harsh chiaroscuro spotlight slicing through absolute blackness.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Beautiful Piano Music',
      option2: 'Peaceful Piano for the Soul',
      option3: '3 Hours Relaxing Piano Music',
      bestOption: 'OPSI 1',
      bestReason: 'Kesederhanaan elegan di atas kontras chiaroscuro hitam-putih yang kuat adalah pemicu klik paling efektif.'
    },
    compositionGuide: {
      focalPoint: 'Tuts piano hitam-putih dan tangan anggun di 1/3 hingga 2/3 kiri frame',
      textZone: '1/3 kanan frame — hitam pekat, bersih tanpa detail mengganggu',
      keyContrast: 'Putih gading tuts piano vs hitam absolut latar belakang'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Piano', hex: '#0D0D0D' },
      accent: { name: 'Putih Gading & Gold', hex: '#C9A84C' },
      textZone: { type: 'Gelap Absolut', hex: '#050505' }
    },
    antiPatterns: [
      'Foto piano dari jarak jauh yang terkesan "stock photo generik korporat"',
      'Latar belakang terang atau warna-warni — menghancurkan kesan prestige dan drama klasik',
      'Terlalu banyak aksesoris dekoratif (bunga mawar, lilin banyak, tumpukan buku) yang mengaburkan focal point',
      'Pencahayaan flat merata tanpa bayangan tajam (chiaroscuro wajib untuk drama)',
      'Foto full-body pemain yang wajahnya mengambil setengah frame — instrumen adalah bintangnya'
    ],
    stylePrompts: {
      cinematic: `Extreme close-up of grand piano keys from a low side angle, black and white keys stretching toward a dramatic vanishing point, single harsh spotlight from above casting stark chiaroscuro shadows, one hand with elegant fingers resting on the keys in sharp focus, deep black background filling 60% of frame, white keys catching bright directional light in high contrast, warm gold accent light from a candle source slightly off-frame, shallow depth of field with bokeh on far keys, Hiroshi Sugimoto piano photography aesthetic, Stanley Kubrick interior lighting quality, intensely dramatic and contemplative mood, keys positioned on left and center third, deep black empty space on right as clean text zone, ultra-sharp on focal key, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition thumbnail, left half: extreme close-up of piano keys in high-contrast chiaroscuro with single dramatic spotlight, black and white keys in sharp focus, right half: deep black velvet background with subtle gold dust particles floating, strong visual divide between detailed left and clean right zones, Caravaggio-inspired lighting on keys, professional concert photography quality, elegant and prestigious mood, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist fine-art piano composition. A single grand piano key illuminated by a razor-thin needle beam of pure white spotlight against deep obsidian darkness. 75% pure negative black space allowing large typographic title placement with maximum contrast. High-end concert hall atmosphere, tactile texture on polished ebony wood, zero clutter, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Warm conservatory piano scene in late afternoon. Side view of hands gracefully playing an upright piano near a tall arched window looking out at gentle rain. Warm tungsten chandelier light illuminating the keys while the right portion of the frame features a soft dark curtain creating an uncluttered text area. Sophisticated, emotionally restorative, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-03': {
    id: 'cat-03',
    name: '03 — STUDY, FOCUS & WORK MUSIC',
    ctrPsychology: 'Time-value proposition: busy US students and remote workers demand immediate quantification of productivity return (e.g. 3 HOURS, DEEP FOCUS).',
    visualHook: 'Large bold duration numeral paired with an ultra-clean Scandinavian desk flat lay featuring natural wood, warm coffee, and zero clutter.',
    bestStyle: 'minimal',
    textOptions: {
      option1: 'Study Music — Deep Focus',
      option2: 'A Productive Sunday Morning ☕',
      option3: '3 HOURS Focus Music — No Distractions',
      bestOption: 'OPSI 3',
      bestReason: 'Angka durasi besar (3 HOURS) dikombinasikan dengan janji "No Distractions" menghasilkan CTR tertinggi di niche produktivitas.'
    },
    compositionGuide: {
      focalPoint: 'Cangkir keramik kopi atau laptop di sudut kiri bawah sebagai elemen jangkar',
      textZone: '60–70% bagian atas frame (permukaan kayu oak hangat yang bersih dan luas)',
      keyContrast: 'Teks gelap/putih tebal vs permukaan kayu warm white netral'
    },
    ctrPalette: {
      dominant: { name: 'Oak Warm White', hex: '#F9F6F0' },
      accent: { name: 'Sage Green & Teal', hex: '#4A6FA5' },
      textZone: { type: 'Terang Bersih', hex: '#F5F0E8' }
    },
    antiPatterns: [
      'Tidak menyertakan angka durasi (3 HOURS / 8 HOURS) — melewatkan USP paling dicari',
      'Warna neon atau saturasi berlebihan — bertolak belakang dengan ketenangan fokus',
      'Gambar 3D otak menyala yang generik — terlihat murah dan sering diabaikan audiens',
      'Meja kerja berantakan penuh kertas — memicu stres visual alih-alih fokus',
      'Font dekoratif atau kursif rumit yang tidak terbaca pada ukuran feed smartphone 320px'
    ],
    stylePrompts: {
      minimal: `Minimalist top-down flat lay of a clean Scandinavian study desk, light warm white oak wood surface as background, single ceramic mug with coffee on left side, open minimal notebook with black pen, small succulent plant in terracotta pot, all objects arranged in loose rule-of-thirds composition, soft diffused natural light from north-facing window creating subtle shadows, sage green and warm white color palette with oak wood accents, Muji catalog aesthetic meets Kinfolk magazine, 70% of frame is clean flat wood surface for large text overlay, objects clustered in lower-left corner, airy and focused mood, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Cozy home office corner scene, medium shot, open laptop with blurred screen on wooden desk near window, warm neutral tones throughout, ceramic mug steaming gently, monstera plant in terracotta pot softly out of focus on right, diffused overcast daylight, calm and productive atmosphere, left one-third has clean window background for text zone, sage and warm beige color palette, Scandinavian minimal aesthetic, professional lifestyle photography, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition for study music. Left half: razor-sharp close up on an analog brass hour-glass timer and ceramic espresso cup on dark walnut wood. Right half: pristine light oak desk surface bathed in soft window sunlight, providing a clean minimalist 50% zone for bold text overlay. Visual balance of focus urgency and calm workspace, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic wide interior of a quiet university library alcove at dusk. Warm desk lamp illuminating a solitary student workspace on the left with leather-bound notebook and headphones, while deep dark bookshelves recede into soft bokeh on the right. Warm amber key light against cool twilight shadows, intellectual prestige, clean text zone, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-04': {
    id: 'cat-04',
    name: '04 — CINEMATIC & FILM SCORE',
    ctrPsychology: 'Awe effect + colossal scale impression: vast landscape with lone human silhouette triggers an involuntary awe response, forcing the brain to halt scrolling.',
    visualHook: 'Massive landscape with Hollywood orange-and-teal grading, dramatic storm clouds pierced by golden god rays, and a tiny human silhouette for scale.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Epic Orchestral Music',
      option2: 'Feel Everything. Hear Everything.',
      option3: '2 Hours Epic Cinematic Music',
      bestOption: 'OPSI 2',
      bestReason: 'Pemicu emosional mendalam dan rasa takjub (awe) adalah alasan utama audiens mencari musik film score.'
    },
    compositionGuide: {
      focalPoint: 'Siluet manusia kecil di 1/3 bawah frame sebagai jangkar skala',
      textZone: '2/3 atas frame (langit dramatis berawan yang luas dan bersih)',
      keyContrast: 'Siluet hitam kecil vs langit megah oranye-teal berdaya pendar tinggi'
    },
    ctrPalette: {
      dominant: { name: 'Teal Sinematik', hex: '#2A7F7F' },
      accent: { name: 'Oranye Golden', hex: '#D4681A' },
      textZone: { type: 'Gelap Dramatis', hex: '#0A1A2A' }
    },
    antiPatterns: [
      'Lanskap yang terlalu datar, cerah dan damai — kategori ini membutuhkan DRAMA dan TENSION',
      'Wajah manusia yang terlihat jelas dari dekat — mengurangi skala epik dan universalitas',
      'Screenshot cuplikan film nyata — memicu pelanggaran hak cipta dan terlihat tidak profesional',
      'Pencahayaan tengah hari yang flat tanpa kontras — wajib golden hour atau blue hour dramatis',
      'Terlalu banyak objek berserakan yang menghancurkan impresi lanskap tak berujung'
    ],
    stylePrompts: {
      cinematic: `Ultra-wide cinematic landscape, lone human silhouette standing small against massive dramatic sky, towering cumulonimbus storm clouds with god rays breaking through in multiple shafts, American Southwest desert salt flats or Icelandic plateau, powerful Hollywood orange-teal color grading with deep teal shadows and warm golden highlights, atmospheric haze at horizon line, extreme depth of field with foreground texture (cracked earth or wet rock), 2.39:1 anamorphic aspect feel, Roger Deakins cinematography style (Blade Runner 2049, Sicario), silhouette positioned on lower-left third, massive sky occupying upper two-thirds as text zone, epic and emotionally overwhelming scale, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition cinematic poster. Left third: towering vertical rocky canyon cliff in deep blue shadows with dramatic rim light. Right two-thirds: fiery golden sunset breaking through parting clouds over distant mountain peaks, providing a high-contrast open sky zone for epic movie-title typography. Hollywood color grade, anamorphic bokeh, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist cinematic fine-art thumbnail. A solitary silhouetted mountain peak crowned with a brilliant golden god ray against an expanse of deep indigo-teal storm clouds. 70% clean gradient sky for large typographic title. Monumental atmosphere, Hans Zimmer film score mood, zero clutter, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Atmospheric cinematic explorer scene. Solitary traveler in dark hooded coat looking out over mist-filled alpine valley at sunrise. Warm golden rim-light outlining the figure on the right, while deep blue mountain fog fills the left two-thirds as a clean zone for text. Emotional awe, epic scale, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-05': {
    id: 'cat-05',
    name: '05 — BIOLA & STRING ENSEMBLE',
    ctrPsychology: 'Texture fascination + prestige signal: macro detail of horsehair bow on silver strings with rosin dust catches immediate visual fascination in busy feeds.',
    visualHook: 'Extreme close-up macro of a Stradivarius violin bow catching candlelight with visible wooden grain, glistening strings, and floating rosin particles.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Beautiful Violin Music',
      option2: 'Music That Moves the Soul 🎻',
      option3: '2 Hours Relaxing Violin & Strings',
      bestOption: 'OPSI 2',
      bestReason: 'Label yang mengusung resonansi emosional mendalam sangat cocok dengan estetika intim senar biola.'
    },
    compositionGuide: {
      focalPoint: 'Senar biola dan busur bersentuhan di pusat-kiri frame',
      textZone: '1/3 kanan frame — gelap pekat tanpa detail mengganggu',
      keyContrast: 'Cahaya emas hangat pada kayu mahoni vs latar belakang hitam pekat'
    },
    ctrPalette: {
      dominant: { name: 'Mahoni Gelap', hex: '#3A1A08' },
      accent: { name: 'Amber Warm & Bordeaux', hex: '#C5A028' },
      textZone: { type: 'Hitam Noir', hex: '#0A0808' }
    },
    antiPatterns: [
      'Foto biola tergeletak datar seperti produk katalog toko alat musik',
      'Ilustrasi kartun instrumen — kehilangan daya tarik tekstur kayu dan senar',
      'Banyak instrumen bertumpuk dalam satu frame — focal point terpecah dan gagal di mobile',
      'Pencahayaan terang merata — chiaroscuro wajib untuk membangun emosi mendalam',
      'Wajah pemain mendominasi frame — instrumen dan busur adalah pusat perhatian'
    ],
    stylePrompts: {
      cinematic: `Extreme close-up macro photography of violin bow moving across strings, shallow depth of field with strings in sharp focus in center and bow slightly motion-blurred, warm amber candlelight from right side creating Caravaggio-style chiaroscuro, rich red-amber varnish of Stradivarius-inspired violin body visible in lower frame, f-holes catching golden light, deep brown mahogany background in darkness, dust particles visible in light beam (rosin), intimate and emotionally intense atmosphere, musical craftmanship and elegance, violin occupying center-left of frame, dark right zone clean for text, Vermeer interior light quality meets modern concert photography, ultra-sharp texture on strings and bow hair, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition string thumbnail. Left half: macro close-up of violin scroll and polished ebony pegs gleaming in warm directional golden spotlight. Right half: deep velvety bordeaux-black shadow backdrop completely empty and optimized for large title typography. High contrast chiaroscuro, tactile wood texture, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist violin art thumbnail. A single silver cello string vibrating with visible golden resonant rings under a focused theatrical spotlight against infinite obsidian black. 75% dark negative space for high-contrast white text overlay. Sophisticated classical minimalism, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Intimate rehearsal room scene at dusk. Violin resting open in vintage velvet-lined case on rustic wooden table, bathed in warm amber lamp glow from the left. Soft shadow fills the right side of the frame creating a clean zone for title text. Authentic craftsmanship, warm acoustic atmosphere, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-06': {
    id: 'cat-06',
    name: '06 — BOSSA & LATIN INSTRUMENTAL',
    ctrPsychology: 'Aspirational transport: transport viewers instantly to a sunny seaside terrace in Lisbon or Rio de Janeiro, triggering instant vacation relaxation.',
    visualHook: 'Sun-drenched outdoor terrace with terracotta tiles, classical acoustic guitar, espresso cup, blooming bougainvillea, and warm golden hour light.',
    bestStyle: 'lifestyle',
    textOptions: {
      option1: 'Bossa Nova Café ☕',
      option2: 'Sunday Afternoon in Brazil',
      option3: 'Relaxing Bossa Nova — 2 Hours',
      bestOption: 'OPSI 2',
      bestReason: 'Destinasi atmosferik ("Sunday Afternoon in Brazil") memberikan janji relaksasi liburan yang jauh lebih menggoda dibanding sekadar teks genre.'
    },
    compositionGuide: {
      focalPoint: 'Gitar klasik atau meja kafe di 1/3 kiri frame',
      textZone: 'Dinding stucco putih atau langit cerah di 1/3 kanan frame',
      keyContrast: 'Warna hangat terra cotta & bunga magenta vs dinding stucco putih bersih'
    },
    ctrPalette: {
      dominant: { name: 'Terra Cotta', hex: '#C15A2B' },
      accent: { name: 'Kuning Sore & Hijau Tropis', hex: '#F5C518' },
      textZone: { type: 'Putih Cerah', hex: '#F5F0E5' }
    },
    antiPatterns: [
      'Warna dingin (biru mendung, abu-abu pucat) — bertentangan dengan kehangatan tropis',
      'Foto kafe dalam ruangan yang tertutup dan pengap — bossa nova butuh angin luar dan sinar matahari',
      'Terlalu banyak cangkir dan piring berserakan di meja — terlihat kotor dan tidak estetik',
      'Gambar tanpa sentuhan instrumen musik akustik — audiens kehilangan sinyal bahwa ini adalah video musik',
      'Pencahayaan flat mendung tanpa bayangan daun palem (dappled light adalah ciri khas)'
    ],
    stylePrompts: {
      lifestyle: `Warm outdoor café scene in golden afternoon light, weathered terracotta tiled floor, wrought iron café table with two espresso cups and condensing water glass, classical guitar leaning against wicker chair partially visible, bougainvillea vines cascading over white stucco wall with vivid magenta flowers, dappled shadow patterns from invisible overhead umbrella or vine canopy, warm terra cotta, coral, and dusty yellow color palette, Portuguese azulejo tile details on partial wall, lazy and sensual vacation atmosphere, Brazil or Portugal coastal café mood, scene fills left-center of frame, bright stucco wall on right as clean text zone, golden 4pm light direction, no people in frame, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic coastal sunset scene in Rio de Janeiro or Lisbon. A blonde cedar classical guitar resting on a sunlit balcony balustrade overlooking glittering ocean waves in golden hour. Warm amber sunlight creating long shadows, lush green palm leaves framing the upper edge, with bright open sky on the right side serving as text zone. Sensual vacation mood, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition bossa nova aesthetic. Left half: close-up of nylon strings and rosette mosaic of a Spanish guitar in brilliant warm sunlight. Right half: clean white-washed Mediterranean stucco wall with soft leaf shadows providing an immaculate high-contrast zone for dark typography. Sun-soaked Latin warmth, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist tropical bossa thumbnail. A solitary cup of Brazilian coffee on a vibrant terracotta saucer beside a single yellow hibiscus flower on sunlit table. 70% clean sunlit stucco background for title text overlay. Fresh, warm, breezy vacation aesthetic, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-07': {
    id: 'cat-07',
    name: '07 — COVER INSTRUMENTAL (Pop/Rock Hits)',
    ctrPsychology: 'Familiarity bias + curiosity gap: recognizing the massive song title instantly combined with curiosity about how it sounds acoustically is the sole driver of clicks.',
    visualHook: 'GIANT READABLE SONG TITLE dominating a high-contrast dark concert stage with a spotlighted acoustic guitar or piano keyboard.',
    bestStyle: 'minimal',
    textOptions: {
      option1: '[SONG TITLE] — Instrumental',
      option2: '[SONG TITLE] Without Words 🎹',
      option3: '[SONG TITLE] Instrumental Version — 1 Hour',
      bestOption: 'OPSI 1',
      bestReason: 'Nama lagu yang terpampang besar dan jelas adalah 90% alasan audiens mengklik video cover instrumental.'
    },
    compositionGuide: {
      focalPoint: 'Instrumen (piano atau gitar) di 1/4 sudut bawah frame',
      textZone: '60–75% area frame berupa gradien gelap bersih khusus untuk NAMA LAGU BESAR',
      keyContrast: 'Instrumen spotlight terang benderang vs latar panggung hitam pekat'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Pekat', hex: '#0A0A0A' },
      accent: { name: 'Warm Spotlight Gold', hex: '#F5D078' },
      textZone: { type: 'Gelap Gradient', hex: '#050510' }
    },
    antiPatterns: [
      'Tidak mencantumkan nama lagu dengan font besar — kesalahan fatal #1 di niche cover',
      'Nama lagu terlalu kecil atau tertutup elemen visual lain',
      'Mencoba meniru artwork album artis asli secara mentah — memicu copyright strike',
      'Latar belakang yang terlalu ramai warna-warni sehingga teks judul tidak terbaca di mobile 320px',
      'Menggunakan font tulisan tangan tipis — wajib menggunakan bold sans-serif yang kokoh'
    ],
    stylePrompts: {
      minimal: `Dark moody background for text-heavy thumbnail, single acoustic guitar or piano keys illuminated by single dramatic spotlight in lower-left corner of frame, rest of frame is deep dark gradient — black fading to deep navy — creating maximum contrast for white text overlay, subtle bokeh light particles in background suggesting concert venue, high-contrast professional concert photography aesthetic, clean and modern album-art feeling, 75% of frame is clean dark gradient zone for large song title text, instrument sharp and detailed in remaining 25%, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split-frame composition: left half shows dramatic close-up of piano keys under single spotlight with Caravaggio-style lighting, right half is deep solid dark gradient (near black to deep charcoal) completely clean for title text overlay, hard visual split between illuminated left and dark right, sophisticated and modern aesthetic, concert photography quality, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Concert hall stage at night. Empty center stage with solitary vintage acoustic guitar on chrome stand illuminated by a single warm golden beam from above. Dark atmospheric haze fills the arena in deep charcoal navy tones, providing massive high-contrast negative space for headline song title. Elegant, magnetic, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Modern acoustic music studio corner at twilight. Upright piano with glowing key spotlight on left side, soft dark acoustic foam wall on right side providing clear dark canvas for title text. Warm intimacy, professional recording aesthetic, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-08': {
    id: 'cat-08',
    name: '08 — DRUM, PERCUSSION & BEAT',
    ctrPsychology: 'Power signal + motion anticipation: dramatic motion blur on drumsticks triggers the auditory cortex to "hear" the impact before clicking.',
    visualHook: 'Low-angle dynamic action shot of a drummer mid-strike, sticks frozen at peak impact, splashing water droplets on cymbals under harsh red/orange stage lighting.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Drum Music — Powerful Beats',
      option2: 'Feel the Power ⚡🥁',
      option3: '1 Hour Drum Music — Energy & Focus',
      bestOption: 'OPSI 2',
      bestReason: 'Energi kuat dan pelepasan dopamin adalah janji emosional utama bagi penikmat ketukan drum perkusi.'
    },
    compositionGuide: {
      focalPoint: 'Stik drum dan cymbal percikan air di pusat-atas frame',
      textZone: 'Area bayangan gelap industri di sisi kiri atau kanan frame',
      keyContrast: 'Kilau hardware chrome & spotlight merah panggung vs bayangan hitam pekat'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Industrial', hex: '#0A0A0A' },
      accent: { name: 'Merah Stage & Chrome', hex: '#B5451B' },
      textZone: { type: 'Bayangan Gelap', hex: '#0F0808' }
    },
    antiPatterns: [
      'Foto statis drum kit kosong tanpa manusia atau aksi — terasa dingin tanpa energi',
      'Pencahayaan terang merata tanpa bayangan panggung — membunuh intensitas drama',
      'Sudut pandang bird-eye dari atas — mengecilkan kesan kekuatan dan skala',
      'Palet warna pastel atau lembut — bertolak belakang dengan karakter raw industrial',
      'Teks overlay diletakkan menutupi titik impak drum/cymbal yang merupakan focal point'
    ],
    stylePrompts: {
      cinematic: `Low-angle dramatic action shot of professional drummer mid-performance, drumsticks caught in motion blur at peak of powerful strike, cymbals splashing water droplets in sharp freeze-frame moment, harsh single overhead spot lighting casting deep shadows on face and kit, stage smoke machine haze in lower frame, deep red and orange stage gel lighting with black shadows, chrome hardware catching specular highlights, industrial and raw energy, intense and powerful emotion on drummer's partially-lit face, kit in foreground sharp focus, drummer face in upper third, deep shadow areas on both sides as text zones, concert photography aesthetic Anton Corbijn style, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition drum thumbnail. Left half: macro close-up of drumstick striking snare drum with flying wood chips and splashing water in frozen motion under harsh amber strobe. Right half: deep pitch-black stage smoke backdrop clean and unobstructed for bold typographic headline. Raw kinetic tension, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist percussion thumbnail. A single gleaming bronze cymbal edge angled diagonally catching a blazing rim light against deep carbon black background. 70% negative space on upper half for heavy impact font. High octane simplicity, zero clutter, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Atmospheric drum studio session. Drummer seen from behind in silhouette looking at illuminated drum set under moody warehouse skylight at dusk. Red neon tube glow on left wall, dark empty space on right for text zone. Raw practice energy, authentic musician grind, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-09': {
    id: 'cat-09',
    name: '09 — ELECTRONIC AMBIENT & SYNTH',
    ctrPsychology: '80s nostalgia + genre visual shorthand: the neon perspective grid and horizontal sunset trigger instant zero-cognitive-load recognition for US synthwave listeners.',
    visualHook: 'Infinite synthwave perspective grid in neon violet and cyan disappearing into a retro striped horizon sun against pure obsidian starfield.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Synthwave Drive 🌆',
      option2: 'Cruising at Midnight',
      option3: '2 Hours Synthwave — Focus & Energy',
      bestOption: 'OPSI 2',
      bestReason: 'Janji pengalaman berkendara malam hari ("Cruising at Midnight") adalah pemicu klik paling mendalam bagi penikmat synthwave.'
    },
    compositionGuide: {
      focalPoint: 'Matahari retro bergaris di titik temu horizon tengah frame',
      textZone: 'Langit gelap berbintang di 1/3 bagian atas frame',
      keyContrast: 'Neon ungu/cyan/pink menyala vs hitam luar angkasa total (rasio kontras tertinggi)'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Luar Angkasa', hex: '#050510' },
      accent: { name: 'Neon Violet & Cyan', hex: '#7B2FBE' },
      textZone: { type: 'Langit Gelap Bintang', hex: '#070315' }
    },
    antiPatterns: [
      'Terlalu banyak warna pelangi sehingga tidak ada focal point matahari retro yang dominan',
      'Desain yang meniru langsung karakter game/film tertentu — risiko hak cipta',
      'Warna pastel atau pudar — genre synthwave wajib menggunakan neon berintensitas tinggi',
      'Latar belakang putih atau terang — bertolak belakang dengan atmosfer nocturnal retrowave',
      'Elemen fotorealistik modern yang merusak estetika retrofuturistik 1980-an'
    ],
    stylePrompts: {
      cinematic: `Synthwave retrofuturist landscape, infinite perspective grid lines in neon purple and cyan extending to dark horizon, retro sun with horizontal stripe gradient (orange to pink) setting between distant mountain silhouettes, deep dark purple-black starfield sky above, city skyline silhouette barely visible at horizon, neon pink and violet light reflecting off foreground grid, lone car silhouette driving toward horizon on gridded road (optional), vivid neon color blocking against near-black background, 1980s retrowave aesthetic meets digital art, color palette of electric violet, hot pink, and cyan on obsidian black, clean and iconic composition, grid occupies lower two-thirds, retro sun and sky on upper third as implied text zone, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition cyberpunk synth aesthetic. Left half: close-up of analog modular synthesizer illuminated by pulsating purple LED meters and chrome knobs. Right half: infinite neon cyan wireframe grid stretching into cosmic darkness with clean sky for bold headline typography. High-voltage contrast, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist retrowave thumbnail. A single glowing wireframe wire sphere and neon magenta horizontal horizon line against deep void black. 70% dark space above horizon line for glowing typographic title. Clean, iconic, futuristic nostalgia, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Late night drive synthwave lifestyle. View from inside sports car looking through windshield at neon city skyline in rainy dusk. Dashboard glowing in soft cyan and amber, windshield raindrops catching street neon, clean dark sky upper area for title text. Immersive nocturnal escapism, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-10': {
    id: 'cat-10',
    name: '10 — GAME, RETRO & CHIPTUNE',
    ctrPsychology: 'Nostalgia trigger + instant recognition: 16-bit pixel art style communicates the gaming soundtrack genre in under 0.1 seconds without words.',
    visualHook: 'Detailed 16-bit SNES-style pixel art scene of a hero silhouette standing before a glowing castle entrance with warm torchlight.',
    bestStyle: 'lifestyle',
    textOptions: {
      option1: 'Retro Game Music 🕹️',
      option2: 'Back to the 8-bit Era',
      option3: '2 Hours Retro Gaming Music',
      bestOption: 'OPSI 1',
      bestReason: 'Ketepatan genre ("Retro Game Music 🕹️") dengan font pixel langsung menarik perhatian gamer tanpa kebingungan.'
    },
    compositionGuide: {
      focalPoint: 'Siluet karakter pahlawan atau gerbang bercahaya di 1/3 kiri hingga tengah frame',
      textZone: 'Area dinding batu gelap atau langit malam pixel di kanan atas frame',
      keyContrast: 'Cahaya hangat obor/gerbang vs bayangan gelap kastil pixel'
    },
    ctrPalette: {
      dominant: { name: 'Biru Malam Retro', hex: '#0F2027' },
      accent: { name: 'Hijau Terminal & Oranye Pixel', hex: '#4ADE80' },
      textZone: { type: 'Langit Malam Pixel', hex: '#0A1520' }
    },
    antiPatterns: [
      'Pixel art yang terlalu kecil dan rumit sehingga terlihat seperti noise buram di layar ponsel 320px',
      'Mencampuradukkan foto nyata dengan pixel art dalam satu thumbnail',
      'Menggunakan karakter terkenal berhak cipta (Mario, Link, Sonic, Pokemon) — risiko pemblokiran akun',
      'Warna pudar atau desaturasi — pixel art wajib berwarna solid dan berenergi',
      'Menggunakan font latin modern untuk teks overlay — wajib font pixel/bitmap'
    ],
    stylePrompts: {
      lifestyle: `Pixel art scene in 16-bit SNES-era style, hero character silhouette standing at entrance of glowing dungeon doorway or castle gate, warm interior light pouring from doorway creating strong contrast with dark exterior, detailed pixel art environment — stone walls, torch flames flickering, moss details, background mountains in layered parallax, rich saturated color palette: deep blue sky, warm orange torchlight, green grass foreground, clean readable pixel style not too small for thumbnail size, adventure and nostalgia mood, character on left third, glowing doorway in center, dark stone wall on right as text zone, no text in pixel art itself, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic 16-bit pixel art wide landscape. A solitary 8-bit adventurer sitting by a crackling campfire on a cliff overlooking a sprawling fantasy pixel kingdom bathed in moonlight and starry skies. Warm orange fire glow on left, vast dark navy sky on right for text placement. Nostalgic RPG wonder, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition retro gaming style. Left half: close-up pixel art illustration of a glowing handheld console with 8-bit chiptune waves radiating outward. Right half: clean dark pixel-grid dungeon wall in midnight blue for high-contrast bitmap font overlay. Nostalgic arcade energy, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist 8-bit gaming title screen aesthetic. A solitary glowing golden quest chest on a dark stone pedestal under a single pixelated beam of light. 70% clean midnight-black background for retro typography. Pure nostalgic gaming charm, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-11': {
    id: 'cat-11',
    name: '11 — GITAR & AKUSTIK INSTRUMENTAL',
    ctrPsychology: 'Craftsmanship proof + nature escapism: close-up fingerpicking fingers on steel strings with golden hour nature bokeh conveys authentic human talent and peaceful countryside relief.',
    visualHook: 'Close-up weathered hands fingerpicking acoustic guitar strings bathed in golden hour sunlight with soft forest bokeh in background.',
    bestStyle: 'lifestyle',
    textOptions: {
      option1: 'Fingerstyle Guitar Music 🎸',
      option2: 'An Afternoon in the Mountains',
      option3: '2 Hours Acoustic Guitar — Relax & Focus',
      bestOption: 'OPSI 2',
      bestReason: 'Kombinasi gitar akustik dengan imajinasi pelarian ke alam bebas ("An Afternoon in the Mountains") memiliki daya pikat emosional tertinggi.'
    },
    compositionGuide: {
      focalPoint: 'Titik temu jari tangan dengan senar gitar akustik di pusat-kiri frame',
      textZone: '1/3 kanan frame — bokeh pepohonan hijau yang blur dan lembut',
      keyContrast: 'Ketajaman senar baja & tekstur kayu vs latar belakang alam yang blur lembut'
    },
    ctrPalette: {
      dominant: { name: 'Spruce Oak', hex: '#7B5E3A' },
      accent: { name: 'Golden Hour Orange', hex: '#C68E3E' },
      textZone: { type: 'Bokeh Alam Lembut', hex: '#3D5A3A' }
    },
    antiPatterns: [
      'Gitar berdiri di stand tanpa manusia — terasa dingin tanpa sentuhan emosi atau keahlian nyata',
      'Foto studio steril berlatar belakang putih polos — akustik wajib memiliki nuansa alam atau kehangatan kayu',
      'Full-body shot pemain dari jauh tanpa terlihat detail jari dan senar',
      'Warna dingin mendung atau pucat — gitar akustik wajib memancarkan kehangatan sinar matahari',
      'Menggunakan gitar elektrik (salah genre — audiens mencari petikan akustik nilon/baja)'
    ],
    stylePrompts: {
      lifestyle: `Close-up of weathered hands fingerpicking acoustic guitar strings, steel strings and fretboard in sharp focus with visible calluses on fingertips, warm golden hour sunlight from left side casting warm amber glow across guitar body, beautiful spruce guitar top grain visible, bokeh forest or rural landscape blurred softly in background (green trees, open sky), shallow depth of field with razor-sharp focus on string contact point, warm wooden tones — spruce, mahogany, amber sunlight, natural and authentic folk music atmosphere, hands occupying center-left two-thirds of frame, right one-third is softly blurred nature background as text zone, no text, no watermark, outdoor natural light photography, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic wide shot of acoustic guitar player sitting on rustic wooden porch bench at sunset in Blue Ridge mountains. Golden sun flaring behind the pine trees, creating intense rim light on the guitar silhouette on the left side, while the misty twilight valley on the right provides an expansive clean text zone. Soulful Americana warmth, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition fingerstyle guitar. Left half: macro close-up of acoustic guitar rosette and vibrating bronze strings under rich 4pm sunlight. Right half: clean blurred warm pine wood background in golden shadow, dedicated for crisp title text overlay. Tactile acoustic warmth, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist acoustic guitar fine-art thumbnail. A single acoustic guitar headstock with brass tuning pegs angled diagonally in warm raking sidelight against a dark earthen clay wall. 70% negative space on right for bold clean typography. Organic rustic elegance, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-12': {
    id: 'cat-12',
    name: '12 — JAZZ INSTRUMENTAL',
    ctrPsychology: 'Sophisticated nocturnal lifestyle appeal: the smoky dim jazz club and single golden spotlight on brass saxophone trigger an exclusive, timeless late-night mood.',
    visualHook: 'Alto saxophone illuminated under a harsh single overhead spotlight cone in a smoky near-black jazz club with subtle brick texture.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Smooth Jazz Instrumental',
      option2: 'Late Night Jazz 🌙',
      option3: '2 Hours Relaxing Jazz — Work & Study',
      bestOption: 'OPSI 2',
      bestReason: '"Late Night Jazz 🌙" langsung mengunci waktu konsumsi audiens jazz Amerika (malam hari saat relaksasi atau membaca).'
    },
    compositionGuide: {
      focalPoint: 'Corong saksofon kuningan emas dan berkas cahaya di pusat-kiri frame',
      textZone: '1/3 kanan frame — hitam pekat kegelapan klub jazz',
      keyContrast: 'Spotlight emas kuningan yang sangat terang vs kegelapan noir hitam pekat'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Noir', hex: '#0A0A0F' },
      accent: { name: 'Amber Whisky & Gold', hex: '#C78B3B' },
      textZone: { type: 'Noir Black', hex: '#050508' }
    },
    antiPatterns: [
      'Foto festival jazz luar ruangan siang hari yang terang — merusak keintiman nocturnal',
      'Warna-warni pop terang yang kekanak-kanakan — jazz membutuhkan palet amber, emas, dan noir',
      'Menampilkan terlalu banyak instrumen sekaligus sehingga perhatian terpecah',
      'Menggunakan font modern sans-serif generic — gunakan estetika tipografi vintage Blue Note Records',
      'Latar belakang rumah biasa yang kasual — atmosfer klub jazz intim wajib ada'
    ],
    stylePrompts: {
      cinematic: `Moody jazz club interior, alto saxophone illuminated by single harsh overhead spotlight creating cone of warm amber light, rest of frame in near-black darkness, saxophone bell catching the light with beautiful specular highlight, musician's hands partially visible in shadow holding the instrument, distant barely-visible neon sign (green or red) through smoky club atmosphere, faint jazz club interior details at edge of darkness (bar stools, brick wall), extremely high contrast black and amber composition, Blue Note Records album cover aesthetic (Reid Miles design sensibility), Herman Leonard concert photography mood, sophisticated and timeless nocturnal elegance, saxophone occupying center-left third, complete darkness on right as text zone, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition jazz club aesthetic. Left half: macro close-up of saxophone keys and mother-of-pearl inlays bathed in warm gold spotlight. Right half: pitch-black smoky club atmosphere completely clean for high-contrast gold or white serif typography. Blue Note Records styling, timeless sophistication, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist jazz typography thumbnail. A solitary golden brass trumpet silhouette emerging from deep shadow with single rim light highlight. 75% dark noir space for large elegant typography. Classy late-night atmosphere, Reid Miles design inspiration, zero clutter, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Intimate corner of a rainy Greenwich Village jazz lounge at 1 AM. Upright bass and saxophone resting in booth corner illuminated by small green banker lamp and candle on tabletop. Deep shadows throughout, rain streaks on window on right providing clear text zone. Smoky nocturnal romance, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-13': {
    id: 'cat-13',
    name: '13 — KLASIK & ORKESTRA',
    ctrPsychology: 'Prestige association + composer brand recognition: prominent composer names (Beethoven, Mozart, Chopin) carry instant global trust and high cultural authority.',
    visualHook: 'Dramatic backstage perspective of a conductor silhouette raising the baton toward a gilded, chandelier-lit grand symphony hall.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'BEETHOVEN — Symphony No. 9',
      option2: 'Music Written for Eternity',
      option3: '3 Hours Classical Music — Study & Focus',
      bestOption: 'OPSI 1',
      bestReason: 'Nama komposer legendaris yang ditulis besar adalah pemicu klik paling dominan di niche musik orkestra klasik.'
    },
    compositionGuide: {
      focalPoint: 'Siluet konduktor dengan baton terangkat di 1/3 kiri frame',
      textZone: 'Area balkon atas gelap atau 1/3 kanan frame',
      keyContrast: 'Siluet hitam pekat konduktor vs kemewahan panggung emas dan lampu kristal'
    },
    ctrPalette: {
      dominant: { name: 'Hitam Formal', hex: '#0A0A0A' },
      accent: { name: 'Imperial Gold & Burgundy', hex: '#CFB53B' },
      textZone: { type: 'Gelap Pekat', hex: '#050505' }
    },
    antiPatterns: [
      'Ilustrasi kartun komposer — merusak citra kemewahan dan reputasi musik klasik',
      'Foto stock orkestra yang tampak murahan dan tidak memiliki rasa megah',
      'Warna neon futuristik — merusak atmosfer abadi dan bersejarah',
      'Terlalu banyak wajah musisi yang terlihat detail — siluet konduktor lebih megah',
      'Font kasual tanpa wibawa — wajib menggunakan font serif klasik berkelas dengan sentuhan emas'
    ],
    stylePrompts: {
      cinematic: `Dramatic concert hall scene from backstage perspective, conductor silhouette from behind gesturing with baton in mid-movement, full orchestra visible beyond in warm stage lighting, massive ornate concert hall visible — gilded baroque ceiling, crystal chandeliers, red velvet balconies, warm golden 2800K stage lighting illuminating orchestra, conductor silhouette in complete black against golden scene, audience in darkness beyond the orchestra, sense of monumental scale and prestige, Vienna Philharmonic concert hall quality, conductor silhouette on left third with baton raised, orchestra and golden hall on center and right, dark upper balcony area on top edge as text zone, professional concert photography, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Aged historical oil painting portrait style close-up of classical composer (not resembling any specific real person), dramatic Rembrandt lighting from upper left on serious contemplative face, dark rich background, ornate period costume collar details, warm umber and gold tones, timeless and prestigious aesthetic, face positioned on left one-third, dark background on right two-thirds providing maximum space for composer name in large serif gold text, no text in image itself, no watermark, painted portrait aesthetic not photography, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition symphony hall poster. Left half: dramatic low-angle shot of a gilded baroque concert hall chandelier and violinist bow in mid-motion. Right half: solid deep charcoal-black formal canvas dedicated for composer name in gold leaf lettering. Monumental classical grandeur, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Atmospheric library music room in Vienna. Grand piano with open sheet music under warm brass reading lamp, antique cello leaning against dark wood bookcase. Soft shadows filling upper two-thirds as clean text zone. Scholarly refinement, timeless classical tradition, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-14': {
    id: 'cat-14',
    name: '14 — NEW AGE & MEDITASI',
    ctrPsychology: 'Wellness credibility signal + frequency curiosity: specific scientific or sacred frequencies (e.g. 528 Hz, 432 Hz) spark intense curiosity and perceived therapeutic value.',
    visualHook: 'Breathtaking pre-dawn blue hour mountain lake with perfectly mirror-like water reflection, floating lotus flower, and clean gradient sky.',
    bestStyle: 'minimal',
    textOptions: {
      option1: 'Meditation Music 🧘',
      option2: 'Stillness Within',
      option3: '528 Hz — Healing Frequency Music',
      bestOption: 'OPSI 3',
      bestReason: 'Klaim frekuensi spesifik (528 Hz) terbukti menghasilkan CTR tertinggi di niche meditasi dan mindfulness di Amerika Serikat.'
    },
    compositionGuide: {
      focalPoint: 'Pantulan gunung salju dan teratai di danau tenang di 1/3 bawah frame',
      textZone: '2/3 atas frame — langit biru lavender fajar yang bersih dan bergradasi lembut',
      keyContrast: 'Kemilau putih puncak salju vs keheningan biru langit blue hour'
    },
    ctrPalette: {
      dominant: { name: 'Blue Celestial', hex: '#C8D8E8' },
      accent: { name: 'Lavender & Sage', hex: '#C8A8D8' },
      textZone: { type: 'Langit Soft', hex: '#8BA8C8' }
    },
    antiPatterns: [
      'Pose meditasi klise model di pantai — audiens sudah kebal dan sering mengabaikannya',
      'Terlalu banyak klaim teks medis berlebihan di thumbnail — terlihat seperti spam',
      'Warna menyala atau berenergi tinggi (merah, oranye terang) — bertolak belakang dengan ketenangan batin',
      'Wajah manusia yang terlalu dominan menutupi lanskap alam yang damai',
      'Geometri sakral yang terlalu rumit dan pecah di resolusi layar kecil smartphone'
    ],
    stylePrompts: {
      minimal: `Serene mountain lake at pre-dawn blue hour, perfectly still water reflecting mirror image of snow-capped peaks and lavender-blue sky, thin wisps of morning mist at water's edge, single lotus flower in foreground gently floating, extremely peaceful and spiritually calm atmosphere, Kawase Hasui Japanese woodblock print color palette meets hyperrealistic photography, color palette of soft lavender, celestial blue, sage green, warm horizon gold at very bottom, 65% of frame is clean calm sky gradient for large text overlay, landscape in lower 35%, ultra-calm meditative mood, no text in image, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic misty pine forest at sunrise. Ethereal golden sunbeams cutting through morning fog above a tranquil still forest pond. A single glowing Tibetan singing bowl resting on a mossy rock in lower left corner, while soft turquoise-gold mist fills the upper two-thirds as an open text area. Profound spiritual calm, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition meditative sanctuary. Left half: close-up macro of water ripple from a single falling drop in crystal clear mountain spring. Right half: soft lavender sky gradient completely empty and serene for healing frequency title text. Deep restorative peace, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Cozy mindful home sanctuary at dusk. Warm ceramic candle lantern and incense smoke gently curling upward in front of a bamboo screen. Soft shadows and uncluttered negative space on right for meditative title overlay. Sacred tranquility, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-15': {
    id: 'cat-15',
    name: '15 — SERULING & WOODWIND',
    ctrPsychology: 'Nature sanctuary + cultural authenticity: wooden flute in deep bamboo grove with golden sunbeams promises pure breath of fresh air away from urban chaos.',
    visualHook: 'Close-up of player hands on a dark wooden shakuhachi or Native American flute with magical golden god rays piercing through misty bamboo forest.',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Japanese Flute Music 🎵',
      option2: 'Breathe. Just Breathe. 🌿',
      option3: '2 Hours Relaxing Flute Music',
      bestOption: 'OPSI 2',
      bestReason: 'Kata "Breathe" memiliki resonansi ganda (literal alat tiup dan metaforis relaksasi) yang sangat kuat bagi audiens yang sedang stres.'
    },
    compositionGuide: {
      focalPoint: 'Tangan dan lubang seruling kayu di pusat-kiri frame',
      textZone: '1/3 kanan frame — berkas god rays yang lembut dan teduh',
      keyContrast: 'Kayu gelap seruling vs berkas cahaya emas yang menembus kanopi hijau'
    },
    ctrPalette: {
      dominant: { name: 'Hijau Hutan', hex: '#1A4A1A' },
      accent: { name: 'Emerald & Gold Cahaya', hex: '#E8C97A' },
      textZone: { type: 'Sinar Lembut', hex: '#C8B87A' }
    },
    antiPatterns: [
      'Latar belakang studio buatan yang kaku — seruling bambu wajib berakar pada alam',
      'Foto yang terlalu gelap dan muram sehingga kehilangan kesegaran alami hutan',
      'Instrumen logam modern alih-alih seruling kayu tradisional — merusak keaslian budaya',
      'Tidak menyertakan unsur tanaman, bambu, atau kabut hutan sama sekali',
      'Komposisi yang kaku tanpa nuansa napas dan aliran organik'
    ],
    stylePrompts: {
      cinematic: `Close-up of wooden flute held by player's hands with detailed finger placement, Japanese shakuhachi or Native American style, sharp focus on finger holes and natural wood grain texture, player's breath condensation visible in cold morning air, magical forest setting in background — bamboo grove or old-growth forest with golden god rays breaking through canopy creating multiple shafts of light, morning mist at ground level, rich emerald green forest tones with warm gold light shafts, spiritual and breathable atmosphere, hands and flute in center-left frame, god rays and forest background on right side as softly lit text zone, National Geographic nature photography quality, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Warm outdoor nature scene in Kyoto bamboo grove. Musician in simple linen attire holding wooden flute near moss-covered stone lantern in morning dew. Gentle golden sunlight filtering through bamboo leaves, right half of frame featuring soft green mist as a clean text area. Breathable, serene, authentic, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition woodwind aesthetic. Left half: macro close-up of dark carved bamboo flute mouthpiece and finger holes with visible natural wood grain. Right half: soft misty emerald forest backdrop clean and uncluttered for headline text. Deep natural connection, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist Zen woodwind thumbnail. A solitary dark shakuhachi flute resting on a weathered grey river stone in front of a calm misty water surface. 70% soft grey-green fog negative space for Japanese calligraphy-inspired title typography. Wabi-sabi tranquility, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-16': {
    id: 'cat-16',
    name: '16 — SLEEP & RELAXATION',
    ctrPsychology: 'Duration guarantee + nocturnal eye comfort: dark thumbnails are scientifically preferred by sleepy viewers browsing in bed to avoid painful eye strain, with 8+ HOURS duration as the absolute USP.',
    visualHook: 'Giant duration text (8 HOURS / 10 HOURS) over an ultra-dark midnight ocean reflecting silver moonlight under calm starry skies.',
    bestStyle: 'minimal',
    textOptions: {
      option1: 'Sleep Music 🌙',
      option2: 'Let the Night Take You',
      option3: '8 HOURS Sleep Music — Fall Asleep Fast',
      bestOption: 'OPSI 3',
      bestReason: 'Angka durasi besar ("8 HOURS") dipadukan dengan janji tidur cepat ("Fall Asleep Fast") adalah formula CTR #1 terbukti pada niche sleep.'
    },
    compositionGuide: {
      focalPoint: 'Bulan purnama perak dan pantulannya di 1/3 bawah frame',
      textZone: '60–70% bagian atas frame — langit midnight ultra-gelap dan bersih',
      keyContrast: 'Kilau perak lembut bulan vs kegelapan biru midnight yang menenangkan'
    },
    ctrPalette: {
      dominant: { name: 'Midnight Blue', hex: '#05001A' },
      accent: { name: 'Moonlight Silver', hex: '#C8CDD8' },
      textZone: { type: 'Gelap Malam', hex: '#030012' }
    },
    antiPatterns: [
      'Background putih, terang atau warna-warni — langsung ditolak oleh audiens yang ingin tidur di kamar gelap',
      'Tidak mencantumkan angka durasi besar (8 HOURS / 10 HOURS) — kehilangan alasan utama audiens mengklik',
      'Warna oranye atau merah menyala yang merangsang mata dan mencegah kantuk',
      'Visual yang terlalu detail dan ramai sehingga otak penonton terstimulasi untuk berpikir keras',
      'Font tajam atau tebal berteriak — gunakan font bersih, rounded atau light weight yang menenangkan'
    ],
    stylePrompts: {
      minimal: `Ultra-dark midnight landscape for sleep music thumbnail, quiet moonlit ocean with silver light path reflecting on perfectly calm water, full moon partially behind thin translucent cloud layer creating soft silver glow, deep navy blue and obsidian black sky with subtle milky way visible, one or two fireflies or stars reflecting in water, extremely peaceful and hypnotic composition, color palette of deep midnight blue, silver moonlight, obsidian black, extremely dark overall with only moonlight as light source, 70% of frame is clean dark sky gradient for large duration text, water reflection occupies lower 30%, Caspar David Friedrich romantic night painting aesthetic meets modern photography, no harsh lights, no warm colors, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic wide midnight sky over silhouette of quiet pine forest. Crescent silver moon glowing softly behind sheer midnight mist with faint star clusters, calm deep navy blue horizon. Lower third is dark forest silhouette, upper two-thirds is pristine ultra-dark night sky optimized for huge duration text. Hypnotic bedtime peace, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition nocturnal sleep scene. Left half: close-up of a vintage dark bedroom window with gentle rain beads reflecting a distant crescent moon. Right half: deep midnight velvet sky with soft silver stardust completely clean for 8 HOURS sleep typography. Calming insomnia relief, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Cozy dark bedroom sanctuary at night. Soft warm moonlight falling across an unmade linen bed near an open curtained window showing stars outside. Deep dark navy and charcoal tones throughout, large clean shadowy area for title text. Ultimate comforting sleep haven, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-17': {
    id: 'cat-17',
    name: '17 — UKULELE & MANDOLIN',
    ctrPsychology: 'Instant mood lift promise: high saturation, tropical sunshine, and vibrant colors trigger an instant dopamine hit, promising immediate happiness.',
    visualHook: 'Bright colorful ukulele (cherry red or cobalt blue) on pure white beach sand beside turquoise ocean waters and fresh tropical flower.',
    bestStyle: 'lifestyle',
    textOptions: {
      option1: 'Happy Ukulele Music 🌺',
      option2: 'Island Vibes Only ☀️',
      option3: '1 Hour Feel-Good Ukulele Music',
      bestOption: 'OPSI 2',
      bestReason: '"Island Vibes Only ☀️" menjanjikan pelarian suasana pulau tropis yang riang dan bebas beban, mengalahkan klaim fungsional biasa.'
    },
    compositionGuide: {
      focalPoint: 'Ukulele berwarna cerah di pusat-kiri frame',
      textZone: 'Laut turquoise dan langit biru cerah tanpa awan di 1/3 kanan frame',
      keyContrast: 'Warna cerah ukulele (merah/kuning/biru) vs laut pirus turquoise cerah'
    },
    ctrPalette: {
      dominant: { name: 'Sunshine Yellow & Turquoise', hex: '#40E0D0' },
      accent: { name: 'Cherry Red & Cobalt Blue', hex: '#DE3163' },
      textZone: { type: 'Sky Blue Cerah', hex: '#87CEEB' }
    },
    antiPatterns: [
      'Tone gelap, mendung atau moody — bertentangan 180 derajat dengan karakter ceria ukulele',
      'Ukulele kayu biasa tanpa warna cerah atau bunga tropis — terlihat membosankan di mobile feed',
      'Latar belakang studio tertutup — ukulele wajib bernapas di bawah terik matahari pantai atau taman',
      'Filter vintage kusam atau warna desaturasi — wajib memiliki kecerahan saturasi tinggi',
      'Terlalu banyak barang berserakan yang mengacaukan keceriaan sederhana'
    ],
    stylePrompts: {
      lifestyle: `Cheerful lifestyle scene of colorful ukulele (bright cherry red or cobalt blue body) lying on white sandy beach, turquoise tropical ocean water visible in background with small waves, single bright tropical flower (plumeria or hibiscus) resting on ukulele body, brilliant midday sunshine creating vivid color saturation, small white clouds in vivid blue sky in background, necklace of flowers (lei) partially visible nearby, everything bright, colorful and joyful, no shadows or moody elements, Wes Anderson-inspired color palette meets vintage 1950s Hawaii travel poster, Pixar color palette brightness and saturation, ukulele on left-center of frame, turquoise ocean and blue sky on right as bright text zone, pure happiness and carefree mood, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      cinematic: `Cinematic wide tropical morning on Hawaiian shore. Sunlit blonde koa wood ukulele resting on a driftwood log overlooking crystal turquoise reef waters. Golden morning sun flare on left, vibrant azure sky occupying the right two-thirds as a clean, uplifting text zone. Joyful island paradise aesthetic, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition sunny ukulele aesthetic. Left half: macro close-up of colorful ukulele bridge and white nylon strings under brilliant tropical sunshine with hibiscus petal. Right half: vibrant flat turquoise ocean water surface serving as high-contrast canvas for dark title typography. Radiant summer cheer, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist cheerful ukulele thumbnail. A single bright sunshine-yellow ukulele standing vertically against a vibrant pastel turquoise tropical beach wall. 70% clean colored negative space for bold playful typography. Clean modern pop aesthetic, joyful mood, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  },

  'cat-18': {
    id: 'cat-18',
    name: '18 — WORLD & TRAVEL INSTRUMENTAL',
    ctrPsychology: 'Cultural wanderlust + specificity hook: specifying the exact culture/location (e.g. Japanese, Celtic, Moroccan) instantly hooks passionate cultural enthusiasts.',
    visualHook: 'Iconic cultural landmark with authentic national palette (e.g. Japanese vermillion red torii gate path disappearing into emerald cedar mist).',
    bestStyle: 'cinematic',
    textOptions: {
      option1: 'Relaxing Japanese Music 🎋',
      option2: 'A Journey Through Japan',
      option3: '2 Hours World Instrumental Music',
      bestOption: 'OPSI 1',
      bestReason: 'Nama negara atau budaya spesifik ("Japanese Music 🎋") adalah filter pencarian dan klik trigger paling kuat di niche musik dunia.'
    },
    compositionGuide: {
      focalPoint: 'Jalur gerbang Torii atau elemen budaya ikonik di pusat frame',
      textZone: 'Kedalaman hutan berkabut atau dinding medina flat di sisi frame',
      keyContrast: 'Merah vermillion cerah vs hijau zamrud hutan pinus kuno'
    },
    ctrPalette: {
      dominant: { name: 'Vermillion Red', hex: '#CC2200' },
      accent: { name: 'Emerald Forest & Gold', hex: '#1A5A1A' },
      textZone: { type: 'Kabut Hutan Lembut', hex: '#2A4A2A' }
    },
    antiPatterns: [
      'Visual "world music" generik tanpa identitas budaya spesifik (kolase bola dunia/peta yang tidak fokus)',
      'Terlalu banyak budaya campur aduk dalam satu thumbnail — membingungkan audiens',
      'Foto turis amatir yang flat tanpa kedalaman komposisi dan pencahayaan profesional',
      'Gambar klise atau stereotip yang tidak menghormati keaslian tradisi lokal',
      'Lupa mencantumkan nama negara/budaya di teks overlay — kehilangan pemicu klik nomor satu'
    ],
    stylePrompts: {
      cinematic: `Cinematic wide shot of traditional Japanese torii gate path through ancient cedar forest, deep perspective row of vermillion red torii gates disappearing into misty green forest depth, early morning golden god rays filtering through cedar canopy creating shafts of light on moss-covered stone path, single distant figure in traditional clothing walking away from camera creating scale and journey feeling, perfect warm morning light, deep emerald forest with vivid red torii contrast, Japanese nature reverence and spiritual atmosphere, National Geographic Steve McCurry travel photography quality, torii path occupying center of frame creating natural leading line, misty forest depth on right as text zone, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      lifestyle: `Cinematic travel photography of Moroccan medina alleyway, warm saffron and terracotta walls with cobalt blue zellige tilework, traditional lanterns hanging above casting warm amber glow in late afternoon shadow, ornate carved stucco archway framing scene, distant figure in traditional djellaba for scale, rich saturated color palette of burnt orange, cobalt, deep gold, and shadow blue, Steve McCurry National Geographic composition quality, strong directional light creating dramatic shadow patterns on textured walls, alleyway leading eye into frame creating depth, flat wall on left as text zone, culturally rich and wanderlust-inspiring, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      split: `Split composition Celtic world music aesthetic. Left half: close-up macro of ancient carved Celtic stone cross and wild heather in evening golden mist. Right half: rolling deep green Irish highland hills fading into dramatic twilight fog, clean and uncluttered for ancient Celtic title typography. Legendary wanderlust, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`,
      minimal: `Minimalist world travel thumbnail. A solitary golden Indian sitar resting on a rich silk saffron cloth in front of an ornate Mughal marble jali window with sunlight streaming through. 70% soft glowing marble negative space for cultural title typography. Pure authentic heritage, no text, no watermark, ${THUMBNAIL_MANDATORY_MODIFIERS}`
    }
  }
};

/**
 * Finds the closest blueprint based on category ID or name / genre keywords.
 */
export function resolveThumbnailCategoryBlueprint(categoryName: string, genre?: string, kw?: string): CategoryThumbnailBlueprint {
  const combined = `${categoryName || ''} ${genre || ''} ${kw || ''}`.toLowerCase();

  // Match by category ID prefix if present
  for (let i = 1; i <= 18; i++) {
    const padded = i < 10 ? `0${i}` : `${i}`;
    if (combined.includes(`cat-${padded}`) || combined.includes(`${padded} —`) || combined.includes(`${padded}-`)) {
      const match = THUMBNAIL_CATEGORIES_DATABASE[`cat-${padded}`];
      if (match) return match;
    }
  }

  // Keyword-based fallback matches
  if (combined.includes('lofi') || combined.includes('lo-fi') || combined.includes('chill beats')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-01'];
  }
  if (combined.includes('piano') || combined.includes('keys')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-02'];
  }
  if (combined.includes('study') || combined.includes('focus') || combined.includes('work') || combined.includes('binaural')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-03'];
  }
  if (combined.includes('cinematic') || combined.includes('film') || combined.includes('score') || combined.includes('epic') || combined.includes('trailer')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-04'];
  }
  if (combined.includes('biola') || combined.includes('violin') || combined.includes('string') || combined.includes('cello')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-05'];
  }
  if (combined.includes('bossa') || combined.includes('latin') || combined.includes('samba') || combined.includes('cafe')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-06'];
  }
  if (combined.includes('cover') || combined.includes('pop hits') || combined.includes('rock hits')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-07'];
  }
  if (combined.includes('drum') || combined.includes('percussion') || combined.includes('beat') || combined.includes('cymbals')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-08'];
  }
  if (combined.includes('electronic') || combined.includes('synth') || combined.includes('synthwave') || combined.includes('ambient') || combined.includes('retrowave')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-09'];
  }
  if (combined.includes('game') || combined.includes('retro') || combined.includes('chiptune') || combined.includes('8-bit') || combined.includes('pixel')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-10'];
  }
  if (combined.includes('gitar') || combined.includes('guitar') || combined.includes('acoustic') || combined.includes('fingerstyle')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-11'];
  }
  if (combined.includes('jazz') || combined.includes('saxophone') || combined.includes('smooth jazz')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-12'];
  }
  if (combined.includes('klasik') || combined.includes('classical') || combined.includes('orkestra') || combined.includes('orchestra') || combined.includes('beethoven')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-13'];
  }
  if (combined.includes('new age') || combined.includes('meditasi') || combined.includes('meditation') || combined.includes('hz') || combined.includes('healing')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-14'];
  }
  if (combined.includes('seruling') || combined.includes('flute') || combined.includes('woodwind') || combined.includes('shakuhachi')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-15'];
  }
  if (combined.includes('sleep') || combined.includes('tidur') || combined.includes('deep sleep') || combined.includes('insomnia')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-16'];
  }
  if (combined.includes('ukulele') || combined.includes('mandolin') || combined.includes('hawaii')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-17'];
  }
  if (combined.includes('world') || combined.includes('travel') || combined.includes('japan') || combined.includes('morocco') || combined.includes('celtic') || combined.includes('oriental')) {
    return THUMBNAIL_CATEGORIES_DATABASE['cat-18'];
  }

  // Default to Lo-fi
  return THUMBNAIL_CATEGORIES_DATABASE['cat-01'];
}

/**
 * Builds the exact mandatory boxed output format required by TuneForge Thumbnail Engine v1.1.
 */
export function formatMandatoryThumbnailOutput(params: {
  categoryTitle: string;
  styleTitle: string;
  ctrStrategy: string;
  prompt: string;
  recommendedText: {
    option1: string;
    option2: string;
    option3: string;
    bestOption: 'OPSI 1' | 'OPSI 2' | 'OPSI 3';
    bestReason: string;
  };
  compositionGuide: {
    focalPoint: string;
    textZone: string;
    keyContrast: string;
  };
  ctrPalette: {
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { type: string; hex: string };
  };
  antiPatterns: string[];
  textPositionCode?: TextPositionCode;
  textPositionLabel?: string;
  colorPaletteCode?: ColorPaletteCode;
  colorPaletteLabel?: string;
  compositionWarning?: string | null;
  contrastWarning?: string | null;
  paletteToneWarning?: string | null;
}): string {
  const antiPatternLines = params.antiPatterns.map((ap, i) => `${i + 1}. ${ap.replace(/^\d+\.\s*/, '')}`).join('\n');
  const posLabel = params.textPositionLabel || 
    (params.textPositionCode && TEXT_POSITION_OPTIONS[params.textPositionCode]?.label) || 
    'POS-AUTO — Rekomendasi Otomatis';
  const palLabel = params.colorPaletteLabel || 
    (params.colorPaletteCode && params.colorPaletteCode !== 'PAL-AUTO' && params.colorPaletteCode !== 'PAL-CUSTOM' && COLOR_PALETTE_PRESETS[params.colorPaletteCode]?.label) || 
    'PAL-AUTO — Rekomendasi Otomatis';

  const warnings: string[] = [];
  if (params.compositionWarning) warnings.push(params.compositionWarning);
  if (params.contrastWarning) warnings.push(params.contrastWarning);
  if (params.paletteToneWarning) warnings.push(params.paletteToneWarning);

  const warningsBlock = warnings.length > 0
    ? `\n\n${warnings.join('\n\n')}`
    : '';

  return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 KATEGORI     : ${params.categoryTitle}
🖼️  GAYA         : ${params.styleTitle}
📍 POSISI TEKS  : ${posLabel}
🎨 PALET WARNA  : ${palLabel}
⚡ STRATEGI CTR : ${params.ctrStrategy}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${warningsBlock}

📸 PROMPT THUMBNAIL:
${params.prompt}

✍️  TEKS OVERLAY YANG DIREKOMENDASIKAN:
• OPSI 1 — FOKUS     : ${params.recommendedText.option1}
• OPSI 2 — ATMOSFER  : ${params.recommendedText.option2}
• OPSI 3 — MANFAAT   : ${params.recommendedText.option3}
→ TERBAIK UNTUK KATEGORI INI: ${params.recommendedText.bestOption} karena ${params.recommendedText.bestReason}

📐 PANDUAN KOMPOSISI THUMBNAIL:
• Focal point   : ${params.compositionGuide.focalPoint}
• Zona teks     : ${params.compositionGuide.textZone}
• Kontras kunci : ${params.compositionGuide.keyContrast}

🎨 PALET CTR THUMBNAIL [${palLabel}]:
• Dominan  : ${params.ctrPalette.dominant.name} [${params.ctrPalette.dominant.hex}]
• Aksen    : ${params.ctrPalette.accent.name} [${params.ctrPalette.accent.hex}]
• Zona teks: ${params.ctrPalette.textZone.type} — [${params.ctrPalette.textZone.hex}]

🚫 ANTI-PATTERN — JANGAN LAKUKAN INI:
${antiPatternLines}

⚙️  SPESIFIKASI TEKNIS:
Rasio: 16:9 | Generate: 1792×1024px | Preview uji: 320×180px (mobile)
Platform: Midjourney v6 (--ar 16:9 --v 6) / DALL-E 3 / Stable Diffusion XL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

/**
 * Main generator function producing all 4 CTR-optimized styles for the specified category.
 */
export function generateEngineeredThumbnailPrompts(input: ThumbnailGenerationInput & {
  textPosition?: TextPositionCode;
  colorPalette?: ColorPaletteCode;
  customColors?: CustomColorInput;
}): {
  prompts: {
    cinematic: string;
    split: string;
    minimal: string;
    lifestyle: string;
  };
  details: Record<'cinematic' | 'split' | 'minimal' | 'lifestyle', ThumbnailPromptDetail>;
} {
  const translatedKw = translateKeywordToEnglish(input.optionalKeyword);
  const kw = translatedKw || '';
  const bp = resolveThumbnailCategoryBlueprint(input.categoryName, input.genre, kw);

  // Dynamic customization for specific categories:
  let textOption1 = bp.textOptions.option1;
  let textOption2 = bp.textOptions.option2;
  let textOption3 = bp.textOptions.option3;

  if (bp.id === 'cat-07' && kw) {
    const cleanTitle = kw.replace(/["']/g, '');
    textOption1 = `${cleanTitle} — Instrumental`;
    textOption2 = `${cleanTitle} Without Words 🎹`;
    textOption3 = `${cleanTitle} Instrumental Version — ${input.duration || '1 Hour'}`;
  } else if ((bp.id === 'cat-03' || bp.id === 'cat-16') && input.duration) {
    const durUpper = input.duration.toUpperCase();
    if (bp.id === 'cat-03') {
      textOption3 = `${durUpper} Focus Music — No Distractions`;
    } else {
      textOption3 = `${durUpper} Sleep Music — Fall Asleep Fast`;
    }
  }

  const customizedTextOptions = {
    ...bp.textOptions,
    option1: textOption1,
    option2: textOption2,
    option3: textOption3
  };

  // Determine active Text Position
  const activePositionCode: TextPositionCode = input.textPosition || 'POS-AUTO';
  const posConfig = TEXT_POSITION_OPTIONS[activePositionCode] || TEXT_POSITION_OPTIONS['POS-AUTO'];
  const textPositionLabel = posConfig.label;

  // Determine active Color Palette
  const activePaletteCode: ColorPaletteCode = input.colorPalette || 'PAL-AUTO';
  let activePalette = {
    code: activePaletteCode,
    name: bp.ctrPalette.dominant.name,
    label: 'PAL-AUTO — Rekomendasi Otomatis',
    dominant: bp.ctrPalette.dominant,
    accent: bp.ctrPalette.accent,
    textZone: {
      name: bp.ctrPalette.textZone.type,
      hex: bp.ctrPalette.textZone.hex,
      type: bp.ctrPalette.textZone.type
    }
  };

  if (activePaletteCode !== 'PAL-AUTO' && activePaletteCode !== 'PAL-CUSTOM' && COLOR_PALETTE_PRESETS[activePaletteCode]) {
    const preset = COLOR_PALETTE_PRESETS[activePaletteCode];
    activePalette = {
      code: preset.code,
      name: preset.name,
      label: preset.label,
      dominant: preset.dominant,
      accent: preset.accent,
      textZone: preset.textZone
    };
  } else if (activePaletteCode === 'PAL-CUSTOM' && input.customColors?.dominant) {
    const custDom = input.customColors.dominant;
    const custAcc = input.customColors.accent || '#E27230';
    const custZone = input.customColors.textZone || '#0D0D15';
    activePalette = {
      code: 'PAL-CUSTOM',
      name: 'Custom Hex',
      label: `KUSTOM [${custDom}]`,
      dominant: { name: `Custom Dominant (${custDom})`, hex: custDom },
      accent: { name: `Custom Accent (${custAcc})`, hex: custAcc },
      textZone: { name: `Custom Text Zone (${custZone})`, hex: custZone, type: 'Custom Zone' }
    };
  }

  // Contrast & Tone Validations
  const contrastWarning = activePaletteCode !== 'PAL-AUTO'
    ? validatePaletteContrast({
        dominant: activePalette.dominant.hex,
        accent: activePalette.accent.hex,
        textZone: activePalette.textZone.hex
      })
    : null;

  const paletteToneWarning = (activePaletteCode === 'PAL-CUSTOM' && input.customColors?.dominant)
    ? validateCategoryColorTone(bp.id, bp.name, input.customColors.dominant)
    : null;

  const styleConfigs: Array<{
    key: 'cinematic' | 'split' | 'minimal' | 'lifestyle';
    name: string;
    targetCTR: string;
    rawPrompt: string;
    layerBg: string;
    layerSubject: string;
    layerFg: string;
    layerText: string;
  }> = [
    {
      key: 'cinematic',
      name: 'Sinematik',
      targetCTR: '>21.8%',
      rawPrompt: bp.stylePrompts.cinematic,
      layerBg: `Wide-angle cinematic backdrop with dramatic lighting, 2.39:1 anamorphic mood, dominant ${activePalette.dominant.name} tones`,
      layerSubject: `Dominant single focal point along the rule-of-thirds: ${bp.compositionGuide.focalPoint}, razor-sharp optical clarity`,
      layerFg: `Cinematic depth blur and atmospheric lens particles, f/1.8 shallow depth of field`,
      layerText: `Clean high-contrast text zone on opposite side reading "${customizedTextOptions.option1}", bold sans-serif with subtle outer drop shadow`
    },
    {
      key: 'split',
      name: 'Komposisi Terbelah',
      targetCTR: '>20.9%',
      rawPrompt: bp.stylePrompts.split,
      layerBg: `Split composition. Left half: high-contrast detailed focus. Right half: deep solid flat background providing clear text overlay`,
      layerSubject: `Single dominant focal subject on one half, sharp edge separation, zero clutter`,
      layerFg: `Subtle vertical divide and soft floating bokeh spheres enhancing stereoscopic depth`,
      layerText: `Bold high-visibility graphic overlay reading "${customizedTextOptions.option2}", high-luminance typography with deep contour`
    },
    {
      key: 'minimal',
      name: 'Tipografi Minimalis',
      targetCTR: '>22.5%',
      rawPrompt: bp.stylePrompts.minimal,
      layerBg: `Minimalist composition with 65–75% clean negative space, soft gradient, low detail for maximum text legibility`,
      layerSubject: `Single heroic centerpiece: ${bp.compositionGuide.focalPoint}, sharp tactile texture, dramatic single spotlight`,
      layerFg: `Soft atmospheric light motes in negative space, f/1.4 optical bokeh`,
      layerText: `Massive editorial typographic headline reading "${customizedTextOptions.option3}", large bold sans-serif font positioned in negative space`
    },
    {
      key: 'lifestyle',
      name: 'Gaya Hidup',
      targetCTR: '>22.1%',
      rawPrompt: bp.stylePrompts.lifestyle,
      layerBg: `Authentic organic scene bathed in warm natural light, aspirational sanctuary atmosphere`,
      layerSubject: `Relatable human presence or warm instrument haven: ${bp.compositionGuide.focalPoint}, authentic emotional connection`,
      layerFg: `Soft foreground blur creating intimate warmth and framing viewer gaze toward focal point`,
      layerText: `Eye-level headline text reading "${customizedTextOptions.bestOption === 'OPSI 2' ? customizedTextOptions.option2 : customizedTextOptions.option1}", clean placement`
    }
  ];

  const details: any = {};
  const prompts: any = {};

  styleConfigs.forEach((cfg) => {
    // Check composition warning for this style
    const compositionWarning = validateCompositionPosition(
      activePositionCode,
      cfg.key,
      cfg.name,
      bp.id
    );

    // Apply Position & Color modifications to the raw prompt
    const modifiedPrompt = applyPositionAndColorToPrompt(
      cfg.rawPrompt,
      activePositionCode,
      activePalette
    );

    // Dynamic composition guide text zone
    const resolvedTextZone = activePositionCode !== 'POS-AUTO'
      ? `${posConfig.zoneDescription} [${activePositionCode}]`
      : bp.compositionGuide.textZone;

    const formattedBlock = formatMandatoryThumbnailOutput({
      categoryTitle: bp.name,
      styleTitle: cfg.name,
      ctrStrategy: bp.ctrPsychology,
      prompt: modifiedPrompt,
      recommendedText: customizedTextOptions,
      compositionGuide: {
        ...bp.compositionGuide,
        textZone: resolvedTextZone
      },
      ctrPalette: {
        dominant: activePalette.dominant,
        accent: activePalette.accent,
        textZone: {
          type: activePalette.textZone.type,
          hex: activePalette.textZone.hex
        }
      },
      antiPatterns: bp.antiPatterns,
      textPositionCode: activePositionCode,
      textPositionLabel,
      colorPaletteCode: activePaletteCode,
      colorPaletteLabel: activePalette.label,
      compositionWarning,
      contrastWarning,
      paletteToneWarning
    });

    const midjourney = `${modifiedPrompt} --ar 16:9 --v 6 --style raw --q 2`;
    const dalle3 = `In a 16:9 landscape format YouTube thumbnail: ${modifiedPrompt}`;
    const sdNegative = THUMBNAIL_UNIVERSAL_NEGATIVE_PROMPT;

    const detail: ThumbnailPromptDetail = {
      styleName: cfg.name,
      styleKey: cfg.key,
      aspectRatio: '16:9',
      targetCTR: cfg.targetCTR,
      fullPrompt: formattedBlock,
      renderPrompt: modifiedPrompt,
      formattedBlock,
      categoryTitle: bp.name,
      styleTitle: cfg.name,
      ctrStrategy: bp.ctrPsychology,
      rawPrompt: modifiedPrompt,
      recommendedText: customizedTextOptions,
      compositionGuide: {
        ...bp.compositionGuide,
        textZone: resolvedTextZone
      },
      ctrPalette: {
        dominant: activePalette.dominant,
        accent: activePalette.accent,
        textZone: {
          type: activePalette.textZone.type,
          hex: activePalette.textZone.hex
        }
      },
      antiPatterns: bp.antiPatterns,
      technicalSpecs: {
        aspectRatio: '16:9',
        generateResolution: '1792×1024px',
        testResolution: '320×180px (mobile feed size)',
        platforms: 'Midjourney v6 (--ar 16:9 --v 6) / DALL-E 3 / Stable Diffusion XL'
      },
      platformPrompts: {
        standard: modifiedPrompt,
        midjourney,
        dalle3,
        stableDiffusion: {
          positive: modifiedPrompt,
          negative: sdNegative,
          cfgScale: 7,
          sampler: 'DPM++ 2M',
          steps: 30
        }
      },
      layers: {
        background: cfg.layerBg,
        mainSubject: cfg.layerSubject,
        foreground: cfg.layerFg,
        textOverlay: cfg.layerText
      },
      clickTriggerReason: bp.ctrPsychology,
      visualRules: {
        contrastPair: bp.compositionGuide.keyContrast,
        focusDepth: 'Razor-sharp dominant focal point with 25-40% clean low-detail text zone',
        lighting: 'High dynamic directional contrast, strong color blocking',
        emotion: bp.ctrPsychology,
        palette: `${activePalette.dominant.name} (${activePalette.dominant.hex}) & ${activePalette.accent.name} (${activePalette.accent.hex})`
      }
    };

    details[cfg.key] = detail;
    prompts[cfg.key] = formattedBlock;
  });

  return {
    prompts,
    details
  };
}

/**
 * Strips conflicting "no text" negative directives from the visual scene prompt,
 * preparing it for generators that render integrated typography on the image.
 */
export function cleanPromptForTextOverlay(rawPrompt: string): string {
  return (rawPrompt || '')
    .replace(/,\s*no text\b/gi, '')
    .replace(/\bno text,?\s*/gi, '')
    .replace(/no watermark, no text, no border, no logo/gi, 'no watermark, no border, no logo')
    .replace(/,\s*,/g, ',')
    .trim();
}

/**
 * Generates platform-specific prompts that thoroughly combine visual imagery
 * AND integrated text typography overlay matching the simulator preview.
 */
export function generateComprehensiveThumbnailPlatformPrompt(params: {
  platform: 'google-flow' | 'chatgpt' | 'general';
  detail: ThumbnailPromptDetail;
  overlayText: string;
  categoryName?: string;
  duration?: string;
  textPosition?: TextPositionCode;
  colorPalette?: ColorPaletteCode;
  customColors?: CustomColorInput;
  appliedPrompt?: string;
  activePalette?: {
    code: string;
    label: string;
    name: string;
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { name: string; hex: string };
  };
  warnings?: string[];
}): string {
  const { platform, detail, overlayText, categoryName, duration, appliedPrompt, textPosition, activePalette, warnings } = params;
  const catTitle = categoryName || detail.categoryTitle || 'Instrumental Music';
  const baseScenePrompt = appliedPrompt || detail.rawPrompt || detail.renderPrompt || '';
  const cleanedScene = cleanPromptForTextOverlay(baseScenePrompt);

  const domColor = activePalette?.dominant?.name || detail.ctrPalette?.dominant?.name || 'Deep Navy';
  const domHex = activePalette?.dominant?.hex || detail.ctrPalette?.dominant?.hex || '#0A0A14';
  const accColor = activePalette?.accent?.name || detail.ctrPalette?.accent?.name || 'Warm Amber';
  const accHex = activePalette?.accent?.hex || detail.ctrPalette?.accent?.hex || '#C9A030';
  const zoneHex = activePalette?.textZone?.hex || detail.ctrPalette?.textZone?.hex || '#0D1020';
  const durStamp = duration || '3:00:00';

  // Determine placement description according to POS code
  const posCode = textPosition || 'POS-AUTO';
  let placementDescGoogle = 'Upper-left quadrant (rule-of-thirds text zone). The bottom-right quadrant must remain completely free of text or logos to accommodate YouTube\'s video duration timestamp.';
  let placementDescGpt = 'Prominently in the upper-left quadrant (clean text safe zone).';
  let placementDescGeneral = 'in the upper-left quadrant';

  if (posCode === 'POS-A') {
    placementDescGoogle = 'Left third of frame (30% left clean text zone) [POS-A]. Main visual subject positioned on right two-thirds.';
    placementDescGpt = 'Left third of frame (clean text safe zone) [POS-A], with main subject on right two-thirds.';
    placementDescGeneral = 'in the left third of the frame [POS-A]';
  } else if (posCode === 'POS-B') {
    placementDescGoogle = 'Right third of frame (30% right clean text zone) [POS-B]. The bottom-right quadrant must remain free of text or logos to accommodate YouTube\'s video duration timestamp.';
    placementDescGpt = 'Right third of frame (clean text safe zone) [POS-B]. Keep bottom-right corner clear for timestamp badge.';
    placementDescGeneral = 'in the right third of the frame [POS-B]';
  } else if (posCode === 'POS-C') {
    placementDescGoogle = 'Top 25% horizontal strip of frame [POS-C]. Main visual subject fills the lower 75%.';
    placementDescGpt = 'Top 25% horizontal strip across frame [POS-C], above the main focal point.';
    placementDescGeneral = 'in the top 25% horizontal strip of the frame [POS-C]';
  } else if (posCode === 'POS-D') {
    placementDescGoogle = 'Bottom 25% horizontal strip of frame [POS-D]. Keep right side of this strip clear of text to prevent YouTube duration timestamp obstruction.';
    placementDescGpt = 'Bottom 25% horizontal strip [POS-D], aligned left and keeping bottom-right clear for the timestamp badge.';
    placementDescGeneral = 'in the bottom 25% horizontal strip of the frame [POS-D]';
  } else if (posCode === 'POS-E') {
    placementDescGoogle = 'Center-left 40% area of frame [POS-E]. Main focal point element shifted toward the right side.';
    placementDescGpt = 'Center-left 40% area of frame [POS-E], with focal point element positioned on the right side.';
    placementDescGeneral = 'in the center-left 40% area of the frame [POS-E]';
  } else if (posCode === 'POS-F') {
    placementDescGoogle = 'Full canvas overlay / minimalist negative space [POS-F]. Clean 60–70% flat background canvas with text as heroic central design element.';
    placementDescGpt = 'Heroic center-canvas typographic layout [POS-F] over minimalist 60–70% flat backdrop.';
    placementDescGeneral = 'across the minimalist open canvas as the heroic focal element [POS-F]';
  }

  const warningsHeader = (warnings && warnings.length > 0)
    ? `[NOTES: ${warnings.join(' | ')}]\n\n`
    : '';

  switch (platform) {
    case 'google-flow':
      return `${warningsHeader}[GOOGLE FLOW / IMAGEN 3 — YOUTUBE THUMBNAIL 16:9]
Prompt:
A high-CTR YouTube thumbnail in 16:9 aspect ratio for ${catTitle}, ${cleanedScene}.

Integrated Text & Graphic Overlay (Render Directly on Image):
- Headline Text: "${overlayText}"
- Typography Style: Giant, ultra-bold modern sans-serif typography, clean uppercase lettering with high edge contrast and subtle dark drop shadow for maximum 320x180px mobile legibility.
- Placement: ${placementDescGoogle}
- Color Harmony: High-luminance crisp white lettering with ${accColor} (${accHex}) accents against ${domColor} (${domHex}) background tones and ${zoneHex} text zone.
- Mobile CTR Rule: Tested and guaranteed for 0.3-second glance comprehension on smartphone screens.

Technical Specifications:
- Aspect Ratio: 16:9 widescreen (1792×1024 px)
- Lighting & Texture: High dynamic contrast, sharp focal point, strong color blocking, uncluttered negative space
- Quality: 8K resolution, cinematic lighting, professional YouTube thumbnail design, no blurry artifacts, no garbled spelling`;

    case 'chatgpt':
      return `${warningsHeader}[CHATGPT / DALL-E 3 PROMPT]
"Generate a professional, high-CTR YouTube thumbnail in 16:9 aspect ratio for a ${catTitle} music track.

VISUAL SCENE & SETTING:
${cleanedScene}

INTEGRATED TEXT OVERLAY (MUST BE RENDERED DIRECTLY ON THE IMAGE):
1. Exact Text: "${overlayText}"
2. Position: ${placementDescGpt}
3. Font & Appearance: Massive, ultra-bold modern sans-serif editorial typography. Ensure extreme edge contrast (high-luminance white letters with crisp subtle outer drop-shadow against ${zoneHex} zone) so it is instantly readable at 320×180 px on mobile feeds.
4. YouTube Safe Zone: Keep the bottom-right corner completely clear of any text or critical visual elements so it is not obscured by the YouTube duration badge (${durStamp}).

STYLE & COMPOSITION:
16:9 widescreen composition, strong color blocking (${domColor} ${domHex} & ${accColor} ${accHex}), razor-sharp focal point, masterwork commercial graphic design."`;

    case 'general':
    default:
      return `${warningsHeader}A professional, high-CTR 16:9 YouTube thumbnail for ${catTitle}. Visual scene: ${cleanedScene}. Prominently featuring bold integrated text headline: "${overlayText}" in massive, ultra-clear high-contrast typography ${placementDescGeneral}, optimized for instant mobile readability (0.3-second glance rule). Bottom-right corner kept clean and free of text for video duration badge. Masterwork, vibrant ${domColor} (${domHex}) and ${accColor} (${accHex}) lighting, 16:9 widescreen, 8K resolution.`;
  }
}
