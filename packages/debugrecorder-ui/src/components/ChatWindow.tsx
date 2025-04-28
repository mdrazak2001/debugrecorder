import React, { useState, useRef, useEffect } from 'react';
import { LLMService, LLMProvider } from '../services/llm/llmService';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWindowProps {
  currentFile: string;
  currentLine: number;
  variables: Record<string, string>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ currentFile, currentLine, variables }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [provider, setProvider] = useState<LLMProvider>("gpt-3.5-turbo");
  const [apiKey, setApiKey] = useState('');
  const llmServiceRef = useRef<LLMService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConfig = () => {
    if (!apiKey) return;
    llmServiceRef.current = new LLMService({ provider, apiKey });
    setIsConfigured(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !llmServiceRef.current) return;

    const newMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    try {
      const response = await llmServiceRef.current.getResponse(inputText, {
        currentFile,
        currentLine,
        variables
      });

      const aiMessage: Message = {
        text: response as string,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        text: "Sorry, there was an error generating the response. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return !isConfigured ? (
    <div className="chat-window h-full flex flex-col chat-text">
      <div className="chat-header p-2 border-b border-gray-700 bg-[#252526] flex items-center justify-between">
        <h2 className="text-sm font-medium">Configure AI Assistant</h2>
      </div>
      <div className="flex-1 p-4 space-y-4 bg-[#1e1e1e]">
        <div className="space-y-2">
          <label className="block">
            Model:
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as LLMProvider)}
              className="ml-2 p-1 rounded bg-[#3C3C3C] border border-gray-700"
            >
              <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
              <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
              <option value="gemma-7b-it">Google Gemma 7B IT</option>
            </select>
          </label>
          <br></br>
          <br></br>
          <label className="block">
            API Key:
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="ml-2 p-1 rounded bg-[#3C3C3C] border border-gray-700 w-64"
            />
          </label>
          <button
            onClick={handleConfig}
            className="px-4 py-2 bg-[#0E639C] text-white rounded hover:bg-[#1177bb]"
          >
            Configure
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="chat-window h-full flex flex-col chat-text">
      <div className="chat-header p-2 border-b border-gray-700 bg-[#252526] flex items-center justify-between">
        <h2 className="text-sm font-medium">AI Assistant ({provider})</h2>
      </div>

      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded p-3 ${
                message.isUser
                  ? 'bg-[#0E639C] text-white'
                  : 'bg-[#2D2D2D] text-gray-100'
              }`}
            >
              <div className="text-xs opacity-50 mb-1">
                {message.isUser ? 'You' : 'Assistant'} • {message.timestamp.toLocaleTimeString()}
              </div>
              <div className="prose prose-invert">
                {message.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input p-3 border-t border-gray-700 bg-[#252526]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about the current debugging state..."
            className="flex-1 p-2 rounded bg-[#3C3C3C] border border-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#0E639C]"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-[#0E639C] text-white rounded hover:bg-[#1177bb] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};