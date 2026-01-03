import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play } from "lucide-react";

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

  // Use full names for 1-2 players, initials for 3+
  const useFullNames = players.length <= 2;

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-slide-up p-4">
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">{t.scoreHistory || "Historial de Puntajes"}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend for 3+ players */}
          {!useFullNames && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {players.map((player, index) => (
                  <div key={player.id} className="flex items-center">
                    <span className={`font-bold ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}>
                      {getInitialsCapitalized(player.name)}
                    </span>
                    <span>{player.name.substring(3)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score table with sticky header */}
          <div className="w-full max-h-[60vh] overflow-y-auto rounded-lg border border-border/50">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-shadow">
                <TableRow>
                  <TableHead className="text-center font-bold w-12 px-1 bg-transparent">{t.round || "Ronda"}</TableHead>
                  {players.map((player, index) => (
                    <TableHead 
                      key={player.id} 
                      className={`text-center font-bold px-2 bg-transparent ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}
                    >
                      <span className="block truncate">{useFullNames ? player.name : getInitials(player.name)}</span>
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
                      <TableCell className="font-medium text-center px-1">
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
                        
                        return (
                          <TableCell key={player.id} className="text-center px-2">
                            {score > 0 && (
                              <span className="inline-flex items-center gap-0.5">
                                <span>{score}</span>
                                {wasBingo && (
                                  <span className="text-yellow-500 font-bold text-xs">B</span>
                                )}
                                {isHighest && !isCurrentRound(roundIndex) && (
                                  <span className="text-primary">·</span>
                                )}
                              </span>
                            )}
                            {score === 0 && !hasNotPlayed && <span className="text-muted-foreground">-</span>}
                            {hasNotPlayed && <span className="text-muted-foreground/40">···</span>}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
