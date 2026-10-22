import React from "react";
import { Share2, Download, Copy, ExternalLink, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { canCopyImage, canShareImage, isEmbeddedWebView } from "@/lib/shareResult";

interface Props {
  blob: Blob | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareText: string;
  resultUrl?: string;
}

export const ShareImageDialog = ({ blob, open, onOpenChange, shareText, resultUrl }: Props) => {
  const { t } = useLanguage();
  const [showHint, setShowHint] = React.useState(false);

  const url = React.useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  const file = React.useMemo(
    () => (blob ? new File([blob], `scrabbro-${Date.now()}.png`, { type: "image/png" }) : null),
    [blob],
  );
  React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  React.useEffect(() => { if (open) setShowHint(!file || !canShareImage(file)); }, [open, file]);

  const canShareFile = file ? canShareImage(file) : false;
  const [isCopying, setIsCopying] = React.useState(false);

  // Called synchronously from the click so the browser keeps the user gesture.
  const handleShare = () => {
    if (!file || !canShareFile) { setShowHint(true); return; }
    try {
      navigator.share({ files: [file], title: "ScrabBro" }).catch((err: Error) => {
        if (err?.name !== "AbortError") setShowHint(true);
      });
    } catch { setShowHint(true); }
  };

  const handleCopy = () => {
    if (!blob || !canCopyImage()) { setShowHint(true); return; }
    setIsCopying(true);
    try {
      navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
        .then(() => toast.success(t.imageCopied))
        .catch(() => { setShowHint(true); toast.error(t.imageCopyError); })
        .finally(() => setIsCopying(false));
    } catch { setIsCopying(false); setShowHint(true); toast.error(t.imageCopyError); }
  };

  const handleCopyLink = () => {
    if (!resultUrl) return;
    navigator.clipboard?.writeText(resultUrl).then(() => toast.success(t.resultLinkCopied))
      .catch(() => toast.error(t.browserOpenError));
  };

  const handleOpenBrowser = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
    // No success toast: the embedded host decides whether to launch a browser.
  };

  const handleSave = () => {
    if (!url || isEmbeddedWebView()) { setShowHint(true); return; }
    const a = document.createElement("a");
    a.href = url;
    a.download = file?.name ?? "scrabbro.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.message(t.downloadStarted);
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
          <p role="status" className="text-center text-sm text-muted-foreground">{t.browserShareHint}</p>
        )}
        <div className="grid gap-2">
          {canShareFile && (
              <Button onClick={handleShare} className="h-12 gap-2">
                <Share2 className="w-5 h-5" /> {t.shareImage}
              </Button>
          )}
          {canCopyImage() && (
            <Button onClick={handleCopy} disabled={isCopying} variant="outline" className="h-11 gap-2">
              <Copy className="w-5 h-5" /> {t.copyImage}
            </Button>
          )}
          {!isEmbeddedWebView() && (
              <Button onClick={handleSave} variant="outline" className="h-11 gap-2">
                <Download className="w-5 h-5" /> {t.saveImage}
              </Button>
          )}
          {resultUrl && <>
            <Button onClick={handleOpenBrowser} variant={showHint ? "default" : "outline"} className="min-h-11 h-auto py-3 gap-2 whitespace-normal">
              <ExternalLink className="w-5 h-5 shrink-0" /> {t.openResultBrowser}
            </Button>
            <Button onClick={handleCopyLink} variant="outline" className="min-h-11 h-auto py-3 gap-2 whitespace-normal">
              <Link className="w-5 h-5 shrink-0" /> {t.copyResultLink}
            </Button>
          </>}
          <Button onClick={() => onOpenChange(false)} variant="ghost" className="h-11">{t.closeLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
