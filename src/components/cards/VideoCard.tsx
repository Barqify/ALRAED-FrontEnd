"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { LazyImage } from "@/components/ui/LazyImage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { X } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { isRtl, pickTriple } from "@/lib/i18n";
import type { VideoItem } from "@/lib/types";

function embedUrlWithAutoplay(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("autoplay", "1");
    u.searchParams.set("rel", "0");
    if (!u.searchParams.has("mute")) u.searchParams.set("mute", "0");
    return u.toString();
  } catch {
    return url;
  }
}

export function VideoCard({
  video,
  locale,
}: {
  video: VideoItem;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const title = pickTriple(video.title, locale);
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
        aria-label="Close video"
        onClick={close}
      />
      <div
        className="relative z-[1] w-full max-w-5xl rounded-[var(--radius-lg)] border border-[rgba(165,133,90,.35)] bg-[var(--bg-darker)] p-3 shadow-[var(--shadow-lg)] sm:p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between gap-3 pe-0.5">
          <p id={labelId} className="min-w-0 flex-1 text-sm font-semibold text-[var(--text-light)] sm:text-base">
            {title}
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
        <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-sm)] bg-black">
          <iframe
            className="absolute inset-0 h-full w-full border-0"
            src={embedUrlWithAutoplay(video.url)}
            title={title}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        className="video-card"
        dir={isRtl(locale) ? "rtl" : "ltr"}
        lang={locale}
      >
        <button
          type="button"
          className="video-placeholder block w-full cursor-pointer border-0 bg-transparent p-0 text-start"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <LazyImage
            src={video.thumb}
            alt={title}
            width={400}
            height={220}
            className="h-full w-full object-cover"
            sizes="(max-width: 768px) 85vw, 320px"
            unoptimized
          />
          <div className="play-overlay">
            <div className="video-play-btn">
              <FontAwesomeIcon icon={faPlay} />
            </div>
          </div>
        </button>
        <div className="video-card-title">{title}</div>
      </div>
      {mounted && modal ? createPortal(modal, document.body) : null}
    </>
  );
}
