import { describe, expect, test } from 'bun:test';
import { createPausableClock } from './pausableClock';

describe('feedback pause', () => {
  test('freezes elapsed time while feedback is open', () => {
    const clock = createPausableClock();
    clock.start(1000);
    clock.pause(6200);
    expect(clock.elapsed(36200)).toBe(5200);
  });
  test('resumes a one-minute turn with the same remaining time', () => {
    const clock = createPausableClock();
    clock.start(0);
    clock.pause(10000);
    clock.resume(40000);
    expect(60 - Math.floor(clock.elapsed(40000) / 1000)).toBe(50);
    expect(60 - Math.floor(clock.elapsed(42000) / 1000)).toBe(48);
  });
  test('does not count repeated pause requests twice', () => {
    const clock = createPausableClock();
    clock.start(0);
    clock.pause(5000);
    clock.pause(7000);
    clock.resume(10000);
    clock.resume(12000);
    expect(clock.elapsed(15000)).toBe(10000);
  });
});