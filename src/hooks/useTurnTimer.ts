import { useState, useEffect, useRef } from 'react';
import { createPausableClock } from '@/lib/pausableClock';

export const useTurnTimer = (currentTurn: number, isActive: boolean, customTimerMinutes?: number, isPaused = false) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [configuredMinutes, setConfiguredMinutes] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousTurnRef = useRef(currentTurn);
  const clockRef = useRef(createPausableClock());
  const durationRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset and restart timer when turn changes
    if (previousTurnRef.current !== currentTurn) {
      setIsFinished(false);
      // Priority: customTimerMinutes > configuredMinutes (global) > null
      const minutesToUse = customTimerMinutes ?? configuredMinutes;
      clockRef.current.reset();
      durationRef.current = minutesToUse !== null && minutesToUse > 0 ? minutesToUse * 60 : null;
      if (minutesToUse !== null && minutesToUse > 0) {
        setRemainingSeconds(minutesToUse * 60);
      } else {
        setRemainingSeconds(null);
      }
      previousTurnRef.current = currentTurn;
    }
  }, [currentTurn, configuredMinutes, customTimerMinutes]);

  useEffect(() => {
    if (!isActive || remainingSeconds === null || remainingSeconds <= 0) {
      return;
    }
    const clock = clockRef.current;
    clock.start(Date.now());
    if (isPaused) {
      clock.pause(Date.now());
      return;
    }
    clock.resume(Date.now());

    const interval = setInterval(() => {
      const duration = durationRef.current;
      if (duration !== null) setRemainingSeconds(Math.max(0, duration - Math.floor(clock.elapsed(Date.now()) / 1000)));
    }, 200);

    return () => clearInterval(interval);
  }, [isActive, remainingSeconds, isPaused]);

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
    clockRef.current.reset();
    durationRef.current = minutes * 60;
    setConfiguredMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsFinished(false);
  };

  const stopTimer = () => {
    clockRef.current.reset();
    durationRef.current = null;
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
