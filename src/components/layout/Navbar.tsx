"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import logoFile from "@/data/logo.json";
import type { Locale } from "@/lib/i18n";
import { swapLocaleSegment } from "@/lib/routing";
import type { LogoFile, TranslationDict } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const localesCycle: Locale[] = ["ar", "en", "fr"];
const LOCALE_COOKIE = "alraed_locale";
const ONE_YEAR = 60 * 60 * 24 * 365;

function localeLabel(l: Locale): string {
  if (l === "ar") return "العربية";
  if (l === "en") return "English";
  return "Français";
}

/** Short hint so each row is unmistakable (native <option> cannot be styled on phones). */
function localeHint(l: Locale): string {
  if (l === "ar") return "واجهة كاملة · اتجاه من اليمين لليسار";
  if (l === "en") return "Full site · left to right";
  return "Site complet · de gauche à droite";
}

export function Navbar({
  locale,
  dict,
}: {
  locale: Locale;
  dict: TranslationDict;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobOpen, setMobOpen] = useState(false);
  const [mobLangOpen, setMobLangOpen] = useState(false);
  const mobLangRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const logo = (logoFile as LogoFile)[locale];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobOpen) setMobLangOpen(false);
  }, [mobOpen]);

  useEffect(() => {
    if (!mobLangOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = mobLangRef.current;
      if (el && !el.contains(e.target as Node)) setMobLangOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [mobLangOpen]);

  useEffect(() => {
    if (!mobLangOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobLangOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobLangOpen]);

  const base = `/${locale}`;

  const links = [
    { href: base, label: dict.nav.home, match: "exact" as const },
    { href: `${base}/about`, label: dict.nav.about, match: "prefix" as const },
    {
      href: `${base}/products`,
      label: dict.nav.products,
      match: "prefix" as const,
    },
    { href: `${base}/news`, label: dict.nav.news, match: "prefix" as const },
    {
      href: `${base}/contact`,
      label: dict.nav.contact,
      match: "prefix" as const,
    },
  ];

  const isActive = (href: string, match: "exact" | "prefix") => {
    if (match === "exact") {
      return pathname === href || pathname === `${href}/`;
    }
    if (href === base) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const afterNav = () => {
    setMobOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setLocale = (n: Locale) => {
    afterNav();
    document.cookie = `${LOCALE_COOKIE}=${n}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
    router.replace(swapLocaleSegment(pathname, n));
  };

  const selectDir = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      <nav
        className={clsx("navbar", scrolled && "scrolled")}
        id="navbar"
      >
        <div className="nav-inner">
          <Link href={base} className="nav-logo" onClick={afterNav}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className="h-auto max-h-[var(--navbar-h)] w-auto"
              priority
              decoding="async"
              unoptimized={logo.src.includes("placeholder")}
            />
          </Link>
          <div className="nav-links">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "nav-link",
                  isActive(l.href, l.match) && "active"
                )}
                onClick={afterNav}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex shrink-0 items-center gap-2.5 px-2.5 py-2 sm:px-3 sm:py-2">
              <FontAwesomeIcon
                icon={faGlobe}
                className="shrink-0 text-[14px] text-[var(--brand-light)]"
                aria-hidden
              />
              <Select
                dir={selectDir}
                value={locale}
                onValueChange={(v) => setLocale(v as Locale)}
              >
                <SelectTrigger
                  aria-label="Language"
                  className="h-10 min-h-10 min-w-[10rem] max-w-[14rem] shrink-0 gap-2.5 px-[10px] py-2"
                >
                  <SelectValue className="min-w-0 flex-1 truncate text-start leading-snug" />
                </SelectTrigger>
                <SelectContent sideOffset={6} align="start" className="py-0.5">
                  {localesCycle.map((l) => (
                    <SelectItem key={l} value={l}>
                      {localeLabel(l)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            type="button"
            className={clsx("hamburger", mobOpen && "open")}
            id="ham-btn"
            aria-label="Menu"
            onClick={() => setMobOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className={clsx("mob-menu", mobOpen && "open")} id="mob-menu">
        {links.map((l) => (
          <Link
            key={`m-${l.href}`}
            href={l.href}
            className={clsx(
              "nav-link",
              isActive(l.href, l.match) && "active"
            )}
            onClick={afterNav}
          >
            {l.label}
          </Link>
        ))}
        <div className="mob-lang-row flex items-start gap-3 px-2 py-2.5">
          <FontAwesomeIcon
            icon={faGlobe}
            className="mt-3 shrink-0 text-base text-[var(--brand-light)]"
            aria-hidden
          />
          {/* Custom menu: clear rows + no body scroll lock (unlike Radix Select). */}
          <div ref={mobLangRef} className="relative min-w-0 flex-1">
            <button
              type="button"
              id="mob-lang-trigger"
              aria-expanded={mobLangOpen}
              aria-haspopup="listbox"
              aria-controls="mob-lang-listbox"
              onClick={() => setMobLangOpen((o) => !o)}
              className="flex min-h-12 w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] border border-[rgba(211,182,135,.42)] bg-[rgba(255,255,255,.08)] px-4 py-2.5 text-start shadow-sm transition-[background,border-color] hover:bg-[rgba(255,255,255,.12)] focus:outline-none focus:ring-2 focus:ring-[rgba(165,133,90,.35)]"
              dir={selectDir}
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-[rgba(236,230,220,.5)]">
                  {locale === "ar" ? "اللغة" : locale === "fr" ? "Langue" : "Language"}
                </span>
                <span className="truncate text-base font-semibold text-[var(--text-light)]">
                  {localeLabel(locale)}
                </span>
              </span>
              <ChevronDown
                className={clsx(
                  "h-5 w-5 shrink-0 text-[var(--text-light)] opacity-90 transition-transform",
                  mobLangOpen && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            {mobLangOpen ? (
              <ul
                id="mob-lang-listbox"
                role="listbox"
                aria-labelledby="mob-lang-trigger"
                className="absolute bottom-full left-0 right-0 z-[1200] mb-2 max-h-[min(70vh,22rem)] overflow-y-auto rounded-[var(--radius-md)] border border-[rgba(211,182,135,.45)] bg-[rgba(22,20,18,.98)] py-1.5 shadow-[var(--shadow-lg)] backdrop-blur-md"
                dir={selectDir}
              >
                {localesCycle.map((l) => {
                  const active = locale === l;
                  return (
                    <li key={l} role="presentation" className="px-1.5">
                      <button
                        type="button"
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setMobLangOpen(false);
                          if (l !== locale) setLocale(l);
                        }}
                        className={clsx(
                          "flex w-full min-h-[3.25rem] items-center gap-3 rounded-[10px] px-3 py-2.5 text-start transition-colors",
                          active
                            ? "bg-[rgba(165,133,90,.22)] text-[var(--text-light)]"
                            : "text-[var(--text-light)] hover:bg-[rgba(165,133,90,.12)]",
                        )}
                      >
                        <span
                          className={clsx(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-bold",
                            active
                              ? "border-[var(--brand-light)] bg-[rgba(165,133,90,.25)] text-[var(--brand-light)]"
                              : "border-[rgba(211,182,135,.35)] bg-[rgba(255,255,255,.06)] text-[rgba(236,230,220,.75)]",
                          )}
                          aria-hidden
                        >
                          {l.toUpperCase()}
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-[15px] font-bold leading-snug">
                            {localeLabel(l)}
                          </span>
                          <span className="text-[12px] font-medium leading-snug text-[rgba(236,230,220,.55)]">
                            {localeHint(l)}
                          </span>
                        </span>
                        {active ? (
                          <Check
                            className="h-5 w-5 shrink-0 text-[var(--brand-light)]"
                            aria-hidden
                          />
                        ) : (
                          <span className="w-5 shrink-0" aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
