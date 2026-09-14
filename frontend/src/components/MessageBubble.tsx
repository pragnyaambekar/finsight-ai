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

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <span className="mb-1 px-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {isUser ? "You" : "FinSight AI"}
      </span>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-ink text-white"
            : "rounded-bl-sm border border-border bg-assistant-bubble text-ink shadow-card"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.sources && message.sources.length > 0 && (
          <details className="group mt-2.5 border-t border-border/70 pt-2.5">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-ink-muted transition-colors hover:text-ink">
              <svg
                className="h-3 w-3 shrink-0 transition-transform group-open:rotate-90"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
              Sources ({message.sources.length})
            </summary>

            <ul className="mt-2 space-y-2">
              {message.sources.map((source, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border bg-paper px-3 py-2"
                >
                  <div className="mb-1 text-[10px] font-medium uppercase tracking-wide text-ink-faint">
                    {source.document_id} · chunk {source.chunk_index}
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-ink-muted">
                    {source.text_preview}
                  </p>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </div>
  );
}
