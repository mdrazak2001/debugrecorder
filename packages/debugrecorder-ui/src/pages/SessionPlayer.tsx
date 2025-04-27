import { useEffect, useState } from 'react';

type DebugFrame = {
  ts: number;
  filename: string;
  line_no: number;
  locals: Record<string, string>;
};

export default function SessionPlayer() {
  const [frames, setFrames] = useState<DebugFrame[]>([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    fetch('/sample-session.jsonl')
      .then(res => res.text())
      .then(text => {
        const lines = text.trim().split('\n');
        const parsed = lines.map(line => JSON.parse(line));
        setFrames(parsed);
      });
  }, []);

  const current = frames[currentFrameIndex];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Debug Session Player</h1>
      <div className="mt-4">
        {current ? (
          <>
            <p><strong>Line:</strong> {current.line_no}</p>
            <p><strong>Vars:</strong> {JSON.stringify(current.locals, null, 2)}</p>
            <button onClick={() => setCurrentFrameIndex((i) => Math.max(0, i - 1))}>◀️ Prev</button>
            <button onClick={() => setCurrentFrameIndex((i) => Math.min(frames.length - 1, i + 1))}>Next ▶️</button>
          </>
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </div>
  );
}
