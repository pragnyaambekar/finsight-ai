import { useState } from "react";
import { DocumentUpload } from "./components/DocumentUpload";
import { DocumentList } from "./components/DocumentList";
import { ChatInterface } from "./components/ChatInterface";

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadComplete = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center gap-2.5 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink">
            <svg className="h-5 w-5 text-amber" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 13.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-3.75zM8.25 9.75A.75.75 0 019 9h1.5a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-7.5zM13.5 5.25a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v12a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75v-12z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight text-ink">FinSight</span>
            <span className="rounded-md bg-amber-wash px-1.5 py-0.5 text-xs font-semibold text-amber-hover">
              AI
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6 lg:flex-row">
        <aside className="flex w-full flex-col gap-4 lg:w-72 lg:shrink-0">
          <DocumentUpload onUploadComplete={handleUploadComplete} />
          <DocumentList refreshTrigger={refreshTrigger} />
        </aside>

        <div className="min-h-0 min-w-0 flex-1">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}

export default App;
