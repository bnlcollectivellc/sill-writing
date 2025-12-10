'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CategoryPills from './components/CategoryPills';
import WritingMode from './components/WritingMode';
import SubmitPromptOverlay from './components/SubmitPromptOverlay';
import { Category, Prompt, prompts } from './lib/prompts';
import { playChime, startAmbientSound, stopAmbientSound } from './lib/sounds';
import { exportToPdf } from './lib/exportPdf';

type AppState = 'landing' | 'writing' | 'complete' | 'stopped';

const TIMER_DURATION = 10 * 60; // 10 minutes in seconds

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [shownPrompts, setShownPrompts] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [userText, setUserText] = useState('');
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [isWritingVisible, setIsWritingVisible] = useState(false);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSubmitOverlayOpen, setIsSubmitOverlayOpen] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedChime = useRef(false);

  // Get a random prompt that hasn't been shown yet
  const getRandomPrompt = useCallback(
    (category: Category, currentShown: Set<string>): Prompt => {
      const categoryPrompts = prompts[category];
      const availablePrompts = categoryPrompts.filter((p) => !currentShown.has(p.text));

      // If all prompts shown, reset and allow repeats
      if (availablePrompts.length === 0) {
        const randomIndex = Math.floor(Math.random() * categoryPrompts.length);
        return categoryPrompts[randomIndex];
      }

      const randomIndex = Math.floor(Math.random() * availablePrompts.length);
      return availablePrompts[randomIndex];
    },
    []
  );

  // Timer logic
  useEffect(() => {
    if (appState === 'writing' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setAppState('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appState, timeRemaining]);

  // Play chime when timer completes
  useEffect(() => {
    if (appState === 'complete' && !hasPlayedChime.current) {
      hasPlayedChime.current = true;
      playChime();
    }
  }, [appState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture shortcuts when submit overlay is open (except Escape)
      if (isSubmitOverlayOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsSubmitOverlayOpen(false);
        }
        return;
      }

      // Escape goes back to landing
      if (e.key === 'Escape') {
        e.preventDefault();
        handleBackToLanding();
        return;
      }

      if (appState !== 'writing' && appState !== 'complete' && appState !== 'stopped') return;
      if (isTextAreaFocused) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        // Spacebar toggles stop/resume
        if (appState === 'stopped') {
          handleResume();
        } else if (appState === 'writing') {
          handleStop();
        }
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReroll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, isTextAreaFocused, selectedCategory, shownPrompts, isSubmitOverlayOpen]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleStart = () => {
    if (!selectedCategory) return;

    const prompt = getRandomPrompt(selectedCategory, shownPrompts);
    setCurrentPrompt(prompt);
    setShownPrompts((prev) => new Set([...prev, prompt.text]));

    // Start ambient sound
    if (!isAmbientMuted) {
      startAmbientSound();
    }

    // Transition animation
    setIsLandingVisible(false);
    setTimeout(() => {
      setAppState('writing');
      setIsWritingVisible(true);
    }, 300);
  };

  const handleReroll = () => {
    if (!selectedCategory) return;

    // Check if all prompts have been shown
    const categoryPrompts = prompts[selectedCategory];
    let newShownPrompts = shownPrompts;

    if (shownPrompts.size >= categoryPrompts.length) {
      // Reset shown prompts for this session
      newShownPrompts = new Set();
      setShownPrompts(newShownPrompts);
    }

    const newPrompt = getRandomPrompt(selectedCategory, newShownPrompts);
    setCurrentPrompt(newPrompt);
    setShownPrompts((prev) => new Set([...prev, newPrompt.text]));
    setTimeRemaining(TIMER_DURATION);
    hasPlayedChime.current = false;

    if (appState === 'complete' || appState === 'stopped') {
      setAppState('writing');
    }
  };

  // Stop button - pauses timer, shows export
  const handleStop = () => {
    setAppState('stopped');
  };

  // Resume from stopped state
  const handleResume = () => {
    setAppState('writing');
  };

  // Back to landing - full reset
  const handleBackToLanding = () => {
    setIsWritingVisible(false);
    stopAmbientSound();
    setTimeout(() => {
      setAppState('landing');
      setSelectedCategory(null);
      setCurrentPrompt(null);
      setTimeRemaining(TIMER_DURATION);
      setUserText('');
      hasPlayedChime.current = false;
      setIsLandingVisible(true);
    }, 300);
  };

  const handleExport = () => {
    if (!selectedCategory || !currentPrompt) return;
    exportToPdf({
      category: selectedCategory,
      prompt: currentPrompt.text,
      text: userText,
    });
  };

  const handleToggleAmbient = () => {
    if (isAmbientMuted) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
    setIsAmbientMuted(!isAmbientMuted);
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const bgColor = isDarkMode ? 'bg-black' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  return (
    <main className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}>
      {(appState === 'landing') && (
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onStart={handleStart}
          isVisible={isLandingVisible}
          isDarkMode={isDarkMode}
        />
      )}

      {(appState === 'writing' || appState === 'complete' || appState === 'stopped') && (
        <WritingMode
          prompt={currentPrompt?.text || ''}
          promptCredit={currentPrompt?.credit}
          timeRemaining={timeRemaining}
          isComplete={appState === 'complete'}
          isStopped={appState === 'stopped'}
          text={userText}
          isVisible={isWritingVisible}
          isAmbientMuted={isAmbientMuted}
          isDarkMode={isDarkMode}
          onTextChange={setUserText}
          onFocusChange={setIsTextAreaFocused}
          onReroll={handleReroll}
          onStop={handleStop}
          onResume={handleResume}
          onBack={handleBackToLanding}
          onExport={handleExport}
          onToggleAmbient={handleToggleAmbient}
        />
      )}

      {/* Submit Prompt Overlay */}
      <SubmitPromptOverlay
        isOpen={isSubmitOverlayOpen}
        isDarkMode={isDarkMode}
        onClose={() => setIsSubmitOverlayOpen(false)}
      />

      {/* Submit Prompt Button - Bottom Left */}
      <button
        onClick={() => setIsSubmitOverlayOpen(true)}
        className={`fixed bottom-4 left-4 w-10 h-10 rounded-full transition-colors duration-300 flex items-center justify-center ${
          isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
        }`}
        aria-label="Submit a prompt"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>
      </button>

      {/* Theme Toggle - Bottom Right */}
      <button
        onClick={handleToggleTheme}
        className={`fixed bottom-4 right-4 w-10 h-10 rounded-full transition-colors duration-300 ${
          isDarkMode ? 'bg-white' : 'bg-black'
        }`}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      />

      {/* Audio Credits */}
      <footer className="fixed bottom-4 left-0 right-0 text-center pointer-events-none">
        <a
          href="https://freesound.org/people/PatrickLieberkind/sounds/214334/"
          target="_blank"
          rel="noopener noreferrer"
          className={`text-xs pointer-events-auto transition-colors ${
            isDarkMode ? 'text-gray-600 hover:text-gray-400' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          Ambient sound by PatrickLieberkind
        </a>
      </footer>
    </main>
  );
}
