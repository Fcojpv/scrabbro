import { useEffect, useState } from 'react';
import { ExternalLink, LoaderCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { FEEDBACK_FORM_URL } from '@/lib/feedback';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hasActiveGame: boolean;
}

export const FeedbackDialog = ({ open, onOpenChange, hasActiveGame }: FeedbackDialogProps) => {
  const { t, language } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  useEffect(() => {
    if (!open) return;
    setLoaded(false);
    setShowFallback(false);
    const timeout = window.setTimeout(() => setShowFallback(true), 12000);
    return () => window.clearTimeout(timeout);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={language === 'ar' ? 'rtl' : 'ltr'} className="flex h-[90dvh] max-h-[90dvh] w-[calc(100%-1rem)] max-w-xl flex-col gap-0 overflow-hidden rounded-lg p-0 [&>button]:hidden">
        <DialogHeader className="shrink-0 px-4 pb-3 pt-4 text-start">
          <DialogTitle className="tracking-normal">{t.sendFeedback}</DialogTitle>
          {hasActiveGame && <DialogDescription>{t.feedbackDescription}</DialogDescription>}
        </DialogHeader>
        <div className="relative min-h-0 flex-1 border-y border-border">
          {!loaded && <div role="status" className="absolute inset-0 flex items-center justify-center gap-2 bg-background text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" />{t.feedbackLoading}</div>}
          <iframe src={FEEDBACK_FORM_URL} title={t.sendFeedback} className="h-full w-full border-0" onLoad={() => setLoaded(true)} onError={() => setShowFallback(true)} />
        </div>
        {showFallback && <div className="shrink-0 px-4 pt-2 text-sm text-muted-foreground">
          <p>{t.feedbackUnavailable}</p>
          <Button variant="link" asChild className="h-auto px-0 py-2"><a href={FEEDBACK_FORM_URL} target="_blank" rel="noopener noreferrer"><ExternalLink className="me-2 h-4 w-4" />{t.feedbackOpenExternal}</a></Button>
        </div>}
        <div className="shrink-0 p-3">
          <DialogClose asChild><Button className="min-h-11 w-full">{hasActiveGame ? t.feedbackClose : t.cancel}</Button></DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};