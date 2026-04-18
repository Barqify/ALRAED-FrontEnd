import { NewsCard } from "@/components/cards/NewsCard";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import { AnimateInView } from "@/components/ui/AnimateInView";
import news from "@/data/news.json";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { NewsItem } from "@/lib/types";

export default async function NewsPage({
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
          { label: dict.nav.news },
        ]}
        title={<span className="gold">{dict.news.title}</span>}
        description={dict.news.desc}
      />
      <section className="section">
        <div className="container">
          <div className="news-grid">
            {(news as NewsItem[]).map((n, i) => (
              <AnimateInView
                key={n.id}
                delayClass={`d${(i % 3) + 1}` as "d1" | "d2" | "d3"}
              >
                <NewsCard news={n} locale={locale} dict={dict} />
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner
        locale={locale}
        title={dict.cta.title}
        description={dict.cta.desc}
        btnLabel={dict.cta.btn}
      />
    </>
  );
}
