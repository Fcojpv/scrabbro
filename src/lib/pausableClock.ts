export const createPausableClock = () => {
  let startedAt: number | null = null;
  let pausedAt: number | null = null;
  let pausedDuration = 0;
  return {
    start(now: number) {
      if (startedAt === null) startedAt = now;
    },
    pause(now: number) {
      if (startedAt !== null && pausedAt === null) pausedAt = now;
    },
    resume(now: number) {
      if (pausedAt !== null) {
        pausedDuration += now - pausedAt;
        pausedAt = null;
      }
    },
    elapsed(now: number) {
      if (startedAt === null) return 0;
      return Math.max(0, (pausedAt ?? now) - startedAt - pausedDuration);
    },
    reset() {
      startedAt = null;
      pausedAt = null;
      pausedDuration = 0;
    },
  };
};