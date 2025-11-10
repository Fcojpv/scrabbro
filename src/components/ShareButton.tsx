import React from "react";
import { Share2, Camera, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import html2canvas from "html2canvas";
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
  
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const hasScores = sortedPlayers.some(p => p.score > 0);
  
  if (!hasScores) return null;

  const getMedalEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    if (rank === 4) return "🫂";
    return "▪️";
  };

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

  const captureLeaderboard = async (): Promise<Blob | null> => {
    if (!leaderboardId) return null;
    
    const element = document.getElementById(leaderboardId);
    if (!element) {
      console.error("Leaderboard element not found");
      return null;
    }

    try {
      setIsCapturing(true);
      
      // Capture with better quality for mobile
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#ffffff',
        logging: false,
        useCORS: true,
      });

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error("Error capturing leaderboard:", error);
      toast.error("Error al capturar la imagen");
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShareAsImage = async () => {
    setShowShareDialog(false);
    
    const imageBlob = await captureLeaderboard();
    if (!imageBlob) {
      toast.error("No se pudo capturar la imagen");
      return;
    }

    const file = new File([imageBlob], 'scrabble-score.png', { type: 'image/png' });
    const shareText = `🎯 Scrabble Score - ${t.results}\n\n⏱️ ${roundNumber} ${t.roundsPlayed}\n\n${t.canYouBeatUs} 🔥`;

    // Try native share with image
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title: "Scrabble Score",
          text: shareText,
          files: [file],
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error sharing image:", error);
          // Fallback: download the image
          downloadImage(imageBlob);
        }
      }
    } else {
      // Fallback for browsers that don't support file sharing
      downloadImage(imageBlob);
      toast.success("Imagen descargada. Puedes compartirla desde tu galería.");
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scrabble-score-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        className="h-8 w-8 text-primary hover:text-primary/80"
        title={t.shareResults}
        disabled={isCapturing}
      >
        <Share2 className="w-4 h-4" />
      </Button>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Compartir Resultados</DialogTitle>
            <DialogDescription className="text-center">
              Elige cómo quieres compartir tus resultados
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-3 py-4">
            {leaderboardId && (
              <Button
                onClick={handleShareAsImage}
                className="w-full h-auto py-4 flex flex-col gap-2"
                variant="default"
                disabled={isCapturing}
              >
                <Camera className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-semibold">Compartir como Imagen</div>
                  <div className="text-xs opacity-80">Captura bonita del leaderboard</div>
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
                <div className="font-semibold">Compartir como Texto</div>
                <div className="text-xs opacity-80">Ranking en formato texto</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};