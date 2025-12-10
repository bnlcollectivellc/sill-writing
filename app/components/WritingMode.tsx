'use client';

import Timer from './Timer';
import PromptDisplay from './PromptDisplay';
import TextArea from './TextArea';
import ControlButtons from './ControlButtons';
import ExportButton from './ExportButton';

interface WritingModeProps {
  prompt: string;
  timeRemaining: number;
  isComplete: boolean;
  isPaused: boolean;
  text: string;
  isVisible: boolean;
  isAmbientMuted: boolean;
  onTextChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
  onPauseResume: () => void;
  onReroll: () => void;
  onStop: () => void;
  onExport: () => void;
  onNewPrompt: () => void;
  onToggleAmbient: () => void;
}

export default function WritingMode({
  prompt,
  timeRemaining,
  isComplete,
  isPaused,
  text,
  isVisible,
  isAmbientMuted,
  onTextChange,
  onFocusChange,
  onPauseResume,
  onReroll,
  onStop,
  onExport,
  onNewPrompt,
  onToggleAmbient,
}: WritingModeProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 gap-8 transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <Timer timeRemaining={timeRemaining} isComplete={isComplete} />

      <PromptDisplay prompt={prompt} isComplete={isComplete} />

      <TextArea
        value={text}
        onChange={onTextChange}
        onFocusChange={onFocusChange}
      />

      <ControlButtons
        isPaused={isPaused}
        onPauseResume={onPauseResume}
        onReroll={onReroll}
        onStop={onStop}
      />

      <div className="flex gap-4 items-center">
        <ExportButton isVisible={isComplete} onExport={onExport} />
        {isComplete && (
          <button
            onClick={onNewPrompt}
            className="mt-4 px-6 py-2 text-sm font-medium border border-white rounded-full transition-all duration-300 ease-out hover:bg-white hover:text-black opacity-100"
          >
            New Prompt
          </button>
        )}
      </div>

      {/* Ambient Sound Toggle */}
      <button
        onClick={onToggleAmbient}
        className="fixed top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
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
