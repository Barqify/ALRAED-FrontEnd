"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { isRtl } from "@/lib/i18n";

const titles: Record<Locale, string> = {
  ar: "الماسة للمحاصيل الزراعية",
  en: "ALMASA CROPS — Egyptian Agricultural Products",
  fr: "ALMASA CROPS — Produits Agricoles Égyptiens",
};

export function LocaleEffects({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl(locale) ? "rtl" : "ltr";
    document.title = titles[locale];
  }, [locale]);

  return null;
}
