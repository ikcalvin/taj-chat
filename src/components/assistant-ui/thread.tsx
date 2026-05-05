'use client';

import {
  ActionBarPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from '@assistant-ui/react';
import type { FC } from 'react';

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col" style={{ background: 'var(--taj-bg)' }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-5 py-3 border-b shrink-0"
        style={{
          background: 'var(--taj-header-bg)',
          borderColor: 'var(--taj-border)',
        }}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-sm">
          <span className="text-sm font-semibold text-white">T</span>
        </div>
        <div>
          <h1
            className="text-[0.9375rem] font-semibold leading-tight"
            style={{ color: 'var(--taj-text)' }}
          >
            TAJ Assistant
          </h1>
          <p
            className="text-[0.6875rem] leading-tight"
            style={{ color: 'var(--taj-text-secondary)' }}
          >
            Tax Administration Jamaica
          </p>
        </div>
        <div
          className="ml-auto flex items-center gap-1 text-[0.6875rem] font-medium px-2 py-0.5 rounded-full"
          style={{ background: '#ecfdf5', color: '#059669' }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Online
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 taj-scrollbar">
        <ThreadPrimitive.Empty>
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 shadow-md mb-5">
              <span className="text-xl font-bold text-white">TAJ</span>
            </div>
            <h2
              className="text-lg font-semibold mb-1.5"
              style={{ color: 'var(--taj-text)' }}
            >
              How can I help you?
            </h2>
            <p
              className="text-sm max-w-xs mb-6"
              style={{ color: 'var(--taj-text-secondary)' }}
            >
              Ask me about TAJ services, TRN, driver&apos;s licences, and more.
            </p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              <SuggestionButton text="How do I get a TRN?" />
              <SuggestionButton text="What are the driver's licence fees?" />
              <SuggestionButton text="How do I pay traffic tickets?" />
            </div>
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />
      </div>

      {/* Scroll to bottom */}
      <ThreadPrimitive.ScrollToBottom
        className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium shadow-md transition-all hover:shadow-lg"
        style={{
          background: 'var(--taj-surface)',
          color: 'var(--taj-text-secondary)',
          border: '1px solid var(--taj-border)',
        }}
      >
        <svg className="inline-block w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
        New messages
      </ThreadPrimitive.ScrollToBottom>

      {/* Composer */}
      <div
        className="px-4 pb-3 pt-2 shrink-0 border-t"
        style={{
          background: 'var(--taj-header-bg)',
          borderColor: 'var(--taj-border)',
        }}
      >
        <ComposerPrimitive.Root
          className="flex items-end gap-2 rounded-xl px-3.5 py-2.5 transition-all focus-within:shadow-md"
          style={{
            background: 'var(--taj-composer-bg)',
            border: '1px solid var(--taj-composer-border)',
          }}
        >
          <ComposerPrimitive.Input
            placeholder="Message TAJ Assistant..."
            className="composer-textarea min-h-[22px] max-h-[120px] flex-1 resize-none bg-transparent text-sm outline-none"
            style={{
              color: 'var(--taj-text)',
            }}
          />
          <ComposerPrimitive.Send
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            style={{
              background: 'var(--taj-send-bg)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
        <p
          className="text-center text-[0.625rem] mt-1.5"
          style={{ color: 'var(--taj-text-secondary)', opacity: 0.6 }}
        >
          TAJ Assistant can make mistakes. Verify important information.
        </p>
      </div>
    </ThreadPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <div className="flex justify-end mb-3">
      <div
        className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm"
        style={{
          background: 'var(--taj-user-bubble)',
          color: 'var(--taj-text)',
        }}
      >
        <MessagePrimitive.Content />
      </div>
    </div>
  );
};

const AssistantMessage: FC = () => {
  return (
    <div className="flex justify-start mb-4 group">
      <div className="flex gap-2.5 max-w-[88%]">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center mt-0.5">
          <span className="text-[0.625rem] font-bold text-white">T</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="aui-assistant-message-content assistant-prose">
            <MessagePrimitive.Content />
          </div>
          <ActionBarPrimitive.Root className="mt-1 flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ActionBarPrimitive.Copy
              className="cursor-pointer rounded-md px-1.5 py-1 text-[0.6875rem] transition-colors hover:bg-black/5"
              style={{ color: 'var(--taj-text-secondary)' }}
            >
              <svg className="inline-block w-3.5 h-3.5 mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload
              className="cursor-pointer rounded-md px-1.5 py-1 text-[0.6875rem] transition-colors hover:bg-black/5"
              style={{ color: 'var(--taj-text-secondary)' }}
            >
              <svg className="inline-block w-3.5 h-3.5 mr-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
              </svg>
              Retry
            </ActionBarPrimitive.Reload>
          </ActionBarPrimitive.Root>
        </div>
      </div>
    </div>
  );
};

const SuggestionButton: FC<{ text: string }> = ({ text }) => {
  return (
    <button
      className="text-left text-sm rounded-xl px-4 py-2.5 transition-all cursor-pointer hover:shadow-sm"
      style={{
        color: 'var(--taj-text)',
        background: 'var(--taj-surface)',
        border: '1px solid var(--taj-border)',
      }}
      onClick={() => {
        const input = document.querySelector<HTMLTextAreaElement>('[data-composer-input]');
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          )?.set;
          nativeInputValueSetter?.call(input, text);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          setTimeout(() => {
            const form = input.closest('form');
            form?.requestSubmit();
          }, 100);
        }
      }}
    >
      {text}
    </button>
  );
};
