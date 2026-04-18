import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ProductCard } from "@/components/cards/ProductCard";
import { PageHero } from "@/components/ui/PageHero";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import { categoryById } from "@/lib/content";
import { getDict } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getFaIcon } from "@/lib/icons";
import type { Category, Product } from "@/lib/types";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return (categories as Category[]).map((c) => ({ cat: c.id }));
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ locale: string; cat: string }>;
}) {
  const { locale: loc, cat: catId } = await params;
  const locale = loc as Locale;
  const dict = getDict(locale);
  const c = categoryById(categories as Category[], catId);
  if (!c) notFound();

  const prods = (products as Product[]).filter((p) => p.cat === catId);

  return (
    <>
      <PageHero
        crumbs={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.products, href: `/${locale}/products` },
          { label: pickTriple(c, locale) },
        ]}
        title={
          <>
            <span style={{ color: c.color }} className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={getFaIcon(c.icon)} />
            </span>{" "}
            <span className="gold">{pickTriple(c, locale)}</span>
          </>
        }
        description={`${prods.length} ${dict.cats.count}`}
      />
      <section
        style={{
          padding: "20px 0",
          background: "var(--bg-white)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container">
          <div className="cat-quick-links">
            {(categories as Category[]).map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/products/${cat.id}`}
                className={`cat-quick-link${cat.id === catId ? " active" : ""}`}
              >
                <FontAwesomeIcon
                  icon={getFaIcon(cat.icon)}
                  style={{ marginInlineEnd: 5, color: cat.color }}
                />
                {pickTriple(cat, locale)}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="prods-grid">
            {prods.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                dict={dict}
                categories={categories as Category[]}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
