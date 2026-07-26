import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const { stackTrace } = await req.json();

    if (!stackTrace) {
      return NextResponse.json({ error: 'Stack trace is required' }, { status: 400 });
    }

    const systemPrompt = `You are a helpful software engineering debugging assistant. 
Analyze the provided stack trace or error log and return ONLY a JSON object matching this structure:
{
  "summary": "A concise, 1-sentence title or summary of what error occurred.",
  "explanation": "A clear, plain-English explanation of why this error happens without unnecessary jargon.",
  "suggestedFix": "The exact code snippet, command, or structural fix to resolve the error."
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Error / Stack Trace:\n${stackTrace}` },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const parsedData = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process AI response' },
      { status: 500 }
    );
  }
}