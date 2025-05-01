import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { editor } from 'monaco-editor';
import { ChatWindow } from './ChatWindow';

// Import Monaco Editor styles
import 'monaco-editor/min/vs/editor/editor.main.css';

interface CodeViewerProps {
  codeLines: string[];
  currentLine: number;
  variables: Record<string, string>;
  events: Array<{
    ts: number;
    filename: string;
    line_no: number;
    locals: Record<string, string>;
  }>;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ codeLines, currentLine, variables, events }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<editor.IStandaloneCodeEditor | null>(null);
  const hoverProvider = useRef<monaco.IDisposable | null>(null);

  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !editorRef.current || !chatRef.current) return;

    // Create the editor
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

    // Add chat toggle action to editor
    editorInstance.current.addAction({
      id: 'toggle-chat',
      label: 'Toggle Chat',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyI],
      run: () => setShowChat(prev => !prev)
    });

    // Handle editor layout
    const updateLayout = () => {
      if (!containerRef.current || !editorRef.current || !chatRef.current || !editorInstance.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const chatWidth = showChat ? 400 : 0;
      const editorWidth = containerWidth - chatWidth;

      editorRef.current.style.width = `${editorWidth}px`;
      chatRef.current.style.width = `${chatWidth}px`;
      chatRef.current.style.display = showChat ? 'block' : 'none';

      editorInstance.current.layout();
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);

    editorInstance.current.revealLineInCenter(currentLine);

    return () => {
      window.removeEventListener('resize', updateLayout);
      if (editorInstance.current) {
        editorInstance.current.dispose();
      }
    };
  }, [codeLines, showChat]);

  // Handle variable hover - use a separate effect to properly dispose and recreate
  useEffect(() => {
    if (!editorInstance.current) return;

    // Remove previous hover provider if exists
    if (hoverProvider.current) {
      hoverProvider.current.dispose();
      hoverProvider.current = null;
    }

    // Register new hover provider
    hoverProvider.current = monaco.languages.registerHoverProvider('python', {
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

    editorInstance.current.revealLineInCenter(currentLine);

    // Highlight current line
    const decorations = editorInstance.current.deltaDecorations([], [
      {
        range: new monaco.Range(currentLine, 1, currentLine, 1),
        options: {
          isWholeLine: true,
          className: 'current-line-highlight',
          glyphMarginClassName: 'current-line-glyph'
        }
      }
    ]);

    // Keep current line in view
    editorInstance.current.revealLineInCenter(currentLine);

    // Cleanup function to remove decorations
    return () => {
      if (editorInstance.current) {
        editorInstance.current.deltaDecorations(decorations, []);
      }
    };
  }, [currentLine, variables]);

  return (
    <div 
      ref={containerRef} 
      className="editor-container" 
      style={{ 
        display: 'flex',
        height: '500px',
        position: 'relative',
        border: '1px solid #333',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <div 
        ref={editorRef}
        style={{ 
          height: '100%',
          flexGrow: 1
        }} 
      />
      <div 
        ref={chatRef}
        className="chat-panel"
        style={{
          height: '100%',
          borderLeft: '1px solid #333',
          backgroundColor: '#1e1e1e',
          display: showChat ? 'block' : 'none'
        }}
      >
        <ChatWindow 
          currentFile={codeLines.join('\n')}
          currentLine={currentLine}
          variables={variables}
          events={events}
        />
      </div>
    </div>
  );
};