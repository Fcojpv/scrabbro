import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface EndGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Player[];
  onApplyPenalties: (penalties: Record<number, number>) => void;
}

export const EndGameDialog = ({ 
  open, 
  onOpenChange, 
  players,
  onApplyPenalties 
}: EndGameDialogProps) => {
  const { t } = useLanguage();
  const [showPenalties, setShowPenalties] = useState(false);
  const [penalties, setPenalties] = useState<Record<number, string>>({});

  const handleApplyPenalties = () => {
    // Convert penalties to numbers and always make them negative
    const finalPenalties: Record<number, number> = {};
    players.forEach(player => {
      const penalty = parseInt(penalties[player.id] || "0");
      // Always subtract (make negative if positive was entered)
      finalPenalties[player.id] = Math.abs(penalty);
    });
    onApplyPenalties(finalPenalties);
    setShowPenalties(false);
    setPenalties({});
  };

  const handleCancel = () => {
    setShowPenalties(false);
    setPenalties({});
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(open) => {
      if (!open) handleCancel();
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {showPenalties ? t.unusedTilesPenalty : t.finishedGame}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {showPenalties ? (
              <div className="pt-4">
                <p className="text-sm mb-4">{t.penaltyDescription}</p>
                <ScrollArea className="max-h-[40vh] pr-4">
                  <div className="space-y-3">
                    {players.map(player => (
                      <div key={player.id} className="flex items-center gap-3">
                        <Label 
                          htmlFor={`penalty-${player.id}`}
                          className="flex-1 text-base font-semibold"
                        >
                          {player.name}
                        </Label>
                        <Input
                          id={`penalty-${player.id}`}
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          placeholder="0"
                          value={penalties[player.id] || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            setPenalties(prev => ({
                              ...prev,
                              [player.id]: value
                            }));
                          }}
                          className="w-24 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <>
                {t.endGameConfirmation} {t.endGameQuestion}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            if (!showPenalties) {
              e.preventDefault(); // Prevent dialog from closing
              setShowPenalties(true);
            } else {
              handleApplyPenalties();
            }
          }}>
            {showPenalties ? t.applyPenalties : t.yes}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
