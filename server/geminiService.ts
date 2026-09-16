import { GoogleGenAI } from '@google/genai';
import { ContentPackage } from '../src/types';
import { generateRefinedTitleVariants } from '../src/data/titleFormulaEngine';
import { generateEngineeredThumbnailPrompts } from '../src/data/thumbnailPromptEngine';
import { generateGoogleFlowPrompts } from '../src/data/googleFlowEngine';
import { 
  translateDurationToEnglish, 
  translateUseCaseToEnglish, 
  translateKeywordToEnglish 
} from '../src/utils/languageTranslator';

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
  preferredThumbnailStyle?: 'all' | 'cinematic' | 'split' | 'minimal' | 'lifestyle';
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

CRITICAL LANGUAGE DIRECTIVE:
ALL generated output text — without exception — MUST be written in 100% natural, fluent, professional English (US).
This includes:
- All YouTube titles, variants, labels, and scoring reasons
- Video description, SEO timestamps, tags, and hashtags
- Thumbnail text overlay variants
- Intro Hook Video (1: Hook, 2: Subtitle, 3: Call to Action)
- All Thumbnail prompts (cinematic, split, minimal, lifestyle), composition layers, and click trigger reasons
- Google Flow base image prompt and video prompt
- Technical notes and audio mastering checklist
NEVER output Indonesian or any other language inside any field of the JSON. Every single text value must be in pure English (US).

You generate an all-inclusive 7-Block Content Package ready for YouTube upload.
Everything must strictly adhere to the following 7 blocks:

1. METADATA:
   - titleVariants: An array of 5 distinct YouTube title variants strictly adhering to this mandatory formula:
     [Specific Keyword/Mood] + [Genre/Instrument] + [General Activity Keyword] + (optional: Number/Duration)
     Example: "Rainy Night Lo-fi Piano — Relaxing Music for Study & Sleep (3 Hours)"
     Rules:
     • Length: 45–70 characters (strict max 100).
     • Must contain 1 niche keyword + 1 high-volume general keyword (e.g., study music, sleep music, focus music, relaxing music, background music).
     • Honest to video contents (no deceptive claims or impossible durations).
     • Title Case, max 1 relevant emoji, NO ALL CAPS words, zero clickbait.
     • Score each variant from: SEO/keyword (35%), CTR potential (30%), content honesty (20%), formula compliance (15%).
     • Only the top variant with score >95% receives isPrimaryRecommendation: true.
     • Reason MUST be written in English (US).
     Each item in titleVariants must be an object:
     {
       "title": "string",
       "score": number, // 0 to 100
       "reason": "string", // 1 concise sentence explanation in English (US)
       "isPrimaryRecommendation": boolean,
       "breakdown": {
         "seoKeyword": number, // max 35
         "ctrPotential": number, // max 30
         "contentHonesty": number, // max 20
         "formulaCompliance": number // max 15
       }
     }
   - titleA: Primary Recommendation (highest scoring variant > 95)
   - titleB: Alternative Recommendation 1
   - titleC: Alternative Recommendation 2
   - description: 3-5 rich paragraphs in English (US) formatted with timestamps, YouTube SEO keywords, sound mastering notes (-14 LUFS standard), and 5 targeted hashtags.
   - tags: 12-16 high-volume, low-competition tags as an array of English strings.

2. THUMBNAIL TEXT:
   - variant1, variant2, variant3: Ultra short, punchy 2-4 word English text overlays designed for mobile CTR > 20% (e.g., "DEEP FOCUS ⚡", "RAIN IN TOKYO 🌧️").

3. INTRO HOOK (0-10 SECONDS):
   - 3-tier structure in English (US) ready to paste into video editing software:
     1) Hook: opening sentence that makes viewers instantly relate.
     2) Subtitle: concise summary of what this session provides and its immediate benefit.
     3) Call to Action: invitation to listen until the end to achieve their focus/sleep goal.

4. THUMBNAIL PROMPTS (BLOCK 04 - AI IMAGE GENERATOR READY, TARGET CTR >20%):
   Generate 4 production-ready English image prompts (cinematic, split, minimal, lifestyle) in 16:9 ratio.
   
   4 MANDATORY COMPOSITION LAYERS PER PROMPT:
     1. Background: Setting/atmosphere matching mood, dominant complementary color, dramatic single-directional lighting (window beam / stage spotlight / warm lantern cone).
     2. Main Subject: Largest sharp focal subject (expressive human face with eyes closed in serene peace, iconic instrument, or category artifact).
     3. Foreground: Near-camera depth elements (swirling steam, floating dust particles, rain droplets, blurred leaves) with f/1.8 shallow depth of field.
     4. Text Overlay: 3–5 words in bold heavyweight sans-serif typography, high complementary contrast with stroke/shadow to pop on small mobile smartphone screens, positioned safely away from bottom-right video duration badge (top-left or upper-third).

   VISUAL RULES:
     - Powerful complementary color contrast (e.g., Midnight Navy Blue vs Radiant Amber Gold, Obsidian Black vs Blazing White-Cyan) to jump out immediately in YouTube feeds.
     - Single sharp focal subject with cinematic background & foreground depth blur.
     - Dramatic single-directional lighting.
     - Authentic emotional expression if a human figure is featured (genuine calm, deep focus, serene relief).
     - Consistent category-specific color palette and aesthetic style.

   OUTPUT:
     - 4 variants: Cinematic, Split, Minimal Typography, Emotional Lifestyle.
     - All in English (US), ready to render for AI image generators (Midjourney, Flux, Imagen, Google Flow AI).
     - 16:9 aspect ratio (--ar 16:9).
     - Seamlessly combine the 4 composition layers + text overlay.
     - MUST CONCLUDE EACH VARIANT WITH 1 CONCISE SENTENCE IN ENGLISH EXPLAINING THE CLICK TRIGGER REASON (curiosity gap, color contrast, or instant benefit promise for CTR >20%).

5. AI IMAGE PROMPT - GOOGLE FLOW BASE IMAGE (BLOCK 05):
   - ONLY 1 BEST IMAGE PROMPT (Single standalone base image prompt, detailed, in English).
   - Targeted specifically at US / Tier-1 instrumental music audience.
   - MUST contain 4 MANDATORY DETAILED LAYERS:
     1. Background: specific location, time of day, weather, color palette harmonizing with the mood.
     2. Main subject: category's iconic instrument / primary object, razor-sharp focus (f/1.8).
     3. Foreground: depth elements (delicate steam/smoke, water droplets on window glass, floating light motes, foliage).
     4. Lighting & color grading: rich cinematic contrast, dramatic single-directional lighting (chiaroscuro / warm tungsten / golden hour).
   - MUST CLOSE WITH THE EXACT PHRASE: "photorealistic / cinematic detail, aspect ratio 16:9".

6. AI VIDEO PROMPT - GOOGLE FLOW IMAGE-TO-VIDEO LOOP (BLOCK 06):
   - Derivative directly from the Base Image prompt in Block 05.
   - Mandatory locked-off static camera: "Locked-off tripod camera (strictly no panning, no tilting, no zoom, no camera movement, no cuts)."
   - Minimum 2 subtle cyclical motions relevant to scene (e.g., steam curling and dissolving from coffee, raindrops or dew sliding down glass, dust motes drifting across light beams, sheer curtains swaying, subtle light flicker/refraction).
   - Perfect 10-second seamless loop without jump-cut: "Continuous seamless 10-second loop cycle with identical start and end frames, zero jump-cuts, zero morphing artifacts."
   - Written with extreme specificity in English.

7. TECHNICAL NOTES:
   - Pre-upload checklist in English covering integrated LUFS (-14 LUFS), recommended timeline extension (10s base loop extended to 1h - 8h), and CTR tips.

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
    "string"
  ],
  "videoPrompt": "string",
  "technicalNotes": "string"
}
Do not wrap in markdown codeblocks if possible, or wrap cleanly in \`\`\`json.
`;

const PRIMARY_TEXT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash'
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

  const translatedDuration = translateDurationToEnglish(input.duration);
  const translatedUseCase = translateUseCaseToEnglish(input.useCase);
  const translatedKw = translateKeywordToEnglish(input.optionalKeyword);
  const kw = translatedKw || 'Deep Session';
  const newId = `pkg-${Date.now()}`;

  if (ai) {
    const userPrompt = `
Generate a complete 7-Block YouTube Content Package for:
- Category: ${input.categoryName}
- Sub-Genre: ${input.subGenre}
- Target Moods: ${input.moods.join(', ')}
- Video Duration: ${translatedDuration}
- Viewer Activity / Use Case: ${translatedUseCase}
- Context/Topic Keyword: ${kw}

CRITICAL MANDATORY INSTRUCTION (100% US ENGLISH ONLY):
- ALL output text fields (YouTube titles, descriptions, tags, thumbnail overlay text variants, intro hook, Midjourney prompts, and Google Flow video prompts) MUST BE WRITTEN IN 100% US ENGLISH.
- Even if the user provided inputs in Indonesian (e.g. "${input.duration || ''}", "${input.useCase || ''}", "${input.optionalKeyword || ''}"), YOU MUST TRANSLATE and CONVERT all concepts, activities, durations, and moods into fluent, high-CTR US English.
- Under NO circumstances may any Indonesian word appear in the JSON output.

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
            reason: tv.reason || (fallbackVariants[idx]?.reason || 'Optimal combination of specific search intent and high-volume niche keywords.'),
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
          preferredStyle: input.preferredThumbnailStyle,
          duration: input.duration,
          useCase: input.useCase,
          optionalKeyword: kw
        });

        const flowFallback = generateGoogleFlowPrompts({
          categoryName: input.categoryName,
          genre: input.subGenre,
          moods: input.moods,
          optionalKeyword: kw,
          variationIndex: 0
        });

        const bestImagePrompt = (Array.isArray(parsed.imagePrompts) && parsed.imagePrompts.length > 0 && typeof parsed.imagePrompts[0] === 'string' && parsed.imagePrompts[0].trim().length > 10)
          ? parsed.imagePrompts[0].trim()
          : flowFallback.imagePrompt;

        const resolvedVideoPrompt = (typeof parsed.videoPrompt === 'string' && parsed.videoPrompt.trim().length > 10)
          ? parsed.videoPrompt.trim()
          : flowFallback.videoPrompt;

        const pkg: ContentPackage = {
          id: newId,
          userId: input.userId || 'usr-demo',
          categoryId: input.categoryId,
          categoryName: input.categoryName,
          subGenre: input.subGenre,
          moods: input.moods,
          preferredThumbnailStyle: input.preferredThumbnailStyle || 'all',
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
          imagePrompts: [bestImagePrompt],
          videoPrompt: resolvedVideoPrompt,
          googleFlowDetails: flowFallback,
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
- If "Prompt Gambar AI": return JSON { "imagePrompts": ["1 best standalone single-scene image prompt in English with 4 layers (Background, Main subject, Foreground, Lighting) closing with 'photorealistic / cinematic detail, aspect ratio 16:9'"] }
- If "Prompt Video AI": return JSON { "videoPrompt": "Locked-off tripod camera (strictly no panning, no zoom, no camera movement, no cuts). Minimal 2 subtle cyclical motions. Seamless 10-second loop with zero jump-cuts." }
- If "Google Flow Prompts": return JSON { "imagePrompts": ["1 best image prompt..."], "videoPrompt": "Locked-off tripod camera..." }
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
  const kw = translateKeywordToEnglish(pkg.optionalKeyword) || 'Midnight Session';
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
    case 'Prompt Video AI':
    case 'Google Flow Prompts': {
      const currentVar = pkg.googleFlowDetails?.variationIndex ?? 0;
      const nextVar = (currentVar + 1) % 3;
      const flow = generateGoogleFlowPrompts({
        categoryName: pkg.categoryName,
        genre: pkg.subGenre,
        moods: pkg.moods,
        optionalKeyword: kw,
        variationIndex: nextVar
      });
      return {
        updatedData: {
          imagePrompts: [flow.imagePrompt],
          videoPrompt: flow.videoPrompt,
          googleFlowDetails: flow
        },
        model: `TuneForge Google Flow Engine (New Composition #${nextVar + 1})`
      };
    }
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
    preferredStyle: input.preferredThumbnailStyle,
    duration: input.duration,
    useCase: input.useCase,
    optionalKeyword: cleanKw
  });

  const flowEngine = generateGoogleFlowPrompts({
    categoryName: input.categoryName,
    genre: input.subGenre,
    moods: input.moods,
    optionalKeyword: cleanKw,
    variationIndex: 0
  });

  return {
    id: newId,
    userId: input.userId || 'usr-demo',
    categoryId: input.categoryId,
    categoryName: input.categoryName,
    subGenre: input.subGenre,
    moods: input.moods,
    preferredThumbnailStyle: input.preferredThumbnailStyle || 'all',
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
    imagePrompts: [flowEngine.imagePrompt],
    videoPrompt: flowEngine.videoPrompt,
    googleFlowDetails: flowEngine,
    technicalNotes: `• Target Loudness: -14 LUFS (Integrated)\n• Recommended Loop Duration: 10s base clip extended to 1 hour timeline\n• Aspect Ratio: 16:9 (3840x2160 or 1920x1080)\n• High CTR Tip: Pair Thumbnail Text Variant 1 with the Cinematic or Minimal Typography thumbnail prompt.`
  };
}
