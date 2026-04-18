import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faDiamond,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import type { Locale } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import { HeroScrollButton } from "./HeroScrollButton";
import { HeroStats } from "./HeroStats";

export function HomeHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: TranslationDict;
}) {
  const base = `/${locale}`;
  const stats = [
    { target: 30, label: dict.stats.clients },
    { target: 25, label: dict.stats.products },
    { target: 6, label: dict.stats.years },
    { target: 15, label: dict.stats.countries },
  ];

  return (
    <section className="hero">
      <div className="hero-video-wrap">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="https://picsum.photos/seed/almasa-hero/1920/1080.jpg"
          style={{ opacity: 0.3 }}
        >
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
        </video>
      </div>
      <div className="hero-video-overlay" />
      <div className="hero-pattern" />
      <div className="hero-content">
        <div className="hero-badge">
          <FontAwesomeIcon icon={faDiamond} style={{ fontSize: 10 }} />{" "}
          {dict.hero.badge}
        </div>
        <h1 className="hero-title">
          <span className="gold">{dict.hero.title1}</span>
        </h1>
        <p className="hero-tagline">{dict.hero.tagline}</p>
        <p className="hero-sub">{dict.hero.sub}</p>
        <div className="hero-actions">
          <Link href={`${base}/products`} className="btn btn-brand btn-lg">
            <FontAwesomeIcon icon={faBoxOpen} /> {dict.hero.cta1}
          </Link>
          <Link href={`${base}/contact`} className="btn btn-outline btn-lg">
            <FontAwesomeIcon icon={faEnvelope} /> {dict.hero.cta2}
          </Link>
        </div>
        <HeroStats stats={stats} />
      </div>
      <HeroScrollButton label={dict.hero.scroll} />
    </section>
  );
}
