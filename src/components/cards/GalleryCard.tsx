"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/ui/LazyImage";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { isRtl, pickTriple } from "@/lib/i18n";
import type { GalleryImage } from "@/lib/types";

export function GalleryCard({
  item,
  locale,
}: {
  item: GalleryImage;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const label = pickTriple(item, locale);
  const labelId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const modal = open && mounted && (
    <div
      className="fixed inset-0 z-[3000] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal
      aria-labelledby={labelId}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      lang={locale}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[rgba(10,8,6,.88)] backdrop-blur-sm"
        aria-label="Close image"
        onClick={close}
      />
      <div
        className="relative z-[1] w-full max-w-5xl rounded-[var(--radius-lg)] border border-[rgba(165,133,90,.35)] bg-[var(--bg-darker)] p-3 shadow-[var(--shadow-lg)] sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between gap-3 pe-0.5">
          <p
            id={labelId}
            className="min-w-0 flex-1 text-sm font-semibold text-[var(--text-light)] sm:text-base"
          >
            {label}
          </p>
          <button
            type="button"
            className="shrink-0 rounded-[var(--radius-sm)] p-2 text-[var(--text-light)] transition-colors hover:bg-[rgba(165,133,90,.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(165,133,90,.5)]"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex min-h-0 w-full max-h-[min(85vh,900px)] items-center justify-center overflow-auto rounded-[var(--radius-sm)] bg-black/40 p-1">
          {/* eslint-disable-next-line @next/next/no-img-element -- lightbox: external URLs, any aspect ratio */}
          <img
            src={item.img}
            alt={label}
            className="h-auto max-h-[min(85vh,900px)] w-full max-w-full object-contain"
            decoding="async"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="gallery-card"
        dir={isRtl(locale) ? "rtl" : "ltr"}
        lang={locale}
      >
        <button
          type="button"
          className="relative block h-full w-full min-h-0 border-0 bg-transparent p-0 text-start"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label={locale === "ar" ? `عرض: ${label}` : `View: ${label}`}
        >
          <LazyImage
            src={item.img}
            alt={label}
            width={600}
            height={400}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 75vw, (max-width: 1200px) 320px, 600px"
            unoptimized
          />
          <div className="gallery-card-overlay">
            <div className="gallery-card-title">{label}</div>
          </div>
        </button>
      </div>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
