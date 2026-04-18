import { ProductsFilterGrid } from "@/components/sections/ProductsFilterGrid";
import { PageHero } from "@/components/ui/PageHero";
import categories from "@/data/categories.json";
import products from "@/data/products.json";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Category, Product } from "@/lib/types";

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  const locale = loc as Locale;
  const dict = getDict(locale);

  return (
    <>
      <PageHero
        crumbs={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.products },
        ]}
        title={<span className="gold">{dict.products.hero}</span>}
        description={dict.products.heroDesc}
      />
      <ProductsFilterGrid
        locale={locale}
        dict={dict}
        categories={categories as Category[]}
        products={products as Product[]}
      />
    </>
  );
}
