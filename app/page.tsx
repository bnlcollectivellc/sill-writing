'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import CategoryPills from './components/CategoryPills';
import WritingMode from './components/WritingMode';
import { Category, prompts } from './lib/prompts';
import { playChime, startAmbientSound, stopAmbientSound } from './lib/sounds';
import { exportToPdf } from './lib/exportPdf';

type AppState = 'landing' | 'writing' | 'complete';

const TIMER_DURATION = 10 * 60; // 10 minutes in seconds

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [shownPrompts, setShownPrompts] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [userText, setUserText] = useState('');
  const [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  const [isLandingVisible, setIsLandingVisible] = useState(true);
  const [isWritingVisible, setIsWritingVisible] = useState(false);
  const [isAmbientMuted, setIsAmbientMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasPlayedChime = useRef(false);

  // Get a random prompt that hasn't been shown yet
  const getRandomPrompt = useCallback(
    (category: Category, currentShown: Set<string>): string => {
      const categoryPrompts = prompts[category];
      const availablePrompts = categoryPrompts.filter((p) => !currentShown.has(p));

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
    if (appState === 'writing' && !isPaused && timeRemaining > 0) {
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
  }, [appState, isPaused, timeRemaining]);

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
      if (appState !== 'writing' && appState !== 'complete') return;
      if (isTextAreaFocused) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handlePauseResume();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleReroll();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState, isTextAreaFocused, selectedCategory, shownPrompts]);

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleStart = () => {
    if (!selectedCategory) return;

    const prompt = getRandomPrompt(selectedCategory, shownPrompts);
    setCurrentPrompt(prompt);
    setShownPrompts((prev) => new Set([...prev, prompt]));

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

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
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
    setShownPrompts((prev) => new Set([...prev, newPrompt]));
    setTimeRemaining(TIMER_DURATION);
    setIsPaused(false);
    hasPlayedChime.current = false;

    if (appState === 'complete') {
      setAppState('writing');
    }
  };

  const handleStop = () => {
    setIsWritingVisible(false);
    stopAmbientSound();
    setTimeout(() => {
      setAppState('landing');
      setSelectedCategory(null);
      setCurrentPrompt('');
      setTimeRemaining(TIMER_DURATION);
      setIsPaused(false);
      setUserText('');
      hasPlayedChime.current = false;
      setIsLandingVisible(true);
    }, 300);
  };

  const handleExport = () => {
    if (!selectedCategory) return;
    exportToPdf({
      category: selectedCategory,
      prompt: currentPrompt,
      text: userText,
    });
  };

  const handleNewPrompt = () => {
    handleStop();
  };

  const handleToggleAmbient = () => {
    if (isAmbientMuted) {
      startAmbientSound();
    } else {
      stopAmbientSound();
    }
    setIsAmbientMuted(!isAmbientMuted);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {(appState === 'landing') && (
        <CategoryPills
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
          onStart={handleStart}
          isVisible={isLandingVisible}
        />
      )}

      {(appState === 'writing' || appState === 'complete') && (
        <WritingMode
          prompt={currentPrompt}
          timeRemaining={timeRemaining}
          isComplete={appState === 'complete'}
          isPaused={isPaused}
          text={userText}
          isVisible={isWritingVisible}
          isAmbientMuted={isAmbientMuted}
          onTextChange={setUserText}
          onFocusChange={setIsTextAreaFocused}
          onPauseResume={handlePauseResume}
          onReroll={handleReroll}
          onStop={handleStop}
          onExport={handleExport}
          onNewPrompt={handleNewPrompt}
          onToggleAmbient={handleToggleAmbient}
        />
      )}

      {/* Audio Credits */}
      <footer className="fixed bottom-4 left-0 right-0 text-center">
        <a
          href="https://freesound.org/people/PatrickLieberkind/sounds/214334/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Ambient sound by PatrickLieberkind
        </a>
      </footer>
    </main>
  );
}
