// Implemented Genkit flow for character-driven narration with Gemini AI voice synthesis.

'use server';
/**
 * @fileOverview Implements character-driven narration using Gemini AI for voice synthesis. Generates character-specific voice context for stories.
 *
 * - characterDrivenNarration - A function that synthesizes voice context for character roles in stories.
 * - CharacterDrivenNarrationInput - The input type for the characterDrivenNarration function.
 * - CharacterDrivenNarrationOutput - The return type for the characterDrivenNarration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

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
  return characterDrivenNarrationFlow(input);
}

const characterDrivenNarrationFlow = ai.defineFlow(
  {
    name: 'characterDrivenNarrationFlow',
    inputSchema: CharacterDrivenNarrationInputSchema,
    outputSchema: CharacterDrivenNarrationOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // You can choose different voice names
          },
        },
      },
      prompt: `${input.characterName}: ${input.dialogue}`,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

