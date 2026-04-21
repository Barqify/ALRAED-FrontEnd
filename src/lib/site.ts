import siteSettings from "@/data/settings.json";
import type { SiteSettings } from "@/lib/types";

const settings = siteSettings as SiteSettings;

export const SITE_MAP = settings.map;

export const SITE_WHATSAPP = settings.whatsapp;

/** OpenStreetMap iframe (no API key; uses coordinates from settings.json). */
export function openStreetMapEmbedSrc(): string {
  const { lat, lng } = settings.map;
  const pad = 0.03;
  const bbox = `${lng - pad},${lat - pad},${lng + pad},${lat + pad}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}
