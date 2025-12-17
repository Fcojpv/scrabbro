import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface RoundScore {
  playerId: number;
  score: number;
  wasBingo: boolean;
}

interface ScoreHistoryProps {
  players: Player[];
  scoreHistory: RoundScore[][];
  currentRoundScores?: RoundScore[];
  currentTurn?: number;
}

const PLAYER_COLORS = [
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
  "text-orange-500",
  "text-pink-500",
  "text-cyan-500",
];

export const ScoreHistory = ({ players, scoreHistory, currentRoundScores = [], currentTurn = 0 }: ScoreHistoryProps) => {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Combine completed rounds with current round in progress
  const allRounds = [...scoreHistory];
  if (currentRoundScores.length > 0) {
    allRounds.push(currentRoundScores);
  }

  // Get initials for each player (first 3 letters uppercase)
  const getInitials = (name: string) => {
    return name.substring(0, 3).toUpperCase();
  };

  // Get initials capitalized (first letter uppercase, rest lowercase)
  const getInitialsCapitalized = (name: string) => {
    const initials = name.substring(0, 3);
    return initials.charAt(0).toUpperCase() + initials.slice(1).toLowerCase();
  };

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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 10);
  };

  // Use full names for 1-2 players, initials for 3+
  const useFullNames = players.length <= 2;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto animate-slide-up p-4 touch-none">
      <Card className="h-full flex flex-col border-primary/20 overflow-hidden shadow-md">
        <CardHeader className={`
          transition-all duration-300 ease-in-out border-b border-border/50 flex-shrink-0
          ${isScrolled ? "py-2 bg-muted/30" : "py-4"}
        `}>
          <CardTitle className={`
            transition-all duration-300 flex items-center gap-2
            ${isScrolled ? "text-base" : "text-xl"}
          `}>
            {t.scoreHistory || "Historial de Puntajes"}
          </CardTitle>

          {/* Legend for 3+ players - collapses when scrolled */}
          {!useFullNames && (
            <div className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isScrolled ? "max-h-0 opacity-0 m-0" : "max-h-20 opacity-100 mt-2"}
            `}>
              <div className="p-2 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex items-center">
                      <span className={`font-bold ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}>
                        {getInitialsCapitalized(player.name)}
                      </span>
                      <span className="ml-1 truncate">{player.name.substring(3)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent
          className="flex-1 overflow-y-auto p-0 relative scroll-smooth"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {/* Sticky table header */}
          <div className={`
            sticky top-0 z-20 transition-all duration-300
            ${isScrolled
              ? "bg-card/95 backdrop-blur-sm shadow-md"
              : "bg-card shadow-sm"
            }
          `}>
            <div className="w-full border-b-2 border-primary/20">
              <div className="flex">
                <div className={`
                  text-center font-bold transition-all duration-300 flex items-center justify-center
                  ${isScrolled ? "w-8 px-0.5 py-1.5 text-[10px]" : "w-10 px-1 py-3 text-xs"}
                `}>
                  <span className={isScrolled ? "writing-mode-vertical-rl transform rotate-180" : ""}>
                    {isScrolled ? "R" : (t.round || "Ronda")}
                  </span>
                </div>
                {players.map((player, index) => (
                  <div
                    key={player.id}
                    className={`
                      flex-1 text-center font-bold transition-all duration-300 flex items-center justify-center
                      ${PLAYER_COLORS[index % PLAYER_COLORS.length]}
                      ${isScrolled ? "py-1.5 px-1" : "py-3 px-2"}
                    `}
                  >
                    <span className={`block truncate transition-all duration-300 ${isScrolled ? "text-[11px]" : "text-sm"}`}>
                      {useFullNames ? player.name : getInitials(player.name)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table body */}
          <Table>
            <TableBody>
              {allRounds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={players.length + 1} className="text-center text-muted-foreground py-8">
                    {t.noRoundsYet || "No hay rondas completadas aún"}
                  </TableCell>
                </TableRow>
              ) : (
                allRounds.map((round, roundIndex) => (
                  <TableRow key={roundIndex} className={isCurrentRound(roundIndex) ? "bg-primary/5" : "hover:bg-muted/50"}>
                    <TableCell className="font-medium text-center text-xs w-10 px-0.5">
                      <span className="relative inline-flex items-center justify-center">
                        {isCurrentRound(roundIndex) && (
                          <Play className="w-2.5 h-2.5 text-primary fill-primary absolute -left-2" />
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

                      return (
                        <TableCell key={player.id} className="text-center px-1 py-2.5">
                          {score > 0 && (
                            <span className="inline-flex items-center justify-center gap-0.5 min-w-[2rem]">
                              <span className={`text-base sm:text-lg ${isHighest && !isCurrentRound(roundIndex) ? "font-bold" : "font-medium"}`}>{score}</span>
                              {wasBingo && (
                                <span className="text-yellow-500 font-bold text-xs ml-0.5">B</span>
                              )}
                            </span>
                          )}
                          {score === 0 && !hasNotPlayed && <span className="text-muted-foreground text-sm">-</span>}
                          {hasNotPlayed && <span className="text-muted-foreground/40 text-sm">···</span>}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
              {/* Spacer to ensure last item isn't hidden behind potential floating elements */}
              <TableRow className="h-4 border-0 hover:bg-transparent">
                <TableCell colSpan={players.length + 1} />
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
