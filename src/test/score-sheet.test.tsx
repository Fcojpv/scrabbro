import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ScoreHistory, getPlayerLabel, hasHiddenScores } from "@/components/ScoreHistory";
import { LanguageProvider } from "@/contexts/LanguageContext";

afterEach(cleanup);

describe("Hidden rounds detection", () => {
  it("detects remaining rounds below the visible area", () => {
    expect(hasHiddenScores(0, 400, 900)).toBe(true);
    expect(hasHiddenScores(450, 400, 900)).toBe(true);
  });
  it("clears the signal at the end, allowing an eight pixel tolerance", () => {
    expect(hasHiddenScores(492, 400, 900)).toBe(false);
    expect(hasHiddenScores(491, 400, 900)).toBe(true);
    expect(hasHiddenScores(500, 400, 900)).toBe(false);
  });
  it("does not signal for a table that fits", () => {
    expect(hasHiddenScores(0, 400, 200)).toBe(false);
  });
});

describe("Player name identification", () => {
  it("preserves full names for one or two players", () => {
    expect(getPlayerLabel("Alejandra", 1)).toBe("Alejandra");
    expect(getPlayerLabel("Benjamín", 2)).toBe("Benjamín");
  });

  it("uses the first three letters in uppercase for three or more players", () => {
    expect(getPlayerLabel("Alejandra", 3)).toBe("ALE");
    expect(getPlayerLabel("Benjamín", 6)).toBe("BEN");
    expect(getPlayerLabel("Li", 4)).toBe("LI");
    expect(getPlayerLabel("👨‍👩‍👧‍👦Ana", 4)).toBe("👨‍👩‍👧‍👦AN");
  });
});

describe("Score sheet totals", () => {
  it("shows accumulated player totals including the current partial round", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: 22 }, { id: 2, name: "Luis", score: 24 }]}
      scoreHistory={[[{ playerId: 1, score: 12, wasBingo: false }, { playerId: 2, score: 24, wasBingo: false }]]}
      currentRoundScores={[{ playerId: 1, score: 10, wasBingo: false }]}
    /></LanguageProvider>);
    const totals = screen.getByRole("table").querySelector("tfoot");
    if (!totals) throw new Error("Missing accumulated totals");
    expect(within(totals).getByText("22")).toBeInTheDocument();
    expect(within(totals).getByText("24")).toBeInTheDocument();
  });

  it("uses the updated player total rather than recomputing historical turns", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: -3 }]}
      scoreHistory={[[{ playerId: 1, score: 12, wasBingo: false }]]}
    /></LanguageProvider>);
    const totals = screen.getByRole("table").querySelector("tfoot");
    if (!totals) throw new Error("Missing accumulated totals");
    expect(within(totals).getByText("-3")).toBeInTheDocument();
  });
});

describe("Leader highlight in totals", () => {
  it("marks only the top scorer's total cell as leader, with a crown icon", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: 22 }, { id: 2, name: "Luis", score: 24 }]}
      scoreHistory={[]}
    /></LanguageProvider>);
    const totals = screen.getByRole("table").querySelector("tfoot");
    if (!totals) throw new Error("Missing accumulated totals");
    const cells = totals.querySelectorAll("td");
    expect(cells[1]).not.toHaveAttribute("data-leader");
    expect(cells[2]).toHaveAttribute("data-leader");
    expect(cells[2]?.querySelector("svg")).not.toBeNull();
  });

  it("marks tied top scorers as co-leaders", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: 30 }, { id: 2, name: "Luis", score: 30 }]}
      scoreHistory={[]}
    /></LanguageProvider>);
    const totals = screen.getByRole("table").querySelector("tfoot");
    if (!totals) throw new Error("Missing accumulated totals");
    const cells = totals.querySelectorAll("td");
    expect(cells[1]).toHaveAttribute("data-leader");
    expect(cells[2]).toHaveAttribute("data-leader");
  });

  it("shows no leader when nobody has a positive score", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: -5 }, { id: 2, name: "Luis", score: 0 }]}
      scoreHistory={[]}
    /></LanguageProvider>);
    const totals = screen.getByRole("table").querySelector("tfoot");
    if (!totals) throw new Error("Missing accumulated totals");
    totals.querySelectorAll("td").forEach(cell => {
      expect(cell).not.toHaveAttribute("data-leader");
    });
  });
});
describe("Score annotations", () => {
  it("shows a red End row with penalties", () => {
    render(<LanguageProvider><ScoreHistory
      players={[{ id: 1, name: "Ana", score: 15 }, { id: 2, name: "Luis", score: 20 }]}
      scoreHistory={[[{ playerId: 1, score: 20, wasBingo: false }, { playerId: 2, score: 20, wasBingo: false }]]}
      penalties={{ 1: 5 }}
    /></LanguageProvider>);
    const row = screen.getByRole("table").querySelector('[data-row="end"]');
    if (!row) throw new Error("Missing end row");
    expect(within(row as HTMLElement).getByText("−5")).toBeInTheDocument();
  });

  it("shows a leaderboard adjustment row only when there are adjustments", () => {
    const { rerender } = render(<LanguageProvider><ScoreHistory players={[{ id: 1, name: "Ana", score: 10 }]} scoreHistory={[]} /></LanguageProvider>);
    expect(screen.getByRole("table").querySelector('[data-row="adjustment"]')).toBeNull();
    rerender(<LanguageProvider><ScoreHistory players={[{ id: 1, name: "Ana", score: 13 }]} scoreHistory={[]} adjustments={{ 1: 3 }} /></LanguageProvider>);
    const row = screen.getByRole("table").querySelector('[data-row="adjustment"]');
    if (!row) throw new Error("Missing adjustment row");
    expect(within(row as HTMLElement).getByText("+3")).toBeInTheDocument();
  });

  it("marks manually edited cells", () => {
    render(<LanguageProvider><ScoreHistory players={[{ id: 1, name: "Ana", score: 9 }]}
      scoreHistory={[[{ playerId: 1, score: 9, wasBingo: false, edited: true }]]} /></LanguageProvider>);
    expect(screen.getByRole("table").querySelector('[data-edited]')).not.toBeNull();
  });
});
