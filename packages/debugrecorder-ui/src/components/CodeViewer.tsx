// packages/debugrecorder-ui/src/components/CodeViewer.tsx
import React from "react";

interface CodeViewerProps {
  codeLines: string[];
  currentLine: number;
  variables: Record<string, string>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ codeLines, currentLine, variables }) => {
  return (
    <div className="font-mono text-sm">
      {codeLines.map((line, index) => (
        <div
          key={index}
          style={{
            background: index + 1 === currentLine ? "#e0f7fa" : "transparent",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          <span style={{ marginRight: 8, color: "#999" }}>{index + 1}</span>
          {line}
          {index + 1 === currentLine && (
            <span className="ml-4 text-green-700">
              {Object.entries(variables).map(([k, v]) => `${k}=${v}`).join(", ")}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};
