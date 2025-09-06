
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


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const wav = require('wav');
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Buffer) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}


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
        const client = await GradioClient.connect("nari-labs/Dia-1.6B", { hf_token: process.env.HUGGING_FACE_TOKEN });
        const result = await client.predict("/generate_audio", {
            text_input: `[S1] ${input.text}`,
            max_new_tokens: 3072,
            cfg_scale: 3,
            temperature: 1.8,
            top_p: 0.95,
            cfg_filter_top_k: 45,
            speed_factor: 1,
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
