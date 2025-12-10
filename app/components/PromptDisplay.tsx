'use client';

interface PromptDisplayProps {
  prompt: string;
  isComplete: boolean;
  isDarkMode: boolean;
}

export default function PromptDisplay({ prompt, isComplete, isDarkMode }: PromptDisplayProps) {
  const activeColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedColor = 'text-gray-500';

  return (
    <p
      className={`text-xl md:text-2xl text-center max-w-2xl leading-relaxed transition-colors duration-300 ${
        isComplete ? mutedColor : activeColor
      }`}
    >
      {prompt}
    </p>
  );
}
