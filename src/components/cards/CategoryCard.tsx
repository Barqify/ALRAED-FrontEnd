import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import { getFaIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";

export function CategoryCard({
  category,
  locale,
}: {
  category: Category;
  locale: Locale;
}) {
  const label = pickTriple(category, locale);
  const desc = pickTriple(
    {
      ar: category.arDesc,
      en: category.enDesc,
      fr: category.frDesc,
    },
    locale
  );

  return (
    <Link
      href={`/${locale}/products/${category.id}`}
      className="cat-card block"
      style={{ scrollSnapAlign: "center" }}
    >
      <div
        className="cat-icon"
        style={{ background: category.bg, color: category.color }}
      >
        <FontAwesomeIcon icon={getFaIcon(category.icon)} />
      </div>
      <h3 className="cat-name">{label}</h3>
      <p className="cat-desc">{desc}</p>
    </Link>
  );
}
