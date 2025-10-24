import { useState, useRef, useEffect } from "react";
import { PlayerSetup } from "@/components/PlayerSetup";
import { Leaderboard } from "@/components/Leaderboard";
import { TurnInput } from "@/components/TurnInput";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { SettingsMenu } from "@/components/SettingsMenu";
import { Button } from "@/components/ui/button";
import { RotateCcw, Clock, Hourglass, Music, ChevronRight, ChevronLeft } from "lucide-react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

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
  const [isRadioPlaying, setIsRadioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const { formatTime: formatGameTime } = useGameTimer(gameStarted);
  const turnTimer = useTurnTimer(currentTurn, gameStarted);

  // Carousel slide tracking
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  const toggleRadio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://stream.zeno.fm/v2wvrmeknm0uv");
      audioRef.current.volume = 0.5;
    }

    if (isRadioPlaying) {
      audioRef.current.pause();
      setIsRadioPlaying(false);
      toast.info("Radio detenida");
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Error playing radio:", error);
        toast.error("Error al reproducir la radio");
      });
      setIsRadioPlaying(true);
      toast.success("Radio iniciada");
    }
  };

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
    <div className="min-h-screen bg-background p-4 pb-8">
      {/* Mobile carousel view */}
      <div className="md:hidden">
        <Carousel 
          setApi={setCarouselApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent>
            {/* Screen 1: Main game */}
            <CarouselItem>
              <div className="max-w-2xl mx-auto space-y-3 animate-slide-up">
                <div className="flex justify-between items-center pt-2">
                  <h1 className="text-2xl font-bold text-foreground">{t.scrabbleScore}</h1>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={toggleRadio}
                      className="flex flex-col items-center justify-center gap-0 h-10 p-1"
                    >
                      <Music className={`w-4 h-4 ${isRadioPlaying ? "text-orange-500" : ""}`} />
                      {isRadioPlaying && (
                        <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                          live
                        </span>
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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
                />

                <Leaderboard 
                  players={players} 
                  onPositionChange={handlePositionChange} 
                  roundNumber={roundNumber} 
                  onEditScore={handleEditScore}
                  gameTime={formatGameTime()}
                />
              </div>
            </CarouselItem>

            {/* Screen 2: Coming soon */}
            <CarouselItem>
              <div className="max-w-2xl mx-auto space-y-3 animate-slide-up min-h-[60vh] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p className="text-lg">Próxima funcionalidad</p>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Navigation indicators - Right chevron (only on first screen) */}
          {currentSlide === 0 && (
            <button
              onClick={() => carouselApi?.scrollNext()}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 text-foreground/20 hover:text-foreground/40 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Navigation indicators - Left chevron (only on second screen) */}
          {currentSlide === 1 && (
            <button
              onClick={() => carouselApi?.scrollPrev()}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 text-foreground/20 hover:text-foreground/40 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1].map((index) => (
              <button
                key={index}
                onClick={() => carouselApi?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentSlide === index 
                    ? "bg-foreground" 
                    : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </Carousel>
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
                onClick={toggleRadio}
                className="flex flex-col items-center justify-center gap-0 h-10 p-1"
              >
                <Music className={`w-4 h-4 ${isRadioPlaying ? "text-orange-500" : ""}`} />
                {isRadioPlaying && (
                  <span className="text-[9px] font-semibold text-orange-500 leading-none -mt-0.5">
                    live
                  </span>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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
          />

          <Leaderboard 
            players={players} 
            onPositionChange={handlePositionChange} 
            roundNumber={roundNumber} 
            onEditScore={handleEditScore}
            gameTime={formatGameTime()}
          />
        </div>
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
