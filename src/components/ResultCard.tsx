import React from "react";
import { translations } from "@/i18n/translations";
import type { ShareResult } from "@/lib/shareResult";

export const getMedalEmoji = (rank: number) => ["🥇", "🥈", "🥉", "🫂"][rank - 1] ?? "▪️";

export const ResultCard = React.forwardRef<HTMLDivElement, { result: ShareResult }>(({ result }, ref) => {
  const t = translations[result.language];
  return (
    <div ref={ref} dir={result.language === "ar" ? "rtl" : "ltr"} className="w-[360px] max-w-full p-6 bg-background text-foreground font-sans">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3 mb-4">
        <span className="text-2xl font-bold text-primary">ScrabBro</span>
        <span className="text-xs text-muted-foreground">{t.roundLabel} {result.roundNumber} · {result.date}</span>
      </div>
      <ol className="space-y-2">
        {[...result.players].sort((a, b) => b.score - a.score).map((p, i) => (
          <li key={p.id} className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/50"}`}>
            <span className="text-xl w-7 shrink-0 text-center">{getMedalEmoji(i + 1)}</span>
            <span className="flex-1 min-w-0 break-words font-medium">{p.name}</span>
            <span className="text-lg font-bold tabular-nums shrink-0">{p.score}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t.canYouBeatUs} · scrabbro.lovable.app</p>
    </div>
  );
});
ResultCard.displayName = "ResultCard";