import { z } from "zod";
import { getGraphemeLength } from "@/lib/utils";

const resultSchema = z.object({
  players: z.array(z.object({
    id: z.number().int(),
    name: z.string().refine(name => getGraphemeLength(name) <= 15),
    score: z.number().int().min(0).max(9999),
  })).min(1).max(20),
  roundNumber: z.number().int().min(0).max(100000),
  language: z.enum(["en", "es", "zh", "hi", "ar", "pt"]),
  theme: z.enum(["classic", "deluxe", "vintage"]),
  date: z.string().max(50),
});

export type ShareResult = z.infer<typeof resultSchema>;

export function createResultUrl(result: ShareResult, origin: string) {
  const data = resultSchema.parse(result);
  const url = new URL("/result", origin);
  // Fragment data stays in the browser, not in server request logs.
  url.hash = encodeURIComponent(JSON.stringify(data));
  return url.href;
}

export function readResultHash(hash: string): ShareResult | null {
  if (hash.length > 20000) return null;
  try {
    return resultSchema.parse(JSON.parse(decodeURIComponent(hash.replace(/^#/, ""))));
  } catch {
    return null;
  }
}

export function canShareImage(file: File): boolean {
  try {
    return typeof navigator.share === "function" && navigator.canShare?.({ files: [file] }) === true;
  } catch {
    return false;
  }
}

export function canCopyImage(): boolean {
  return typeof ClipboardItem !== "undefined" && typeof navigator.clipboard?.write === "function" &&
    (typeof ClipboardItem.supports !== "function" || ClipboardItem.supports("image/png"));
}

export const isEmbeddedWebView = () => {
  const w = window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } };
  return w.Capacitor?.isNativePlatform?.() === true || /; wv\)/.test(navigator.userAgent);
};