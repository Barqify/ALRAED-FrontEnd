import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { isRtl } from "@/lib/i18n";

export function CtaBanner({
  locale,
  title,
  description,
  btnLabel,
}: {
  locale: string;
  title: string;
  description: string;
  btnLabel: string;
}) {
  const rtl = isRtl(locale === "ar" ? "ar" : locale === "fr" ? "fr" : "en");
  return (
    <section className="cta-banner">
      <div className="container cta-content">
        <h2 className="cta-title">{title}</h2>
        <p className="cta-desc">{description}</p>
        <Link href={`/${locale}/contact`} className="btn btn-white btn-lg">
          {btnLabel}{" "}
          <FontAwesomeIcon
            icon={rtl ? faArrowLeft : faArrowRight}
          />
        </Link>
      </div>
    </section>
  );
}
