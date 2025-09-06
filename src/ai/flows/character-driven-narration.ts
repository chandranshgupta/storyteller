
'use server';
/**
 * @fileOverview Implements character-driven narration using the Nari-Dia AI for voice synthesis.
 *
 * - characterDrivenNarration - A function that synthesizes voice context for character roles in stories.
 * - CharacterDrivenNarrationInput - The input type for the characterDrivenNarration function.
 * - CharacterDrivenNarrationOutput - The return type for the characterDrivenNarration function.
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


const narilabsNarrationTool = ai.defineTool(
    {
      name: 'narilabsNarrationTool',
      description: 'Generates narration audio using the Nari-Labs Dia model.',
      inputSchema: z.object({
          text: z.string(),
      }),
      outputSchema: z.string().describe("A URL to the generated WAV audio file."),
    },
    async (input) => {
        const {GradioClient} = await import('@gradio/client');
        const hfToken = process.env.HUGGING_FACE_TOKEN;
        if (!hfToken) {
          throw new Error("HUGGING_FACE_TOKEN environment variable not set.");
        }

        const client = await GradioClient.connect("nari-labs/Dia-1.6B", { hf_token: hfToken });
        const result = await client.predict("/generate_audio", {
            text_input: `[S1] ${input.text}`,
        });

        if (typeof result.data[0] === 'object' && result.data[0] !== null && 'url' in result.data[0]) {
            return (result.data[0] as { url: string }).url;
        }
        throw new Error('Unexpected response format from Nari-Labs API');
    }
);


export async function characterDrivenNarration(input: CharacterDrivenNarrationInput): Promise<CharacterDrivenNarrationOutput> {
  return characterDrivenNarrationFlow(input);
}


const characterDrivenNarrationFlow = ai.defineFlow(
  {
    name: 'characterDrivenNarrationFlow',
    inputSchema: CharacterDrivenNarrationInputSchema,
    outputSchema: CharacterDrivenNarrationOutputSchema,
  },
  async (input) => {
    const audioUrl = await narilabsNarrationTool({ text: input.dialogue });
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(audioUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch audio file: ${response.statusText}`);
    }
    const audioBuffer = await response.buffer();
    
    return {
      media: 'data:audio/wav;base64,' + audioBuffer.toString('base64'),
    };
  }
);
