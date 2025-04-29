import { useEffect, useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { CodeViewer } from '../components/CodeViewer';
import { Timeline } from '../components/Timeline';

type DebugFrame = {
  ts: number;
  filename: string;
  line_no: number;
  locals: Record<string, string>;
};

export default function SessionPlayer() {
  const [frames, setFrames] = useState<DebugFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [showFileUpload, setShowFileUpload] = useState(true);

  const handleFilesSelected = async (pythonFile: File, jsonlFile: File) => {
    try {
      // Read Python file
      const pythonText = await pythonFile.text();
      setCodeLines(pythonText.split('\n'));

      // Read JSONL file
      const jsonlText = await jsonlFile.text();
      const lines = jsonlText.trim().split('\n');
      const parsed = lines.map(line => JSON.parse(line));
      setFrames(parsed);
      setCurrentFrameIndex(0);
      setShowFileUpload(false);
    } catch (error) {
      console.error('Error reading files:', error);
      alert('Error reading files. Please make sure they are valid.');
    }
  };

  const currentFrame = frames[currentFrameIndex];

  return (
    <div className="flex justify-center items-center flex-col gap-4 w-screen h-screen">
      <h1 className="text-xl font-bold mb-4 flex items-center flex-col gap-1">Debug Session Player</h1>
      
      {showFileUpload ? (
        <FileUpload onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="space-y-4">
          <div className="flex space-x-4">
            <button 
              onClick={() => setCurrentFrameIndex(i => Math.max(0, i - 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ◀️ Prev
            </button>
            <button 
              onClick={() => setCurrentFrameIndex(i => Math.min(frames.length - 1, i + 1))}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next ▶️
            </button>
            <button 
              onClick={() => setShowFileUpload(true)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Load Different Files
            </button>
          </div>

          { currentFrame && (
            <Timeline 
              events={frames}
              currentIndex={currentFrameIndex}
              onSelect={setCurrentFrameIndex}
            />
          )}
  

          {currentFrame && (
            <CodeViewer
              codeLines={codeLines}
              currentLine={currentFrame.line_no}
              variables={currentFrame.locals}
              events={frames}
            />
          )}
        </div>
      )}
    </div>
  );
}
