
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
  // It retrieves the high-quality pre-generated text and then enhances it.
  
  const prompt = ai.definePrompt({
    name: 'narrateFromHeroPOVPrompt',
    input: { schema: NarrationInputSchema },
    output: { schema: NarrationOutputSchema },
    prompt: `
        You are an expert storyteller tasked with enhancing a pre-written, first-person narration from the perspective of ${character} for a chapter of the Ramayana.
        Your task is to act as a master wordsmith. Read the provided text and subtly enhance it to make it more immersive and emotionally resonant.

        RULES:
        1.  PRESERVE THE CORE NARRATIVE: Do not change the sequence of events or add new plot points.
        2.  ENHANCE, DON'T REPLACE: Build upon the existing text. You can rephrase sentences for better flow, add descriptive sensory details (sights, sounds, smells), and expand on the character's inner monologue, emotions, and motivations that are implied in the text.
        3.  MAINTAIN AUTHENTICITY: The tone must be authentic to the character of ${character}.
        4.  OUTPUT: Return only the final, enhanced narration for the full chapter. Do not include any introductory phrases like "Here is the enhanced version".

        CONTEXT TO ENHANCE: "${preGeneratedText}"
    `,
  });

  const { output } = await prompt(input);
  return output!;
}
