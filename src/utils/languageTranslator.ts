/**
 * Language Translator & Normalizer
 * Enforces 100% US English output across all TuneForge engines,
 * automatically converting Indonesian inputs (Blocks 5-7: Duration, Use Case, Topic/Keyword)
 * into high-CTR, native US English.
 */

const DURATION_DICTIONARY: Record<string, string> = {
  '15 menit': '15 Minutes',
  '30 menit': '30 Minutes',
  '45 menit': '45 Minutes',
  '1 jam': '1 Hour',
  '2 jam': '2 Hours',
  '3 jam': '3 Hours',
  '4 jam': '4 Hours',
  '5 jam': '5 Hours',
  '6 jam': '6 Hours',
  '8 jam': '8 Hours',
  '10 jam': '10 Hours',
  '12 jam': '12 Hours',
  '24 jam': '24 Hours',
  'sepanjang malam': 'All Night (8 Hours)',
  'semalaman': 'All Night (8 Hours)',
};

const USECASE_DICTIONARY: Record<string, string> = {
  'belajar / deep work': 'Deep Work & Study',
  'belajar': 'Study & Focus',
  'deep work': 'Deep Work & Concentration',
  'tidur nyenyak': 'Deep Restful Sleep',
  'tidur': 'Sleep & Insomnia Relief',
  'relaksasi / santai': 'Deep Relaxation & Calm',
  'relaksasi': 'Relaxation & Stress Relief',
  'santai': 'Relaxing & Unwinding',
  'membaca buku': 'Reading & Focus',
  'membaca': 'Reading & Study',
  'coding / pemrograman': 'Coding & Programming',
  'coding': 'Coding & Development',
  'pemrograman': 'Software Engineering & Coding',
  'menulis jurnal': 'Journaling & Reflection',
  'menulis': 'Creative Writing & Focus',
  'meditasi / yoga': 'Meditation & Yoga',
  'meditasi': 'Mindfulness Meditation',
  'yoga': 'Yoga & Inner Peace',
  'menemani kerja lembur': 'Late Night Overtime Work',
  'kerja lembur': 'Late Night Work Session',
  'kerja': 'Focus & Work',
  'bekerja': 'Work & Productivity',
  'istirahat': 'Rest & Recovery',
  'fokus': 'Deep Concentration',
  'fokus belajar': 'Study Session Focus',
  'nongkrong': 'Chill Vibes & Hanging Out',
  'santai sore': 'Sunset Chill Session',
  'kantor': 'Office Productivity',
  'pekerjaan kantor': 'Productive Office Work',
  'belajar ujian': 'Exam Cramming & Study',
  'skripsi': 'Thesis Writing & Deep Focus',
  'tugas kuliah': 'Homework & College Study',
};

const KEYWORD_PHRASE_REPLACEMENTS: [RegExp, string][] = [
  // Full common phrases
  [/\bhujan di tokyo\b/gi, 'Rain in Tokyo'],
  [/\bhujan di kyoto\b/gi, 'Rain in Kyoto'],
  [/\bkafe hujan di kyoto\b/gi, 'Rainy Kyoto Cafe'],
  [/\bruang kerja minimalis\b/gi, 'Minimalist Workspace'],
  [/\bkamar tidur aesthetic\b/gi, 'Aesthetic Bedroom'],
  [/\bhutan pinus berkabut\b/gi, 'Misty Pine Forest'],
  [/\bapi unggun di tepi danau\b/gi, 'Lakeside Campfire'],
  [/\bpantai senja sunset\b/gi, 'Sunset Beach Ocean'],
  [/\bmusim dingin bersalju\b/gi, 'Snowy Winter Landscape'],
  [/\bmusim gugur hangat\b/gi, 'Cozy Autumn Foliage'],
  [/\bperpustakaan tua\b/gi, 'Vintage Old Library'],
  [/\bkedai kopi malam\b/gi, 'Midnight Coffee Shop'],
  [/\bkereta malam di jepang\b/gi, 'Japanese Midnight Train'],
  [/\bgedung pencakar langit malam\b/gi, 'Midnight City Skyscrapers'],
  [/\bbalkon apartemen hujan\b/gi, 'Rainy Apartment Balcony'],
  [/\bkota cyberpunk neon\b/gi, 'Cyberpunk Neon City'],
  [/\blilin hangat di meja\b/gi, 'Warm Candlelight Desk'],
  [/\bkucing tidur di jendela\b/gi, 'Sleeping Cat on Rainy Window'],
  
  // Specific words
  [/\bhujan deras\b/gi, 'Heavy Rain'],
  [/\bhujan gerimis\b/gi, 'Gentle Drizzle'],
  [/\bhujan\b/gi, 'Rain'],
  [/\bgerimis\b/gi, 'Drizzle'],
  [/\bberkabut\b/gi, 'Misty'],
  [/\bkabut\b/gi, 'Fog'],
  [/\bsalju\b/gi, 'Snow'],
  [/\bbersalju\b/gi, 'Snowy'],
  [/\bmalam hari\b/gi, 'Midnight'],
  [/\bmalam\b/gi, 'Night'],
  [/\bpagi hari\b/gi, 'Sunrise Morning'],
  [/\bpagi\b/gi, 'Morning'],
  [/\bsore hari\b/gi, 'Afternoon'],
  [/\bsore\b/gi, 'Afternoon'],
  [/\bsenja\b/gi, 'Twilight Dusk'],
  [/\bsubuh\b/gi, 'Early Dawn'],
  [/\bkafe\b/gi, 'Cafe'],
  [/\bkopi\b/gi, 'Coffee'],
  [/\bkedai kopi\b/gi, 'Coffee Shop'],
  [/\bteh hangat\b/gi, 'Warm Tea'],
  [/\bruang kerja\b/gi, 'Workspace'],
  [/\bmeja kerja\b/gi, 'Work Desk'],
  [/\bmeja\b/gi, 'Desk'],
  [/\bkamar tidur\b/gi, 'Bedroom'],
  [/\bkamar\b/gi, 'Room'],
  [/\bruang tamu\b/gi, 'Living Room'],
  [/\bperpustakaan\b/gi, 'Library'],
  [/\bbuku\b/gi, 'Books'],
  [/\bhutan pinus\b/gi, 'Pine Forest'],
  [/\bhutan\b/gi, 'Forest'],
  [/\balam\b/gi, 'Nature'],
  [/\bpegunungan\b/gi, 'Mountains'],
  [/\bgunung\b/gi, 'Mountain'],
  [/\btaman\b/gi, 'Park'],
  [/\bdanau\b/gi, 'Lake'],
  [/\btepi danau\b/gi, 'Lakeside'],
  [/\bsungai\b/gi, 'River'],
  [/\bair terjun\b/gi, 'Waterfall'],
  [/\bpantai\b/gi, 'Beach'],
  [/\blaut\b/gi, 'Ocean'],
  [/\bombak\b/gi, 'Ocean Waves'],
  [/\bapi unggun\b/gi, 'Campfire'],
  [/\bperapian\b/gi, 'Fireplace'],
  [/\blilin\b/gi, 'Candlelight'],
  [/\bjendela berembun\b/gi, 'Steamy Rainy Window'],
  [/\bjendela\b/gi, 'Window'],
  [/\bbalkon\b/gi, 'Balcony'],
  [/\bloteng\b/gi, 'Cozy Attic'],
  [/\bkereta\b/gi, 'Train'],
  [/\bkucing\b/gi, 'Cat'],
  [/\btanaman\b/gi, 'Plants'],
  [/\bbunga sakura\b/gi, 'Cherry Blossom Sakura'],
  [/\bbunga\b/gi, 'Flowers'],
  [/\blangit berbintang\b/gi, 'Starry Night Sky'],
  [/\blangit\b/gi, 'Sky'],
  [/\bbintang\b/gi, 'Stars'],
  [/\bbulan purnama\b/gi, 'Full Moon'],
  [/\bbulan\b/gi, 'Moon'],
  [/\bmusim dingin\b/gi, 'Winter'],
  [/\bmusim gugur\b/gi, 'Autumn'],
  [/\bmusim semi\b/gi, 'Spring'],
  [/\bmusim panas\b/gi, 'Summer'],
  [/\blampu meja\b/gi, 'Desk Lamp'],
  [/\blampu neon\b/gi, 'Neon Lights'],
  [/\blampu\b/gi, 'Lights'],
  [/\bcahaya hangat\b/gi, 'Warm Golden Glow'],
  [/\bcahaya\b/gi, 'Lighting'],
  [/\btenang\b/gi, 'Calm'],
  [/\bhening\b/gi, 'Quiet'],
  [/\bdamai\b/gi, 'Peaceful'],
  [/\bnyaman\b/gi, 'Cozy'],
  [/\bhangat\b/gi, 'Warm'],
  [/\bsejuk\b/gi, 'Breezy Cool'],
  [/\bgalau\b/gi, 'Melancholy Nostalgia'],
  [/\bsedih\b/gi, 'Melancholy'],
  [/\bsendirian\b/gi, 'Solitary Solitude'],
  [/\bkesendirian\b/gi, 'Peaceful Solitude'],
  [/\btanpa lirik\b/gi, 'No Lyrics'],
  [/\binstrumen\b/gi, 'Instrumental'],
  [/\blagu\b/gi, 'Music'],
  [/\bmusik\b/gi, 'Music'],
  
  // Prepositions & Conjunctions
  [/\bdi\b/gi, 'in'],
  [/\bke\b/gi, 'to'],
  [/\bdari\b/gi, 'from'],
  [/\bdengan\b/gi, 'with'],
  [/\bdan\b/gi, 'and'],
  [/\buntuk\b/gi, 'for'],
  [/\bsaat\b/gi, 'during'],
  [/\bketika\b/gi, 'while'],
  [/\btanpa\b/gi, 'without'],
];

/**
 * Normalizes duration input into clean English format (e.g. "45 Menit" -> "45 Minutes", "1 Jam" -> "1 Hour")
 */
export function translateDurationToEnglish(rawDuration?: string): string {
  if (!rawDuration) return '1 Hour';
  const clean = rawDuration.trim();
  const lower = clean.toLowerCase();

  // Exact match in dictionary
  if (DURATION_DICTIONARY[lower]) {
    return DURATION_DICTIONARY[lower];
  }

  // Regex matches for "X Menit" or "X Jam"
  const menitMatch = clean.match(/^(\d+(?:[.,]\d+)?)\s*(?:menit|mins?|minutes?)$/i);
  if (menitMatch) {
    return `${menitMatch[1]} Minutes`;
  }

  const jamMatch = clean.match(/^(\d+(?:[.,]\d+)?)\s*(?:jam|hours?|hrs?)$/i);
  if (jamMatch) {
    const num = parseFloat(jamMatch[1].replace(',', '.'));
    return num === 1 ? '1 Hour' : `${jamMatch[1]} Hours`;
  }

  // General conversion
  let converted = clean
    .replace(/menit/gi, 'Minutes')
    .replace(/jam/gi, 'Hours')
    .replace(/detik/gi, 'Seconds');

  return converted || '1 Hour';
}

/**
 * Translates useCase (audience activity) to English (e.g. "Belajar / Deep Work" -> "Deep Work & Study")
 */
export function translateUseCaseToEnglish(rawUseCase?: string): string {
  if (!rawUseCase) return 'Deep Work & Study';
  const clean = rawUseCase.trim();
  const lower = clean.toLowerCase();

  if (USECASE_DICTIONARY[lower]) {
    return USECASE_DICTIONARY[lower];
  }

  // Replace common sub-phrases
  let result = clean;
  for (const [pattern, replacement] of KEYWORD_PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  // Extra use case replacements
  result = result
    .replace(/belajar/gi, 'Study')
    .replace(/tidur/gi, 'Sleep')
    .replace(/santai/gi, 'Relax')
    .replace(/bekerja|kerja/gi, 'Work')
    .replace(/fokus/gi, 'Focus');

  return result || 'Deep Work & Study';
}

/**
 * Translates and cleans optional keyword/context to English
 * (e.g. "Hujan di Tokyo" -> "Rain in Tokyo", "Kamar tidur aesthetic malam hari" -> "Aesthetic Bedroom Midnight")
 */
export function translateKeywordToEnglish(rawKeyword?: string): string {
  if (!rawKeyword) return '';
  let result = rawKeyword.trim();
  if (!result) return '';

  for (const [pattern, replacement] of KEYWORD_PHRASE_REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }

  // Clean double spaces and sanitize
  result = result.replace(/\s{2,}/g, ' ').trim();
  return result;
}

/**
 * Full English Sanitizer for any user-provided string
 */
export function forceEnglishString(text: string, fallback = ''): string {
  if (!text) return fallback;
  return translateKeywordToEnglish(text) || fallback;
}
