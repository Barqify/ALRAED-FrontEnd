"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import {
  Children,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  getMaxSlideIndex,
  getNearestSlideIndex,
  getScrollLeftForSlideIndex,
} from "@/lib/carouselScroll";

function scrollTrackToIndexInstant(
  track: HTMLDivElement,
  idx: number,
): void {
  track.scrollTo({
    left: getScrollLeftForSlideIndex(track, idx),
    behavior: "auto",
  });
}

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
  const slideCount = Children.toArray(children).length;
  const fewSlides = slideCount > 0 && slideCount < 3;

  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const intervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const currentIndexRef = useRef(0);

  const prevIcon = rtl ? faChevronRight : faChevronLeft;
  const nextIcon = rtl ? faChevronLeft : faChevronRight;

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
      const t = getMaxSlideIndex(track);
      const clamped = Math.max(0, Math.min(idx, t));
      currentIndexRef.current = clamped;
      track.scrollTo({
        left: getScrollLeftForSlideIndex(track, clamped),
        behavior: "smooth",
      });
      updateDots(track.id, clamped);
    },
    [updateDots]
  );

  const nextStep = useCallback(
    (track: HTMLDivElement) => {
      const t = getMaxSlideIndex(track);
      const nextIdx =
        currentIndexRef.current >= t ? 0 : currentIndexRef.current + 1;
      goToStep(track, nextIdx);
    },
    [goToStep]
  );

  const prevStep = useCallback(
    (track: HTMLDivElement) => {
      const t = getMaxSlideIndex(track);
      const prevIdx =
        currentIndexRef.current <= 0 ? t : currentIndexRef.current - 1;
      goToStep(track, prevIdx);
    },
    [goToStep]
  );

  const createDots = useCallback(
    (track: HTMLDivElement) => {
      const d = dotsRef.current;
      if (!d) return;
      const t = getMaxSlideIndex(track);
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
    [goToStep]
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

    const layoutRaf = requestAnimationFrame(() => {
      const tmax = getMaxSlideIndex(track);
      const idx = Math.min(currentIndexRef.current, tmax);
      currentIndexRef.current = idx;
      scrollTrackToIndexInstant(track, idx);
      updateDots(track.id, idx);
    });

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
        const ci = getNearestSlideIndex(track);
        const t = getMaxSlideIndex(track);
        const clamped = Math.max(0, Math.min(ci, t));
        currentIndexRef.current = clamped;
        updateDots(track.id, clamped);
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
      cancelAnimationFrame(layoutRaf);
      clearInterval(id);
      intervalsRef.current = intervalsRef.current.filter((x) => x !== id);
      wrap?.removeEventListener("mouseenter", onMouseEnter);
      wrap?.removeEventListener("mouseleave", onMouseLeave);
      track.removeEventListener("touchstart", onTouchStart);
      track.removeEventListener("touchend", onTouchEnd);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [children, createDots, goToStep, intervalMs, nextStep, updateDots]);

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
      <div
        className={clsx(
          "carousel-track",
          fewSlides && "carousel-track--few"
        )}
        id={trackId}
        ref={trackRef}
      >
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
