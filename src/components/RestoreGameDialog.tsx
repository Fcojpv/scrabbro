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
import { useLanguage } from "@/contexts/LanguageContext";
import { Clock } from "lucide-react";

interface RestoreGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameInfo: {
    players: string;
    round: number;
    timestamp: number;
  } | null;
  onRestore: () => void;
  onNewGame: () => void;
}

export const RestoreGameDialog = ({ 
  open, 
  onOpenChange, 
  gameInfo, 
  onRestore, 
  onNewGame 
}: RestoreGameDialogProps) => {
  const { t } = useLanguage();

  if (!gameInfo) return null;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? t.minute : t.minutes} ${t.ago}`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? t.hour : t.hours} ${t.ago}`;
    return `${diffDays} ${diffDays === 1 ? t.day : t.days} ${t.ago}`;
  };

  const handleRestore = () => {
    onRestore();
    onOpenChange(false);
  };

  const handleNewGame = () => {
    onNewGame();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            {t.gameInProgress}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div className="text-foreground/90 font-medium">
              {t.savedGameFound}
            </div>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">{t.player}:</span>{" "}
                <span className="font-medium text-foreground">{gameInfo.players}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t.round}:</span>{" "}
                <span className="font-medium text-foreground">{gameInfo.round}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{t.lastPlayed}:</span>{" "}
                <span className="font-medium text-foreground">{formatTimestamp(gameInfo.timestamp)}</span>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              {t.continueOrNewQuestion}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel onClick={handleNewGame} className="sm:flex-1">
            {t.newGame}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRestore} className="sm:flex-1">
            {t.continueGame}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
