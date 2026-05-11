'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { AssistantChatTransport, useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { Thread } from '@/components/assistant-ui/thread';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const THREAD_ID_STORAGE_KEY = 'taj-chat-thread-id';
const RESOURCE_ID_STORAGE_KEY = 'taj-chat-resource-id';

function getOrCreateClientId(storageKey: string, prefix: string): string {
  const existingValue = window.localStorage.getItem(storageKey);
  if (existingValue) return existingValue;

  const generatedValue = `${prefix}-${crypto.randomUUID()}`;
  window.localStorage.setItem(storageKey, generatedValue);
  return generatedValue;
}

function ChatApp() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const [isOpen, setIsOpen] = useState(!isEmbed);
  const [hasBeenOpened, setHasBeenOpened] = useState(!isEmbed);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      // Route through the Next.js server-side proxy so the API key
      // stays on the server and is never exposed to the browser.
      api: '/api/chat',
      prepareSendMessagesRequest: async (options) => {
        const threadId = getOrCreateClientId(THREAD_ID_STORAGE_KEY, 'thread');
        const resourceId = getOrCreateClientId(RESOURCE_ID_STORAGE_KEY, 'resource');

        return {
          ...options,
          body: {
            ...options.body,
            messages: options.messages,
            trigger: options.trigger,
            messageId: options.messageId,
            threadId,
            resourceId,
          },
        };
      },
    }),
  });

  // Listen for postMessage from parent window (for iframe embed control)
  useEffect(() => {
    if (!isEmbed) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'taj-chat-toggle') {
        setIsOpen((prev) => !prev);
        setHasBeenOpened(true);
      }
      if (event.data?.type === 'taj-chat-open') {
        setIsOpen(true);
        setHasBeenOpened(true);
      }
      if (event.data?.type === 'taj-chat-close') {
        setIsOpen(false);
      }
      if (event.data?.type === 'taj-theme-change') {
        if (event.data.theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isEmbed]);

  // Add embed-mode class to body
  useEffect(() => {
    if (isEmbed) {
      document.body.classList.add('embed-mode');
    }
    return () => {
      document.body.classList.remove('embed-mode');
    };
  }, [isEmbed]);

  if (isEmbed) {
    return (
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="h-dvh w-full flex flex-col p-4 pb-6">
          {/* Widget Panel */}
          {hasBeenOpened && (
            <div
              className={`flex-1 flex flex-col overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${
                isOpen ? 'widget-enter' : 'widget-exit'
              }`}
              style={{
                background: 'var(--taj-bg)',
                border: '1px solid var(--taj-border)',
              }}
              onAnimationEnd={() => {
                if (!isOpen) setHasBeenOpened(false);
              }}
            >
              <Thread />
            </div>
          )}
        </div>
      </AssistantRuntimeProvider>
    );
  }

  // Full-page mode
  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <main className="h-dvh flex items-center justify-center p-4" style={{ background: '#f0ece4' }}>
        <div
          className="w-full max-w-lg h-full max-h-[700px] rounded-2xl shadow-xl overflow-hidden flex flex-col"
          style={{
            background: 'var(--taj-bg)',
            border: '1px solid var(--taj-border)',
          }}
        >
          <Thread />
        </div>
      </main>
    </AssistantRuntimeProvider>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="h-dvh flex items-center justify-center" style={{ background: '#f0ece4' }}>
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    }>
      <ChatApp />
    </Suspense>
  );
}
