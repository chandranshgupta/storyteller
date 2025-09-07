
'use server';

/**
 * @fileOverview Narrates the story from a specific hero's point of view.
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


async function getChapterText(chapterId: number): Promise<string> {
    const filePath = path.join(process.cwd(), 'public', 'ramayana_complete.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const storyData = JSON.parse(fileContent);
    const chapter = storyData.find((chap: any) => chap.chapter === chapterId);
    if (!chapter) {
        throw new Error(`Chapter ${chapterId} not found.`);
    }
    return chapter.text;
}


export async function narrateFromHeroPOV(input: NarrationInput): Promise<NarrationOutput> {
  const chapterText = await getChapterText(input.chapterId);

  const prompt = ai.definePrompt({
    name: 'narrateFromHeroPOVPrompt',
    input: { schema: NarrationInputSchema },
    output: { schema: NarrationOutputSchema },
    prompt: `Based ONLY on the following context from the Ramayana for a given chapter:
CONTEXT: "${chapterText}"

TASK: Rewrite the entire provided context from the first-person perspective of the character: ${input.characterName}. Emphasize their inner thoughts, emotions, and personal motivations related to the events in this specific chapter. The tone should be authentic to their character.
`,
  });

  const { output } = await prompt(input);
  return output!;
}
