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
import { getContactDisplay, siteSettings, socialUrl } from "@/lib/settings";
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
  const display = getContactDisplay(locale);
  const phoneLines = display.phoneDisplay.split("\n");
  const { social } = siteSettings;

  const socialBtn = (
    url: string,
    icon: typeof faFacebookF,
    label: string,
  ) => (
    <a
      href={socialUrl(url)}
      className="footer-soc"
      aria-label={label}
      {...(url.trim() ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <FontAwesomeIcon icon={icon} />
    </a>
  );

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
              {socialBtn(social.facebook, faFacebookF, "Facebook")}
              {socialBtn(social.instagram, faInstagram, "Instagram")}
              {socialBtn(social.linkedin, faLinkedinIn, "LinkedIn")}
              {socialBtn(social.twitter, faXTwitter, "X")}
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
              <span>{display.address}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span>{phoneLines[0]}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>{display.email}</span>
            </div>
            <div className="footer-contact-item">
              <FontAwesomeIcon icon={faClock} />
              <span>{display.hours}</span>
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
