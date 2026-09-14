const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}
export type DocumentInfo = {
  document_id: string;
  filename: string;
};

export async function listDocuments(): Promise<{ documents: DocumentInfo[] }> {
  const response = await fetch(`${API_BASE_URL}/documents`);
  return response.json();
}

export async function askDocuments(question: string) {
  const response = await fetch(`${API_BASE_URL}/documents/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

export async function askAgent(question: string) {
  const response = await fetch(`${API_BASE_URL}/agent/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
}

export async function askDocumentsStream(
  question: string,
  onChunk: (text: string) => void
) {
  const response = await fetch(`${API_BASE_URL}/documents/ask-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Request failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    onChunk(text);
  }
}