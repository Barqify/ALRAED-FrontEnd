import raw from "@/data/settings.json";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { SiteSettings } from "@/lib/types";

export const siteSettings = raw as SiteSettings;

/** Contact field values — edit `src/data/settings.json`, not translations */
export function getContactDisplay(locale: Locale) {
  const c = siteSettings.contact;
  return {
    address: pickTriple(c.address, locale),
    phoneDisplay: c.phoneDisplay,
    email: c.email,
    hours: pickTriple(c.hours, locale),
  };
}

/** Social URLs; empty string becomes `#` in the UI */
export function socialUrl(url: string): string {
  const u = url.trim();
  return u.length > 0 ? u : "#";
}
