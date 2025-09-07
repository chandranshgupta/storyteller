
'use server';
/**
 * @fileOverview Generates a detailed character backstory or "lore".
 *
 * - generateCharacterLore - A function that generates a rich narrative about a character's history and significance.
 * - CharacterLoreInput - The input type for the generateCharacterLore function.
 * - CharacterLoreOutput - The return type for the generateCharacterLore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CharacterLoreInputSchema = z.object({
  characterName: z.string().describe('The name of the character for whom to generate lore.'),
});
export type CharacterLoreInput = z.infer<typeof CharacterLoreInputSchema>;

// Corrected Output Schema to expect a direct string
const CharacterLoreOutputSchema = z.string().describe('The detailed, generated lore for the character, approximately 500-700 words.');
export type CharacterLoreOutput = z.infer<typeof CharacterLoreOutputSchema>;

export async function generateCharacterLore(input: CharacterLoreInput): Promise<CharacterLoreOutput> {
  return generateCharacterLoreFlow(input);
}

const lorePrompt = ai.definePrompt({
  name: 'characterLorePrompt',
  input: {schema: CharacterLoreInputSchema},
  output: { format: 'text' }, // We expect a plain text string
  prompt: `
    You are a master storyteller and scholar of the Ramayana, speaking with a reverent and epic tone.
    Generate a detailed character lore for {{{characterName}}}.
    The lore must cover their origin, key personality traits (like Rama's dharma or Sita's resilience), their pivotal moments in the epic, their primary motivations, and their ultimate role in the grander scheme of the story. 
    The response should be comprehensive and insightful, approximately 500-700 words long.
    Return only the lore as a single block of text, without any additional formatting or labels.
  `,
  config: {
    model: 'googleai/gemini-1.5-flash-latest',
  },
});

const generateCharacterLoreFlow = ai.defineFlow(
  {
    name: 'generateCharacterLoreFlow',
    inputSchema: CharacterLoreInputSchema,
    outputSchema: CharacterLoreOutputSchema,
    // Give it more time for longer responses
    flowConfig: {
      timeout: 300000, 
    },
  },
  async (input) => {
    const {output} = await lorePrompt(input);
    // The output is now the string directly
    return output!;
  }
);
