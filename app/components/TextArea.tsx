'use client';

import { useRef, useEffect } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
  isDarkMode: boolean;
}

export default function TextArea({ value, onChange, onFocusChange, isDarkMode }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const placeholderColor = isDarkMode ? 'placeholder-gray-600' : 'placeholder-gray-400';

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      placeholder="Start writing..."
      className={`w-full max-w-2xl h-64 md:h-80 bg-transparent text-lg leading-relaxed resize-none focus:outline-none ${textColor} ${placeholderColor}`}
    />
  );
}
