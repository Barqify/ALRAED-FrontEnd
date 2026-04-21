import Link from "next/link";
import clsx from "clsx";
import { ProductCard } from "@/components/cards/ProductCard";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import type { Category, Product } from "@/lib/types";

/** Server component: category filter uses `?cat=id` so no client bundle / RSC boundary issues */
export function ProductsFilterGrid({
  locale,
  dict,
  categories,
  products,
  activeCat,
}: {
  locale: Locale;
  dict: TranslationDict;
  categories: Category[];
  products: Product[];
  activeCat: string;
}) {
  const filtered =
    activeCat === "all"
      ? products
      : products.filter((p) => p.cat === activeCat);

  const base = `/${locale}/products`;

  return (
    <>
      <div className="filter-bar">
        <div className="container">
          <div className="filter-list" id="filter-list">
            <Link
              href={base}
              scroll={false}
              className={clsx("filter-btn", activeCat === "all" && "active")}
              data-cat="all"
            >
              {dict.products.all}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`${base}?cat=${encodeURIComponent(c.id)}`}
                scroll={false}
                className={clsx(
                  "filter-btn",
                  activeCat === c.id && "active",
                )}
                data-cat={c.id}
              >
                {pickTriple(c, locale)}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <section className="section" style={{ paddingTop: 36 }}>
        <div className="container">
          <div className="prods-grid" id="prods-grid">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                dict={dict}
                categories={categories}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
