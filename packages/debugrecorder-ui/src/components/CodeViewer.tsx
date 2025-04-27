// packages/debugrecorder-ui/src/components/CodeViewer.tsx
import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';

// Import Monaco Editor styles
import 'monaco-editor/min/vs/editor/editor.main.css';

interface CodeViewerProps {
  codeLines: string[];
  currentLine: number;
  variables: Record<string, string>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ codeLines, currentLine, variables }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Initialize Monaco Editor
      editorInstance.current = monaco.editor.create(editorRef.current, {
        value: codeLines.join('\n'),
        language: 'python',
        theme: 'vs-dark',
        readOnly: true,
        minimap: { enabled: true },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        glyphMargin: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
      });

      // Add hover provider for variables
      monaco.languages.registerHoverProvider('python', {
        provideHover: (model, position) => {
          const word = model.getWordAtPosition(position);
          if (!word) return null;

          const variableName = word.word;
          if (variables[variableName]) {
            return {
              contents: [
                { value: `**${variableName}** = ${variables[variableName]}` }
              ]
            };
          }
          return null;
        }
      });

      // Highlight current line
      editorInstance.current.deltaDecorations([], [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'current-line-highlight',
            glyphMarginClassName: 'current-line-glyph'
          }
        }
      ]);
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.dispose();
      }
    };
  }, [codeLines, currentLine, variables]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        height: '500px', 
        border: '1px solid #333',
        borderRadius: '4px'
      }} 
    />
  );
};
