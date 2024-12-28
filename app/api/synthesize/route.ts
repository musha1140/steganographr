import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: 'ElevenLabs API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { text, needsAdjustment } = await request.json();
    let finalText = text;

    if (needsAdjustment) {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant helping to improve a steganography demo. The demo might not make sense in some scenarios. Your task is to provide a brief, apathetic, and slightly sarcastic explanation or correction. Keep it under 50 words."
          },
          {
            role: "user",
            content: `The current demo step doesn't make sense: "${text}". Provide a brief, apathetic correction.`
          }
        ],
      });

      finalText = completion.choices[0].message.content || text;
    }

    // Convert the text to a more apathetic and heartless tone
    const apathetic_completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant tasked with converting text to an apathetic and heartless tone. Keep the same information but make it sound cold and uncaring."
        },
        {
          role: "user",
          content: `Convert this text to an apathetic and heartless tone: "${finalText}"`
        }
      ],
    });

    finalText = apathetic_completion.choices[0].message.content || finalText;

    const voice_id = "SSTrdRNQ3L4su4DUfpEr"; // HAL 9000 voice ID
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: finalText,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to synthesize speech: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Speech synthesis error:', error);
    return NextResponse.json(
      { error: `Failed to synthesize speech: ${error.message}` },
      { status: 500 }
    );
  }
}

