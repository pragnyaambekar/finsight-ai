import { useState } from "react";
import { askDocuments, askAgent } from "../api";
import { MessageBubble } from "./MessageBubble";

type Source = {
  chunk_index: number;
  document_id: string;
  text_preview: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [useAgent, setUseAgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = useAgent ? await askAgent(input) : await askDocuments(input);

      const assistantMessage: Message = {
        role: "assistant",
        content: result.answer,
        sources: result.sources,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-7 py-5">
        <h2 className="text-base font-semibold text-ink">Ask a Question</h2>

        <label className="flex cursor-pointer items-center gap-2.5 select-none">
          <span className="relative inline-flex h-5 w-9 shrink-0 items-center">
            <input
              type="checkbox"
              checked={useAgent}
              onChange={(e) => setUseAgent(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-5 w-9 rounded-full bg-border-strong transition-colors duration-200 peer-checked:bg-amber" />
            <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 peer-checked:translate-x-4" />
          </span>
          <span className="text-sm text-ink-muted">
            <span className="font-medium text-ink">Agent mode</span>
            <span className="hidden sm:inline"> — for complex, multi-step questions</span>
          </span>
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-7 py-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-wash">
              <svg className="h-5 w-5 text-amber-hover" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a9 9 0 01-2.347-.306c-.584.235-1.938.749-4.153 1.306.224-.567.276-1.795.31-2.559A6.951 6.951 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-ink-faint">
              Upload a document, then ask a question about it to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <span className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
                  FinSight AI
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-border bg-assistant-bubble px-4 py-3 shadow-card">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-faint" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-border px-7 py-5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about your documents..."
          disabled={isLoading}
          className="flex-1 rounded-xl border border-border bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-amber focus:bg-surface focus:outline-none focus:ring-2 focus:ring-amber/20 disabled:opacity-60"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="shrink-0 rounded-xl bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? "Thinking…" : "Send"}
        </button>
      </div>
    </div>
  );
}
