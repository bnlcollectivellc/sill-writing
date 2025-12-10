'use client';

interface ControlButtonsProps {
  isStopped: boolean;
  isDarkMode: boolean;
  onReroll: () => void;
  onStop: () => void;
  onResume: () => void;
}

export default function ControlButtons({
  isStopped,
  isDarkMode,
  onReroll,
  onStop,
  onResume,
}: ControlButtonsProps) {
  const mutedColor = isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black';
  const invertedBg = isDarkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800';

  return (
    <div className="flex gap-8 items-center">
      {/* Reroll Button - Circular arrow */}
      <button
        onClick={onReroll}
        className={`p-3 transition-colors duration-200 ${mutedColor}`}
        aria-label="Reroll prompt"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
        </svg>
      </button>

      {/* Stop/Resume Button - Play/Stop icons */}
      {isStopped ? (
        <button
          onClick={onResume}
          className={`p-3 rounded-full transition-colors duration-200 ${invertedBg}`}
          aria-label="Resume"
        >
          {/* Play icon (triangle) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </button>
      ) : (
        <button
          onClick={onStop}
          className={`p-3 transition-colors duration-200 ${mutedColor}`}
          aria-label="Stop"
        >
          {/* Stop icon (square) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="none"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
        </button>
      )}
    </div>
  );
}
