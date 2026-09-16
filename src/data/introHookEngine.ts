import { ContentPackage } from '../types';

export interface IntroHookTiers {
  hook: string;
  subtitle: string;
  cta: string;
  fullFormattedText: string;
}

/**
 * Generates or extracts 3-tier Intro Hook Video (0–10 seconds):
 * 1) Hook — Kalimat pembuka yang langsung membuat audiens merasa relate
 * 2) Sub-judul — Penjelasan singkat isi video + manfaatnya
 * 3) Call to Action — Ajakan menonton sampai selesai untuk menyelesaikan masalah audiens
 */
export function getIntroHookTiers(pkg: ContentPackage): IntroHookTiers {
  // If explicitly present in package
  if (pkg.introHookDetails && pkg.introHookDetails.hook) {
    const { hook, subtitle, cta } = pkg.introHookDetails;
    const fullFormattedText = `1) Hook:\n${hook}\n\n2) Sub-judul:\n${subtitle}\n\n3) Call to Action:\n${cta}`;
    return { hook, subtitle, cta, fullFormattedText };
  }

  // Parse if raw introHook already contains 3 tiers or numbered lines
  const raw = pkg.introHook || '';
  if (raw.includes('1)') || raw.includes('Hook:') || raw.includes('1.')) {
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    let hook = '';
    let subtitle = '';
    let cta = '';

    for (const line of lines) {
      if (/^(1\)|1\.|Hook:)/i.test(line)) {
        hook = line.replace(/^(1\)|1\.|Hook:)\s*/i, '');
      } else if (/^(2\)|2\.|Sub-judul:|Subtitle:)/i.test(line)) {
        subtitle = line.replace(/^(2\)|2\.|Sub-judul:|Subtitle:)\s*/i, '');
      } else if (/^(3\)|3\.|Call to Action:|CTA:)/i.test(line)) {
        cta = line.replace(/^(3\)|3\.|Call to Action:|CTA:)\s*/i, '');
      }
    }

    if (hook && subtitle && cta) {
      const fullFormattedText = `1) Hook:\n${hook}\n\n2) Sub-judul:\n${subtitle}\n\n3) Call to Action:\n${cta}`;
      return { hook, subtitle, cta, fullFormattedText };
    }
  }

  // Build tailor-made 3 tiers based on category, genre, moods, useCase, duration
  const categoryLower = (pkg.categoryName || '').toLowerCase();
  const genreLower = (pkg.subGenre || '').toLowerCase();
  const useCase = pkg.useCase || 'Study & Deep Work';
  const duration = pkg.duration || '1 Hour';
  const moodStr = pkg.moods && pkg.moods.length > 0 ? pkg.moods.join(', ') : 'Peaceful, Focused';

  let hook = 'Struggling to silence the noise and focus on what truly matters right now?';
  let subtitle = `${duration} of immersive ${pkg.subGenre || 'instrumental'} music designed to help you concentrate deeply and reach effortless flow.`;
  let cta = 'Put on your headphones, minimize distractions, and let this session carry you through until the work is done.';

  if (categoryLower.includes('sleep') || genreLower.includes('sleep') || moodStr.toLowerCase().includes('sleep')) {
    hook = "Can't seem to turn off your racing thoughts as you try to fall asleep tonight?";
    subtitle = `Calming nocturnal soundscapes and gentle acoustic textures crafted to slow your heart rate and guide you into deep sleep.`;
    cta = 'Dim your lights, close your eyes, and let this track play through the night for uninterrupted rest.';
  } else if (categoryLower.includes('stress') || categoryLower.includes('meditation') || moodStr.toLowerCase().includes('healing')) {
    hook = 'Feeling exhausted, overwhelmed, and carrying the heavy mental weight of today?';
    subtitle = `Restorative ambient frequencies and soothing harmonies engineered to melt away tension and restore your inner calm.`;
    cta = 'Take one slow, deep breath, drop your shoulders, and stay with this audio session to recenter yourself.';
  } else if (genreLower.includes('piano') || categoryLower.includes('piano')) {
    hook = 'Looking for a quiet, gentle sanctuary to breathe and reset your mind?';
    subtitle = `Intimate solo piano melodies tuned to quiet the noise, accompany your creative thoughts, and bring stillness to your space.`;
    cta = 'Make yourself a warm cup of coffee, sit back, and enjoy this peaceful journey from beginning to end.';
  } else if (genreLower.includes('lo-fi') || genreLower.includes('lofi') || genreLower.includes('chillhop')) {
    hook = 'Having a hard time finding your rhythm and staying locked into your study session?';
    subtitle = `Laid-back lo-fi beats and cozy warm chords curated for long study hours, coding marathons, and creative work.`;
    cta = 'Pop on your headphones, set your focus timer, and immerse yourself in uninterrupted flow state.';
  } else if (raw.trim().length > 10) {
    // If there is existing raw hook text, use it as hook, and derive suitable subtitle and cta
    hook = raw.replace(/^["']|["']$/g, '').trim();
    subtitle = `Specially crafted ${duration} ${pkg.subGenre || 'instrumental'} session tailored for ${useCase}.`;
    cta = 'Put on your headphones and let this complete musical session help you achieve peak calm and focus.';
  }

  const fullFormattedText = `1) Hook:\n${hook}\n\n2) Sub-judul:\n${subtitle}\n\n3) Call to Action:\n${cta}`;

  return { hook, subtitle, cta, fullFormattedText };
}
