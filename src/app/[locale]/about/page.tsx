import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullseye,
  faCertificate,
  faGem,
  faHeart,
  faImages,
  faUserTie,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { GalleryCard } from "@/components/cards/GalleryCard";
import { VideoCard } from "@/components/cards/VideoCard";
import { TeamCard } from "@/components/cards/TeamCard";
import { CertBadge } from "@/components/cards/CertBadge";
import { Carousel } from "@/components/ui/Carousel";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { AnimateInView } from "@/components/ui/AnimateInView";
import gallery from "@/data/gallery.json";
import team from "@/data/team.json";
import certs from "@/data/certs.json";
import videos from "@/data/videos.json";
import { getDict, isRtl, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { getFaIcon } from "@/lib/icons";
import type {
  CertItem,
  GalleryImage,
  TeamMember,
  VideoItem,
} from "@/lib/types";

type Milestone = {
  y: string;
  ar: string;
  en: string;
  fr: string;
};

function milestoneText(m: Milestone, locale: Locale): string {
  return locale === "ar" ? m.ar : locale === "fr" ? m.fr : m.en;
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  const locale = loc as Locale;
  const dict = getDict(locale);
  const rtl = isRtl(locale);

  const about = dict.about as {
    hero: string;
    heroDesc: string;
    story: {
      title: string;
      text1: string;
      text2: string;
      text3: string;
    };
    milestones: { items: Milestone[] };
    gallery: { title: string; desc: string };
    mvp: { title: string };
    values: { title: string };
    team: { title: string; desc: string };
    certs: { title: string; desc: string };
  };
  const milestones = about.milestones.items;

  const mvpIcons = ["fa-rocket", "fa-eye", "fa-handshake"] as const;
  const mvpKeys = ["mission", "vision", "promise"] as const;
  const mvpColors = ["#3d7a4a", "#9b7a4d", "#7b4a8a"] as const;
  const mvpBgs = ["#e8f5e9", "#faf3e8", "#f3e5f5"] as const;

  const valIcons = ["fa-award", "fa-certificate", "fa-handshake", "fa-cogs"] as const;
  const valKeys = ["v1", "v2", "v3", "v4"] as const;

  return (
    <>
      <PageHero
        crumbs={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.about },
        ]}
        title={<span className="gold">{about.hero}</span>}
        description={about.heroDesc}
      />

      <section className="diamond-stories-section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faGem} />}
            title={about.story.title}
          />
          <div className="diamond-stories-grid">
            <AnimateInView>
              <div className="diamond-story-content">
                <p className="story-text">{about.story.text1}</p>
                <p className="story-text">{about.story.text2}</p>
                <p className="story-text">{about.story.text3}</p>
              </div>
            </AnimateInView>
            <div className="story-cards">
              {milestones.map((m, i) => (
                <AnimateInView
                  key={m.y}
                  delayClass={`d${(i % 4) + 1}` as "d1" | "d2" | "d3" | "d4"}
                >
                  <div className="story-card">
                    <div className="story-card-date">
                      <span className="story-card-year">{m.y}</span>
                    </div>
                    <div>
                      <h4 className="story-card-title">
                        {milestoneText(m, locale)}
                      </h4>
                    </div>
                  </div>
                </AnimateInView>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faImages} />}
            title={about.gallery.title}
            description={about.gallery.desc}
          />
          <Carousel
            key={`about-g-${locale}`}
            trackId="about-gallery-track"
            intervalMs={3500}
            rtl={rtl}
            variant="gallery"
          >
            {(gallery as GalleryImage[]).map((item) => (
              <GalleryCard key={item.id} item={item} locale={locale} />
            ))}
          </Carousel>
        </div>
      </section>

      <section className="video-gallery-section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faVideo} />}
            title={t(dict, "about.videos.title")}
            description={t(dict, "about.videos.desc")}
          />
          <Carousel
            key={`about-v-${locale}`}
            trackId="about-video-track"
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
            icon={<FontAwesomeIcon icon={faBullseye} />}
            title={about.mvp.title}
          />
          <div className="mvp-grid">
            {mvpKeys.map((key, i) => (
              <AnimateInView key={key} delayClass={`d${i + 1}` as "d1" | "d2" | "d3"}>
                <div className="mvp-card">
                  <div
                    className="mvp-icon"
                    style={{
                      background: mvpBgs[i],
                      color: mvpColors[i],
                    }}
                  >
                    <FontAwesomeIcon icon={getFaIcon(mvpIcons[i])} />
                  </div>
                  <h3 className="mvp-title">
                    {t(dict, `about.mvp.${key}.title`)}
                  </h3>
                  <p className="mvp-desc">
                    {t(dict, `about.mvp.${key}.desc`)}
                  </p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faHeart} />}
            title={about.values.title}
          />
          <div className="vals-grid">
            {valKeys.map((key, i) => (
              <AnimateInView
                key={key}
                delayClass={`d${(i % 2) + 1}` as "d1" | "d2"}
              >
                <div className="val-card">
                  <div className="val-icon">
                    <FontAwesomeIcon icon={getFaIcon(valIcons[i])} />
                  </div>
                  <div>
                    <h4 className="val-title">
                      {t(dict, `about.values.${key}.title`)}
                    </h4>
                    <p className="val-desc">
                      {t(dict, `about.values.${key}.desc`)}
                    </p>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-white)" }}>
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faUserTie} />}
            title={about.team.title}
            description={about.team.desc}
          />
          <div className="team-grid">
            {(team as TeamMember[]).map((m, i) => (
              <AnimateInView key={m.en} delayClass={`d${(i % 5) + 1}` as "d1" | "d2" | "d3" | "d4" | "d5"}>
                <TeamCard member={m} locale={locale} />
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            icon={<FontAwesomeIcon icon={faCertificate} />}
            title={about.certs.title}
            description={about.certs.desc}
          />
          <div className="certs-grid">
            {(certs as CertItem[]).map((c, i) => (
              <AnimateInView
                key={c.n}
                delayClass={`d${(i % 5) + 1}` as "d1" | "d2" | "d3" | "d4" | "d5"}
              >
                <CertBadge cert={c} />
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
