import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import confetti from "canvas-confetti";

interface TurnInputProps {
  currentPlayer: number;
  currentPlayerName: string;
  onSubmitScore: (score: number, wasBingo: boolean) => void;
  timerDisplay: string | null;
  timerColorClass: string;
  isTimerFinished: boolean;
  onEndGame: () => void;
}

export const TurnInput = ({ 
  currentPlayer, 
  currentPlayerName, 
  onSubmitScore,
  timerDisplay,
  timerColorClass,
  isTimerFinished,
  onEndGame
}: TurnInputProps) => {
  const { t } = useLanguage();
  const [score, setScore] = useState("");
  const [wasBingo, setWasBingo] = useState(false);
  const bingoButtonRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = () => {
    const numScore = parseInt(score) || 0;
    if (numScore >= 0) {
      onSubmitScore(numScore, wasBingo);
      setScore("");
      setWasBingo(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setScore("");
  };

  const handleBingo = () => {
    const newScore = Math.min(parseInt(score || "0") + 50, 9999).toString();
    setScore(newScore);
    setWasBingo(true);
    
    // Trigger confetti from the button position
    if (bingoButtonRef.current) {
      const rect = bingoButtonRef.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x, y },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#9370DB', '#3CB371'],
        ticks: 200,
        gravity: 1,
        scalar: 0.6,
      });
    }
  };

  return (
    <Card className="p-4 border-2 border-primary/20 bg-card/50 backdrop-blur relative">
      {timerDisplay && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className={`text-2xl font-bold font-mono ${timerColorClass} transition-colors`}>
            {timerDisplay}
          </span>
          {isTimerFinished && (
            <span className="text-2xl animate-bounce">🔔</span>
          )}
        </div>
      )}
      <div className="space-y-3">
        <div className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEndGame}
            className="absolute left-0 top-0 h-auto py-1 px-2 text-[10px] leading-tight"
          >
            <span className="block">{t.finishedGame.split(' ')[0]}</span>
            <span className="block -mt-0.5">{t.finishedGame.split(' ')[1]}</span>
          </Button>
          <h3 className="text-lg font-semibold text-muted-foreground">{t.turn}</h3>
          <p className="text-2xl font-bold text-primary animate-pulse-subtle">
            {currentPlayerName}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={score}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || (parseInt(val) >= 0 && parseInt(val) <= 9999)) {
                setScore(val);
              }
            }}
            placeholder={t.enterScore}
            onKeyPress={handleKeyPress}
            className="text-2xl text-center font-bold h-12"
            max={9999}
          />
          {score.length > 0 && (
            <Button 
              onClick={handleClear}
              variant="ghost"
              size="lg"
              className="px-4"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="px-6"
          >
            <CheckCircle2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex gap-2 flex-nowrap">
          {[1, 5, 10, 25].map((quickScore) => (
            <Button
              key={quickScore}
              variant="outline"
              size="sm"
              onClick={() => setScore((prev) => {
                const newVal = parseInt(prev || "0") + quickScore;
                return Math.min(newVal, 9999).toString();
              })}
              className="flex-1 min-w-[50px]"
            >
              +{quickScore}
            </Button>
          ))}
          <Button
            ref={bingoButtonRef}
            variant="outline"
            size="sm"
            onClick={handleBingo}
            className="flex-1 min-w-[50px] border-2 border-yellow-500/50 hover:border-yellow-500 flex-col gap-0.5 py-1.5"
          >
            <span className="text-sm leading-none">+50</span>
            <span className="text-[9px] text-yellow-500 font-semibold leading-none">
              {t.bingo}
            </span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
