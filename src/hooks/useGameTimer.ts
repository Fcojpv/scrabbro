import { useState, useEffect, useRef } from 'react';

export const useGameTimer = (isActive: boolean, isPaused: boolean = false) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      setElapsedSeconds(0);
      startTimeRef.current = null;
      pausedAtRef.current = null;
      finishedRef.current = false;
      setIsFinished(false);
      return;
    }

    if (isPaused) {
      if (pausedAtRef.current === null) pausedAtRef.current = Date.now();
      return;
    }

    if (pausedAtRef.current !== null && startTimeRef.current !== null) {
      startTimeRef.current += Date.now() - pausedAtRef.current;
    }
    pausedAtRef.current = null;

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);

        if (countdownMinutes !== null) {
          const totalSeconds = countdownMinutes * 60;
          if (elapsed >= totalSeconds && !finishedRef.current) {
            finishedRef.current = true;
            setIsFinished(true);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, countdownMinutes]);

  const startCountdown = (minutes: number) => {
    setCountdownMinutes(minutes);
    setElapsedSeconds(0);
    setIsFinished(false);
    finishedRef.current = false;
    startTimeRef.current = null;
  };

  const stopCountdown = () => {
    setCountdownMinutes(null);
    setIsFinished(false);
  };

  const formatTime = () => {
    if (countdownMinutes === null) {
      const minutes = Math.floor(elapsedSeconds / 60);
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;

      if (hours > 0) {
        return `${hours} h ${remainingMinutes} min`;
      }
      return `${minutes} min`;
    } else {
      const totalSeconds = countdownMinutes * 60;
      const remaining = totalSeconds - elapsedSeconds;
      const absRemaining = Math.abs(remaining);
      const mins = Math.floor(absRemaining / 60);
      const secs = absRemaining % 60;

      if (remaining <= 300 || remaining < 0) {
        const sign = remaining < 0 ? '-' : '';
        return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
      }

      return `${mins} min`;
    }
  };

  const getColorClass = () => {
    if (countdownMinutes === null) return '';

    const totalSeconds = countdownMinutes * 60;
    const remaining = totalSeconds - elapsedSeconds;

    if (remaining < 0) return 'text-[hsl(var(--timer-warning))]';
    if (remaining <= 60) return 'text-[hsl(var(--timer-danger))]';
    if (remaining <= 300) return 'text-[hsl(var(--timer-warning))]';
    return 'text-[hsl(var(--timer-safe))]';
  };

  return {
    elapsedSeconds,
    formatTime,
    startCountdown,
    stopCountdown,
    isCountdownActive: countdownMinutes !== null,
    isFinished,
    getColorClass,
  };
};
