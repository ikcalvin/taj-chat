// This API route is no longer the primary chat endpoint.
// The frontend now talks directly to the Mastra server's chatRoute()
// endpoint via AssistantChatTransport (see page.tsx).
//
// This file is kept as a potential server-side proxy fallback.
// If you need to add auth headers or server-side logging, you can
// route through here instead. Otherwise, it can be safely deleted.

export async function POST() {
  return new Response(
    JSON.stringify({
      error:
        'This endpoint is deprecated. The frontend now connects directly to the Mastra server.',
    }),
    { status: 410, headers: { 'Content-Type': 'application/json' } },
  );
}
