"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { TranslationDict } from "@/lib/types";
import type { Category, Product } from "@/lib/types";
import { ProductCard } from "@/components/cards/ProductCard";

export function ProductsFilterGrid({
  locale,
  dict,
  categories,
  products,
}: {
  locale: Locale;
  dict: TranslationDict;
  categories: Category[];
  products: Product[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return products;
    return products.filter((p) => p.cat === filter);
  }, [filter, products]);

  return (
    <>
      <div className="filter-bar">
        <div className="container">
          <div className="filter-list" id="filter-list">
            <button
              type="button"
              className={clsx("filter-btn", filter === "all" && "active")}
              data-cat="all"
              onClick={() => setFilter("all")}
            >
              {dict.products.all}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={clsx(
                  "filter-btn",
                  filter === c.id && "active"
                )}
                data-cat={c.id}
                onClick={() => setFilter(c.id)}
              >
                {pickTriple(c, locale)}
              </button>
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
