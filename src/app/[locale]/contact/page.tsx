import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { PageHero } from "@/components/ui/PageHero";
import { AnimateInView } from "@/components/ui/AnimateInView";
import { ContactForm } from "@/components/sections/ContactForm";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import {
  getContactDisplay,
  siteSettings,
  socialUrl,
} from "@/lib/settings";
import { openStreetMapEmbedSrc, SITE_MAP, SITE_WHATSAPP } from "@/lib/site";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: loc } = await params;
  const locale = loc as Locale;
  const dict = getDict(locale);
  const contact = dict.contact as {
    hero: string;
    heroDesc: string;
    form: Record<string, string>;
    info: {
      address: string;
      phone: string;
      email: string;
      hours: string;
    };
    socials: string;
    waBtn: string;
    mapLabel: string;
    mapOpen: string;
  };

  const display = getContactDisplay(locale);
  const { social } = siteSettings;

  return (
    <>
      <PageHero
        crumbs={[
          { label: dict.nav.home, href: `/${locale}` },
          { label: dict.nav.contact },
        ]}
        title={<span className="gold">{contact.hero}</span>}
        description={contact.heroDesc}
      />
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <AnimateInView>
                <div className="c-card">
                  <div className="c-card-icon">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <div>
                    <div className="c-card-label">{contact.info.address}</div>
                    <div className="c-card-value">{display.address}</div>
                  </div>
                </div>
              </AnimateInView>
              <AnimateInView delayClass="d1">
                <div className="c-card">
                  <div className="c-card-icon">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                  <div>
                    <div className="c-card-label">{contact.info.phone}</div>
                    <div
                      className="c-card-value"
                      dangerouslySetInnerHTML={{
                        __html: display.phoneDisplay.split("\n").join("<br/>"),
                      }}
                    />
                  </div>
                </div>
              </AnimateInView>
              <AnimateInView delayClass="d2">
                <div className="c-card">
                  <div className="c-card-icon">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                  <div>
                    <div className="c-card-label">{contact.info.email}</div>
                    <div className="c-card-value">{display.email}</div>
                  </div>
                </div>
              </AnimateInView>
              <AnimateInView delayClass="d3">
                <div className="c-card">
                  <div className="c-card-icon">
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div>
                    <div className="c-card-label">{contact.info.hours}</div>
                    <div className="c-card-value">{display.hours}</div>
                  </div>
                </div>
              </AnimateInView>
              <AnimateInView delayClass="d4">
                <div className="contact-socials">
                  <span>{contact.socials}</span>
                  <a
                    href={socialUrl(social.facebook)}
                    className="soc-link"
                    aria-label="Facebook"
                    {...(social.facebook?.trim()
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <FontAwesomeIcon icon={faFacebookF} />
                  </a>
                  <a
                    href={socialUrl(social.instagram)}
                    className="soc-link"
                    aria-label="Instagram"
                    {...(social.instagram?.trim()
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                  <a
                    href={socialUrl(social.linkedin)}
                    className="soc-link"
                    aria-label="LinkedIn"
                    {...(social.linkedin?.trim()
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <FontAwesomeIcon icon={faLinkedinIn} />
                  </a>
                  <a
                    href={socialUrl(social.twitter)}
                    className="soc-link"
                    aria-label="X"
                    {...(social.twitter?.trim()
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    <FontAwesomeIcon icon={faXTwitter} />
                  </a>
                </div>
              </AnimateInView>
              <AnimateInView delayClass="d5">
                <a
                  href={`https://wa.me/${SITE_WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-wa btn-lg flex w-full justify-center"
                >
                  <FontAwesomeIcon icon={faWhatsapp} /> {contact.waBtn}
                </a>
              </AnimateInView>
            </div>
            <AnimateInView delayClass="d2">
              <ContactForm locale={locale} dict={contact.form} />
            </AnimateInView>
          </div>
        </div>
      </section>
      <section
        className="section"
        style={{ paddingTop: 0, background: "var(--bg-white)" }}
      >
        <div className="container">
          <AnimateInView>
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="sec-title">{contact.mapLabel}</h2>
              <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[var(--text-dark)]">
                {display.address}
              </p>
            </div>
          </AnimateInView>
          <AnimateInView delayClass="d1">
            <div className="map-section">
              <iframe
                src={openStreetMapEmbedSrc()}
                title={`${contact.mapLabel} — ${contact.info.address}`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
              <div className="map-label">
                <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
                <a
                  href={SITE_MAP.shortGoogleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "inherit" }}
                >
                  {contact.mapOpen}
                </a>
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
