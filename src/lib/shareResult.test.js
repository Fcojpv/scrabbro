import { describe, expect, test } from "bun:test";
import { createResultUrl, readResultHash, canShareImage } from "./shareResult";

const result = { players: [{ id: 1, name: "Ana👨‍👩‍👧‍👦", score: 1234 }, { id: 2, name: "Luis", score: 999 }], roundNumber: 4, language: "es", theme: "classic", date: "22/10/2026" };

describe("result transfer", () => {
  test("preserves the ranking in a different browser without storage", () => {
    const url = new URL(createResultUrl(result, "https://scrabbro.lovable.app"));
    expect(url.pathname).toBe("/result");
    expect(url.search).toBe("");
    expect(readResultHash(url.hash)).toEqual(result);
  });
  test("accepts 15 graphemes and rejects 16", () => {
    const make = name => ({ ...result, players: [{ id: 1, name, score: 1 }] });
    expect(() => createResultUrl(make("😀".repeat(15)), "https://scrabbro.lovable.app")).not.toThrow();
    expect(() => createResultUrl(make("😀".repeat(16)), "https://scrabbro.lovable.app")).toThrow();
  });
  test("accepts 9999 and rejects a greater score", () => {
    const make = score => ({ ...result, players: [{ id: 1, name: "Ana", score }] });
    expect(() => createResultUrl(make(9999), "https://scrabbro.lovable.app")).not.toThrow();
    expect(() => createResultUrl(make(10000), "https://scrabbro.lovable.app")).toThrow();
  });
  test("rejects corrupted result links", () => {
    expect(readResultHash("#%XX")).toBeNull();
    expect(readResultHash("#{}" )).toBeNull();
  });
  test("treats a throwing file-share capability check as unsupported", () => {
    const old = globalThis.navigator;
    Object.defineProperty(globalThis, "navigator", { configurable: true, value: { share() {}, canShare() { throw new Error("unsupported"); } } });
    try { expect(canShareImage(new File(["png"], "test.png"))).toBe(false); }
    finally { Object.defineProperty(globalThis, "navigator", { configurable: true, value: old }); }
  });
});