import { Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClosedScreenProps {
  open: boolean;
  onBack: () => void;
}

export const ClosedScreen = ({ open, onBack }: ClosedScreenProps) => {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="closed-title"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-background p-8 text-center animate-in fade-in duration-300"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-card">
        <Power className="h-8 w-8 text-destructive" aria-hidden="true" />
      </div>
      <div className="text-3xl font-bold text-primary">ScrabBro</div>
      <h1 id="closed-title" className="text-xl font-semibold text-foreground">{t.closedTitle}</h1>
      <p className="max-w-xs text-sm text-muted-foreground">{t.closedDescription}</p>
      <Button size="lg" className="h-12 min-w-48" onClick={onBack} autoFocus>
        {t.backToGame}
      </Button>
    </div>
  );
};
