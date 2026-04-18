import Link from "next/link";
import type { ReactNode } from "react";

export type BreadcrumbCrumb = { label: string; href?: string };

export function PageHero({
  crumbs,
  title,
  description,
}: {
  crumbs: BreadcrumbCrumb[];
  title: ReactNode;
  description: string;
}) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg" />
      <div className="page-hero-pattern" />
      <div className="page-hero-content">
        <div className="breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`}>
              {i > 0 ? <span className="sep">/</span> : null}
              {c.href ? (
                <Link href={c.href}>{c.label}</Link>
              ) : (
                <span>{c.label}</span>
              )}
            </span>
          ))}
        </div>
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-desc">{description}</p>
      </div>
    </section>
  );
}
