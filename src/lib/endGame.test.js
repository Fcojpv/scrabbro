import { test, expect } from "bun:test";
import { SURPRISE_EMOJI_DURATION_MS } from "./endGame.ts";

test("surprise emojis last 30 seconds after cancelling", () => {
  expect(SURPRISE_EMOJI_DURATION_MS).toBe(30000);
});
