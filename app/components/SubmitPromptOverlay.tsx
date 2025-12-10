'use client';

import { useState } from 'react';
import { categories, Category } from '@/app/lib/prompts';

interface SubmitPromptOverlayProps {
  isOpen: boolean;
  isDarkMode: boolean;
  onClose: () => void;
}

export default function SubmitPromptOverlay({
  isOpen,
  isDarkMode,
  onClose,
}: SubmitPromptOverlayProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [promptText, setPromptText] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';
  const borderColor = isDarkMode ? 'border-white' : 'border-black';
  const hoverBg = isDarkMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white';
  const selectedBg = isDarkMode ? 'bg-white text-black' : 'bg-black text-white';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const placeholderColor = isDarkMode ? 'placeholder-gray-600' : 'placeholder-gray-400';

  const handleSubmit = async () => {
    if (!selectedCategory || !promptText.trim()) return;

    setIsSubmitting(true);

    try {
      // Send email via formsubmit.co (free email form service)
      const formData = new FormData();
      formData.append('_subject', 'SillWriting Submission');
      formData.append('category', selectedCategory);
      formData.append('prompt', promptText.trim());
      formData.append('name', name.trim() || 'Anonymous');
      formData.append('_captcha', 'false');

      await fetch('https://formsubmit.co/ajax/leopham00@gmail.com', {
        method: 'POST',
        body: formData,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      // Still show success - formsubmit might work even if response fails
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    // Reset state when closing
    setSelectedCategory(null);
    setPromptText('');
    setName('');
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${bgColor} ${textColor} z-50 flex flex-col items-center justify-center p-4 transition-all duration-300`}>
      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`fixed top-4 right-4 p-2 transition-colors ${mutedColor} hover:${textColor}`}
        aria-label="Close"
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
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {isSubmitted ? (
        // Success Message
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-medium mb-4">Thank you!</h2>
          <p className={`${mutedColor} mb-8`}>
            Your submission has been received. If accepted, you may bump into it as you use the site.
          </p>
          <button
            onClick={handleClose}
            className={`px-6 py-2 text-sm font-medium border rounded-full transition-all duration-300 ${borderColor} ${hoverBg}`}
          >
            Close
          </button>
        </div>
      ) : (
        // Submission Form
        <div className="w-full max-w-xl flex flex-col items-center gap-8">
          <h2 className="text-2xl font-medium">Submit a Prompt</h2>

          {/* Category Selection */}
          <div className="flex flex-row justify-center gap-3 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ease-out border rounded-full whitespace-nowrap ${borderColor} ${
                  selectedCategory === category
                    ? selectedBg
                    : `bg-transparent ${hoverBg}`
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Prompt Input */}
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Write your prompt question..."
            className={`w-full h-32 bg-transparent text-lg leading-relaxed resize-none focus:outline-none ${placeholderColor}`}
          />

          {/* Name Input (Optional) */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className={`w-full bg-transparent text-base focus:outline-none ${placeholderColor}`}
          />

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedCategory || !promptText.trim() || isSubmitting}
            className={`px-6 py-2 text-sm font-medium border rounded-full transition-all duration-300 ${borderColor} ${
              selectedCategory && promptText.trim() && !isSubmitting
                ? hoverBg
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
