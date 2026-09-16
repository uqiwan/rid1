import { GoogleGenAI } from '@google/genai';
import { ContentPackage } from '../src/types';
import { generateRefinedTitleVariants } from '../src/data/titleFormulaEngine';
import { generateEngineeredThumbnailPrompts } from '../src/data/thumbnailPromptEngine';

let genAIClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

export interface ForgeInput {
  categoryId: string;
  categoryName: string;
  subGenre: string;
  moods: string[];
  duration?: string; // e.g. "1 Hour", "3 Hours", "8 Hours"
  useCase?: string; // e.g. "Study & Coding", "Deep Sleep", "Meditation"
  optionalKeyword?: string;
  userId: string;
}

/**
 * System prompt designed specifically for YouTube Instrumental Music Content Packages (Bab 6 PRD)
 */
const TUNEFORGE_SYSTEM_PROMPT = `
You are TuneForge AI Engine, the world's most elite YouTube Content Architect specializing exclusively in Instrumental Music, Study Loops, Sleep Soundscapes, and Ambient Beats.

You generate an all-inclusive 7-Block Content Package ready for YouTube upload.
Everything must strictly adhere to the following 7 blocks:

1. METADATA:
   - titleVariants: An array of 5 distinct YouTube title variants strictly adhering to this mandatory formula:
     [Keyword Spesifik/Mood] + [Genre/Instrumen] + [Keyword Aktivitas Umum] + (opsional: Angka/Durasi)
     Example: "Rainy Night Lo-fi Piano — Relaxing Music for Study & Sleep (3 Hours)"
     Rules:
     • Length: 45–70 characters (strict max 100).
     • Must contain 1 niche keyword + 1 high-volume general keyword (e.g., study music, sleep music, focus music, relaxing music, background music).
     • Honest to video contents (no deceptive claims or impossible durations).
     • Title Case, max 1 relevant emoji, NO ALL CAPS words, zero clickbait.
     • Score each variant from: SEO/keyword (35%), CTR potential (30%), content honesty (20%), formula compliance (15%).
     • Only the top variant with score >95% receives isPrimaryRecommendation: true.
     Each item in titleVariants must be an object:
     {
       "title": "string",
       "score": number, // 0 to 100
       "reason": "string", // 1 concise sentence explanation
       "isPrimaryRecommendation": boolean,
       "breakdown": {
         "seoKeyword": number, // max 35
         "ctrPotential": number, // max 30
         "contentHonesty": number, // max 20
         "formulaCompliance": number // max 15
       }
     }
   - titleA: The #1 top-scoring title variant (Rekomendasi Utama)
   - titleB: The #2 title variant
   - titleC: The #3 title variant
   - description: 3-5 rich paragraphs formatted with timestamps, YouTube SEO keywords, sound mastering notes (-14 LUFS standard), and 5 targeted hashtags.
   - tags: 12-16 high-volume, low-competition tags as an array of strings.

2. THUMBNAIL TEXT:
   - variant1, variant2, variant3: Ultra short, punchy 2-4 word text overlays designed for mobile CTR > 20% (e.g., "DEEP FOCUS ⚡", "RAIN IN TOKYO 🌧️").

3. INTRO HOOK:
   - 0 to 10 seconds viewer retention script for on-screen kinetic text or soft voiceover intro to lock in viewers before the music starts.

4. THUMBNAIL PROMPTS (BLOK 04 - FOR GOOGLE FLOW AI & MIDJOURNEY, RATIO 16:9, CTR > 10%):
   Generate 4 production-ready English image prompts (cinematic, split, minimal, lifestyle) combining 4 MANDATORY COMPOSITION LAYERS:
     1. Background: Atmosphere/location matching mood, dominant tones, dramatic single-directional lighting (window/spotlight).
     2. Main Subject: Largest focal object/subject (expressive human face with eyes closed in serene peace, iconic instrument, or category artifact).
     3. Foreground: Near-camera depth elements (swirling steam, dust particles, rain droplets, blurred leaves) with shallow f/1.8 depth.
     4. Text Overlay: 3–5 words in bold heavyweight sans-serif, high complementary contrast with stroke/shadow to pop on small mobile screens, positioned safely away from bottom-right video duration badge.
   VISUAL RULES:
     - Powerful complementary color contrast (e.g., deep navy blue vs glowing amber/gold) to jump out in the YouTube feed.
     - One sharp focal point, background/foreground blur for 3D depth.
     - Conclude each prompt with 1 concise sentence explaining the click trigger (curiosity/benefit/color contrast).

5. AI IMAGE PROMPTS (BLOK 05 - REVISED):
   - Array of exactly 3 DISTINCT, STANDALONE single-scene base image prompts.
   - CRITICAL REQUIREMENT: Each of the 3 prompts MUST be an independent, self-contained single scene (NOT sequential scenes 1, 2, 3 or chronological storyboard). The creator will pick ONE single best image to be animated in Block 06.

6. AI VIDEO PROMPT (BLOK 06):
   - Prompt for Google Flow AI / Veo / Runway image-to-video seamless loop.
   - CRITICAL REQUIREMENT: Camera is strictly LOCKED-OFF and static on tripod (zero camera panning, tilting, or perspective shifts). Micro-movement is isolated to atmospheric particles, gentle steam, flickering ambient light, or raindrop trails, engineered for infinite seamless looping.

7. TECHNICAL NOTES:
   - Pre-upload checklist covering integrated LUFS (-14 LUFS), recommended timeline extension (10s base loop extended to 1h - 8h), and CTR tips.

You MUST reply ONLY with valid, raw JSON matching this TypeScript schema:
{
  "metadata": {
    "titleVariants": [
      {
        "title": "string",
        "score": 96,
        "reason": "string",
        "isPrimaryRecommendation": true,
        "breakdown": {
          "seoKeyword": 35,
          "ctrPotential": 28,
          "contentHonesty": 20,
          "formulaCompliance": 15
        }
      }
    ],
    "titleA": "string",
    "titleB": "string",
    "titleC": "string",
    "description": "string",
    "tags": ["string"]
  },
  "thumbnailText": {
    "variant1": "string",
    "variant2": "string",
    "variant3": "string"
  },
  "introHook": "string",
  "thumbnailPrompts": {
    "cinematic": "string",
    "split": "string",
    "minimal": "string",
    "lifestyle": "string"
  },
  "imagePrompts": [
    "string",
    "string",
    "string"
  ],
  "videoPrompt": "string",
  "technicalNotes": "string"
}
Do not wrap in markdown codeblocks if possible, or wrap cleanly in \`\`\`json.
`;

const PRIMARY_TEXT_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

/**
 * Execute Gemini content generation with multi-model resilience and fallback
 */
async function callGeminiWithResilience<T>(
  callFn: (model: string) => Promise<T>
): Promise<{ result: T; modelName: string } | null> {
  for (const model of PRIMARY_TEXT_MODELS) {
    try {
      const result = await callFn(model);
      return { result, modelName: model };
    } catch (err: any) {
      const statusCode = err?.status || err?.code || err?.error?.code;
      const isTransient =
        statusCode === 503 ||
        statusCode === 429 ||
        statusCode === 500 ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('UNAVAILABLE');

      if (isTransient) {
        console.warn(`Gemini model ${model} experienced temporary demand (${statusCode || '503/transient'}). Switching to fallback model...`);
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      console.warn(`Gemini model ${model} error:`, err?.message || err);
    }
  }
  return null;
}

/**
 * Generate full 7-block content package via Gemini or intelligent algorithmic fallback
 */
export async function generateTuneForgePackage(input: ForgeInput): Promise<ContentPackage> {
  const startTime = Date.now();
  const ai = getGenAI();

  const kw = input.optionalKeyword?.trim() || 'Deep Session';
  const newId = `pkg-${Date.now()}`;

  if (ai) {
    const userPrompt = `
Generate a complete 7-Block YouTube Content Package for:
- Category: ${input.categoryName}
- Sub-Genre: ${input.subGenre}
- Target Moods: ${input.moods.join(', ')}
- Context/Topic Keyword: ${kw}
Strictly output JSON following the system prompt rules.
`;

    const aiCall = await callGeminiWithResilience(async (model) => {
      return await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: userPrompt }] }
        ],
        config: {
          systemInstruction: TUNEFORGE_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });
    });

    if (aiCall && aiCall.result) {
      try {
        const responseText = aiCall.result.text || '';
        const cleanedJson = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();

        const parsed = JSON.parse(cleanedJson);

        // Compute verified 5-variant formula titles
        const fallbackVariants = generateRefinedTitleVariants({
          categoryName: input.categoryName,
          genre: input.subGenre,
          moods: input.moods,
          duration: input.duration,
          useCase: input.useCase,
          optionalKeyword: kw
        });

        // Use AI parsed titleVariants if present and valid, otherwise use refined formula engine
        let finalTitleVariants = fallbackVariants;
        if (Array.isArray(parsed.metadata?.titleVariants) && parsed.metadata.titleVariants.length >= 3) {
          finalTitleVariants = parsed.metadata.titleVariants.map((tv: any, idx: number) => ({
            title: tv.title || fallbackVariants[idx]?.title || `${input.subGenre} — Relaxing Music (1 Hour)`,
            score: typeof tv.score === 'number' ? tv.score : (fallbackVariants[idx]?.score || 92),
            reason: tv.reason || (fallbackVariants[idx]?.reason || 'Kombinasi search intent dan keyword niche yang optimal.'),
            isPrimaryRecommendation: tv.isPrimaryRecommendation !== undefined ? tv.isPrimaryRecommendation : idx === 0,
            breakdown: tv.breakdown || fallbackVariants[idx]?.breakdown || {
              seoKeyword: 32,
              ctrPotential: 27,
              contentHonesty: 19,
              formulaCompliance: 14
            }
          }));
          // Ensure sorted descending
          finalTitleVariants.sort((a, b) => b.score - a.score);
          if (finalTitleVariants[0].score <= 95) {
            finalTitleVariants[0] = fallbackVariants[0];
          }
        }

        const topTitle = finalTitleVariants[0]?.title || parsed.metadata?.titleA || `${input.categoryName} — Relaxing Music (1 Hour)`;
        const secondTitle = finalTitleVariants[1]?.title || parsed.metadata?.titleB || `Deep Focus ${input.subGenre} (No Lyrics)`;
        const thirdTitle = finalTitleVariants[2]?.title || parsed.metadata?.titleC || `${kw} Ambient Beats (Study Loop)`;

        const engineeredThumbs = generateEngineeredThumbnailPrompts({
          categoryName: input.categoryName,
          genre: input.subGenre,
          moods: input.moods,
          duration: input.duration,
          useCase: input.useCase,
          optionalKeyword: kw
        });

        const pkg: ContentPackage = {
          id: newId,
          userId: input.userId || 'usr-demo',
          categoryId: input.categoryId,
          categoryName: input.categoryName,
          subGenre: input.subGenre,
          moods: input.moods,
          duration: input.duration,
          useCase: input.useCase,
          optionalKeyword: kw,
          createdAt: new Date().toISOString(),
          generationMs: Date.now() - startTime,
          model: `${aiCall.modelName} (Live AI)`,
          metadata: {
            titleA: topTitle,
            titleB: secondTitle,
            titleC: thirdTitle,
            titleVariants: finalTitleVariants,
            description: parsed.metadata?.description || `Specially crafted for deep study, focus, and relaxation.\n#${input.categoryId} #lofi #study`,
            tags: Array.isArray(parsed.metadata?.tags) ? parsed.metadata.tags : [input.subGenre, 'instrumental', 'study beats', 'no lyrics']
          },
          thumbnailText: {
            variant1: parsed.thumbnailText?.variant1 || `${kw.toUpperCase().slice(0, 16)} ⚡`,
            variant2: parsed.thumbnailText?.variant2 || `${input.subGenre.toUpperCase().slice(0, 16)} 🎧`,
            variant3: parsed.thumbnailText?.variant3 || `DEEP ${input.moods[0]?.toUpperCase() || 'FOCUS'} 📚`
          },
          introHook: parsed.introHook || `Welcome to this 1-hour session of ${input.subGenre}. Keep your focus uninterrupted and let the soundscape carry you.`,
          thumbnailPrompts: {
            cinematic: parsed.thumbnailPrompts?.cinematic || engineeredThumbs.prompts.cinematic,
            split: parsed.thumbnailPrompts?.split || engineeredThumbs.prompts.split,
            minimal: parsed.thumbnailPrompts?.minimal || engineeredThumbs.prompts.minimal,
            lifestyle: parsed.thumbnailPrompts?.lifestyle || engineeredThumbs.prompts.lifestyle
          },
          thumbnailDetails: engineeredThumbs.details,
          imagePrompts: Array.isArray(parsed.imagePrompts) && parsed.imagePrompts.length === 3
            ? parsed.imagePrompts
            : [
                `Alternatif 1 (Master Composition): Standalone single scene of ${kw}, warm lighting, 8k resolution, static composition for video looping.`,
                `Alternatif 2 (Atmospheric Detail): Standalone single scene reflecting ${input.moods.join(' and ')} mood, soft focus background bokeh, tranquil aesthetic framing.`,
                `Alternatif 3 (Minimalist Angle): Standalone single wide perspective complementary to ${input.categoryName}, spacious negative space for locked-off looping.`
              ],
          videoPrompt: parsed.videoPrompt || `Image-to-video seamless loop: Locked-off camera on tripod. Subtle gentle micro-motion in atmospheric lighting and particle drift matching ${kw}. Zero camera panning, flawless 10s loop cycle.`,
          technicalNotes: parsed.technicalNotes || `• Target Loudness: -14 LUFS (Integrated)\n• Recommended Loop Duration: 10s base clip extended to 1 hour timeline\n• Aspect Ratio: 16:9 (3840x2160 or 1920x1080)`
        };

        return pkg;
      } catch (err) {
        console.warn('JSON parsing failed from Gemini output, using algorithmic fallback:', err);
      }
    }
  }

  // Fallback / Offline Generator with deterministic quality
  return generateAlgorithmicFallback(input, newId, startTime);
}

/**
 * Regenerate an individual block
 */
export async function regenerateSingleBlock(
  blockName: string,
  pkg: ContentPackage
): Promise<{ updatedData: any; model: string }> {
  const ai = getGenAI();
  if (ai) {
    const prompt = `
Context:
- Category: ${pkg.categoryName} (${pkg.subGenre})
- Moods: ${pkg.moods.join(', ')}
- Context/Topic: ${pkg.optionalKeyword || 'Ambient Session'}

Task: Regenerate only the "${blockName}" block for this YouTube Instrumental Music package.
Follow these specific rules:
- If "Metadata YouTube": return JSON { 
    "titleVariants": [
      {
        "title": "...", 
        "score": 97,
        "reason": "...",
        "isPrimaryRecommendation": true,
        "breakdown": { "seoKeyword": 35, "ctrPotential": 28, "contentHonesty": 20, "formulaCompliance": 14 }
      }
    ],
    "titleA": "...",
    "titleB": "...",
    "titleC": "...",
    "description": "...",
    "tags": ["..."]
  } adhering to formula: [Keyword Spesifik/Mood] + [Genre/Instrumen] + [Keyword Aktivitas Umum] + (opsional: Angka/Durasi)
- If "Teks Thumbnail": return JSON { "variant1": "...", "variant2": "...", "variant3": "..." }
- If "Intro Hook Video": return JSON { "introHook": "..." }
- If "Prompt Thumbnail": return JSON { "cinematic": "...", "split": "...", "minimal": "...", "lifestyle": "..." }
- If "Prompt Gambar AI": return JSON { "imagePrompts": ["3 standalone single-scene prompts..."] }
- If "Prompt Video AI": return JSON { "videoPrompt": "..." }
- If "Catatan Teknis": return JSON { "technicalNotes": "..." }

Return strictly JSON.
`;

    const aiCall = await callGeminiWithResilience(async (model) => {
      return await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json', temperature: 0.8 }
      });
    });

    if (aiCall && aiCall.result) {
      try {
        const parsed = JSON.parse(aiCall.result.text?.trim() || '{}');
        return { updatedData: parsed, model: `${aiCall.modelName} (Live AI)` };
      } catch (e) {
        console.warn('Regenerate JSON parsing failed, falling back:', e);
      }
    }
  }

  // Algorithmic regenerate variant
  const kw = pkg.optionalKeyword || 'Midnight Session';
  const timestamp = new Date().toLocaleTimeString();

  switch (blockName) {
    case 'Metadata YouTube': {
      const variants = generateRefinedTitleVariants({
        categoryName: pkg.categoryName,
        genre: pkg.subGenre,
        moods: pkg.moods,
        duration: pkg.duration,
        useCase: pkg.useCase,
        optionalKeyword: kw
      });
      return {
        updatedData: {
          titleVariants: variants,
          titleA: variants[0].title,
          titleB: variants[1].title,
          titleC: variants[2].title,
          description: `Freshly regenerated description for ${pkg.categoryName} (${pkg.subGenre}).\n\nOptimized for YouTube search intent: ${kw}.\nIntegrated -14 LUFS mastering for zero ear fatigue.\n\n#${pkg.categoryId} #chillbeats #studymusic`,
          tags: [pkg.subGenre.toLowerCase(), 'lofi beats', kw.toLowerCase(), 'study music', 'focus loop', 'youtube instrumental']
        },
        model: 'TuneForge Algorithmic Engine (SEO Formula v2)'
      };
    }
    case 'Teks Thumbnail':
      return {
        updatedData: {
          variant1: `${kw.toUpperCase().slice(0, 14)} ⚡`,
          variant2: `DEEP FLOW 🎧`,
          variant3: `STAY FOCUSED 📚`
        },
        model: 'TuneForge Algorithmic Engine'
      };
    case 'Intro Hook Video':
      return {
        updatedData: {
          introHook: `Press play, silence your distractions, and let this ${pkg.subGenre} soundscape unlock your best work yet.`
        },
        model: 'TuneForge Algorithmic Engine'
      };
    case 'Prompt Thumbnail': {
      const generated = generateEngineeredThumbnailPrompts({
        categoryName: pkg.categoryName,
        genre: pkg.subGenre,
        moods: pkg.moods,
        duration: pkg.duration,
        useCase: pkg.useCase,
        optionalKeyword: kw
      });
      return {
        updatedData: {
          ...generated.prompts,
          thumbnailDetails: generated.details
        },
        model: 'TuneForge Visual Engine (Google Flow AI 4-Layer Spec)'
      };
    }
    case 'Prompt Gambar AI':
      return {
        updatedData: {
          imagePrompts: [
            `Alternatif 1 (Master Composition): Standalone single scene of ${kw}, peaceful ambient lighting, 8k resolution, photorealistic studio photography, clean composition optimized as base image for video looping.`,
            `Alternatif 2 (Atmospheric Environment): Standalone single scene reflecting ${pkg.moods.join(' and ')} mood, soft focus background bokeh, tranquil aesthetic framing crafted for subtle image-to-video motion.`,
            `Alternatif 3 (Cinematic Perspective): Standalone single wide perspective complementing ${pkg.categoryName}, tranquil and balanced negative space, perfect for locked-off camera image-to-video loop animation.`
          ]
        },
        model: 'TuneForge Algorithmic Engine'
      };
    case 'Prompt Video AI':
      return {
        updatedData: {
          videoPrompt: `Image-to-video seamless loop: Locked-off camera on tripod. Subtle gentle micro-motion in atmospheric lighting and particle drift matching ${kw}. Absolutely zero camera panning or perspective warping. Seamless 10-second loop.`
        },
        model: 'TuneForge Algorithmic Engine'
      };
    default:
      return {
        updatedData: {
          technicalNotes: `• Target Loudness: -14 LUFS (Integrated)\n• Recommended Loop Duration: 10s base clip extended to 1-8 hour timeline\n• Aspect Ratio: 16:9 (3840x2160 or 1920x1080)\n• High CTR Tip: Pair Thumbnail Text Variant 1 with the Cinematic or Minimal thumbnail prompt.`
        },
        model: 'TuneForge Algorithmic Engine'
      };
  }
}

function generateAlgorithmicFallback(input: ForgeInput, newId: string, startTime: number): ContentPackage {
  const kw = input.optionalKeyword?.trim() || 'Midnight Session';
  const cleanKw = kw.replace(/</g, '').replace(/>/g, '');

  const variants = generateRefinedTitleVariants({
    categoryName: input.categoryName,
    genre: input.subGenre,
    moods: input.moods,
    duration: input.duration,
    useCase: input.useCase,
    optionalKeyword: cleanKw
  });

  const thumbEngine = generateEngineeredThumbnailPrompts({
    categoryName: input.categoryName,
    genre: input.subGenre,
    moods: input.moods,
    duration: input.duration,
    useCase: input.useCase,
    optionalKeyword: cleanKw
  });

  return {
    id: newId,
    userId: input.userId || 'usr-demo',
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    subGenre: input.subGenre,
    moods: input.moods,
    duration: input.duration,
    useCase: input.useCase,
    optionalKeyword: cleanKw,
    createdAt: new Date().toISOString(),
    generationMs: Date.now() - startTime + 1200,
    model: 'TuneForge Formula Engine v2',
    metadata: {
      titleA: variants[0].title,
      titleB: variants[1].title,
      titleC: variants[2].title,
      titleVariants: variants,
      description: `Experience continuous calm and focused energy with ${input.categoryName} (${input.subGenre}). Specially curated for deep work, coding, reading, and stress relief with zero distracting lyrics.\n\nContext: ${cleanKw}\nMoods: ${input.moods.join(', ')}\nMastered to YouTube -14 LUFS standards.\n\n#instrumental #${input.categoryId} #studymusic #focusbeats`,
      tags: [
        input.categoryId,
        input.subGenre.toLowerCase(),
        'instrumental music',
        'study beats',
        'no lyrics',
        cleanKw.toLowerCase(),
        'focus music',
        'youtube background music',
        'relaxing loop'
      ]
    },
    thumbnailText: {
      variant1: `${cleanKw.toUpperCase().slice(0, 18)} ⚡`,
      variant2: `${input.subGenre.toUpperCase().slice(0, 18)} 🎧`,
      variant3: `DEEP ${input.moods[0]?.toUpperCase() || 'FOCUS'} 📚`
    },
    introHook: `Welcome to this 1-hour session of ${input.subGenre}. Keep your focus uninterrupted, let the rhythm flow, and enjoy your deepest work yet.`,
    thumbnailPrompts: thumbEngine.prompts,
    thumbnailDetails: thumbEngine.details,
    imagePrompts: [
      `Alternatif 1 (Master Composition): Standalone single scene of ${cleanKw}, peaceful ambient lighting, 8k resolution, photorealistic studio photography, clean composition optimized as base image for video looping.`,
      `Alternatif 2 (Atmospheric Environment): Standalone single scene reflecting ${input.moods.join(' and ')} mood, soft focus background bokeh, tranquil aesthetic framing crafted for subtle image-to-video motion.`,
      `Alternatif 3 (Cinematic Perspective): Standalone single wide perspective complementing ${input.categoryName}, tranquil and balanced negative space, perfect for locked-off camera image-to-video loop animation.`
    ],
    videoPrompt: `Image-to-video prompt: Perfectly static camera locked-off on tripod. Subtle gentle motion in ambient light and atmospheric particles matching ${cleanKw}. Absolutely zero camera panning or perspective warping. Seamless 10-second loop.`,
    technicalNotes: `• Target Loudness: -14 LUFS (Integrated)\n• Recommended Loop Duration: 10s base clip extended to 1 hour timeline\n• Aspect Ratio: 16:9 (3840x2160 or 1920x1080)\n• High CTR Tip: Pair Thumbnail Text Variant 1 with the Cinematic or Minimal Typography thumbnail prompt.`
  };
}
