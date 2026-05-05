'use client';

import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { AssistantChatTransport, useChatRuntime } from '@assistant-ui/react-ai-sdk';
import { Thread } from '@/components/assistant-ui/thread';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ChatApp() {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';
  const [isOpen, setIsOpen] = useState(!isEmbed);
  const [hasBeenOpened, setHasBeenOpened] = useState(!isEmbed);

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: '/api/chat',
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
        <div className="h-dvh w-full flex flex-col">
          {/* Widget Panel */}
          {hasBeenOpened && (
            <div
              className={`flex-1 flex flex-col overflow-hidden rounded-2xl shadow-2xl ${
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
