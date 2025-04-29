import React, { useState, useCallback } from 'react';
import Dropzone, { DropzoneState } from 'shadcn-dropzone';
import { Upload, X } from "lucide-react";

interface FileUploadProps {
  onFilesSelected: (pythonFile: File, jsonlFile: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [pythonFile, setPythonFile] = useState<File | null>(null);
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    // Process dropped files
    acceptedFiles.forEach(file => {
      if (file.name.endsWith('.py')) {
        setPythonFile(file);
      } else if (file.name.endsWith('.jsonl')) {
        setJsonlFile(file);
      }
    });
  }, []);

  // Auto-submit when both files are present
  React.useEffect(() => {
    if (pythonFile && jsonlFile) {
      onFilesSelected(pythonFile, jsonlFile);
    }
  }, [pythonFile, jsonlFile, onFilesSelected]);

  return (
    <div className="max-w-xl mx-auto">
      <Dropzone
        onDrop={handleDrop}
        accept={{
          'text/x-python': ['.py'],
          'application/jsonl': ['.jsonl'],
          'text/plain': ['.py', '.jsonl']
        }}
        maxFiles={2}
      >
        {(dropzone: DropzoneState) => (
          <div 
            className={`custom-dropzone p-8 min-h-[300px] min-w-[300px] text-center flex flex-col justify-center ${
              dropzone.isDragAccept ? 'accept' : ''
            }`}
          >
            {dropzone.isDragAccept ? (
              <div className="text-lg font-medium text-blue-600">Drop your files here!</div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                  <Upload className="size-10 text-muted-foreground" />
                <p className="font-medium text-sm">Drag & drop files here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (max 2 files)
                </p>
              </div>
              
            )}

            <div className="text-sm space-y-2 mt-4">
              <div className="flex items-center justify-center gap-2">
                <span className={pythonFile ? 'font-medium text-green-600' : 'font-medium text-gray-400'}>
                  {pythonFile ? '✓ Python file selected' : '• Python file (.py)'}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className={jsonlFile ? 'font-medium text-green-600' : 'font-medium text-gray-400'}>
                  {jsonlFile ? '✓ Debug data selected' : '• Debug data (.jsonl)'}
                </span>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 font-medium mt-2">
                {error}
              </div>
            )}
          </div>
        )}
      </Dropzone>
      <br></br>
      <div className="text-sm text-gray-500 text-center mt-2">
        Upload both a Python source file (.py) and a debug session file (.jsonl)
      </div>
    </div>
  );
};