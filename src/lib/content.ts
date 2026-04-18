import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";

export function productLabel(p: Product, locale: Locale): string {
  return pickTriple(
    { ar: p.ar, en: p.en, fr: p.fr },
    locale
  );
}

export function productDesc(p: Product, locale: Locale): string {
  return pickTriple(
    { ar: p.arD, en: p.enD, fr: p.frD },
    locale
  );
}

export function categoryById(
  categories: Category[],
  id: string
): Category | undefined {
  return categories.find((c) => c.id === id);
}
