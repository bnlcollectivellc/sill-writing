'use client';

interface PromptDisplayProps {
  prompt: string;
  isComplete: boolean;
}

export default function PromptDisplay({ prompt, isComplete }: PromptDisplayProps) {
  return (
    <p
      className={`text-xl md:text-2xl text-center max-w-2xl leading-relaxed transition-colors duration-300 ${
        isComplete ? 'text-gray-500' : 'text-white'
      }`}
    >
      {prompt}
    </p>
  );
}
