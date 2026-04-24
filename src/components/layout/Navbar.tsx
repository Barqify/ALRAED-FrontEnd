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
        <div className="mob-lang-row flex items-center gap-3 px-2 py-2.5">
          <FontAwesomeIcon
            icon={faGlobe}
            className="shrink-0 text-[15px] text-[var(--brand-light)]"
            aria-hidden
          />
          <Select
            dir={selectDir}
            value={locale}
            onValueChange={(v) => setLocale(v as Locale)}
          >
            <SelectTrigger
              aria-label="Language"
              className="h-12 min-h-12 min-w-0 flex-1 gap-3 border-[rgba(211,182,135,.42)] bg-[rgba(255,255,255,.08)] px-4 py-2.5 text-start text-[15px] text-[var(--text-light)] shadow-sm hover:bg-[rgba(255,255,255,.12)]"
            >
              <SelectValue className="min-w-0 flex-1 truncate text-start leading-snug" />
            </SelectTrigger>
            <SelectContent
              sideOffset={10}
              align="center"
              className="border-[rgba(211,182,135,.35)] py-1"
            >
              {localesCycle.map((l) => (
                <SelectItem key={l} value={l} className="min-h-11 py-3 text-[15px]">
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
