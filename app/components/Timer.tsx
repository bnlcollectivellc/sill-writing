'use client';

interface TimerProps {
  timeRemaining: number;
  isComplete: boolean;
  isDarkMode: boolean;
}

export default function Timer({ timeRemaining, isComplete, isDarkMode }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const activeColor = isDarkMode ? 'text-white' : 'text-black';
  const mutedColor = 'text-gray-500';

  return (
    <div
      className={`font-mono text-4xl transition-colors duration-300 ${
        isComplete ? mutedColor : activeColor
      }`}
    >
      {formattedTime}
    </div>
  );
}
