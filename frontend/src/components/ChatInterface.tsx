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
    <div>
      <h2>Ask a Question</h2>

      <label>
        <input
          type="checkbox"
          checked={useAgent}
          onChange={(e) => setUseAgent(e.target.checked)}
        />
        Use agent (for complex/multi-step questions)
      </label>

      <div>
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Ask about your documents..."
        disabled={isLoading}
      />
      <button onClick={handleSend} disabled={isLoading || !input.trim()}>
        {isLoading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}