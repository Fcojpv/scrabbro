import React from "react";
import { Share2, Camera, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { toBlob } from "html-to-image";
import { ShareImageDialog } from "@/components/ShareImageDialog";
import { ResultCard, getMedalEmoji } from "@/components/ResultCard";
import { createResultUrl, type ShareResult } from "@/lib/shareResult";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Player {
  id: number;
  name: string;
  score: number;
}

interface ShareButtonProps {
  players: Player[];
  roundNumber: number;
  leaderboardId?: string;
}

export const ShareButton = ({ players, roundNumber, leaderboardId }: ShareButtonProps) => {
  const { t } = useLanguage();
  const [showShareDialog, setShowShareDialog] = React.useState(false);
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [imageBlob, setImageBlob] = React.useState<Blob | null>(null);
  const [showPreview, setShowPreview] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { theme } = useTheme();
  const [resultUrl, setResultUrl] = React.useState<string>();
  const result: ShareResult = { players, roundNumber, language, theme, date: new Date().toLocaleDateString(language) };

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const hasScores = sortedPlayers.some(p => p.score > 0);

  if (!hasScores) return null;

  const generateShareText = () => {
    const rankings = sortedPlayers
      .map((player, index) => {
        const rank = index + 1;
        const medal = getMedalEmoji(rank);
        return `${medal} #${rank} ${player.name} - ${player.score} pts`;
      })
      .join("\n");

    return `🎯 Scrabble Score - ${t.results}

${rankings}

⏱️ ${roundNumber} ${t.roundsPlayed}

${t.canYouBeatUs} 🔥
${t.playHere} ${window.location.origin}

#ScrabbleScore #Scrabble #BoardGame`;
  };

  const imageShareText = `🎯 ScrabBro - ${t.results}\n${t.canYouBeatUs} 🔥\n${window.location.origin}`;

  const captureCard = async (): Promise<Blob | null> => {
    const element = cardRef.current;
    if (!element) return null;
    try {
      setIsCapturing(true);
      const bgVar = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
      const opts = { pixelRatio: 2, backgroundColor: bgVar ? `hsl(${bgVar})` : "#ffffff", cacheBust: true };
      await toBlob(element, opts).catch(() => null); // warm-up pass (fonts)
      return await toBlob(element, opts);
    } catch (error) {
      console.error("Error capturing result card:", error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShareAsImage = async () => {
    setShowShareDialog(false);
    // Transfer the snapshot, not the page-local blob, to a different browser.
    try { setResultUrl(createResultUrl(result, window.location.origin)); }
    catch { toast.error(t.imageCaptureError); return; }
    const blob = await captureCard();
    if (!blob) { toast.error(t.imageCaptureError); return; }
    setImageBlob(blob);
    setShowPreview(true);
  };

  const handleShareAsText = async () => {
    setShowShareDialog(false);
    const shareText = generateShareText();

    // Try Web Share API first (native sharing on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Scrabble Score",
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing:", error);
          fallbackCopyToClipboard(shareText);
        }
      }
    } else {
      // Fallback to clipboard for desktop
      fallbackCopyToClipboard(shareText);
    }
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const fallbackCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t.copiedToClipboard);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error(t.shareNotSupported);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="h-8 w-8"
        title={t.shareResults}
        disabled={isCapturing}
      >
        <Share2 className="w-4 h-4" />
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{t.shareDialogTitle}</DialogTitle>
            <DialogDescription className="text-center">
              {t.shareDialogDesc}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {(
              <Button
                onClick={handleShareAsImage}
                className="w-full h-auto py-4 flex flex-col gap-2"
                variant="default"
                disabled={isCapturing}
              >
                <Camera className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">{t.shareAsImage}</div>
                  <div className="text-xs opacity-80">{t.shareAsImageDesc}</div>
                </div>
              </Button>
            )}

            <Button
              onClick={handleShareAsText}
              className="w-full h-auto py-4 flex flex-col gap-2"
              variant="outline"
            >
              <MessageSquare className="w-6 h-6" />
              <div className="text-center">
                <div className="font-semibold">{t.shareAsText}</div>
                <div className="text-xs opacity-80">{t.shareAsTextDesc}</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ShareImageDialog blob={imageBlob} open={showPreview} onOpenChange={setShowPreview} shareText={imageShareText} resultUrl={resultUrl} />

      {/* Off-screen result card used only for image capture */}
      <div aria-hidden="true" style={{ position: "fixed", left: "-10000px", top: 0, pointerEvents: "none" }}>
        <ResultCard ref={cardRef} result={result} />
      </div>
    </>
  );
};
