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
}

const PLAYER_COLORS = [
  "text-blue-500",
  "text-green-500",
  "text-purple-500",
  "text-orange-500",
  "text-pink-500",
  "text-cyan-500",
];

export const ScoreHistory = ({ players, scoreHistory }: ScoreHistoryProps) => {
  const { t } = useLanguage();
  
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
    const round = scoreHistory[roundIndex];
    if (!round) return false;
    
    const playerScore = round.find(s => s.playerId === playerId);
    if (!playerScore) return false;
    
    const maxScore = Math.max(...round.map(s => s.score));
    return playerScore.score === maxScore && maxScore > 0;
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

          {/* Score table */}
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold w-12 px-1">{t.round || "Ronda"}</TableHead>
                  {players.map((player, index) => (
                    <TableHead 
                      key={player.id} 
                      className={`text-center font-bold px-2 ${PLAYER_COLORS[index % PLAYER_COLORS.length]}`}
                    >
                      <span className="block truncate">{useFullNames ? player.name : getInitials(player.name)}</span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scoreHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={players.length + 1} className="text-center text-muted-foreground py-8">
                      {t.noRoundsYet || "No hay rondas completadas aún"}
                    </TableCell>
                  </TableRow>
                ) : (
                  scoreHistory.map((round, roundIndex) => (
                    <TableRow key={roundIndex}>
                      <TableCell className="font-medium text-center px-1">{roundIndex + 1}</TableCell>
                      {players.map((player) => {
                        const scoreData = round.find(s => s.playerId === player.id);
                        const score = scoreData?.score || 0;
                        const wasBingo = scoreData?.wasBingo || false;
                        const isHighest = isHighestInRound(roundIndex, player.id);
                        
                        return (
                          <TableCell key={player.id} className="text-center px-2">
                            {score > 0 && (
                              <span className="inline-flex items-center gap-0.5">
                                <span>{score}</span>
                                {wasBingo && (
                                  <span className="text-yellow-500 font-bold text-xs">B</span>
                                )}
                                {isHighest && (
                                  <span className="text-primary">·</span>
                                )}
                              </span>
                            )}
                            {score === 0 && <span className="text-muted-foreground">-</span>}
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
