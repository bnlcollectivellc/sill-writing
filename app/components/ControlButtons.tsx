'use client';

interface ControlButtonsProps {
  isPaused: boolean;
  isStopped: boolean;
  isDarkMode: boolean;
  onPauseResume: () => void;
  onReroll: () => void;
  onStop: () => void;
  onResume: () => void;
}

export default function ControlButtons({
  isPaused,
  isStopped,
  isDarkMode,
  onPauseResume,
  onReroll,
  onStop,
  onResume,
}: ControlButtonsProps) {
  const mutedColor = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';
  const invertedBg = isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800';

  return (
    <div className="flex gap-6">
      <button
        onClick={onPauseResume}
        className={`px-4 py-2 text-sm transition-colors duration-200 ${mutedColor}`}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <button
        onClick={onReroll}
        className={`px-4 py-2 text-sm transition-colors duration-200 ${mutedColor}`}
      >
        Reroll
      </button>
      {isStopped ? (
        <button
          onClick={onResume}
          className={`px-4 py-2 text-sm rounded-full transition-colors duration-200 ${invertedBg}`}
        >
          Resume
        </button>
      ) : (
        <button
          onClick={onStop}
          className={`px-4 py-2 text-sm transition-colors duration-200 ${mutedColor}`}
        >
          Stop
        </button>
      )}
    </div>
  );
}
