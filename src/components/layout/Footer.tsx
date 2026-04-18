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
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import Link from "next/link";
import logoFile from "@/data/logo.json";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { Category, LogoFile, TranslationDict } from "@/lib/types";

export function Footer({
  locale,
  dict,
  categories,
}: {
  locale: Locale;
  dict: TranslationDict;
  categories: Category[];
}) {
  const logo = (logoFile as LogoFile)[locale];
  const base = `/${locale}`;
  const contact = dict.contact as Record<string, unknown>;
  const info = contact.info as Record<string, string>;

  const phoneLines = info.phoneVal.split("\n");

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href={base} className="nav-logo mb-3.5 inline-block">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-auto max-h-[var(--navbar-h)] w-auto"
                unoptimized={logo.src.includes("placeholder")}
              />
            </Link>
            <p className="footer-brand-desc">{dict.footer.desc}</p>
            <div className="footer-socials">
              <a href="#" className="footer-soc" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="#" className="footer-soc" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="#" className="footer-soc" aria-label="LinkedIn">
                <FontAwesomeIcon icon={faLinkedinIn} />
              </a>
              <a href="#" className="footer-soc" aria-label="X">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">{dict.footer.quick}</h4>
            <div className="footer-links">
              <Link href={base} className="footer-link">
                {dict.nav.home}
              </Link>
              <Link href={`${base}/about`} className="footer-link">
                {dict.nav.about}
              </Link>
              <Link href={`${base}/products`} className="footer-link">
                {dict.nav.products}
              </Link>
              <Link href={`${base}/news`} className="footer-link">
                {dict.nav.news}
              </Link>
              <Link href={`${base}/contact`} className="footer-link">
                {dict.nav.contact}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="footer-heading">{dict.footer.prodLinks}</h4>
            <div className="footer-links">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`${base}/products/${c.id}`}
                  className="footer-link"
                >
                  {pickTriple(c, locale)}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-heading">{dict.footer.contactUs}</h4>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              <span>{info.addressVal}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>{phoneLines[0]}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{info.emailVal}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faClock} />
              <span>{info.hoursVal}</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{dict.footer.copy}</span>
          <span>{dict.footer.made}</span>
        </div>
      </div>
    </footer>
  );
}
