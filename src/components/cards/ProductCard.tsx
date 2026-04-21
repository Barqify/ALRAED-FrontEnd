import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import {
  categoryById,
  productDesc,
  productLabel,
} from "@/lib/content";
import type { Category, Product } from "@/lib/types";
import { getFaIcon } from "@/lib/icons";

import { SITE_WHATSAPP as WA } from "@/lib/site";

export function ProductCard({
  product,
  locale,
  dict,
  categories,
}: {
  product: Product;
  locale: Locale;
  dict: TranslationDict;
  categories: Category[];
}) {
  const cat = categoryById(categories, product.cat);
  const name = productLabel(product, locale);
  const desc = productDesc(product, locale);
  const cn = cat ? pickTriple({ ar: cat.ar, en: cat.en, fr: cat.fr }, locale) : "";
  const wt = encodeURIComponent(
    `${locale === "ar" ? "استفسار عن: " : "Inquiry: "}${name}`
  );

  return (
    <div className="prod-card">
      <div
        className="prod-img"
        style={
          cat
            ? {
                background: `linear-gradient(135deg, ${cat.color}22, ${cat.bg})`,
              }
            : undefined
        }
      >
        <Image
          src={product.img}
          alt={name}
          width={400}
          height={300}
          className="h-full w-full object-cover"
          unoptimized
        />
        {cat ? (
          <FontAwesomeIcon
            icon={getFaIcon(cat.icon)}
            className="prod-icon-fb"
          />
        ) : null}
        {cat ? (
          <span className="prod-badge-cat">{cn}</span>
        ) : null}
        <span className="prod-badge-eg">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-[9px]" />{" "}
          {dict.egypt}
        </span>
      </div>
      <div className="prod-body">
        <h3 className="prod-name">{name}</h3>
        <p className="prod-desc">{desc}</p>
        <div className="prod-footer">
          <span className="prod-packaging">{dict.packaging}</span>
          <a
            href={`https://wa.me/${WA}?text=${wt}`}
            target="_blank"
            rel="noopener noreferrer"
            className="prod-inquiry"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="text-[11px]" />{" "}
            {dict.featured.inquiry}
          </a>
        </div>
      </div>
    </div>
  );
}
