import { useState } from "react";
import { uploadDocument } from "../api";

export function DocumentUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await uploadDocument(selectedFile);
      setSelectedFile(null);
      onUploadComplete();
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <h2 className="mb-3 text-base font-semibold text-ink">Upload a Document</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="group flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-border-strong bg-paper px-4 py-3 transition-colors hover:border-amber hover:bg-amber-wash/40">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-wash text-amber-hover">
            <svg className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 101.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
              <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1 text-sm">
            {selectedFile ? (
              <span className="block truncate font-medium text-ink">{selectedFile.name}</span>
            ) : (
              <>
                <span className="font-medium text-ink">Click to choose a PDF</span>
                <span className="block text-xs text-ink-faint">.pdf files only</span>
              </>
            )}
          </span>
          <input type="file" accept=".pdf" onChange={handleFileChange} className="sr-only" />
        </label>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="shrink-0 rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.63-1.516 2.63H3.72c-1.347 0-2.189-1.463-1.516-2.63L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
