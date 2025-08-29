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

const NarrationInputSchema = z.object({
  storySummary: z
    .string()
    .describe('A summary of the story to be narrated.'),
  heroName: z
    .string()
    .describe('The name of the hero whose perspective to use.'),
});
export type NarrationInput = z.infer<typeof NarrationInputSchema>;

const NarrationOutputSchema = z.object({
  narration: z.string().describe('The story narrated from the hero perspective.'),
});
export type NarrationOutput = z.infer<typeof NarrationOutputSchema>;

export async function narrateFromHeroPOV(input: NarrationInput): Promise<NarrationOutput> {
  return narrateFromHeroPOVFlow(input);
}

const prompt = ai.definePrompt({
  name: 'narrateFromHeroPOVPrompt',
  input: {schema: NarrationInputSchema},
  output: {schema: NarrationOutputSchema},
  prompt: `You are a skilled storyteller, adept at narrating stories from different perspectives.

  Please narrate the following story summary from the point of view of {{heroName}}.
  Focus on the hero's thoughts, feelings, and experiences.  Select details that best support the hero's POV.

  Story Summary: {{{storySummary}}}`,
});

const narrateFromHeroPOVFlow = ai.defineFlow(
  {
    name: 'narrateFromHeroPOVFlow',
    inputSchema: NarrationInputSchema,
    outputSchema: NarrationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
