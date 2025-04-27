// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import SessionPlayer from '../pages/SessionPlayer';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<SessionPlayer />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// packages/debugrecorder-ui/src/App.tsx
// App.tsx
import React, { useState } from "react";
import { CodeViewer } from "../components/CodeViewer";
import { Timeline } from "../components/Timeline";


interface DebugEvent {
  ts: number;
  filename: string;
  line_no: number;
  locals: Record<string, string>;
}

function App() {
  const [events, setEvents] = useState<DebugEvent[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [filename, setFilename] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.trim().split("\n");
    const parsedEvents: DebugEvent[] = lines.map((line) => JSON.parse(line));
    setEvents(parsedEvents);

    // Get source code file from the first event
    const pyfile = parsedEvents[0]?.filename?.split(/\\|\//).pop(); // example.py
    setFilename(pyfile || "");

    // Load Python file from public/sample for dev
    const source = await fetch(`/sample/${pyfile}`).then((res) => res.text());
    setCodeLines(source.split("\n"));
  };

  const currentEvent = events[currentIdx] || { line_no: 1, locals: {} };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Session Viewer</h1>

      <input type="file" accept=".jsonl" onChange={handleFileUpload} className="mb-4" />

      {filename && <div className="mb-2 text-gray-600">📄 {filename}</div>}

      <Timeline
        events={events}
        currentIndex={currentIdx}
        onSelect={setCurrentIdx}
      />

      <CodeViewer
        codeLines={codeLines}
        currentLine={currentEvent.line_no}
        variables={currentEvent.locals}
      />
    </div>
  );
}

export default App;


