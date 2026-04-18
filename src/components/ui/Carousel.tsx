"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { type ReactNode, useCallback, useEffect, useRef } from "react";

type CarouselVariant =
  | "cats"
  | "prods"
  | "news"
  | "gallery"
  | "video"
  | "home-gallery";

export function Carousel({
  trackId,
  intervalMs,
  rtl,
  variant,
  children,
}: {
  trackId: string;
  intervalMs: number;
  rtl: boolean;
  variant: CarouselVariant;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const currentIndexRef = useRef(0);

  const prevIcon = rtl ? faChevronRight : faChevronLeft;
  const nextIcon = rtl ? faChevronLeft : faChevronRight;

  const getGap = useCallback((track: HTMLDivElement) => {
    const g = getComputedStyle(track).gap;
    const p = parseInt(g, 10);
    return p && p > 0 ? p : 16;
  }, []);

  const cw = useCallback((track: HTMLDivElement) => {
    const items = track.children;
    if (!items.length) return 0;
    return (items[0] as HTMLElement).offsetWidth + getGap(track);
  }, [getGap]);

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

  const updateDots = useCallback((trackIdInner: string, idx: number) => {
    const d = document.getElementById(`${trackIdInner}-dots`);
    if (!d) return;
    const dots = d.querySelectorAll(".carousel-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === idx);
    });
  }, []);

  const goToStep = useCallback(
    (track: HTMLDivElement, idx: number) => {
      const t = totalSteps(track);
      const clamped = Math.max(0, Math.min(idx, t));
      currentIndexRef.current = clamped;
      track.scrollTo({
        left: clamped * cw(track),
        behavior: "smooth",
      });
      updateDots(track.id, clamped);
    },
    [cw, totalSteps, updateDots]
  );

  const nextStep = useCallback(
    (track: HTMLDivElement) => {
      const t = totalSteps(track);
      const nextIdx =
        currentIndexRef.current >= t ? 0 : currentIndexRef.current + 1;
      goToStep(track, nextIdx);
    },
    [goToStep, totalSteps]
  );

  const prevStep = useCallback(
    (track: HTMLDivElement) => {
      const t = totalSteps(track);
      const prevIdx =
        currentIndexRef.current <= 0 ? t : currentIndexRef.current - 1;
      goToStep(track, prevIdx);
    },
    [goToStep, totalSteps]
  );

  const createDots = useCallback(
    (track: HTMLDivElement) => {
      const d = dotsRef.current;
      if (!d) return;
      const t = totalSteps(track);
      const count = t + 1;
      d.innerHTML = "";
      for (let i = 0; i < count; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "carousel-dot" + (i === 0 ? " active" : "");
        const idx = i;
        btn.addEventListener("click", () => goToStep(track, idx));
        d.appendChild(btn);
      }
    },
    [goToStep, totalSteps]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.style.direction = "ltr";
    track.style.scrollSnapType = "x mandatory";

    let isPaused = false;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let scrollTimer: ReturnType<typeof setTimeout>;

    const items = track.children;
    if (items.length <= 1) return;

    createDots(track);

    const id = setInterval(() => {
      if (!isPaused) nextStep(track);
    }, intervalMs);
    intervalsRef.current.push(id);

    const wrap = track.closest(".carousel-wrap");

    const onMouseEnter = () => {
      isPaused = true;
    };
    const onMouseLeave = () => {
      isPaused = false;
    };
    wrap?.addEventListener("mouseenter", onMouseEnter);
    wrap?.addEventListener("mouseleave", onMouseLeave);

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

    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const t = totalSteps(track);
        let ci = Math.round(track.scrollLeft / cw(track));
        ci = Math.max(0, Math.min(ci, t));
        currentIndexRef.current = ci;
        updateDots(track.id, ci);
      }, 80);
    };
    track.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        goToStep(track, currentIndexRef.current);
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      clearInterval(id);
      intervalsRef.current = intervalsRef.current.filter((x) => x !== id);
      wrap?.removeEventListener("mouseenter", onMouseEnter);
      wrap?.removeEventListener("mouseleave", onMouseLeave);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [
    children,
    createDots,
    cw,
    goToStep,
    intervalMs,
    nextStep,
    totalSteps,
    trackId,
    updateDots,
  ]);

  const wrapClass = clsx(
    "carousel-wrap",
    variant === "cats" && "cats-carousel",
    variant === "prods" && "prods-carousel",
    variant === "news" && "news-carousel",
    variant === "gallery" && "gallery-carousel",
    variant === "video" && "video-carousel",
    variant === "home-gallery" && "gallery-carousel"
  );

  return (
    <div className={wrapClass}>
      <button
        type="button"
        className="carousel-arrow prev"
        aria-label="Previous"
        onClick={() => trackRef.current && prevStep(trackRef.current)}
      >
        <FontAwesomeIcon icon={prevIcon} />
      </button>
      <div className="carousel-track" id={trackId} ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className="carousel-arrow next"
        aria-label="Next"
        onClick={() => trackRef.current && nextStep(trackRef.current)}
      >
        <FontAwesomeIcon icon={nextIcon} />
      </button>
      <div className="carousel-dots" id={`${trackId}-dots`} ref={dotsRef} />
    </div>
  );
}
