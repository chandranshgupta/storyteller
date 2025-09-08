
'use server';

/**
 * @fileOverview This file is no longer in use. The Point of View (POV) generation
 * feature has been removed to focus on the Character Lore feature.
 */

import {z} from 'genkit';

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


export async function narrateFromHeroPOV(input: NarrationInput): Promise<NarrationOutput> {
  throw new Error("This flow is deprecated and no longer in use.");
}
