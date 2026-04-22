import type { TranslationDict } from "./types";
import ar from "@/data/translations/ar.json";
import en from "@/data/translations/en.json";
import fr from "@/data/translations/fr.json";

export const locales = ["ar", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, TranslationDict> = { ar, en, fr };

export function isLocale(s: string): s is Locale {
  return locales.includes(s as Locale);
}

export function getDict(locale: Locale): TranslationDict {
  return dictionaries[locale];
}

export function isRtl(locale: Locale): boolean {
  return locale === "ar";
}

export function pickTriple(
  row: { ar: string; en: string; fr: string },
  locale: Locale
): string {
  return row[locale];
}

/** Nested translation path e.g. "hero.title1" */
export function t(dict: TranslationDict, path: string): string {
  const parts = path.split(".");
  let cur: unknown = dict as unknown;
  for (const p of parts) {
    if (cur === null || typeof cur !== "object") return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : path;
}
