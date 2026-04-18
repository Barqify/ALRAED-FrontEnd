"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useEffect, useState } from "react";
import logoFile from "@/data/logo.json";
import type { Locale } from "@/lib/i18n";
import { swapLocaleSegment } from "@/lib/routing";
import type { LogoFile, TranslationDict } from "@/lib/types";

const localesCycle: Locale[] = ["ar", "en", "fr"];

function nextLocale(current: Locale): Locale {
  const i = localesCycle.indexOf(current);
  return localesCycle[(i + 1) % localesCycle.length];
}

function langButtonLabel(locale: Locale): string {
  if (locale === "ar") return "English";
  if (locale === "en") return "Français";
  return "العربية";
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

  const toggleLang = (e: MouseEvent) => {
    e.preventDefault();
    const n = nextLocale(locale);
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
            <button
              type="button"
              className="lang-btn"
              onClick={toggleLang}
            >
              <FontAwesomeIcon icon={faGlobe} />{" "}
              <span className="btn-text">{langButtonLabel(locale)}</span>
            </button>
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
        <button type="button" className="lang-btn" onClick={toggleLang}>
          <FontAwesomeIcon icon={faGlobe} />{" "}
          <span className="btn-text">{langButtonLabel(locale)}</span>
        </button>
      </div>
    </>
  );
}
