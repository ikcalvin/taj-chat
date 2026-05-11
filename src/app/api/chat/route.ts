/**
 * Server-side proxy for Mastra chat endpoints.
 *
 * The frontend sends requests here instead of directly to the Mastra server.
 * This route injects the MASTRA_API_KEY as a Bearer token so the secret never
 * reaches the browser.
 *
 * Environment variables (server-only — NOT prefixed with NEXT_PUBLIC_):
 *   MASTRA_URL      – Base URL of the Mastra server (e.g. http://localhost:4111/chat/orchestratorAgent)
 *   MASTRA_API_KEY   – Secret key that matches the Mastra server's MASTRA_API_KEY
 */

export async function POST(request: Request) {
  const mastraUrl = process.env.MASTRA_URL?.trim();
  const mastraApiKey = process.env.MASTRA_API_KEY?.trim();

  if (!mastraUrl) {
    return new Response(
      JSON.stringify({ error: 'MASTRA_URL is not configured on the server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Build headers to forward
  const headers: Record<string, string> = {
    'Content-Type': request.headers.get('content-type') || 'application/json',
  };

  if (mastraApiKey) {
    headers['Authorization'] = `Bearer ${mastraApiKey}`;
  }

  try {
    const body = await request.text();

    const upstream = await fetch(mastraUrl, {
      method: 'POST',
      headers,
      body,
    });

    // Stream the response back to the client
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'text/plain',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: any) {
    console.error('[api/chat] Upstream request failed:', err?.message || err);
    return new Response(
      JSON.stringify({ error: 'Failed to reach the Mastra server.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
