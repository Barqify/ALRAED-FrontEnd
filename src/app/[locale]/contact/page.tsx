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
import { ContactForm } from "@/components/sections/ContactForm";
import { getDict } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

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
    info: Record<string, string>;
    socials: string;
    waBtn: string;
    mapLabel: string;
    mapOpen: string;
  };

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
              <div className="c-card anim">
                <div className="c-card-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <div className="c-card-label">{contact.info.address}</div>
                  <div className="c-card-value">{contact.info.addressVal}</div>
                </div>
              </div>
              <div className="c-card anim d1">
                <div className="c-card-icon">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <div className="c-card-label">{contact.info.phone}</div>
                  <div
                    className="c-card-value"
                    dangerouslySetInnerHTML={{
                      __html: contact.info.phoneVal.split("\n").join("<br/>"),
                    }}
                  />
                </div>
              </div>
              <div className="c-card anim d2">
                <div className="c-card-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <div className="c-card-label">{contact.info.email}</div>
                  <div className="c-card-value">{contact.info.emailVal}</div>
                </div>
              </div>
              <div className="c-card anim d3">
                <div className="c-card-icon">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <div className="c-card-label">{contact.info.hours}</div>
                  <div className="c-card-value">{contact.info.hoursVal}</div>
                </div>
              </div>
              <div className="contact-socials anim d4">
                <span>{contact.socials}</span>
                <a href="#" className="soc-link" aria-label="Facebook">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="#" className="soc-link" aria-label="Instagram">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="#" className="soc-link" aria-label="LinkedIn">
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </a>
                <a href="#" className="soc-link" aria-label="X">
                  <FontAwesomeIcon icon={faXTwitter} />
                </a>
              </div>
              <a
                href="https://wa.me/201098765432"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-wa btn-lg anim d5 flex w-full justify-center"
              >
                <FontAwesomeIcon icon={faWhatsapp} /> {contact.waBtn}
              </a>
            </div>
            <ContactForm locale={locale} dict={contact.form} />
          </div>
        </div>
      </section>
      <section
        className="section"
        style={{ paddingTop: 0, background: "var(--bg-white)" }}
      >
        <div className="container">
          <div className="map-section anim">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3456.789012345678!2d30.290583!3d30.885778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDUzJzA4LjgiTiAzMMKwMTcnMjYuMSJF!5e0!3m2!1sen!2seg!4v1234567890123!5m2!1sen!2seg"
              title="Map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full border-0"
            />
            <div className="map-label">
              <FontAwesomeIcon icon={faMapMarkerAlt} />{" "}
              <a
                href="https://maps.app.goo.gl/os2NaPWt4A4FEs8Y6"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "inherit" }}
              >
                {contact.mapLabel} — {contact.mapOpen}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
