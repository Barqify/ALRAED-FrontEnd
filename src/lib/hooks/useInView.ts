"use client";

import { type RefObject, useEffect, useState } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      options ?? {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, visible, options]);

  return visible;
}
