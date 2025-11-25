'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored ? stored === 'dark' : prefersDark;
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'This is a placeholder response. Connect this to your RAG backend API.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-[#1a2332] transition-colors duration-200">
      <header className="border-b bg-white px-6 py-4 dark:bg-[#1a2332]" style={{ borderColor: 'rgba(52, 71, 104, 0.2)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/decodelogo.svg" alt="Decode Logo" className="h-15 w-auto" />
            <div>
              <h1 className="text-xl font-medium dark:text-white" style={{ color: '#344768' }}>
                FTC Decode Chatbot
          </h1>
              <p className="text-xs dark:text-gray-300" style={{ color: '#344768' }}>
                Ask me anything about the FTC Game Manual for the 2025-2026 season!
          </p>
        </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors dark:text-gray-300"
            style={{ 
              backgroundColor: 'rgba(52, 71, 104, 0.1)',
              color: '#344768'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 71, 104, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 71, 104, 0.1)';
            }}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-8 scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center animate-fade-in">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(52, 71, 104, 0.1)' }}>
                <svg
                  className="h-10 w-10"
                  style={{ color: '#344768' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-3xl font-medium dark:text-white" style={{ color: '#344768' }}>
                Welcome! 👋
              </h2>
              <p className="mb-2 text-lg dark:text-gray-300" style={{ color: '#344768' }}>
                I'm here to help you find answers about the rules for the 2025-2026 FTC Decode season!
              </p>
              <p className="text-sm dark:text-gray-400" style={{ color: '#344768' }}>
                Start a conversation by typing a message below
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex animate-slide-up ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <div
                  className="max-w-[85%] rounded-2xl px-5 py-3.5 text-white shadow-md"
                  style={{
                    backgroundColor: message.role === 'user' ? '#9053a0' : '#344768'
                  }}
                >
                  <p className="whitespace-pre-wrap break-words leading-relaxed text-[15px]">
                    {message.content}
                  </p>
                  <span
                    className="mt-2 block text-xs opacity-80"
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[85%] rounded-2xl px-5 py-4 shadow-md" style={{ backgroundColor: '#344768' }}>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t bg-white px-6 py-5 dark:bg-[#1a2332]" style={{ borderColor: 'rgba(52, 71, 104, 0.2)' }}>
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full rounded-2xl border bg-white px-5 py-3.5 pr-12 transition-colors focus:outline-none focus:ring-2 dark:bg-[#1a2332] dark:text-gray-50 dark:placeholder-gray-400"
                style={{ 
                  borderColor: 'rgba(52, 71, 104, 0.3)',
                  color: '#344768',
                  '--tw-ring-color': 'rgba(52, 71, 104, 0.2)',
                } as React.CSSProperties & { '--tw-ring-color': string }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#344768';
                  e.target.style.boxShadow = '0 0 0 2px rgba(52, 71, 104, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '';
                  e.target.style.boxShadow = '';
                }}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-gray-400" style={{ color: 'rgba(52, 71, 104, 0.6)' }}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex items-center gap-2 rounded-2xl px-6 py-3.5 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 shadow-md"
              style={{ backgroundColor: '#344768' }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#2a3850';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#344768';
                }
              }}
              onMouseDown={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#1f2a3d';
                }
              }}
              onMouseUp={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = '#344768';
                }
              }}
            >
              <span>Send</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      <footer className="border-t bg-white px-4 py-2 dark:bg-[#1a2332]" style={{ borderColor: 'rgba(52, 71, 104, 0.2)' }}>
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 text-xs dark:text-gray-400" style={{ color: '#344768' }}>
          <img src="/genetonlogo.svg" alt="Geneton Logo" className="h-6 w-6 rounded-full object-cover" />
          <span>Made by Team Geneton #26507</span>
        </div>
      </footer>
    </div>
  );
}
