import { useState } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Leaderboard } from "@/components/Leaderboard";
import { TurnInput } from "@/components/TurnInput";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SettingsMenu } from "@/components/SettingsMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, Hourglass } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useTurnTimer } from "@/hooks/useTurnTimer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Player {
  id: number;
  name: string;
  score: number;
}

const Index = () => {
  const { t } = useLanguage();
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  
  const { formatTime: formatGameTime } = useGameTimer(gameStarted);
  const turnTimer = useTurnTimer(currentTurn, gameStarted);

  const handleStartGame = (players: Player[]) => {
    setPlayers(players);
    setCurrentTurn(0);
    setGameStarted(true);
  };

  const handleSubmitScore = (score: number) => {
    const currentPlayerId = players[currentTurn].id;
    
    setPlayers(prev =>
      prev.map(p =>
        p.id === currentPlayerId
          ? { ...p, score: p.score + score }
          : p
      )
    );

    const playerName = players.find(p => p.id === currentPlayerId)?.name || `${t.player} ${currentPlayerId}`;
    toast.success(`${playerName}: +${score} ${t.points}`, {
      duration: 2000,
    });

    const nextTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(nextTurn);
    
    // Increment round when all players have played
    if (nextTurn === 0) {
      setRoundNumber(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setGameStarted(false);
    setPlayers([]);
    setCurrentTurn(0);
    setRoundNumber(1);
    setShowResetDialog(false);
    turnTimer.stopTimer();
    toast.info(t.gameReset);
  };

  const handlePositionChange = () => {
    // This is called when a player's position changes in the leaderboard
  };

  const handleEditScore = (playerId: number, newScore: number) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, score: newScore }
          : p
      )
    );
    toast.success(t.scoreUpdated, {
      duration: 2000,
    });
  };

  if (!gameStarted) {
    return <PlayerSetup onStart={handleStartGame} />;
  }

  const currentPlayer = players[currentTurn];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div className="flex justify-between items-center pt-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-foreground">{t.scrabbleScore}</h1>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatGameTime()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Hourglass className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                {[1, 2, 3, 4, 5].map((minutes) => (
                  <DropdownMenuItem
                    key={minutes}
                    onClick={() => turnTimer.startTimer(minutes)}
                    className="cursor-pointer"
                  >
                    {minutes} {minutes === 1 ? t.minute : t.minutes}
                  </DropdownMenuItem>
                ))}
                {turnTimer.isActive && (
                  <DropdownMenuItem
                    onClick={() => turnTimer.stopTimer()}
                    className="cursor-pointer text-destructive"
                  >
                    {t.stopTimer}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t.reset}
            </Button>
            <SettingsMenu />
          </div>
        </div>

        <TurnInput
          currentPlayer={currentPlayer.id}
          currentPlayerName={currentPlayer.name}
          onSubmitScore={handleSubmitScore}
          timerDisplay={turnTimer.formatTime()}
          timerColorClass={turnTimer.getColorClass()}
          isTimerFinished={turnTimer.isFinished}
        />

        <Leaderboard players={players} onPositionChange={handlePositionChange} roundNumber={roundNumber} onEditScore={handleEditScore} />
      </div>

      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleReset}
      />
    </div>
  );
};

export default Index;
