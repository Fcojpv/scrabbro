import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Crown, Pencil, ArrowDown, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { truncateByGraphemes } from "@/lib/utils";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface RoundScore {
  playerId: number;
  score: number;
  wasBingo: boolean;
  edited?: boolean;
}

interface ScoreHistoryProps {
  players: Player[];
  scoreHistory: RoundScore[][];
  currentRoundScores?: RoundScore[];
  currentTurn?: number;
  adjustments?: Record<number, number>;
  penalties?: Record<number, number>;
  onEditRoundScore?: (roundIndex: number, playerId: number, score: number) => void;
}

/** Long-press duration (ms) that opens cell editing; movement beyond the slop cancels it so scrolling never edits. */
export const LONG_PRESS_MS = 500;
const MOVE_SLOP_PX = 10;

const PLAYER_COLORS = [
  "text-player-1",
  "text-player-2",
  "text-player-3",
  "text-player-4",
  "text-player-5",
  "text-player-6",
];

export const getPlayerLabel = (name: string, playerCount: number) =>
  playerCount <= 2 ? name : truncateByGraphemes(name, 3).toUpperCase();

export const hasHiddenScores = (scrollTop: number, clientHeight: number, scrollHeight: number) =>
  scrollHeight - clientHeight - scrollTop > 8;

export const ScoreHistory = ({ players, scoreHistory, currentRoundScores = [], currentTurn = 0, adjustments = {}, penalties = {}, onEditRoundScore }: ScoreHistoryProps) => {
  const [editing, setEditing] = useState<{ roundIndex: number; playerId: number; value: string } | null>(null);
  const pressRef = useRef<{ timer: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null);
  const cancelPress = () => { if (pressRef.current) clearTimeout(pressRef.current.timer); pressRef.current = null; };
  const pressHandlers = (roundIndex: number, playerId: number, score: number, enabled: boolean) => enabled && onEditRoundScore ? {
    onPointerDown: (e: React.PointerEvent) => {
      cancelPress();
      const timer = setTimeout(() => {
        pressRef.current = null;
        navigator.vibrate?.(15);
        setEditing({ roundIndex, playerId, value: String(score) });
      }, LONG_PRESS_MS);
      pressRef.current = { timer, x: e.clientX, y: e.clientY };
    },
    onPointerMove: (e: React.PointerEvent) => {
      const p = pressRef.current;
      if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_SLOP_PX) cancelPress();
    },
    onPointerUp: cancelPress,
    onPointerLeave: cancelPress,
    onPointerCancel: cancelPress,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    className: "select-none [-webkit-touch-callout:none] cursor-pointer active:bg-primary/10 transition-colors",
  } : {};
  const saveEdit = () => {
    if (!editing) return;
    const value = Math.min(Math.max(parseInt(editing.value) || 0, 0), 9999);
    onEditRoundScore?.(editing.roundIndex, editing.playerId, value);
    setEditing(null);
  };
  const hasAdjustments = players.some(p => (adjustments[p.id] ?? 0) !== 0);
  const hasPenalties = players.some(p => (penalties[p.id] ?? 0) > 0);
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const [compactNames, setCompactNames] = useState(false);
  const [moreScoresBelow, setMoreScoresBelow] = useState(false);

  useEffect(() => {
    const wrapper = tableWrapperRef.current;
    const scroller = wrapper?.firstElementChild;
    if (!wrapper || !(scroller instanceof HTMLElement)) return;
    const table = scroller.querySelector('table');
    const footer = scroller.querySelector('tfoot');
    const update = () => {
      setMoreScoresBelow(hasHiddenScores(scroller.scrollTop, scroller.clientHeight, scroller.scrollHeight));
      wrapper.style.setProperty('--score-footer-height', `${footer?.getBoundingClientRect().height ?? 0}px`);
    };
    update();
    scroller.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    if (table) observer.observe(table);
    if (footer) observer.observe(footer);
    return () => {
      scroller.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [scoreHistory.length, currentRoundScores.length, players.length, hasAdjustments, hasPenalties]);

  const scrollToTotals = () => {
    const scroller = tableWrapperRef.current?.firstElementChild;
    if (!(scroller instanceof HTMLElement)) return;
    scroller.scrollTo({
      top: scroller.scrollHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };
  
  // The table and the swipe page are independent scroll surfaces.
  useEffect(() => {
    const outer = containerRef.current?.closest('.overflow-y-auto');
    const inner = tableWrapperRef.current?.firstElementChild;
    const handleScroll = () => {
      const scrollTop = Math.max(outer?.scrollTop ?? 0, inner?.scrollTop ?? 0);
      // Hysteresis prevents flickering when the header changes height.
      setCompactNames(previous => scrollTop > 40 ? true : scrollTop <= 4 ? false : previous);
    };
    handleScroll();
    outer?.addEventListener('scroll', handleScroll, { passive: true });
    inner?.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      outer?.removeEventListener('scroll', handleScroll);
      inner?.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Combine completed rounds with current round in progress
  const allRounds = [...scoreHistory];
  if (currentRoundScores.length > 0) {
    allRounds.push(currentRoundScores);
  }
  
  // Check if this score was the highest in the round
  const isHighestInRound = (roundIndex: number, playerId: number) => {
    const round = allRounds[roundIndex];
    if (!round) return false;
    
    const playerScore = round.find(s => s.playerId === playerId);
    if (!playerScore) return false;
    
    const maxScore = Math.max(...round.map(s => s.score));
    return playerScore.score === maxScore && maxScore > 0;
  };

  // Check if this is the current round in progress
  const isCurrentRound = (roundIndex: number) => {
    return roundIndex === allRounds.length - 1 && currentRoundScores.length > 0;
  };

  // Use full names for 1-2 players, initials for 3+
  const useFullNames = players.length <= 2;

  // Leader = highest accumulated score; shown only when someone is above zero.
  const maxScore = Math.max(...players.map(p => p.score), 0);
  const isLeader = (player: Player) => maxScore > 0 && player.score === maxScore;

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto animate-slide-up px-2 py-3 sm:p-4">
      <Card className="border-primary/20 overflow-visible">
        {/* Sticky header */}
        <CardHeader className="px-3 pt-4 pb-3 sm:px-6 sticky top-0 z-20 bg-card/95 backdrop-blur-sm rounded-t-lg">
          <CardTitle className="text-xl text-center w-full">{t.scoreHistory}</CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-3 pt-0 sm:px-6 sm:pb-6">
          {/* Score table with sticky header */}
          <div ref={tableWrapperRef} className="relative w-full [&>.relative]:max-h-[min(60dvh,36rem)]">
            <Table className="table-fixed">
              <colgroup>
                <col className="w-12" />
                {players.map(player => <col key={player.id} className="min-w-16" />)}
              </colgroup>
              <TableHeader data-compact={compactNames} className="sticky top-0 z-10 bg-card">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-9 text-center font-bold w-12 px-1 bg-transparent">{t.round || "Ronda"}</TableHead>
                  {players.map((player, index) => (
                    <TableHead 
                      key={player.id} 
                      className={`h-9 text-center font-bold px-1 py-1 bg-transparent ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}
                    >
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button type="button" variant="ghost" aria-label={player.name} title={player.name}
                            className={`h-auto min-h-11 w-full min-w-0 flex-col gap-0 px-0.5 py-0.5 whitespace-normal hover:text-inherit ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}>
                            <span className={useFullNames ? "block w-full truncate font-bold" : "flex h-9 w-11 shrink-0 items-center justify-center rounded-full bg-current/10 font-bold"}>
                              {getPlayerLabel(player.name, players.length)}
                            </span>
                            {!useFullNames && (
                              <span aria-hidden="true" className={`grid w-full transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none ${compactNames ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"}`}>
                                <span className="min-h-0 overflow-hidden">
                                  <span className="block truncate pt-1 pb-0.5 text-xs font-normal text-foreground">{player.name}</span>
                                </span>
                              </span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto max-w-[min(18rem,calc(100vw-2rem))] px-4 py-3 text-center">
                          <span className={`block text-sm font-bold ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}>{getPlayerLabel(player.name, players.length)}</span>
                          {!useFullNames && <span className="mt-1 block break-words text-sm">{player.name}</span>}
                        </PopoverContent>
                      </Popover>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allRounds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={players.length + 1} className="text-center text-muted-foreground py-8">
                      {t.noRoundsYet || "No hay rondas completadas aún"}
                    </TableCell>
                  </TableRow>
                ) : (
                  allRounds.map((round, roundIndex) => (
                    <TableRow key={roundIndex} className={isCurrentRound(roundIndex) ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium text-center px-1 py-1.5">
                        <span className="relative inline-flex items-center justify-center">
                          {isCurrentRound(roundIndex) && (
                            <Play className="w-3 h-3 text-primary fill-primary absolute -left-3" />
                          )}
                          {roundIndex + 1}
                        </span>
                      </TableCell>
                      {players.map((player) => {
                        const scoreData = round.find(s => s.playerId === player.id);
                        const score = scoreData?.score || 0;
                        const wasBingo = scoreData?.wasBingo || false;
                        const isHighest = isHighestInRound(roundIndex, player.id);
                        const hasNotPlayed = isCurrentRound(roundIndex) && !scoreData;
                        
                        const press = pressHandlers(roundIndex, player.id, score, !!scoreData);
                        return (
                          <TableCell key={player.id} {...press} data-edited={scoreData?.edited || undefined} className={`text-center px-2 py-1.5 ${press.className ?? ""}`}>
                            {score > 0 && (
                              <span className="inline-flex items-center gap-0.5">
                                <span>{score}</span>
                                {wasBingo && (
                                  <span className="text-yellow-500 font-bold text-xs">B</span>
                                )}
                                {isHighest && !isCurrentRound(roundIndex) && (
                                  <span className="text-primary">·</span>
                                )}
                                {scoreData?.edited && <Pencil aria-label={t.editedHint} className="w-3 h-3 text-muted-foreground" />}
                              </span>
                            )}
                            {score === 0 && !hasNotPlayed && (
                              <span className="inline-flex items-center gap-0.5 text-muted-foreground">-
                                {scoreData?.edited && <Pencil aria-label={t.editedHint} className="w-3 h-3" />}
                              </span>
                            )}
                            {hasNotPlayed && <span className="text-muted-foreground/40">···</span>}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
                {hasAdjustments && (
                  <TableRow data-row="adjustment" className="bg-muted/30">
                    <TableCell className="text-center px-1 py-1.5 text-xs font-medium">{t.adjustmentRow}</TableCell>
                    {players.map(player => {
                      const value = adjustments[player.id] ?? 0;
                      return (
                        <TableCell key={player.id} className="text-center px-2 py-1.5">
                          {value === 0 ? <span className="text-muted-foreground">-</span> : (
                            <span className="inline-flex items-center gap-0.5">
                              <span className={value < 0 ? "text-destructive" : ""}>{value > 0 ? `+${value}` : `−${Math.abs(value)}`}</span>
                              <Pencil aria-label={t.editedHint} className="w-3 h-3 text-muted-foreground" />
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}
                {hasPenalties && (
                  <TableRow data-row="end" className="bg-destructive/5">
                    <TableCell className="text-center px-1 py-1.5 text-xs font-medium">{t.endRow}</TableCell>
                    {players.map(player => {
                      const value = penalties[player.id] ?? 0;
                      return (
                        <TableCell key={player.id} className="text-center px-2 py-1.5">
                          {value === 0 ? <span className="text-muted-foreground">-</span> : (
                            <span className="inline-flex items-center gap-0.5 font-semibold text-destructive">
                              <span>−{value}</span>
                              <ArrowDown aria-label={t.penaltyHint} className="w-3 h-3" />
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                )}
              </TableBody>
              <TableFooter className="sticky bottom-0 z-10 bg-muted font-bold">
                <TableRow className="hover:bg-transparent">
                  <TableCell className="text-center px-1 py-2 text-xs break-words">{t.totalScore}</TableCell>
                  {players.map(player => {
                    const leader = isLeader(player);
                    return (
                      <TableCell
                        key={player.id}
                        data-leader={leader || undefined}
                        className={`text-center px-2 py-2 transition-colors ${leader ? "bg-gold/10" : ""}`}
                      >
                        {leader && (
                          <Crown className="w-3.5 h-3.5 inline-block -mt-0.5 mr-0.5 fill-gold text-gold" aria-hidden="true" />
                        )}
                        {player.score}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableFooter>
            </Table>
            <div
              data-scroll-cue={moreScoresBelow ? "visible" : "hidden"}
              aria-hidden={!moreScoresBelow}
              className={`score-scroll-cue pointer-events-none absolute inset-x-0 z-10 flex h-11 items-end justify-center pb-1 transition-opacity duration-200 motion-reduce:transition-none ${moreScoresBelow ? "opacity-100" : "opacity-0"}`}
            >
              <Button type="button" variant="outline" size="sm" onClick={scrollToTotals}
                tabIndex={moreScoresBelow ? 0 : -1} title={t.totalScore}
                className={`h-8 max-w-[calc(100%-1rem)] gap-1 rounded-full border-border/60 bg-card/95 px-3 text-xs font-medium text-muted-foreground shadow-none hover:bg-card hover:text-foreground ${moreScoresBelow ? "pointer-events-auto" : "pointer-events-none"}`}>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{t.totalScore}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Dialog open={!!editing} onOpenChange={open => { if (!open) setEditing(null); }}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="text-center">
              {t.editRoundScore}
              {editing && <span className="block text-sm font-normal text-muted-foreground mt-1">
                {players.find(p => p.id === editing.playerId)?.name} · {t.round || "Ronda"} {editing.roundIndex + 1}
              </span>}
            </DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            type="number"
            inputMode="numeric"
            aria-label={t.editRoundScore}
            value={editing?.value ?? ""}
            onChange={e => { const v = e.target.value.replace(/[^0-9]/g, "").slice(0, 4); setEditing(prev => prev && { ...prev, value: v }); }}
            onKeyDown={e => { if (e.key === "Enter") saveEdit(); }}
            className="text-2xl text-center font-bold h-12"
          />
          <DialogFooter className="flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditing(null)}>{t.cancel}</Button>
            <Button className="flex-1" onClick={saveEdit}>{t.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
