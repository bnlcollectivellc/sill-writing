'use client';

interface TimerProps {
  timeRemaining: number;
  isComplete: boolean;
}

export default function Timer({ timeRemaining, isComplete }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div
      className={`font-mono text-4xl transition-colors duration-300 ${
        isComplete ? 'text-gray-500' : 'text-white'
      }`}
    >
      {formattedTime}
    </div>
  );
}
