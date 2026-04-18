import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faNewspaper,
  faStar,
  faThLarge,
  faTrophy,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { GalleryCard } from "@/components/cards/GalleryCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { AutoScrollGalleryStrip } from "@/components/ui/AutoScrollGalleryStrip";
import { Carousel } from "@/components/ui/Carousel";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimateInView } from "@/components/ui/AnimateInView";
import { HomeHero } from "@/components/sections/HomeHero";
import categories from "@/data/categories.json";
import gallery from "@/data/gallery.json";
import news from "@/data/news.json";
import products from "@/data/products.json";
import videos from "@/data/videos.json";
import { getDict, isRtl, t } from "@/lib/i18n";
import { getFaIcon } from "@/lib/icons";
import type { Locale } from "@/lib/i18n";
import type { Category, GalleryImage, NewsItem, Product, VideoItem } from "@/lib/types";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  const locale = loc as Locale;
  const dict = getDict(locale);
  const rtl = isRtl(locale);

  const featured = (products as Product[]).slice(0, 8);
  const whyIcons = ["fa-award", "fa-certificate", "fa-handshake", "fa-cogs"] as const;
  const whyKeys = ["w1", "w2", "w3", "w4"] as const;

  return (
    <>
      <HomeHero locale={locale} dict={dict} />

      <AutoScrollGalleryStrip intervalMs={3500}>
        {(gallery as GalleryImage[]).map((item) => (
          <GalleryCard key={item.id} item={item} locale={locale} />
        ))}
      </AutoScrollGalleryStrip>

      <section className="video-gallery-section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faVideo} />}
            title={t(dict, "about.videos.title")}
            description={t(dict, "about.videos.desc")}
          />
          <Carousel
            key={`video-${locale}`}
            trackId="video-track"
            intervalMs={4500}
            rtl={rtl}
            variant="video"
          >
            {(videos as VideoItem[]).map((v) => (
              <VideoCard key={v.id} video={v} locale={locale} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faThLarge} />}
            title={dict.cats.title}
            description={dict.cats.desc}
          />
          <div className="cats-grid cats-grid-desktop hidden md:grid">
            {(categories as Category[]).map((c) => (
              <CategoryCard key={c.id} category={c} locale={locale} />
            ))}
          </div>
          <div className="md:hidden">
            <Carousel
              key={`cats-${locale}`}
              trackId="cats-track"
              intervalMs={3000}
              rtl={rtl}
              variant="cats"
            >
              {(categories as Category[]).map((c) => (
                <CategoryCard key={c.id} category={c} locale={locale} />
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faStar} />}
            title={dict.featured.title}
            description={dict.featured.desc}
          />
          <div className="prods-grid prods-grid-desktop hidden md:grid">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                locale={locale}
                dict={dict}
                categories={categories as Category[]}
              />
            ))}
          </div>
          <div className="md:hidden">
            <Carousel
              key={`prods-${locale}`}
              trackId="prods-track"
              intervalMs={3500}
              rtl={rtl}
              variant="prods"
            >
              {featured.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={locale}
                  dict={dict}
                  categories={categories as Category[]}
                />
              ))}
            </Carousel>
          </div>
          <div className="view-all-wrap anim">
            <Link
              href={`/${locale}/products`}
              className="btn btn-outline"
            >
              {dict.featured.viewAll}{" "}
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="rtl:rotate-0 [dir=ltr]:rotate-180"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faNewspaper} />}
            title={dict.news.homeTitle}
            description={dict.news.homeDesc}
          />
          <div className="news-grid news-grid-desktop hidden md:grid">
            {(news as NewsItem[]).map((n) => (
              <NewsCard key={n.id} news={n} locale={locale} dict={dict} />
            ))}
          </div>
          <div className="md:hidden">
            <Carousel
              key={`news-${locale}`}
              trackId="news-track"
              intervalMs={4000}
              rtl={rtl}
              variant="news"
            >
              {(news as NewsItem[]).map((n) => (
                <NewsCard key={n.id} news={n} locale={locale} dict={dict} />
              ))}
            </Carousel>
          </div>
          <div className="view-all-wrap anim">
            <Link href={`/${locale}/news`} className="btn btn-outline">
              {dict.news.viewAll}{" "}
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="rtl:rotate-0 [dir=ltr]:rotate-180"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faTrophy} />}
            title={dict.why.title as string}
            description={dict.why.desc as string}
          />
          <div className="why-grid">
            {whyKeys.map((key, i) => (
              <AnimateInView key={key} delayClass={`d${i + 1}` as "d1" | "d2" | "d3" | "d4"}>
                <div className="why-card">
                  <div className="why-icon">
                    <FontAwesomeIcon icon={getFaIcon(whyIcons[i])} />
                  </div>
                  <h3 className="why-title">
                    {t(dict, `why.${key}.title`)}
                  </h3>
                  <p className="why-desc">{t(dict, `why.${key}.desc`)}</p>
                </div>
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
