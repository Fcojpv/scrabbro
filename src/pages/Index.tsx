import { useState, useRef, useEffect } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Leaderboard } from "@/components/Leaderboard";
import { TurnInput } from "@/components/TurnInput";
import { ScoreHistory } from "@/components/ScoreHistory";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { EndGameDialog } from "@/components/EndGameDialog";
import { KofiDialog } from "@/components/KofiDialog";
import { SettingsMenu } from "@/components/SettingsMenu";
import { RestoreGameDialog } from "@/components/RestoreGameDialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, Hourglass, Music, ChevronRight, ChevronLeft, Heart } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { useGameTimer } from "@/hooks/useGameTimer";
import { useTurnTimer } from "@/hooks/useTurnTimer";
import { useGamePersistence } from "@/hooks/useGamePersistence";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SwipeableViews } from "@/components/SwipeableViews";

interface Player {
  id: number;
  name: string;
  score: number;
  customTimerMinutes?: number;
}

interface RoundScore {
  playerId: number;
  score: number;
  wasBingo: boolean;
}

const Index = () => {
  const { t } = useLanguage();
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [showSurpriseEmojis, setShowSurpriseEmojis] = useState(false);
  const [roundNumber, setRoundNumber] = useState(1);
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const [showKofiDialog, setShowKofiDialog] = useState(false);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentView, setCurrentView] = useState(0);
  const [scoreHistory, setScoreHistory] = useState<RoundScore[][]>([]);
  const [currentRoundScores, setCurrentRoundScores] = useState<RoundScore[]>([]);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedGameInfo, setSavedGameInfo] = useState<{ players: string; round: number; timestamp: number } | null>(null);
  
  const gameTimer = useGameTimer(gameStarted);
  const turnTimer = useTurnTimer(currentTurn, gameStarted, players[currentTurn]?.customTimerMinutes);
  const { saveGameState, loadGameState, clearSavedGame, getSavedGameInfo } = useGamePersistence();

  // Check for saved game on mount
  useEffect(() => {
    const info = getSavedGameInfo();
    if (info) {
      setSavedGameInfo(info);
      // Small delay to ensure all other effects have run
      setTimeout(() => {
        setShowRestoreDialog(true);
      }, 100);
    }
  }, []);

  // Auto-save game state when it changes
  useEffect(() => {
    if (gameStarted) {
      saveGameState({
        gameStarted,
        players,
        currentTurn,
        roundNumber,
        scoreHistory,
        currentRoundScores,
      });
    }
  }, [gameStarted, players, currentTurn, roundNumber, scoreHistory, currentRoundScores]);

  // Heart animation cycle: 60s empty -> 5s filled -> repeat
  useEffect(() => {
    const cycle = () => {
      // Empty for 60 seconds
      setIsHeartFilled(false);
      
      const fillTimeout = setTimeout(() => {
        // Filled for 5 seconds
        setIsHeartFilled(true);
        
        const emptyTimeout = setTimeout(() => {
          cycle(); // Restart cycle
        }, 5000);
        
        return () => clearTimeout(emptyTimeout);
      }, 60000);
      
      return () => clearTimeout(fillTimeout);
    };
    
    const cleanup = cycle();
    return cleanup;
  }, []);


  const toggleRadio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://stream.zeno.fm/v2wvrmeknm0uv");
      audioRef.current.volume = 0.5;
    }

    if (isRadioPlaying) {
      audioRef.current.pause();
      setIsRadioPlaying(false);
      toast.info(t.radioStopped);
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing radio:", error);
        toast.error(t.radioError);
      });
      setIsRadioPlaying(true);
      toast.success(t.radioStarted);
    }
  };

  const handleStartGame = (players: Player[]) => {
    // Clear any saved game when starting fresh
    clearSavedGame();
    setPlayers(players);
    setCurrentTurn(0);
    setGameStarted(true);
    setScoreHistory([]);
    setCurrentRoundScores([]);
    setRoundNumber(1);
  };

  const handleRestoreGame = () => {
    const savedState = loadGameState();
    if (savedState) {
      // Close dialog first
      setShowRestoreDialog(false);
      
      // Batch all state updates - set gameStarted LAST to ensure proper render
      setPlayers(savedState.players);
      setCurrentTurn(savedState.currentTurn);
      setRoundNumber(savedState.roundNumber);
      setScoreHistory(savedState.scoreHistory);
      setCurrentRoundScores(savedState.currentRoundScores);
      setGameStarted(true); // Set this LAST and explicitly to true
      
      // Show success message after a small delay to ensure UI has updated
      setTimeout(() => {
        toast.success(t.gameRestored, { duration: 3000 });
      }, 100);
    }
  };

  const handleNewGame = () => {
    clearSavedGame();
    setShowRestoreDialog(false);
  };

  const handleSubmitScore = (score: number, wasBingo: boolean) => {
    const currentPlayerId = players[currentTurn].id;
    
    setPlayers(prev =>
      prev.map(p =>
        p.id === currentPlayerId
          ? { ...p, score: p.score + score }
          : p
      )
    );

    // Track score for current round
    setCurrentRoundScores(prev => [
      ...prev,
      { playerId: currentPlayerId, score, wasBingo }
    ]);

    const playerName = players.find(p => p.id === currentPlayerId)?.name || `${t.player} ${currentPlayerId}`;
    toast.success(`${playerName}: +${score} ${t.points}`, {
      duration: 2000,
    });

    const nextTurn = (currentTurn + 1) % players.length;
    setCurrentTurn(nextTurn);
    
    // Increment round when all players have played
    if (nextTurn === 0) {
      // Save completed round to history
      setScoreHistory(prev => [...prev, currentRoundScores.concat([{ playerId: currentPlayerId, score, wasBingo }])]);
      setCurrentRoundScores([]);
      setRoundNumber(prev => prev + 1);
    }
  };

  const handleReset = () => {
    clearSavedGame();
    setGameStarted(false);
    setPlayers([]);
    setCurrentTurn(0);
    setRoundNumber(1);
    setScoreHistory([]);
    setCurrentRoundScores([]);
    setShowResetDialog(false);
    turnTimer.stopTimer();
    toast.info(t.gameReset);
  };

  const handlePositionChange = () => {
    // This is called when a player's position changes in the leaderboard
  };

  const handleEditPlayer = (playerId: number, newName: string, newScore: number, customTimerMinutes?: number) => {
    setPlayers(prev =>
      prev.map(p =>
        p.id === playerId
          ? { ...p, name: newName, score: newScore, customTimerMinutes }
          : p
      )
    );
    toast.success(t.scoreUpdated, {
      duration: 2000,
    });
  };

  const handleTurnTimerChange = (minutes: number) => {
    // Reset all custom timers when global timer changes
    setPlayers(prev =>
      prev.map(p => ({ ...p, customTimerMinutes: undefined }))
    );
    turnTimer.startTimer(minutes);
  };

  const handleEndGame = () => {
    setShowSurpriseEmojis(true);
    // Small delay to ensure emojis change before dialog opens
    setTimeout(() => {
      setShowEndGameDialog(true);
    }, 100);
  };

  const handleApplyPenalties = (penalties: Record<number, number>) => {
    setPlayers(prev =>
      prev.map(p => ({
        ...p,
        score: p.score - penalties[p.id]
      }))
    );
    setShowEndGameDialog(false);
    setShowSurpriseEmojis(false);
    // Clear saved game when ending
    clearSavedGame();
    toast.success(t.scoreUpdated, {
      duration: 2000,
    });
  };

  // Don't show PlayerSetup if we have players loaded (means we're restoring)
  if (!gameStarted && players.length === 0) {
    return (
      <>
        <PlayerSetup onStart={handleStartGame} />
        <RestoreGameDialog
          open={showRestoreDialog}
          onOpenChange={setShowRestoreDialog}
          gameInfo={savedGameInfo}
          onRestore={handleRestoreGame}
          onNewGame={handleNewGame}
        />
      </>
    );
  }

  // If we have players but game not started yet, wait for state to sync
  if (!gameStarted && players.length > 0) {
    return null;
  }

  const currentPlayer = players[currentTurn];

  return (
    <div className="min-h-screen bg-background p-4 pb-8">
      {/* Mobile swipeable view */}
      <div className="md:hidden h-screen overflow-hidden flex flex-col">
        <SwipeableViews currentView={currentView} onViewChange={setCurrentView}>
          {/* Screen 1: Main game */}
          <div className="h-full overflow-y-auto pb-20 px-4">
            <div className="max-w-2xl mx-auto space-y-3 animate-slide-up">
              <div className="flex justify-between items-center pt-2">
                <h1 className="text-2xl font-bold text-foreground">{t.scrabbleScore}</h1>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowKofiDialog(true)}
                    className="flex flex-col items-center justify-center gap-0 h-10 p-1"
                  >
                    <Heart 
                      className={`w-4 h-4 transition-all duration-300 ${
                        isHeartFilled ? "fill-orange-500 text-orange-500" : ""
                      }`} 
                    />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleRadio}
                    className="flex flex-col items-center justify-center gap-0 h-10 p-1"
                  >
                  <Music className={`w-4 h-4 ${isRadioPlaying ? "text-orange-500" : ""}`} />
                  {isRadioPlaying && (
                    <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                      {t.radioLive}
                    </span>
                  )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="flex flex-col items-center justify-center gap-0 h-10 p-1"
                      >
                      <Hourglass className={`w-4 h-4 ${turnTimer.isActive || gameTimer.isCountdownActive ? "text-orange-500" : ""}`} />
                      {(turnTimer.isActive || gameTimer.isCountdownActive) && (
                        <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                          {t.timerOn}
                        </span>
                      )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {t.turnTimer}
                      </div>
                      {[1, 2, 3, 4, 5].map((minutes) => (
                        <DropdownMenuItem
                          key={`turn-${minutes}`}
                          onClick={() => handleTurnTimerChange(minutes)}
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
                      <div className="h-px bg-border my-1" />
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {t.gameTimer}
                      </div>
                      {[15, 30, 45, 60, 90].map((minutes) => (
                        <DropdownMenuItem
                          key={`game-${minutes}`}
                          onClick={() => gameTimer.startCountdown(minutes)}
                          className="cursor-pointer"
                        >
                          {minutes} {t.minutes}
                        </DropdownMenuItem>
                      ))}
                      {gameTimer.isCountdownActive && (
                        <DropdownMenuItem
                          onClick={() => gameTimer.stopCountdown()}
                          className="cursor-pointer text-destructive"
                        >
                          {t.stopTimer}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowResetDialog(true)}
                  >
                    <RotateCcw className="w-4 h-4" />
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
                onEndGame={handleEndGame}
              />

              <Leaderboard 
                players={players} 
                onPositionChange={handlePositionChange} 
                roundNumber={roundNumber} 
                onEditPlayer={handleEditPlayer}
                gameTime={gameTimer.formatTime()}
                gameTimeColor={gameTimer.getColorClass()}
                isGameTimeFinished={gameTimer.isFinished}
                showSurpriseEmojis={showSurpriseEmojis}
              />
            </div>
          </div>

          {/* Screen 2: Score History */}
          <div className="h-full overflow-y-auto pb-20 px-4">
            <ScoreHistory 
              players={players} 
              scoreHistory={scoreHistory}
              currentRoundScores={currentRoundScores}
              currentTurn={currentTurn}
            />
          </div>
        </SwipeableViews>

        {/* Fixed dot indicators */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {[0, 1].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentView(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentView === index 
                  ? "bg-foreground" 
                  : "bg-foreground/20"
              }`}
            />
          ))}
        </div>

        {/* Fixed chevron navigation - Right (only on first screen) */}
        {currentView === 0 && (
          <button
            onClick={() => setCurrentView(1)}
            className="fixed right-2 top-1/2 -translate-y-1/2 z-20 text-foreground/20 hover:text-foreground/40 transition-colors md:hidden"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Fixed chevron navigation - Left (only on second screen) */}
        {currentView === 1 && (
          <button
            onClick={() => setCurrentView(0)}
            className="fixed left-2 top-1/2 -translate-y-1/2 z-20 text-foreground/20 hover:text-foreground/40 transition-colors md:hidden"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Desktop view - no carousel */}
      <div className="hidden md:block">
        <div className="max-w-2xl mx-auto space-y-3 animate-slide-up">
          <div className="flex justify-between items-center pt-2">
            <h1 className="text-2xl font-bold text-foreground">{t.scrabbleScore}</h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowKofiDialog(true)}
                className="flex flex-col items-center justify-center gap-0 h-10 p-1"
              >
                <Heart 
                  className={`w-4 h-4 transition-all duration-300 ${
                    isHeartFilled ? "fill-orange-500 text-orange-500" : ""
                  }`} 
                />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleRadio}
                className="flex flex-col items-center justify-center gap-0 h-10 p-1"
              >
              <Music className={`w-4 h-4 ${isRadioPlaying ? "text-orange-500" : ""}`} />
              {isRadioPlaying && (
                <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                  {t.radioLive}
                </span>
              )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="flex flex-col items-center justify-center gap-0 h-10 p-1"
                  >
                  <Hourglass className={`w-4 h-4 ${turnTimer.isActive || gameTimer.isCountdownActive ? "text-orange-500" : ""}`} />
                  {(turnTimer.isActive || gameTimer.isCountdownActive) && (
                    <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                      {t.timerOn}
                    </span>
                  )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur">
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {t.turnTimer}
                  </div>
                  {[1, 2, 3, 4, 5].map((minutes) => (
                    <DropdownMenuItem
                      key={`turn-${minutes}`}
                      onClick={() => handleTurnTimerChange(minutes)}
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
                  <div className="h-px bg-border my-1" />
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {t.gameTimer}
                  </div>
                  {[15, 30, 45, 60, 90].map((minutes) => (
                    <DropdownMenuItem
                      key={`game-${minutes}`}
                      onClick={() => gameTimer.startCountdown(minutes)}
                      className="cursor-pointer"
                    >
                      {minutes} {t.minutes}
                    </DropdownMenuItem>
                  ))}
                  {gameTimer.isCountdownActive && (
                    <DropdownMenuItem
                      onClick={() => gameTimer.stopCountdown()}
                      className="cursor-pointer text-destructive"
                    >
                      {t.stopTimer}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowResetDialog(true)}
              >
                <RotateCcw className="w-4 h-4" />
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
            onEndGame={handleEndGame}
          />

          <Leaderboard 
            players={players} 
            onPositionChange={handlePositionChange} 
            roundNumber={roundNumber} 
            onEditPlayer={handleEditPlayer}
            gameTime={gameTimer.formatTime()}
            gameTimeColor={gameTimer.getColorClass()}
            isGameTimeFinished={gameTimer.isFinished}
            showSurpriseEmojis={showSurpriseEmojis}
          />
        </div>
      </div>

      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onConfirm={handleReset}
      />
      
      <KofiDialog
        open={showKofiDialog}
        onOpenChange={setShowKofiDialog}
      />
      
      <EndGameDialog
        open={showEndGameDialog}
        onOpenChange={setShowEndGameDialog}
        players={players}
        onApplyPenalties={handleApplyPenalties}
      />
      
      <RestoreGameDialog
        open={showRestoreDialog}
        onOpenChange={setShowRestoreDialog}
        gameInfo={savedGameInfo}
        onRestore={handleRestoreGame}
        onNewGame={handleNewGame}
      />
    </div>
  );
};

export default Index;
