import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import type { NewsItem } from "@/lib/types";

import { SITE_WHATSAPP as WA } from "@/lib/site";

export function NewsCard({
  news,
  locale,
  dict,
}: {
  news: NewsItem;
  locale: Locale;
  dict: TranslationDict;
}) {
  const dv = pickTriple(news.date, locale);
  const lv = pickTriple(news.location, locale);
  const ti = pickTriple(news, locale);
  const de = pickTriple(
    { ar: news.arD, en: news.enD, fr: news.frD },
    locale
  );
  const wt = encodeURIComponent(
    `${locale === "ar" ? "استفسار عن: " : "Inquiry: "}${ti}`
  );
  const imgUrl = `https://picsum.photos/seed/${news.img}/600/400.jpg`;

  return (
    <div className="news-card">
      <div
        className="news-img"
        style={{
          backgroundImage: `url(${imgUrl})`,
        }}
      >
        <span className="news-date-badge">
          <FontAwesomeIcon
            icon={faCalendarDays}
            className="text-[11px]"
            style={{ color: "var(--brand)" }}
          />{" "}
          {dv}
        </span>
        <span className="news-loc-badge">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[10px]" /> {lv}
        </span>
      </div>
      <div className="news-body">
        <h3 className="news-title">{ti}</h3>
        <p className="news-desc">{de}</p>
        <div className="news-footer">
          <Link
            href={`/${locale}/news`}
            className="news-link"
          >
            {dict.news.readMore}{" "}
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="text-[11px] rtl:rotate-180"
            />
          </Link>
          <a
            href={`https://wa.me/${WA}?text=${wt}`}
            target="_blank"
            rel="noopener noreferrer"
            className="news-inquiry"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-[11px]" />{" "}
            {dict.news.inquiry}
          </a>
        </div>
      </div>
    </div>
  );
}
