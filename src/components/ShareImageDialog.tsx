import React from "react";
import { Share2, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  blob: Blob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareText: string;
}

/** Android WebView (e.g. Capacitor shell) ignores <a download> and Web Share. */
export const isEmbeddedWebView = () => {
  const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
  if (w.Capacitor?.isNativePlatform?.()) return true;
  return /; wv\)/.test(navigator.userAgent);
};

export const ShareImageDialog = ({ blob, open, onOpenChange, shareText }: Props) => {
  const { t } = useLanguage();
  const [showHint, setShowHint] = React.useState(false);

  const url = React.useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  const file = React.useMemo(
    () => (blob ? new File([blob], `scrabbro-${Date.now()}.png`, { type: "image/png" }) : null),
    [blob],
  );
  React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  React.useEffect(() => { if (open) setShowHint(isEmbeddedWebView()); }, [open]);

  const canShareFile = !!file && !!navigator.share && !!navigator.canShare?.({ files: [file] });

  // Called synchronously from the click so the browser keeps the user gesture.
  const handleShare = () => {
    if (!file || !canShareFile) { setShowHint(true); return; }
    navigator.share({ files: [file], text: shareText, title: "ScrabBro" }).catch((err: Error) => {
      if (err?.name !== "AbortError") setShowHint(true);
    });
  };

  const handleSave = () => {
    if (!url || isEmbeddedWebView()) { setShowHint(true); return; }
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name ?? "scrabbro.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success(t.imageSaved);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">{t.sharePreviewTitle}</DialogTitle>
          <DialogDescription className="text-center">{t.shareAsImageDesc}</DialogDescription>
        </DialogHeader>
        {url && (
          <img
            src={url}
            alt={t.sharePreviewTitle}
            className="w-full rounded-lg border border-border shadow-sm select-auto"
            style={{ WebkitTouchCallout: "default" } as React.CSSProperties}
          />
        )}
        {showHint && (
          <p role="status" className="text-center text-sm text-muted-foreground">{t.longPressHint}</p>
        )}
        <div className="grid gap-2">
          {!isEmbeddedWebView() && (
            <>
              <Button onClick={handleShare} className="h-12 gap-2">
                <Share2 className="w-5 h-5" /> {t.shareImage}
              </Button>
              <Button onClick={handleSave} variant="outline" className="h-11 gap-2">
                <Download className="w-5 h-5" /> {t.saveImage}
              </Button>
            </>
          )}
          <Button onClick={() => onOpenChange(false)} variant="ghost" className="h-11">{t.closeLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
