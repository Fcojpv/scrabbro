import { useState } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Leaderboard } from "@/components/Leaderboard";
import { TurnInput } from "@/components/TurnInput";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Player {
  id: number;
  score: number;
}

const Index = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleStartGame = (playerCount: number) => {
    const newPlayers: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      score: 0,
    }));
    setPlayers(newPlayers);
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

    toast.success(`Jugador ${currentPlayerId}: +${score} puntos`, {
      duration: 2000,
    });

    setCurrentTurn((prev) => (prev + 1) % players.length);
  };

  const handleReset = () => {
    setGameStarted(false);
    setPlayers([]);
    setCurrentTurn(0);
    setShowResetDialog(false);
    toast.info("Juego reiniciado");
  };

  const handlePositionChange = () => {
    // This is called when a player's position changes in the leaderboard
  };

  if (!gameStarted) {
    return <PlayerSetup onStart={handleStartGame} />;
  }

  const currentPlayer = players[currentTurn];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div className="flex justify-between items-center pt-4">
          <h1 className="text-2xl font-bold text-foreground">Scrabble Score</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetDialog(true)}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>

        <TurnInput
          currentPlayer={currentPlayer.id}
          onSubmitScore={handleSubmitScore}
        />

        <Leaderboard players={players} onPositionChange={handlePositionChange} />
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
