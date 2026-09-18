import { ContentPackage } from '../types';
import { translateDurationToEnglish, translateUseCaseToEnglish } from '../utils/languageTranslator';

export interface IntroHookTiers {
  hook: string;
  subtitle: string;
  cta: string;
  fullFormattedText: string;
}

/**
 * Cleans out any leading numbers, tier labels, and quotes from a tier text
 */
export function cleanTierText(text: string): string {
  if (!text) return '';
  let str = text.trim();
  // Strip outer quotes and backticks
  str = str.replace(/^["'“”‘`]+|["'“”‘`]+$/g, '').trim();
  // Strip markdown bold wrappers like **1. Hook:** or **1:** or **Hook:**
  str = str.replace(/^\*\*(?:[^*]+)\*\*\s*[:\-–—]?\s*/, '').trim();
  // Strip tier numbering like 1., 1:, 1), [1], (1), 1 -, 1 /
  str = str.replace(/^(?:\[[1-3]\]|\([1-3]\)|[1-3][.:\)\-–—\/])\s*/, '').trim();
  // Strip tier labels like Tingkat 1, Hook (0-3s):, Hook:, Sub-judul:, CTA:, etc.
  str = str.replace(/^(?:(?:tingkat|tier)\s*[1-3]\s*[:\-–—]?\s*)?(?:hook|subtitle|sub-?judul|cta|call\s*to\s*action)?\s*(?:\([^)]*\))?\s*[:\-–—]\s*/i, '').trim();
  // Second pass for compound formats like "1. Hook: Text"
  str = str.replace(/^(?:\[[1-3]\]|\([1-3]\)|[1-3][.:\)\-–—\/])\s*/, '').trim();
  str = str.replace(/^(?:(?:tingkat|tier)\s*[1-3]\s*[:\-–—]?\s*)?(?:hook|subtitle|sub-?judul|cta|call\s*to\s*action)?\s*(?:\([^)]*\))?\s*[:\-–—]\s*/i, '').trim();
  // Strip trailing & leading quotes once more
  str = str.replace(/^["'“”‘`]+|["'“”‘`]+$/g, '').trim();
  return str;
}

/**
 * Parses raw text containing 1, 2, 3 or tier markers into separate items
 */
function extractTiersFromRaw(raw: string): { hook: string; subtitle: string; cta: string } | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 1. Line-by-line inspection (most common format from Gemini or copy-pastes)
  const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const isTier1 = (line: string) => /^(?:1[.:\)\-–—\/]|\[1\]|\(1\)|(?:tingkat|tier)\s*1\b|hook[:\-–—\s])/i.test(line);
  const isTier2 = (line: string) => /^(?:2[.:\)\-–—\/]|\[2\]|\(2\)|(?:tingkat|tier)\s*2\b|sub(?:title|-?judul)[:\-–—\s])/i.test(line);
  const isTier3 = (line: string) => /^(?:3[.:\)\-–—\/]|\[3\]|\(3\)|(?:tingkat|tier)\s*3\b|(?:cta\b|call\s*to\s*action)[:\-–—\s])/i.test(line);

  let h = '';
  let s = '';
  let c = '';
  let currentTier = 0;

  for (const line of lines) {
    if (isTier1(line)) {
      currentTier = 1;
      const cleaned = cleanTierText(line);
      h += (h ? ' ' : '') + cleaned;
    } else if (isTier2(line)) {
      currentTier = 2;
      const cleaned = cleanTierText(line);
      s += (s ? ' ' : '') + cleaned;
    } else if (isTier3(line)) {
      currentTier = 3;
      const cleaned = cleanTierText(line);
      c += (c ? ' ' : '') + cleaned;
    } else if (currentTier === 1) {
      h += ' ' + line;
    } else if (currentTier === 2) {
      s += ' ' + line;
    } else if (currentTier === 3) {
      c += ' ' + line;
    }
  }

  if (h && (s || c)) {
    return {
      hook: cleanTierText(h),
      subtitle: cleanTierText(s),
      cta: cleanTierText(c)
    };
  }

  // 2. Check inline numbering/markers if all on a single line
  const inlineHasTiers = (
    /(?:^|\s+)(?:1[.:\)\-–—\/]|\[1\]|\(1\)|(?:tingkat|tier)\s*1\b|hook[:\-–—])/i.test(trimmed) &&
    /(?:^|\s+)(?:2[.:\)\-–—\/]|\[2\]|\(2\)|(?:tingkat|tier)\s*2\b|sub(?:title|-?judul)[:\-–—])/i.test(trimmed)
  );

  if (inlineHasTiers) {
    const parts = trimmed.split(/(?=(?:^|\s+)(?:(?:[1-3][.:\)\-–—\/]|\[[1-3]\]|\([1-3]\)|(?:tingkat|tier)\s*[1-3]\b)|(?:hook|sub(?:title|-?judul)|cta|call\s*to\s*action)[:\-–—]))/i);
    let inlineH = '';
    let inlineS = '';
    let inlineC = '';

    for (const part of parts) {
      const p = part.trim();
      if (isTier1(p)) {
        inlineH = cleanTierText(p);
      } else if (isTier2(p)) {
        inlineS = cleanTierText(p);
      } else if (isTier3(p)) {
        inlineC = cleanTierText(p);
      }
    }

    if (inlineH && (inlineS || inlineC)) {
      return {
        hook: cleanTierText(inlineH),
        subtitle: cleanTierText(inlineS),
        cta: cleanTierText(inlineC)
      };
    }
  }

  // 3. Check if exactly 3 non-numbered lines exist
  if (lines.length >= 3) {
    return {
      hook: cleanTierText(lines[0]),
      subtitle: cleanTierText(lines.slice(1, lines.length - 1).join(' ')),
      cta: cleanTierText(lines[lines.length - 1])
    };
  }

  return null;
}

/**
 * Generates or extracts 3-tier Intro Hook Video (0–10 seconds):
 * 1) Hook — Kalimat pembuka yang langsung membuat audiens merasa relate
 * 2) Sub-judul — Penjelasan singkat isi video + manfaatnya
 * 3) Call to Action — Ajakan menonton sampai selesai untuk menyelesaikan masalah audiens
 */
export function getIntroHookTiers(pkg: ContentPackage): IntroHookTiers {
  if (!pkg) {
    return {
      hook: '',
      subtitle: '',
      cta: '',
      fullFormattedText: ''
    };
  }

  // 1. If explicitly present in package introHookDetails
  if (pkg.introHookDetails && typeof pkg.introHookDetails === 'object' && (pkg.introHookDetails.hook || pkg.introHookDetails.subtitle || pkg.introHookDetails.cta)) {
    const hook = cleanTierText(String(pkg.introHookDetails.hook || ''));
    const subtitle = cleanTierText(String(pkg.introHookDetails.subtitle || ''));
    const cta = cleanTierText(String(pkg.introHookDetails.cta || ''));
    if (hook || subtitle || cta) {
      const fullFormattedText = `1) Hook:\n${hook}\n\n2) Subtitle:\n${subtitle}\n\n3) Call to Action:\n${cta}`;
      return { hook, subtitle, cta, fullFormattedText };
    }
  }

  // 2. If pkg.introHook is an object with hook/subtitle/cta properties
  if (pkg.introHook && typeof pkg.introHook === 'object') {
    const obj = pkg.introHook as Record<string, any>;
    const hook = cleanTierText(String(obj.hook || obj['1'] || obj.intro || obj.title || ''));
    const subtitle = cleanTierText(String(obj.subtitle || obj['2'] || obj.sub || obj.description || ''));
    const cta = cleanTierText(String(obj.cta || obj['3'] || obj.callToAction || ''));
    if (hook || subtitle || cta) {
      const fullFormattedText = `1) Hook:\n${hook}\n\n2) Subtitle:\n${subtitle}\n\n3) Call to Action:\n${cta}`;
      return { hook, subtitle, cta, fullFormattedText };
    }
  }

  // 3. Guaranteed string extraction from raw string
  const raw = typeof pkg.introHook === 'string'
    ? pkg.introHook
    : (pkg.introHook ? String(pkg.introHook) : '');

  const extracted = extractTiersFromRaw(raw);

  // Tailored baseline texts for fallback if any tier is missing
  const categoryLower = (pkg.categoryName || '').toLowerCase();
  const genreLower = (pkg.subGenre || '').toLowerCase();
  const useCase = translateUseCaseToEnglish(pkg.useCase);
  const duration = translateDurationToEnglish(pkg.duration);
  const moodStr = pkg.moods && pkg.moods.length > 0 ? pkg.moods.join(', ') : 'Peaceful, Focused';

  let defaultHook = 'Struggling to silence the noise and focus on what truly matters right now?';
  let defaultSubtitle = `${duration} of immersive ${pkg.subGenre || 'instrumental'} music designed to help you concentrate deeply and reach effortless flow.`;
  let defaultCta = 'Put on your headphones, minimize distractions, and let this session carry you through until the work is done.';

  if (categoryLower.includes('sleep') || genreLower.includes('sleep') || moodStr.toLowerCase().includes('sleep')) {
    defaultHook = "Can't seem to turn off your racing thoughts as you try to fall asleep tonight?";
    defaultSubtitle = `Calming nocturnal soundscapes and gentle acoustic textures crafted to slow your heart rate and guide you into deep sleep.`;
    defaultCta = 'Dim your lights, close your eyes, and let this track play through the night for uninterrupted rest.';
  } else if (categoryLower.includes('stress') || categoryLower.includes('meditation') || moodStr.toLowerCase().includes('healing')) {
    defaultHook = 'Feeling exhausted, overwhelmed, and carrying the heavy mental weight of today?';
    defaultSubtitle = `Restorative ambient frequencies and soothing harmonies engineered to melt away tension and restore your inner calm.`;
    defaultCta = 'Take one slow, deep breath, drop your shoulders, and stay with this audio session to recenter yourself.';
  } else if (genreLower.includes('piano') || categoryLower.includes('piano')) {
    defaultHook = 'Looking for a quiet, gentle sanctuary to breathe and reset your mind?';
    defaultSubtitle = `Intimate solo piano melodies tuned to quiet the noise, accompany your creative thoughts, and bring stillness to your space.`;
    defaultCta = 'Make yourself a warm cup of coffee, sit back, and enjoy this peaceful journey from beginning to end.';
  } else if (genreLower.includes('lo-fi') || genreLower.includes('lofi') || genreLower.includes('chillhop')) {
    defaultHook = 'Having a hard time finding your rhythm and staying locked into your study session?';
    defaultSubtitle = `Laid-back lo-fi beats and cozy warm chords curated for long study hours, coding marathons, and creative work.`;
    defaultCta = 'Pop on your headphones, set your focus timer, and immerse yourself in uninterrupted flow state.';
  }

  let hook = '';
  let subtitle = '';
  let cta = '';

  if (extracted) {
    hook = extracted.hook || defaultHook;
    subtitle = extracted.subtitle || defaultSubtitle;
    cta = extracted.cta || defaultCta;
  } else if (raw.trim().length > 10) {
    // If raw doesn't have tiers, clean it and treat as single hook, then provide contextual subtitle & cta
    hook = cleanTierText(raw);
    subtitle = defaultSubtitle;
    cta = defaultCta;
  } else {
    hook = defaultHook;
    subtitle = defaultSubtitle;
    cta = defaultCta;
  }

  const fullFormattedText = `1) Hook:\n${hook}\n\n2) Subtitle:\n${subtitle}\n\n3) Call to Action:\n${cta}`;

  return { hook, subtitle, cta, fullFormattedText };
}
