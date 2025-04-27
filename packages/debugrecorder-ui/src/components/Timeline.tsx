// packages/debugrecorder-ui/src/components/Timeline.tsx
import React from "react";

interface TimelineProps {
  events: any[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ events, currentIndex, onSelect }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto my-4">
      {events.map((event, index) => (
        <button
          key={index}
          className={`px-2 py-1 border rounded ${index === currentIndex ? 'bg-blue-300' : 'bg-white'}`}
          onClick={() => onSelect(index)}
        >
          {index}
        </button>
      ))}
    </div>
  );
};
