# TAJ Chat

Chat frontend for the [TAJ Assistant](https://github.com/ikcalvin/taj-assistant) — a Mastra-powered AI assistant for Tax Administration Jamaica services.

Built with [Next.js](https://nextjs.org) and [assistant-ui](https://www.assistant-ui.com/) using the [separate server integration](https://www.assistant-ui.com/docs/integrations/frameworks/mastra/separate-server) pattern.

## How It Works

The frontend connects to a separate Mastra backend server over HTTP. The assistant-ui `AssistantChatTransport` sends messages to the Mastra `chatRoute` endpoint, which streams responses back using the AI SDK v6 format.

```
Browser (localhost:3000)  -->  Mastra server (localhost:4111)
     assistant-ui              /chat/orchestratorAgent
     AssistantChatTransport         |
                                    v
                             Orchestrator agent
                                    |
                              Tax / TRN / Motor Vehicle agents
```

The frontend includes:

- Full-page and embeddable widget modes (toggle with `?embed=true`).
- Per-user thread and resource IDs stored in `localStorage` for conversation continuity.
- Custom TAJ-branded UI with suggested questions.

## Prerequisites

- Node.js >= 18
- The [TAJ Assistant](https://github.com/ikcalvin/taj-assistant) backend running on `localhost:4111`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy and configure the environment:

```bash
cp .env.example .env
```

3. Start the Mastra backend (in a separate terminal):

```bash
cd ../taj-assistant
npm run dev
```

4. Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chat.

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_MASTRA_URL` | Full URL to the Mastra chat endpoint, e.g. `http://localhost:4111/chat/orchestratorAgent` |
| `AGENT_ID` | The agent key to use (must match the JS object key in the backend's `agents` map) |

> **Note:** The agent ID in the URL is the **JavaScript object key** from the backend's `agents` map (e.g. `orchestratorAgent`), not the agent's `id` field (`orchestrator`). See the [backend README](https://github.com/ikcalvin/taj-assistant#running-locally) for the full mapping.

## Key Files

- `src/app/page.tsx`: Main chat page with full-page and embed modes, transport configuration.
- `src/components/assistant-ui/thread.tsx`: Customised assistant-ui thread component with TAJ branding.
- `src/app/globals.css`: TAJ design tokens and animations.

## Embed Mode

Append `?embed=true` to the URL to use the widget mode, suitable for embedding in an iframe:

```html
<iframe src="http://localhost:3000?embed=true" width="400" height="600"></iframe>
```

The parent page can control the widget via `postMessage`:

```js
iframe.contentWindow.postMessage({ type: 'taj-chat-toggle' }, '*');
iframe.contentWindow.postMessage({ type: 'taj-chat-open' }, '*');
iframe.contentWindow.postMessage({ type: 'taj-chat-close' }, '*');
```
