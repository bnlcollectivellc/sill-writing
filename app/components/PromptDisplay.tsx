'use client';

interface PromptDisplayProps {
  prompt: string;
  credit?: string;
  isComplete: boolean;
  isDarkMode: boolean;
}

export default function PromptDisplay({ prompt, credit, isComplete, isDarkMode }: PromptDisplayProps) {
  const activeColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedColor = 'text-gray-500';

  return (
    <div className="text-center max-w-2xl">
      <p
        className={`text-xl md:text-2xl leading-relaxed transition-colors duration-300 ${
          isComplete ? mutedColor : activeColor
        }`}
      >
        {prompt}
      </p>
      {credit && (
        <p className={`mt-2 text-sm ${mutedColor}`}>
          — {credit}
        </p>
      )}
    </div>
  );
}
