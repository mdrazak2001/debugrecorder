import React, { useState } from 'react';

interface FileUploadProps {
  onFilesSelected: (pythonFile: File, jsonlFile: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const [pythonFile, setPythonFile] = useState<File | null>(null);
  const [jsonlFile, setJsonlFile] = useState<File | null>(null);

  const handlePythonFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.py')) {
      setPythonFile(file);
    } else {
      alert('Please select a Python file (.py)');
    }
  };

  const handleJsonlFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.jsonl')) {
      setJsonlFile(file);
    } else {
      alert('Please select a JSONL file (.jsonl)');
    }
  };

  const handleSubmit = () => {
    if (pythonFile && jsonlFile) {
      onFilesSelected(pythonFile, jsonlFile);
    } else {
      alert('Please select both a Python file and a JSONL file');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Python Source File
        </label>
        <input
          type="file"
          accept=".py"
          onChange={handlePythonFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Debug Session File (JSONL)
        </label>
        <input
          type="file"
          accept=".jsonl"
          onChange={handleJsonlFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!pythonFile || !jsonlFile}
        className="px-4 py-2 bg-blue-600 text-white rounded-md
          hover:bg-blue-700 disabled:bg-gray-400
          disabled:cursor-not-allowed"
      >
        Load Files
      </button>
    </div>
  );
}; 