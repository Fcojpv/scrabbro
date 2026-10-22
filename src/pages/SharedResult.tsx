import { useEffect, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { Share2 } from "lucide-react";
import { ResultCard } from "@/components/ResultCard";
import { ShareImageDialog } from "@/components/ShareImageDialog";
import { Button } from "@/components/ui/button";
import { readResultHash } from "@/lib/shareResult";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function SharedResult() {
  const { t, setLanguage } = useLanguage();
  const { setTheme } = useTheme();
  const [result] = useState(() => readResultHash(window.location.hash));
  const ref = useRef<HTMLDivElement>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!result) return;
    setLanguage(result.language);
    setTheme(result.theme);
    // The isolated result page does not restore or overwrite game data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    if (!result) return;
    let cancelled = false;
    setFailed(false);
    const generate = async () => {
      try {
        await document.fonts.ready;
        const element = ref.current;
        if (!element) return;
        const backgroundColor = getComputedStyle(element).backgroundColor;
        const options = { pixelRatio: 2, backgroundColor, cacheBust: true };
        await toBlob(element, options);
        const image = await toBlob(element, options);
        if (!image) throw new Error("Empty image");
        if (!cancelled) { setBlob(image); setOpen(true); }
      } catch { if (!cancelled) setFailed(true); }
    };
    void generate();
    return () => { cancelled = true; };
  }, [result, attempt]);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center gap-6 px-4 py-8">
      {result ? <>
        <ResultCard ref={ref} result={result} />
        {failed && <p role="alert" className="text-destructive">{t.imageCaptureError}</p>}
        <Button disabled={!blob && !failed} onClick={() => failed ? setAttempt(value => value + 1) : setOpen(true)} className="min-h-12 gap-2">
          <Share2 className="w-5 h-5" /> {t.shareImage}
        </Button>
        <ShareImageDialog blob={blob} open={open} onOpenChange={setOpen} shareText="ScrabBro" resultUrl={window.location.href} />
      </> : <p role="alert">{t.invalidResult}</p>}
    </main>
  );
}