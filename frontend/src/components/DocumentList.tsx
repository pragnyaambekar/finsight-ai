import { useState, useEffect } from "react";
import { listDocuments, type DocumentInfo } from "../api";

export function DocumentList({ refreshTrigger }: { refreshTrigger: number }) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDocuments() {
      setIsLoading(true);
      const data = await listDocuments();
      setDocuments(data.documents);
      setIsLoading(false);
    }

    fetchDocuments();
  }, [refreshTrigger]);

  if (isLoading) {
    return <p>Loading documents...</p>;
  }

  return (
    <div>
      <h2>Your Documents</h2>
      {documents.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.document_id}>{doc.filename}</li>
          ))}
        </ul>
      )}
    </div>
  );
}