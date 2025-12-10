'use client';

import Timer from './Timer';
import PromptDisplay from './PromptDisplay';
import TextArea from './TextArea';
import ControlButtons from './ControlButtons';
import ExportButton from './ExportButton';

interface WritingModeProps {
  prompt: string;
  promptCredit?: string;
  timeRemaining: number;
  isComplete: boolean;
  isStopped: boolean;
  text: string;
  isVisible: boolean;
  isAmbientMuted: boolean;
  isDarkMode: boolean;
  onTextChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
  onReroll: () => void;
  onStop: () => void;
  onResume: () => void;
  onBack: () => void;
  onExport: () => void;
  onToggleAmbient: () => void;
}

export default function WritingMode({
  prompt,
  promptCredit,
  timeRemaining,
  isComplete,
  isStopped,
  text,
  isVisible,
  isAmbientMuted,
  isDarkMode,
  onTextChange,
  onFocusChange,
  onReroll,
  onStop,
  onResume,
  onBack,
  onExport,
  onToggleAmbient,
}: WritingModeProps) {
  const showExport = isComplete || isStopped;
  const iconColor = isDarkMode ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-black';

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {/* Back Button - Top Left */}
      <button
        onClick={onBack}
        className={`fixed top-4 left-4 p-2 transition-colors ${iconColor}`}
        aria-label="Back to categories"
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
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      <Timer timeRemaining={timeRemaining} isComplete={isComplete || isStopped} isDarkMode={isDarkMode} />

      <PromptDisplay
        prompt={prompt}
        credit={promptCredit}
        isComplete={isComplete || isStopped}
        isDarkMode={isDarkMode}
      />

      <TextArea
        value={text}
        onChange={onTextChange}
        onFocusChange={onFocusChange}
        isDarkMode={isDarkMode}
      />

      <ControlButtons
        isStopped={isStopped}
        isDarkMode={isDarkMode}
        onReroll={onReroll}
        onStop={onStop}
        onResume={onResume}
      />

      {/* Export Button - shows when stopped or complete */}
      <div className={`flex gap-4 items-center transition-all duration-300 ${showExport ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <ExportButton isVisible={showExport} onExport={onExport} isDarkMode={isDarkMode} />
      </div>

      {/* Ambient Sound Toggle - Top Right */}
      <button
        onClick={onToggleAmbient}
        className={`fixed top-4 right-4 p-2 transition-colors ${iconColor}`}
        aria-label={isAmbientMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
      >
        {isAmbientMuted ? (
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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
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
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
      </button>
    </div>
  );
}
