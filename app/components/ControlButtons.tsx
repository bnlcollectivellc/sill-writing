'use client';

interface ControlButtonsProps {
  isPaused: boolean;
  onPauseResume: () => void;
  onReroll: () => void;
  onStop: () => void;
}

export default function ControlButtons({
  isPaused,
  onPauseResume,
  onReroll,
  onStop,
}: ControlButtonsProps) {
  return (
    <div className="flex gap-6">
      <button
        onClick={onPauseResume}
        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        onClick={onReroll}
        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
      >
        Reroll
      </button>
      <button
        onClick={onStop}
        className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
      >
        Stop
      </button>
    </div>
  );
}
