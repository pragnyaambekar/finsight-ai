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
  return (
    <div style={{ marginBottom: "1rem" }}>
      <strong>{message.role === "user" ? "You" : "FinSight AI"}:</strong>
      <p>{message.content}</p>

      {message.sources && message.sources.length > 0 && (
        <details>
          <summary>Sources ({message.sources.length})</summary>
          <ul>
            {message.sources.map((source, i) => (
              <li key={i}>{source.text_preview}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}