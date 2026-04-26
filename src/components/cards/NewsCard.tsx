import { LazyImage } from "@/components/ui/LazyImage";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCalendarDays,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Locale } from "@/lib/i18n";
import { isRtl, pickTriple } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import type { NewsItem } from "@/lib/types";

import { SITE_WHATSAPP as WA } from "@/lib/site";

export function NewsCard({
  news,
  locale,
  dict,
  showReadMore = true,
}: {
  news: NewsItem;
  locale: Locale;
  dict: TranslationDict;
  /** On the full news page, hide — user is already on the listing. */
  showReadMore?: boolean;
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
  // Use absolute image URLs as-is; only use Picsum when `img` is a short seed/id.
  const imgUrl = /^https?:\/\//i.test(news.img)
    ? news.img
    : `https://picsum.photos/seed/${encodeURIComponent(news.img)}/600/400.jpg`;

  const readMoreIcon = isRtl(locale) ? faArrowLeft : faArrowRight;
  const listingHref = `/${locale}/news#news-${news.id}`;

  return (
    <div
      id={`news-${news.id}`}
      className="news-card"
      dir={isRtl(locale) ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className="news-img">
        <LazyImage
          src={imgUrl}
          alt={ti}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 85vw, (max-width: 1200px) 33vw, 400px"
        />
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
          {showReadMore ? (
            <Link href={listingHref} className="news-link">
              {dict.news.readMore}{" "}
              <FontAwesomeIcon icon={readMoreIcon} className="text-[11px]" />
            </Link>
          ) : null}
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
