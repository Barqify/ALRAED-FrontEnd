"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  const logo = (logoFile as LogoFile)[locale];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const setLocale = (n: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${n}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
    router.replace(swapLocaleSegment(pathname, n));
  };

  const afterNav = () => {
    setMobOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faGlobe} className="text-[13px] text-[var(--brand-light)]" />
              <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
                <SelectTrigger aria-label="Language" className="h-[34px] min-w-[112px] px-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
        <div className="mob-lang-row flex items-center gap-3">
          <FontAwesomeIcon
            icon={faGlobe}
            className="shrink-0 text-[14px] text-[var(--brand-light)]"
            aria-hidden
          />
          <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
            <SelectTrigger
              aria-label="Language"
              className="h-11 min-h-[44px] min-w-0 flex-1 border-[rgba(211,182,135,.42)] bg-[rgba(255,255,255,.07)] px-4 text-start text-[15px] text-[var(--text-light)] shadow-sm hover:bg-[rgba(255,255,255,.11)]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {localesCycle.map((l) => (
                <SelectItem key={l} value={l}>
                  {localeLabel(l)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
