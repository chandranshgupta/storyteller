
import {NextRequest, NextResponse} from 'next/server';
import {ai} from '@/ai/genkit';
import {generate} from 'genkit/generate';

// By default, this is a streaming-first route.
// To disable streaming, set the `streaming` export to `false`.
// export const streaming = false;

// By default, this route is cached.
// To disable caching, set the `revalidate` export to `0`.
// export const revalidate = 0;

export async function POST(req: NextRequest) {
  const {prompt} = await req.json();

  if (!prompt) {
    return NextResponse.json({error: 'Prompt is required'}, {status: 400});
  }

  try {
    const {output} = await generate({
      // The `prompt` variable is sent to the model.
      prompt: prompt,
      // The `model` is the model to use for generation.
      model: 'googleai/gemini-1.5-flash-latest',
      // The `output` format can be 'json' or 'text'.
      output: {
        format: 'text',
      },
    });

    return NextResponse.json({generatedText: output});
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      {error: 'Failed to generate text from Gemini API'},
      {status: 500}
    );
  }
}
