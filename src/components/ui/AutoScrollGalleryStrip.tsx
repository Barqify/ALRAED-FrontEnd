"use client";

import { Children, type ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import {
  getMaxSlideIndex,
  getNearestSlideIndex,
  getScrollLeftForSlideIndex,
} from "@/lib/carouselScroll";

/** Home hero strip: horizontal auto-scroll only (matches original HTML structure). */
export function AutoScrollGalleryStrip({
  intervalMs,
  children,
}: {
  intervalMs: number;
  children: ReactNode;
}) {
  const slideCount = Children.toArray(children).length;
  const fewSlides = slideCount > 0 && slideCount < 3;

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || track.children.length <= 1) return;

    track.style.direction = "ltr";
    track.style.scrollSnapType = "x mandatory";

    let currentIndex = 0;
    let isPaused = false;

    const nextStep = () => {
      if (isPaused) return;
      const t = getMaxSlideIndex(track);
      const nextIdx = currentIndex >= t ? 0 : currentIndex + 1;
      currentIndex = nextIdx;
      track.scrollTo({
        left: getScrollLeftForSlideIndex(track, nextIdx),
        behavior: "smooth",
      });
    };

    const layoutRaf = requestAnimationFrame(() => {
      currentIndex = 0;
      track.scrollTo({
        left: getScrollLeftForSlideIndex(track, 0),
        behavior: "auto",
      });
    });

    const timerId = setInterval(nextStep, intervalMs);

    const onTouchStart = () => {
      isPaused = true;
    };
    const onTouchEnd = () => {
      setTimeout(() => {
        isPaused = false;
      }, 2000);
    };
    let scrollTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        currentIndex = getNearestSlideIndex(track);
      }, 80);
    };

    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });
    track.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(layoutRaf);
      clearInterval(timerId);
      clearTimeout(scrollTimer);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("scroll", onScroll);
    };
  }, [children, intervalMs]);

  return (
    <section className="home-gallery-strip">
      <div className="container min-w-0">
        <div
          className={clsx(
            "gallery-track",
            fewSlides && "gallery-track--few"
          )}
          id="home-gallery-track"
          ref={trackRef}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
