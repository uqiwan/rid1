/**
 * TuneForge Thumbnail Engine v1.1 - Text Position & Color Palette Engine
 * Handles automatic and manual overrides for:
 * 1. [POSISI TEKS] (7 options: POS-AUTO, POS-A through POS-F)
 * 2. [KOMBINASI WARNA] (10 presets: PAL-01 through PAL-10, plus Custom Hex)
 *
 * Includes contrast validation, category tone validation, composition conflict detection,
 * and prompt injection routines complying with YouTube mobile 320x180px CTR standards.
 */

export type TextPositionCode = 
  | 'POS-AUTO' 
  | 'POS-A' 
  | 'POS-B' 
  | 'POS-C' 
  | 'POS-D' 
  | 'POS-E' 
  | 'POS-F';

export interface TextPositionOption {
  code: TextPositionCode;
  name: string;
  label: string;
  description: string;
  promptInstruction: string;
  zoneDescription: string;
  simulatorClass: string;
  textAlignClass: string;
}

export const TEXT_POSITION_OPTIONS: Record<TextPositionCode, TextPositionOption> = {
  'POS-AUTO': {
    code: 'POS-AUTO',
    name: 'Otomatis',
    label: 'POS-AUTO — Otomatis',
    description: 'Sistem menentukan posisi terbaik berdasarkan kategori & gaya (default)',
    promptInstruction: '',
    zoneDescription: 'Rekomendasi otomatis per kategori & gaya',
    simulatorClass: 'top-3 left-3 max-w-[65%]',
    textAlignClass: 'text-left'
  },
  'POS-A': {
    code: 'POS-A',
    name: 'Kiri (30%)',
    label: 'POS-A — Kiri (30%)',
    description: '30% sisi kiri frame harus flat/clean/blur kuat',
    promptInstruction: 'left third of frame must be flat, low-detail, and heavily blurred or solid-color to serve as clean text zone, main subject positioned on right side',
    zoneDescription: '30% sisi KIRI — flat, low-detail & blur kuat, bersih untuk overlay teks',
    simulatorClass: 'top-3 left-3 max-w-[45%] bottom-10 flex flex-col justify-center',
    textAlignClass: 'text-left'
  },
  'POS-B': {
    code: 'POS-B',
    name: 'Kanan (30%)',
    label: 'POS-B — Kanan (30%)',
    description: '30% sisi kanan frame harus flat/clean/blur kuat',
    promptInstruction: 'right third of frame must be flat, low-detail, and heavily blurred or solid-color to serve as clean text zone, main subject positioned on left side',
    zoneDescription: '30% sisi KANAN — flat, low-detail & blur kuat, bersih untuk overlay teks',
    simulatorClass: 'top-3 right-3 max-w-[45%] bottom-10 flex flex-col justify-center items-end',
    textAlignClass: 'text-right'
  },
  'POS-C': {
    code: 'POS-C',
    name: 'Atas (25%)',
    label: 'POS-C — Atas (25%)',
    description: 'Strip horizontal atas 25% frame harus flat/gelap',
    promptInstruction: 'top 25% of frame must be flat gradient or dark sky/ceiling with minimal detail for text overlay, main subject fills lower 75%',
    zoneDescription: 'Strip horizontal ATAS 25% — flat gradient/gelap dengan detail minimal',
    simulatorClass: 'top-2.5 inset-x-3 max-w-[85%] mx-auto',
    textAlignClass: 'text-center'
  },
  'POS-D': {
    code: 'POS-D',
    name: 'Bawah (25%)',
    label: 'POS-D — Bawah (25%)',
    description: 'Strip horizontal bawah 25% frame harus flat/gelap',
    promptInstruction: 'bottom 25% of frame must be flat dark strip or ground/floor with minimal detail, main subject fills upper 75%',
    zoneDescription: 'Strip horizontal BAWAH 25% — flat dark strip, aman dari timestamp YouTube',
    simulatorClass: 'bottom-9 left-3 max-w-[65%]',
    textAlignClass: 'text-left'
  },
  'POS-E': {
    code: 'POS-E',
    name: 'Tengah-Kiri',
    label: 'POS-E — Tengah-Kiri',
    description: '40% area tengah-kiri, focal point digeser ke kanan',
    promptInstruction: 'center-left 40% of frame is clean flat area for large text overlay, focal point element positioned on right side of frame',
    zoneDescription: '40% area TENGAH-KIRI — area flat bersih untuk overlay teks besar, focal point di kanan',
    simulatorClass: 'top-1/2 -translate-y-1/2 left-3 max-w-[55%]',
    textAlignClass: 'text-left'
  },
  'POS-F': {
    code: 'POS-F',
    name: 'Overlay Penuh',
    label: 'POS-F — Overlay Penuh',
    description: 'Background 60–70% flat/minimal — teks sebagai elemen utama desain (cocok Gaya Tipografi Minimalis)',
    promptInstruction: 'minimalist background occupying 60–70% of frame with single strong isolated subject, background is clean enough to function as full text canvas',
    zoneDescription: 'OVERLAY PENUH — background 60–70% flat/minimal sebagai canvas teks utama',
    simulatorClass: 'inset-x-4 top-1/2 -translate-y-1/2 max-w-[85%] mx-auto text-center',
    textAlignClass: 'text-center'
  }
};

export type ColorPaletteCode = 
  | 'PAL-AUTO'
  | 'PAL-01'
  | 'PAL-02'
  | 'PAL-03'
  | 'PAL-04'
  | 'PAL-05'
  | 'PAL-06'
  | 'PAL-07'
  | 'PAL-08'
  | 'PAL-09'
  | 'PAL-10'
  | 'PAL-CUSTOM';

export interface ColorPalettePreset {
  code: ColorPaletteCode;
  name: string;
  label: string;
  characteristics: string;
  suitableFor: string;
  dominant: { name: string; hex: string };
  accent: { name: string; hex: string };
  textZone: { name: string; hex: string; type: string };
}

export const COLOR_PALETTE_PRESETS: Record<Exclude<ColorPaletteCode, 'PAL-AUTO' | 'PAL-CUSTOM'>, ColorPalettePreset> = {
  'PAL-01': {
    code: 'PAL-01',
    name: 'Dark Cinematic',
    label: 'PAL-01 — Dark Cinematic',
    characteristics: 'Dominan hitam/navy gelap, aksen gold/amber',
    suitableFor: 'Jazz, Piano, Sleep, Klasik',
    dominant: { name: 'Deep Black and Navy', hex: '#0A0A14' },
    accent: { name: 'Rich Gold and Amber', hex: '#C9A030' },
    textZone: { name: 'Dark Navy Shadow', hex: '#0D1020', type: 'Dark Navy' }
  },
  'PAL-02': {
    code: 'PAL-02',
    name: 'Warm Earth',
    label: 'PAL-02 — Warm Earth',
    characteristics: 'Dominan terracotta/coklat, aksen oranye & krem',
    suitableFor: 'Akustik, World, Bossa',
    dominant: { name: 'Terracotta Brown', hex: '#3D2314' },
    accent: { name: 'Warm Orange & Cream', hex: '#E27230' },
    textZone: { name: 'Dark Earth', hex: '#24140B', type: 'Dark Brown Earth' }
  },
  'PAL-03': {
    code: 'PAL-03',
    name: 'Cool Blue Arctic',
    label: 'PAL-03 — Cool Blue Arctic',
    characteristics: 'Dominan biru es/slate, aksen putih & silver',
    suitableFor: 'Study/Focus, New Age, Piano',
    dominant: { name: 'Slate Arctic Blue', hex: '#102538' },
    accent: { name: 'Ice Blue & Silver', hex: '#6BB8F0' },
    textZone: { name: 'Deep Arctic Navy', hex: '#081622', type: 'Deep Arctic' }
  },
  'PAL-04': {
    code: 'PAL-04',
    name: 'Neon Synthwave',
    label: 'PAL-04 — Neon Synthwave',
    characteristics: 'Dominan ungu/magenta neon, aksen cyan electric',
    suitableFor: 'Electronic, Game/Chiptune',
    dominant: { name: 'Deep Neon Violet', hex: '#2B0B3F' },
    accent: { name: 'Electric Cyan & Hot Pink', hex: '#00F0FF' },
    textZone: { name: 'Dark Violet Shadow', hex: '#180424', type: 'Dark Violet' }
  },
  'PAL-05': {
    code: 'PAL-05',
    name: 'Forest Green',
    label: 'PAL-05 — Forest Green',
    characteristics: 'Dominan hijau tua/emerald, aksen gold & cream',
    suitableFor: 'Lo-fi, Nature, Akustik',
    dominant: { name: 'Deep Forest Green', hex: '#1A3A1A' },
    accent: { name: 'Gold & Warm Cream', hex: '#C9A030' },
    textZone: { name: 'Dark Forest Pine', hex: '#0D1A0D', type: 'Dark Forest' }
  },
  'PAL-06': {
    code: 'PAL-06',
    name: 'Pastel Dream',
    label: 'PAL-06 — Pastel Dream',
    characteristics: 'Dominan pastel pink/lavender, aksen mint',
    suitableFor: 'Lo-fi Chill, Ukulele, New Age',
    dominant: { name: 'Soft Dark Plum Lavender', hex: '#422E48' },
    accent: { name: 'Fresh Pastel Mint', hex: '#88E5BE' },
    textZone: { name: 'Deep Plum Shadow', hex: '#261A2A', type: 'Soft Plum' }
  },
  'PAL-07': {
    code: 'PAL-07',
    name: 'Sunset Vivid',
    label: 'PAL-07 — Sunset Vivid',
    characteristics: 'Dominan oranye-merah gradient, aksen kuning & pink',
    suitableFor: 'World, Cinematic, Bossa',
    dominant: { name: 'Deep Crimson Ember', hex: '#4A1208' },
    accent: { name: 'Solar Gold & Coral', hex: '#FDB813' },
    textZone: { name: 'Dark Ember Shadow', hex: '#280702', type: 'Dark Ember' }
  },
  'PAL-08': {
    code: 'PAL-08',
    name: 'Monochrome Black',
    label: 'PAL-08 — Monochrome Black',
    characteristics: 'Full hitam & putih, aksen abu minimalis',
    suitableFor: 'Cover Instrumental, Piano, Jazz',
    dominant: { name: 'Noir Matte Black', hex: '#111111' },
    accent: { name: 'Pure White Minimalist', hex: '#FFFFFF' },
    textZone: { name: 'Deep Noir Shadow', hex: '#080808', type: 'Absolute Noir' }
  },
  'PAL-09': {
    code: 'PAL-09',
    name: 'Deep Purple',
    label: 'PAL-09 — Deep Purple',
    characteristics: 'Dominan ungu tua/indigo, aksen teal & gold',
    suitableFor: 'Meditasi, String, Cinematic',
    dominant: { name: 'Deep Mystical Indigo', hex: '#200C3B' },
    accent: { name: 'Luminous Teal & Gold', hex: '#00D2BA' },
    textZone: { name: 'Midnight Indigo', hex: '#110520', type: 'Dark Indigo' }
  },
  'PAL-10': {
    code: 'PAL-10',
    name: 'Tropical Vivid',
    label: 'PAL-10 — Tropical Vivid',
    characteristics: 'Dominan turquoise/teal, aksen kuning & coral',
    suitableFor: 'Bossa, Ukulele, World',
    dominant: { name: 'Deep Tropical Teal', hex: '#0A3638' },
    accent: { name: 'Bright Canary Yellow & Coral', hex: '#FFCE00' },
    textZone: { name: 'Deep Submerged Teal', hex: '#041D1E', type: 'Deep Teal' }
  }
};

export interface CustomColorInput {
  dominant: string;
  accent?: string;
  textZone?: string;
}

/**
 * Parses Hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16)
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  }
  return null;
}

/**
 * Calculates relative luminance according to WCAG standards
 */
export function getRelativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0.1;
  const rs = rgb.r / 255;
  const gs = rgb.g / 255;
  const bs = rgb.b / 255;
  const r = rs <= 0.03928 ? rs / 12.92 : Math.pow((rs + 0.055) / 1.055, 2.4);
  const g = gs <= 0.03928 ? gs / 12.92 : Math.pow((gs + 0.055) / 1.055, 2.4);
  const b = bs <= 0.03928 ? bs / 12.92 : Math.pow((bs + 0.055) / 1.055, 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two hex colors (1:1 to 21:1)
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validates minimum contrast ratio for text zone overlay
 */
export function validatePaletteContrast(palette: { dominant: string; accent: string; textZone: string }): string | null {
  // Mobile feed 320x180px requires crisp text readability
  // Standard text overlay is crisp white #FFFFFF or high-luminance accent
  const textLuminance = getRelativeLuminance('#FFFFFF');
  const zoneContrastWhite = (textLuminance + 0.05) / (getRelativeLuminance(palette.textZone) + 0.05);
  const accentVsDom = getContrastRatio(palette.dominant, palette.accent);

  if (zoneContrastWhite < 3.2) {
    return `⚠️ PERINGATAN KONTRAS: Kombinasi warna yang Anda pilih memiliki kontras rendah antara teks putih dan zona teks (${palette.textZone}). Di ukuran mobile 320px, teks overlay akan sulit dibaca sekilas dalam 0.3 detik. Pertimbangkan membuat zona teks lebih gelap (misal: #0D0D15) atau menambahkan drop shadow pekat.`;
  }

  if (accentVsDom < 2.5) {
    return `⚠️ PERINGATAN KONTRAS: Aksen (${palette.accent}) dan warna dominan (${palette.dominant}) memiliki perbedaan kontras yang terlalu tipis (${accentVsDom.toFixed(1)}:1). Di layar ponsel kecil, elemen aksen tidak akan terlihat mencolok. Pertimbangkan menambah saturasi atau kecerahan aksen.`;
  }

  return null;
}

/**
 * Checks if a custom color contradicts the core mood of the music category
 */
export function validateCategoryColorTone(categoryId: string, categoryName: string, customDominantHex: string): string | null {
  const lum = getRelativeLuminance(customDominantHex);

  // Calming / Deep categories require dark / muted backgrounds
  const darkCategories = ['cat-01', 'cat-02', 'cat-03', 'cat-04', 'cat-07', 'cat-11', 'cat-15', 'cat-16', 'cat-17'];
  if (darkCategories.some(c => categoryId.includes(c)) && lum > 0.55) {
    return `⚠️ CATATAN PALET: Warna [${customDominantHex}] yang Anda pilih cenderung terlalu terang untuk kategori ${categoryName} yang biasanya menggunakan tone gelap, hangat, dan menenangkan. Prompt tetap menggunakan pilihan Anda — namun pastikan kontras zona teks tetap terjaga agar tidak silau di layar mobile.`;
  }

  // Upbeat / Tropical / Vibrant categories
  const vibrantCategories = ['cat-08', 'cat-09', 'cat-10', 'cat-13'];
  if (vibrantCategories.some(c => categoryId.includes(c)) && lum < 0.04) {
    return `⚠️ CATATAN PALET: Warna [${customDominantHex}] yang Anda pilih cenderung terlalu gelap untuk kategori ${categoryName} yang biasanya menggunakan tone cerah, hangat, dan tropis. Prompt tetap menggunakan pilihan Anda — namun pertimbangkan palet lebih vibrant untuk CTR optimal.`;
  }

  return null;
}

/**
 * Validates composition position against style and category principles
 */
export function validateCompositionPosition(
  position: TextPositionCode,
  styleKey: string,
  styleName: string,
  _categoryId?: string
): string | null {
  if (position === 'POS-AUTO') return null;

  if (position === 'POS-D') {
    return `⚠️ CATATAN KOMPOSISI: Posisi POS-D (Bawah 25%) yang Anda pilih tidak optimal untuk gaya ${styleName} karena sudut kanan bawah rentan tertutup badge durasi YouTube (timestamp) dan timeline player. Prompt tetap dihasilkan sesuai permintaan, namun pertimbangkan POS-A (Kiri) atau POS-E (Tengah-Kiri) untuk hasil CTR terbaik.`;
  }

  if (position === 'POS-F' && styleKey !== 'minimal') {
    return `⚠️ CATATAN KOMPOSISI: Posisi POS-F (Overlay Penuh) yang Anda pilih tidak optimal untuk gaya ${styleName} karena gaya ini memiliki subjek visual yang detail dan terstruktur sehingga teks layar penuh berisiko menurunkan kejelasan visual subjek. Prompt tetap dihasilkan sesuai permintaan, namun pertimbangkan POS-A atau POS-B untuk hasil CTR terbaik.`;
  }

  return null;
}

/**
 * Helper to produce the color palette prompt clause
 */
export function formatColorPalettePromptClause(palette: {
  name: string;
  code: string;
  dominant: { name: string; hex: string };
  accent: { name: string; hex: string };
  textZone: { name: string; hex: string; type?: string };
}): string {
  return `color palette: ${palette.dominant.name} (${palette.dominant.hex}) as dominant background, ${palette.accent.name} (${palette.accent.hex}) as accent highlights, ${palette.textZone.name} (${palette.textZone.hex}) for text zone area`;
}

/**
 * Injects text position and color palette directives into the visual scene prompt
 */
export function applyPositionAndColorToPrompt(
  rawPrompt: string,
  positionCode: TextPositionCode,
  palette: {
    code: string;
    dominant: { name: string; hex: string };
    accent: { name: string; hex: string };
    textZone: { name: string; hex: string };
  }
): string {
  let prompt = rawPrompt;

  // 1. Inject Text Position if not POS-AUTO
  if (positionCode !== 'POS-AUTO' && TEXT_POSITION_OPTIONS[positionCode]) {
    const posOption = TEXT_POSITION_OPTIONS[positionCode];
    const posDirective = posOption.promptInstruction;

    // Clean any conflicting legacy text position phrases
    prompt = prompt
      .replace(/right two-thirds as clean text zone/gi, '')
      .replace(/left one-third.*clean text zone/gi, '')
      .replace(/open dark sky on right as text zone/gi, '')
      .replace(/clean flat navy blue backdrop dedicated for text overlay/gi, '')
      .replace(/clean low-detail text zone/gi, '')
      .replace(/,\s*,/g, ',')
      .trim();

    // Insert position directive before the trailing modifiers
    const modifierMarker = 'thumbnail composition optimized';
    if (prompt.includes(modifierMarker)) {
      prompt = prompt.replace(
        modifierMarker,
        `${posDirective}, ${modifierMarker}`
      );
    } else {
      prompt = `${prompt}, ${posDirective}`;
    }
  }

  // 2. Inject Color Palette if not PAL-AUTO
  if (palette.code !== 'PAL-AUTO') {
    const colorClause = `color palette: ${palette.dominant.name} (${palette.dominant.hex}) as dominant background, ${palette.accent.name} (${palette.accent.hex}) as accent highlights, ${palette.textZone.name} (${palette.textZone.hex}) for text zone area`;
    
    const modifierMarker = 'thumbnail composition optimized';
    if (prompt.includes(modifierMarker)) {
      prompt = prompt.replace(
        modifierMarker,
        `${colorClause}, ${modifierMarker}`
      );
    } else {
      prompt = `${prompt}, ${colorClause}`;
    }
  }

  return prompt.replace(/,\s*,/g, ',').trim();
}
