"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  dataPreview: string;
  hasData: boolean;
}

export default function ChatInterface({ dataPreview, hasData }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          dataPreview,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      const aiMessage: Message = {
        role: "assistant",
        content: data.message || "Sorry, I couldn't analyze that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: Failed to connect to AI. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    "Summarize this dataset",
    "Find outliers and anomalies",
    "What are the key trends?",
    "Suggest visualizations",
  ];

  return (
    <div className="glass-card flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 p-5 border-b border-[var(--border-color)]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--purple-primary)] to-[var(--cyan-primary)] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
            <line x1="10" y1="22" x2="14" y2="22" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[var(--text-primary)]">DataLens AI</h3>
          <p className="text-xs text-[var(--text-muted)]">Powered by MiMo</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-all"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--purple-primary)]/20 to-[var(--cyan-primary)]/20 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-primary)" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8M12 8v8" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[var(--text-secondary)] font-medium">
                {hasData ? "Ask anything about your data" : "Upload a file to get started"}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {hasData
                  ? "Try one of the suggestions below"
                  : "Drop a CSV or JSON file to begin analysis"}
              </p>
            </div>
            {hasData && (
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setInput(s);
                    }}
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--purple-primary)]/50 hover:bg-[var(--purple-primary)]/5 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl ${
                  msg.role === "user" ? "chat-message-user" : "chat-message-ai"
                }`}
              >
                <p className="text-xs font-semibold mb-2 text-[var(--text-muted)]">
                  {msg.role === "user" ? "You" : "DataLens AI"}
                </p>
                <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-4 rounded-xl chat-message-ai">
                <p className="text-xs font-semibold mb-2 text-[var(--text-muted)]">DataLens AI</p>
                <div className="flex items-center gap-2">
                  <div className="spinner" />
                  <span className="text-sm text-[var(--text-muted)]">Analyzing...</span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[var(--border-color)]">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={hasData ? "Ask about your data..." : "Upload a file first..."}
            disabled={!hasData}
            className="flex-1 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--purple-primary)] disabled:opacity-50 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || !hasData}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--purple-primary)] to-[var(--cyan-primary)] text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
