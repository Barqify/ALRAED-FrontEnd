"use client";

import {
  type ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";

/** Home hero strip: horizontal auto-scroll only (matches original HTML structure). */
export function AutoScrollGalleryStrip({
  intervalMs,
  children,
}: {
  intervalMs: number;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const getGap = useCallback((track: HTMLDivElement) => {
    const g = getComputedStyle(track).gap;
    const p = parseInt(g, 10);
    return p && p > 0 ? p : 16;
  }, []);

  const cw = useCallback(
    (track: HTMLDivElement) => {
      const items = track.children;
      if (!items.length) return 0;
      return (items[0] as HTMLElement).offsetWidth + getGap(track);
    },
    [getGap]
  );

  const maxScroll = useCallback((track: HTMLDivElement) => {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }, []);

  const totalSteps = useCallback(
    (track: HTMLDivElement) => {
      const m = maxScroll(track);
      const step = cw(track);
      return m > 0 && step > 0 ? Math.round(m / step) : 0;
    },
    [cw, maxScroll]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || track.children.length <= 1) return;

    track.style.direction = "ltr";
    track.style.scrollSnapType = "x mandatory";

    let currentIndex = 0;
    let isPaused = false;

    const nextStep = () => {
      if (isPaused) return;
      const t = totalSteps(track);
      const nextIdx = currentIndex >= t ? 0 : currentIndex + 1;
      currentIndex = nextIdx;
      track.scrollTo({
        left: nextIdx * cw(track),
        behavior: "smooth",
      });
    };

    const timerId = setInterval(nextStep, intervalMs);

    const onTouchStart = () => {
      isPaused = true;
    };
    const onTouchEnd = () => {
      setTimeout(() => {
        isPaused = false;
      }, 2000);
    };
    track.addEventListener("touchstart", onTouchStart, { passive: true });
    track.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      clearInterval(timerId);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
    };
  }, [children, cw, intervalMs, totalSteps]);

  return (
    <section className="home-gallery-strip">
      <div className="gallery-track" id="home-gallery-track" ref={trackRef}>
        {children}
      </div>
    </section>
  );
}
