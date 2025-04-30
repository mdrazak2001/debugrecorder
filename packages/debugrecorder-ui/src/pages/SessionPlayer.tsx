import { useEffect, useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { CodeViewer } from '../components/CodeViewer';
import { Timeline } from '../components/Timeline';
import { StepBack, StepForward } from 'lucide-react';

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
      const pythonText = await pythonFile.text();
      setCodeLines(pythonText.split('\n'));

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
    <div className="p">
      <h1 className="text-xl font-bold mb-4 flex items-center flex-col gap-1 chat-text">Debug Session Player</h1>
      
      {showFileUpload ? (
        <FileUpload onFilesSelected={handleFilesSelected} />
      ) : (
        <div className="space-y-4">
        

          {/* Code + variables view */}
          {currentFrame && (
            <CodeViewer
              codeLines={codeLines}
              currentLine={currentFrame.line_no}
              variables={currentFrame.locals}
              events={frames}
            />
          )}

          {/* Control bar with centered back/forward and right-aligned load button */}
          <div className="flex">
            {/* <div className="w-200 flex-1 "></div> */}
            <div className="play-button">
              <button
                onClick={() => setCurrentFrameIndex(i => Math.max(0, i - 1))}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <StepBack />
              </button>
              <button
                onClick={() => setCurrentFrameIndex(i => Math.min(frames.length - 1, i + 1))}
                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <StepForward />
              </button>
            </div>
            {/* <div className="flex-1" /> */}

            <button
              onClick={() => setShowFileUpload(true)}
              className="ml-auto p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Load Different Files
            </button>
            <div />
          </div>

          {currentFrame && (
            <Timeline
              events={frames}
              currentIndex={currentFrameIndex}
              onSelect={setCurrentFrameIndex}
            />
          )}

        </div>
      )}
    </div>
  );
}
