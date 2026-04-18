import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

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
  return (
    <section className="cta-banner">
      <div className="container cta-content">
        <h2 className="cta-title">{title}</h2>
        <p className="cta-desc">{description}</p>
        <Link href={`/${locale}/contact`} className="btn btn-white btn-lg">
          {btnLabel}{" "}
          <FontAwesomeIcon
            icon={faArrowLeft}
            className={clsx("[dir=ltr]:rotate-180")}
          />
        </Link>
      </div>
    </section>
  );
}
