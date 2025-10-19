import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

interface PlayerSetupProps {
  onStart: (playerCount: number) => void;
}

export const PlayerSetup = ({ onStart }: PlayerSetupProps) => {
  const [selectedCount, setSelectedCount] = useState(2);

  const playerOptions = [2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8 space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Scrabble Score</h1>
          <p className="text-muted-foreground">¿Cuántos jugadores?</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {playerOptions.map((count) => (
            <button
              key={count}
              onClick={() => setSelectedCount(count)}
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

        <Button 
          onClick={() => onStart(selectedCount)} 
          size="lg" 
          className="w-full"
        >
          Comenzar Juego
        </Button>
      </Card>
    </div>
  );
};
