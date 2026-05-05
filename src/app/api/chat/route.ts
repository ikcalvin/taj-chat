import { NextRequest, NextResponse } from 'next/server';

const MASTRA_URL = process.env.MASTRA_URL;
const AGENT_ID = process.env.AGENT_ID;

const toSseChunk = (value: unknown) => `data: ${JSON.stringify(value)}\n\n`;

function createUiTextStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const textId = 'text-0';
  const deltas = text.match(/.{1,24}/gs) ?? [];

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(encoder.encode(toSseChunk({ type: 'start' })));
      controller.enqueue(encoder.encode(toSseChunk({ type: 'text-start', id: textId })));

      for (const delta of deltas) {
        controller.enqueue(
          encoder.encode(toSseChunk({ type: 'text-delta', id: textId, delta }))
        );
        await new Promise((resolve) => setTimeout(resolve, 12));
      }

      controller.enqueue(encoder.encode(toSseChunk({ type: 'text-end', id: textId })));
      controller.enqueue(encoder.encode(toSseChunk({ type: 'finish' })));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mastraPayload = {
      messages: Array.isArray(body?.messages)
        ? body.messages.map((message: { role?: string; content?: unknown }) => ({
            role: message?.role ?? 'user',
            content:
              typeof message?.content === 'string'
                ? message.content
                : String(message?.content ?? ''),
          }))
        : [],
    };

    const response = await fetch(`${MASTRA_URL}/api/agents/${AGENT_ID}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mastraPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Mastra server error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = (await response.json()) as { text?: unknown };
    const text = typeof data?.text === 'string' ? data.text : '';
    const uiStream = createUiTextStream(text);

    return new Response(uiStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Mastra server at ' + MASTRA_URL },
      { status: 502 }
    );
  }
}
