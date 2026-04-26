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
    <ThreadPrimitive.Root className="flex h-full flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/80">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <span className="text-lg font-bold text-white">T</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight">TAJ Assistant</h1>
          <p className="text-xs text-slate-400">Tax Administration Jamaica &bull; Knowledge Base</p>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <ThreadPrimitive.Empty>
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/30 mb-6">
              <span className="text-3xl font-bold text-white">TAJ</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to TAJ Assistant</h2>
            <p className="text-slate-400 max-w-md mb-8">
              I can help you with questions about Tax Administration Jamaica services,
              driver&apos;s licences, TRN, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              <SuggestionButton text="How do I get a TRN?" />
              <SuggestionButton text="What are the driver's licence fees?" />
              <SuggestionButton text="How do I pay traffic tickets online?" />
              <SuggestionButton text="How to apply for a Tax Compliance Certificate?" />
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
      <ThreadPrimitive.ScrollToBottom className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2 cursor-pointer rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-300 shadow-lg transition-colors hover:bg-slate-700">
        ↓ Scroll to bottom
      </ThreadPrimitive.ScrollToBottom>

      {/* Composer */}
      <div className="px-4 pb-4 pt-2">
        <ComposerPrimitive.Root className="flex items-end gap-2 rounded-2xl border border-slate-700/50 bg-slate-800/50 px-4 py-3 shadow-xl shadow-black/20 backdrop-blur-sm transition-colors focus-within:border-emerald-500/50">
          <ComposerPrimitive.Input
            placeholder="Ask about TAJ services..."
            className="min-h-[24px] max-h-[120px] flex-1 resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <ComposerPrimitive.Send className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </ComposerPrimitive.Send>
        </ComposerPrimitive.Root>
        <p className="text-center text-xs text-slate-600 mt-2">
          TAJ Assistant may make mistakes. Verify important information.
        </p>
      </div>
    </ThreadPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-lg shadow-emerald-500/10">
        <MessagePrimitive.Content />
      </div>
    </div>
  );
};

const AssistantMessage: FC = () => {
  return (
    <div className="flex justify-start mb-4 group">
      <div className="flex gap-3 max-w-[85%]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mt-1 shadow-md shadow-emerald-500/20">
          <span className="text-xs font-bold text-white">T</span>
        </div>
        <div className="rounded-2xl rounded-tl-md bg-slate-800/80 border border-slate-700/50 px-4 py-3 text-slate-200 shadow-lg">
          <MessagePrimitive.Content />
          <ActionBarPrimitive.Root className="mt-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <ActionBarPrimitive.Copy className="cursor-pointer rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-700/50 hover:text-slate-300">
              Copy
            </ActionBarPrimitive.Copy>
            <ActionBarPrimitive.Reload className="cursor-pointer rounded px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-700/50 hover:text-slate-300">
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
      className="text-left text-sm text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 hover:bg-slate-700/50 hover:border-emerald-500/30 hover:text-white transition-all cursor-pointer"
      onClick={() => {
        // Dispatch to the composer
        const input = document.querySelector<HTMLTextAreaElement>('[data-composer-input]');
        if (input) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, 'value'
          )?.set;
          nativeInputValueSetter?.call(input, text);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          // Find and click the send button
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
