import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Cuenta grafemas (caracteres visuales) en lugar de unidades de código UTF-16.
 * Previene que emojis cuenten como 2+ caracteres.
 */
export function getGraphemeLength(str: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('es', { granularity: 'grapheme' });
    return [...segmenter.segment(str)].length;
  }
  return [...str].length;
}

/**
 * Trunca un string por grafemas sin cortar emojis a la mitad.
 * Previene el símbolo "�" al cortar mid-surrogate.
 */
export function truncateByGraphemes(str: string, maxLength: number): string {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new (Intl as any).Segmenter('es', { granularity: 'grapheme' });
    const graphemes = [...segmenter.segment(str)];
    if (graphemes.length <= maxLength) return str;
    return graphemes.slice(0, maxLength).map((g: any) => g.segment).join('');
  }
  const chars = [...str];
  if (chars.length <= maxLength) return str;
  return chars.slice(0, maxLength).join('');
}
