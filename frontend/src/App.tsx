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
    <div>
      <h1>FinSight AI</h1>
      <DocumentUpload onUploadComplete={handleUploadComplete} />
      <DocumentList refreshTrigger={refreshTrigger} />
      <ChatInterface />
    </div>
  );
}

export default App;