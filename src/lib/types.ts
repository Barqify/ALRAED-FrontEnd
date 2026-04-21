/** Localized triplet used across content JSON */
export type LocalizedTriple = {
  ar: string;
  en: string;
  fr: string;
};

export type Category = {
  id: string;
  icon: string;
  color: string;
  bg: string;
  ar: string;
  en: string;
  fr: string;
  arDesc: string;
  enDesc: string;
  frDesc: string;
};

export type Product = {
  id: number;
  cat: string;
  ar: string;
  en: string;
  fr: string;
  arD: string;
  enD: string;
  frD: string;
  img: string;
};

export type NewsItem = {
  id: number;
  img: string;
  date: LocalizedTriple;
  location: LocalizedTriple;
  ar: string;
  en: string;
  fr: string;
  arD: string;
  enD: string;
  frD: string;
};

export type VideoItem = {
  id: string;
  title: LocalizedTriple;
  url: string;
  thumb: string;
};

export type GalleryImage = {
  id: string;
  ar: string;
  en: string;
  fr: string;
  img: string;
};

export type TeamMember = {
  name: string;
  en: string;
  fr: string;
  role: string;
  enRole: string;
  frRole: string;
  color: string;
  img: string;
};

export type CertItem = {
  n: string;
  i: string;
};

export type LogoConfig = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LogoFile = Record<"ar" | "en" | "fr", LogoConfig>;

/** Single JSON source for contact, map, WhatsApp, social URLs (`src/data/settings.json`) */
export type SiteSettings = {
  contact: {
    address: LocalizedTriple;
    phoneDisplay: string;
    email: string;
    hours: LocalizedTriple;
  };
  whatsapp: string;
  map: {
    lat: number;
    lng: number;
    googleMapsUrl: string;
    shortGoogleMapsUrl: string;
  };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  /** First content block on the home page after the gallery strip (image or video carousel) */
  homeSpotlight:
    | {
        mode: "image";
        imageUrl: string;
        alt: LocalizedTriple;
      }
    | {
        mode: "videos";
      };
};

/** Translation file shape (same for ar, en, fr JSON) */
export type TranslationDict = {
  nav: { home: string; about: string; products: string; news: string; contact: string };
  hero: Record<string, string>;
  stats: Record<string, string>;
  cats: Record<string, string>;
  featured: Record<string, string>;
  news: Record<string, string>;
  why: Record<string, string | Record<string, string>>;
  cta: Record<string, string>;
  about: Record<string, unknown>;
  products: Record<string, string>;
  contact: Record<string, unknown>;
  footer: Record<string, string>;
  packaging: string;
  egypt: string;
};
