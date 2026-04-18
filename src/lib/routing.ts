import { isLocale, type Locale } from "@/lib/i18n";

/** Rewrite first path segment to a new locale, preserving the rest of the URL. */
export function swapLocaleSegment(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return `/${locale}`;
  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }
  return "/" + segments.join("/");
}
