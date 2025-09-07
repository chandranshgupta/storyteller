
'use server';

/**
 * @fileOverview Narrates the story from a specific hero's point of view using pre-processed data.
 *
 * - narrateFromHeroPOV - A function that narrates the story from a hero's perspective.
 * - NarrationInput - The input type for the narrateFromHeroPOV function.
 * - NarrationOutput - The return type for the narrateFromHeroPOV function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { promises as fs } from 'fs';
import path from 'path';

const NarrationInputSchema = z.object({
  chapterId: z
    .number()
    .describe('The ID of the chapter to be narrated.'),
  characterName: z
    .string()
    .describe('The name of the hero whose perspective to use.'),
});
export type NarrationInput = z.infer<typeof NarrationInputSchema>;

const NarrationOutputSchema = z.object({
  narration: z.string().describe("The story chapter narrated from the hero's perspective."),
});
export type NarrationOutput = z.infer<typeof NarrationOutputSchema>;


interface PreprocessedChapter {
    chapter: number;
    title: string;
    text_original: string;
    perspectives: {
        [character: string]: string;
    }
}

async function getPreprocessedChapter(chapterId: number): Promise<PreprocessedChapter> {
    const filePath = path.join(process.cwd(), 'public', 'ramayana_preprocessed.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const storyData: PreprocessedChapter[] = JSON.parse(fileContent);
    const chapter = storyData.find((chap: any) => chap.chapter === chapterId);
    if (!chapter) {
        throw new Error(`Chapter ${chapterId} not found in pre-processed data.`);
    }
    return chapter;
}


export async function narrateFromHeroPOV(input: NarrationInput): Promise<NarrationOutput> {
  const chapter = await getPreprocessedChapter(input.chapterId);
  const character = input.characterName;

  const preGeneratedText = character.toLowerCase() === 'rama'
    ? chapter.text_original
    : chapter.perspectives[character];

  if (!preGeneratedText) {
    throw new Error(`Perspective for ${character} not found in Chapter ${input.chapterId}`);
  }
  
  // This function now acts as part of a "Hybrid RAG" system.
  // It retrieves the high-quality pre-generated text.
  // A future "enhancement" step could involve a new AI prompt that takes this
  // preGeneratedText as input to add minor, real-time details.
  // For now, we return the pre-generated text directly for a fast user experience.

  const prompt = ai.definePrompt({
    name: 'narrateFromHeroPOVPrompt',
    input: { schema: NarrationInputSchema },
    output: { schema: NarrationOutputSchema },
    prompt: `
        You have been given a pre-written, first-person narration from the perspective of ${character} for a chapter of the Ramayana.
        Your task is to act as a final reviewer. Ensure the text is well-written and engaging.
        You can make very subtle improvements, but your main goal is to preserve the authenticity of the provided text.
        
        RETURN THE PROVIDED TEXT, with only minor grammatical corrections if absolutely necessary. Do not add new content.

        CONTEXT: "${preGeneratedText}"
    `,
  });

  const { output } = await prompt(input);
  // For now, we will return the direct pre-generated text.
  // The prompt above is a placeholder for a more complex enhancement flow.
  return { narration: preGeneratedText };
}

    