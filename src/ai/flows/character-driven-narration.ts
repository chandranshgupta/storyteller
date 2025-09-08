
'use server';
/**
 * @fileOverview This file is no longer in use for narration. 
 * The narration is now handled by a secure Firebase Function.
 * See /functions/index.js for the backend implementation and
 * /src/components/dialogue-player.tsx for the frontend implementation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CharacterDrivenNarrationInputSchema = z.object({
  characterName: z.string().describe('The name of the character.'),
  dialogue: z.string().describe('The dialogue spoken by the character.'),
});
export type CharacterDrivenNarrationInput = z.infer<typeof CharacterDrivenNarrationInputSchema>;

const CharacterDrivenNarrationOutputSchema = z.object({
  media: z.string().describe('The audio data in WAV format as a data URI.'),
});
export type CharacterDrivenNarrationOutput = z.infer<typeof CharacterDrivenNarrationOutputSchema>;


export async function characterDrivenNarration(input: CharacterDrivenNarrationInput): Promise<CharacterDrivenNarrationOutput> {
  throw new Error("This flow is deprecated. Use the 'generateNarration' Firebase Function instead.");
}
