import { NextRequest, NextResponse } from 'next/server';

const MASTRA_URL = process.env.MASTRA_URL || 'http://localhost:4111';
const AGENT_ID = 'tajAssistantAgent';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${MASTRA_URL}/chat/${AGENT_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Mastra server error: ${errorText}` },
        { status: response.status }
      );
    }

    // Stream the response back to the client
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Mastra server. Is it running on port 4111?' },
      { status: 502 }
    );
  }
}
