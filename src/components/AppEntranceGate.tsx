"use client";

import Lottie from "lottie-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** No fixed wait before Lottie: spinner only until JSON is ready. */
const DELAY_BEFORE_ANIM_MS = 0;
/** No extra hold after Lottie mounts; fade starts as soon as data is shown. */
const MIN_VISIBLE_AFTER_ANIM_MS = 0;
/** Fallback if `transitionend` does not fire (e.g. reduced motion / odd browsers). */
const OVERLAY_EXIT_FALLBACK_MS = 600;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Replace `public/lottie/share-6a998c26.json` with JSON exported from the LottieFiles share:
 * https://app.lottiefiles.com/share/6a998c26-8695-47b1-995b-04f65dbcb3ba
 * Or set `NEXT_PUBLIC_LOTTIE_FIRST_LOAD_URL` to a hosted `.json` URL.
 */
function lottieUrls(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_LOTTIE_FIRST_LOAD_URL?.trim();
  if (fromEnv) return [fromEnv];
  return [
    "/lottie/share-6a998c26.json",
    "/lottie/global-food-supply.json",
  ];
}

async function fetchFirstLottieJson(urls: string[]): Promise<object | null> {
  for (const url of urls) {
    try {
      const r = await fetch(url, { cache: "force-cache" });
      if (!r.ok) continue;
      const data = (await r.json()) as unknown;
      if (data && typeof data === "object") return data as object;
    } catch {
      /* try next */
    }
  }
  return null;
}

type Phase = "off" | "enter" | "exit";

/**
 * First full load only: Lottie/spinner then crossfade into `children`.
 * Overlay is removed as soon as the opacity transition finishes — no extra sleep after the fade.
 */
export function AppEntranceGate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [phase, setPhase] = useState<Phase>("enter");
  const [animationData, setAnimationData] = useState<object | null>(null);
  const exitFinishedRef = useRef(false);

  const showShell = phase === "exit" || phase === "off";
  const showOverlay = phase === "enter" || phase === "exit";

  const finishExit = useCallback(() => {
    if (exitFinishedRef.current) return;
    exitFinishedRef.current = true;
    document.body.style.overflow = "";
    setPhase("off");
    setAnimationData(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const urls = lottieUrls();

    const run = async () => {
      exitFinishedRef.current = false;
      setAnimationData(null);
      setPhase("enter");
      document.body.style.overflow = "hidden";

      const loadPromise = fetchFirstLottieJson(urls);

      if (DELAY_BEFORE_ANIM_MS > 0) {
        await sleep(DELAY_BEFORE_ANIM_MS);
        if (cancelled) return;
      }

      const parsed = await loadPromise;
      if (cancelled) return;

      if (!parsed) {
        document.body.style.overflow = "";
        setPhase("off");
        return;
      }

      setAnimationData(parsed);
      if (MIN_VISIBLE_AFTER_ANIM_MS > 0) {
        await sleep(MIN_VISIBLE_AFTER_ANIM_MS);
        if (cancelled) return;
      } else {
        // One paint so Lottie is on-screen before fade (no fixed hold after fade vs. main SPA).
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });
        if (cancelled) return;
      }

      setPhase("exit");
    };

    void run();

    return () => {
      cancelled = true;
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = window.setTimeout(() => {
      finishExit();
    }, OVERLAY_EXIT_FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [phase, finishExit]);

  const onOverlayTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (phase !== "exit" || e.propertyName !== "opacity") return;
    finishExit();
  };

  return (
    <>
      {showShell ? children : null}
      {showOverlay ? (
        <div
          className={cn(
            "fixed inset-0 z-[1100] flex flex-col items-center justify-center gap-6 bg-[rgba(18,16,16,.97)] px-6 transition-opacity duration-500 ease-out",
            phase === "exit" ? "pointer-events-none opacity-0" : "opacity-100",
          )}
          aria-hidden
          onTransitionEnd={onOverlayTransitionEnd}
        >
          {animationData ? (
            <div className="flex w-full max-w-md min-h-0 items-center justify-center">
              <Lottie
                animationData={animationData}
                loop
                className="h-[min(55vh,420px)] w-full max-w-md"
              />
            </div>
          ) : (
            <div
              className="h-14 w-14 shrink-0 rounded-full border-2 border-[rgba(165,133,90,.25)] border-t-[var(--brand-light)] animate-spin motion-reduce:animate-none"
              aria-hidden
            />
          )}
        </div>
      ) : null}
    </>
  );
}
