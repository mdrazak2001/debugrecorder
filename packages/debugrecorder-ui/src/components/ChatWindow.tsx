import React, { useState, useRef, useEffect } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // TODO: Here you'll integrate your LLM response logic
  };

  return (
    <div className="chat-window h-full flex flex-col text-white-100">
      <div className="chat-header p-2 border-b border-gray-700 bg-[#252526] flex items-center justify-between">
        <h2 className="text-sm font-medium chat-text">AI Assistant</h2>
      </div>

      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e1e1e] chat-text">
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
            placeholder="Ask a question..."
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