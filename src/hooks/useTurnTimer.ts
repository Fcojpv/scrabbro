import { useState, useEffect, useRef } from 'react';

export const useTurnTimer = (currentTurn: number, isActive: boolean) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [configuredMinutes, setConfiguredMinutes] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTurnRef = useRef(currentTurn);

  useEffect(() => {
    // Reset and restart timer when turn changes
    if (previousTurnRef.current !== currentTurn) {
      setIsFinished(false);
      // Restart timer with the same duration if it was configured
      if (configuredMinutes !== null) {
        setRemainingSeconds(configuredMinutes * 60);
      }
      previousTurnRef.current = currentTurn;
    }
  }, [currentTurn, configuredMinutes]);

  useEffect(() => {
    if (!isActive || remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null || prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds]);

  useEffect(() => {
    if (remainingSeconds === 0 && !isFinished) {
      setIsFinished(true);
      playSound();
    }
  }, [remainingSeconds, isFinished]);

  const playSound = () => {
    // Create a simple triangle sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 1760; // High A note (triangle-like)
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startTimer = (minutes: number) => {
    setConfiguredMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsFinished(false);
  };

  const stopTimer = () => {
    setConfiguredMinutes(null);
    setRemainingSeconds(null);
    setIsFinished(false);
  };

  const formatTime = () => {
    if (remainingSeconds === null) return null;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getColorClass = () => {
    if (remainingSeconds === null) return '';
    if (remainingSeconds <= 10) return 'text-[hsl(var(--timer-danger))]';
    if (remainingSeconds <= 30) return 'text-[hsl(var(--timer-warning))]';
    return 'text-[hsl(var(--timer-safe))]';
  };

  return {
    remainingSeconds,
    isFinished,
    startTimer,
    stopTimer,
    formatTime,
    getColorClass,
    isActive: remainingSeconds !== null && remainingSeconds > 0,
  };
};
