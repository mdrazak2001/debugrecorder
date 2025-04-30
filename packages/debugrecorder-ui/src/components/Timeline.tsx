// packages/debugrecorder-ui/src/components/Timeline.tsx
import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface TimelineProps {
  events: any[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ events, currentIndex, onSelect }) => {
  const [inputStep, setInputStep] = useState(currentIndex + 1);

  const handleValueChange = (values: number[]) => {
    onSelect(Math.round(values[0]));
    setInputStep(Math.round(values[0]) + 1);
  };

  const handleStepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setInputStep(value);
  };

  const handleStepInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIndex = Math.min(Math.max(0, inputStep - 1), events.length - 1);
    onSelect(newIndex);
  };

  // Update input when currentIndex changes from outside
  React.useEffect(() => {
    setInputStep(currentIndex + 1);
  }, [currentIndex]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow chat-text jump-to-button">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <form onSubmit={handleStepInputSubmit} className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Jump to Step</span>
            <input
              type="number"
              value={inputStep}
              onChange={handleStepInputChange}
              min={1}
              max={events.length}
              className="input-field"
              aria-label="Step number"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">of {events.length}</span>
          </form>
          {/* <span className="text-sm text-gray-500 dark:text-gray-400">
            Line {events[currentIndex]?.line_no}
          </span> */}
        </div>
        
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[currentIndex]}
          max={events.length - 1}
          step={1}
          onValueChange={handleValueChange}
          aria-label="Timeline Position"
        >
          <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-[3px]">
            <Slider.Range className="absolute bg-blue-500 dark:bg-blue-400 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white dark:bg-gray-200 shadow-lg rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </Slider.Root>

        {/* <div className="flex justify-between">
          <button
            onClick={() => onSelect(Math.max(0, currentIndex - 1))}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => onSelect(Math.min(events.length - 1, currentIndex + 1))}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentIndex === events.length - 1}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};
