"use client";

import { useEffect, useLayoutEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { isRtl } from "@/lib/i18n";

const titles: Record<Locale, string> = {
  ar: "alraedcrops",
  en: "alraedcrops",
  fr: "alraedcrops",
};

function applyDocumentLocale(locale: Locale) {
  const html = document.documentElement;
  html.lang = locale;
  html.dir = isRtl(locale) ? "rtl" : "ltr";
}

export function LocaleEffects({ locale }: { locale: Locale }) {
  /** Before paint on client navigations — keeps `dir` / Tailwind `rtl:` in sync with the route. */
  useLayoutEffect(() => {
    applyDocumentLocale(locale);
  }, [locale]);

  useEffect(() => {
    document.title = titles[locale];
  }, [locale]);

  return null;
}
