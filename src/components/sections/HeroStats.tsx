"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/lib/hooks/useInView";

export function HeroStats({
  stats,
}: {
  stats: { target: number; label: string }[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visible = useInView(containerRef, { threshold: 0.3 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!visible || started) return;
    setStarted(true);

    const els = containerRef.current?.querySelectorAll(
      ".hero-stat-num span[data-target]"
    );
    if (!els?.length) return;

    els.forEach((el) => {
      const tgt = +(el as HTMLElement).dataset.target!;
      const dur = 2000;
      const st = performance.now();
      function step(now: number) {
        const p = Math.min((now - st) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.floor(eased * tgt));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(tgt);
      }
      requestAnimationFrame(step);
    });
  }, [visible, started]);

  return (
    <div className="hero-stats" id="hero-stats" ref={containerRef}>
      {stats.map((s, i) => (
        <div key={i} className="hero-stat">
          <div className="hero-stat-num">
            <span data-target={s.target}>0</span>+
          </div>
          <div className="hero-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
