'use client';

import { useRef, useEffect } from 'react';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
}

export default function TextArea({ value, onChange, onFocusChange }: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => onFocusChange(false)}
      placeholder="Start writing..."
      className="w-full max-w-2xl h-64 md:h-80 bg-transparent text-white text-lg leading-relaxed resize-none focus:outline-none placeholder-gray-600"
    />
  );
}
