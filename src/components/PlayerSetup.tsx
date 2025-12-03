import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, ChevronLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SettingsMenu } from "@/components/SettingsMenu";
import { getGraphemeLength, truncateByGraphemes } from "@/lib/utils";

interface PlayerSetupProps {
  onStart: (players: { id: number; name: string; score: number }[]) => void;
}

export const PlayerSetup = ({ onStart }: PlayerSetupProps) => {
  const { t } = useLanguage();
  const [selectedCount, setSelectedCount] = useState(1);
  const [step, setStep] = useState<'count' | 'names'>('count');
  const [playerNames, setPlayerNames] = useState<string[]>([]);

  const playerOptions = [1, 2, 3, 4];

  const handleCountSelect = (count: number) => {
    setSelectedCount(count);
    setPlayerNames(Array.from({ length: count }, () => ""));
    setStep('names');
  };

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = truncateByGraphemes(name, 15);
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const players = playerNames.map((name, i) => ({
      id: i + 1,
      name: name.trim() || `${t.player} ${i + 1}`,
      score: 0
    }));
    onStart(players);
  };

  if (step === 'names') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
        <div className="absolute top-4 right-4">
          <SettingsMenu />
        </div>
        <Card className="w-full max-w-md p-8 space-y-6 animate-slide-up">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('count')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="p-4 bg-primary/10 rounded-full">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="w-16" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">{t.names}</h1>
            <p className="text-muted-foreground">{t.enterPlayerName}</p>
          </div>

          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index} className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {t.player} {index + 1}
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    placeholder={`${t.player} ${index + 1}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="text-center font-medium pr-10"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    {15 - getGraphemeLength(name)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleStart} 
            size="lg" 
            className="w-full"
          >
            {t.startGame}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      <div className="absolute top-4 right-4">
        <SettingsMenu />
      </div>
      <Card className="w-full max-w-md p-8 space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">{t.scrabbleScore}</h1>
          <p className="text-muted-foreground">{t.howManyPlayers}</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {playerOptions.map((count) => (
            <button
              key={count}
              onClick={() => handleCountSelect(count)}
              className={`
                aspect-square rounded-lg border-2 transition-all
                ${
                  selectedCount === count
                    ? "bg-primary text-primary-foreground border-primary shadow-lg scale-105"
                    : "bg-card text-card-foreground border-border hover:border-primary/50 hover:scale-105"
                }
              `}
            >
              <span className="text-2xl font-bold">{count}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};
