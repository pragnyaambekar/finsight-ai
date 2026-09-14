import { useState, useEffect } from "react";
import { listDocuments, type DocumentInfo } from "../api";

export function DocumentList({ refreshTrigger }: { refreshTrigger: number }) {
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      setIsLoading(true);
      const data = await listDocuments();
      setDocuments(data.documents);
      setIsLoading(false);
    }

    fetchDocuments();
  }, [refreshTrigger]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-ink">Your Documents</h2>
          {!isLoading && documents.length > 0 && (
            <span className="rounded-full bg-amber-wash px-2 py-0.5 text-xs font-medium text-amber-hover">
              {documents.length}
            </span>
          )}
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-3 border-t border-border pt-3">
          {isLoading ? (
            <ul className="space-y-2">
              {[0, 1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-2">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-paper" />
                  <div className="h-3.5 w-40 max-w-full animate-pulse rounded bg-paper" />
                </li>
              ))}
            </ul>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink-faint">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0012.586 3H4zm3 10a1 1 0 100-2 1 1 0 000 2zm1-4a1 1 0 11-2 0 1 1 0 012 0zm3 4a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm text-ink-faint">No documents uploaded yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {documents.map((doc) => (
                <li
                  key={doc.document_id}
                  className="flex items-center gap-3 px-2 py-2.5 transition-colors hover:bg-paper"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-wash text-amber-hover">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707l-3.414-3.414A1 1 0 0012.586 3H4zm7 1.414L14.586 8H11V4.414zM6 11a1 1 0 100 2h8a1 1 0 100-2H6zm0 3a1 1 0 100 2h5a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{doc.filename}</p>
                    <p className="truncate font-mono text-xs text-ink-faint">{doc.document_id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
