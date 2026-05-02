/**
 * Horizontal carousel helpers. Tracks use `direction: "ltr"` and `scrollTo({ left })`
 * so autoplay does not depend on document RTL / locale.
 *
 * Targets match `scroll-snap-align: center` (see `.carousel-track` / gallery strips):
 * we scroll so each slide’s midpoint aligns with the track’s visible midpoint.
 */

/** ScrollLeft that centers slide `idx` in the track viewport (LTR scroll coordinates). */
export function getScrollLeftForSlideIndex(
  track: HTMLElement,
  idx: number,
): number {
  const child = track.children[idx] as HTMLElement | undefined;
  if (!child || idx < 0) return 0;
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  const trackRect = track.getBoundingClientRect();
  const childRect = child.getBoundingClientRect();
  const childCenter = childRect.left + childRect.width / 2;
  const trackCenter = trackRect.left + trackRect.width / 2;
  const nextLeft = track.scrollLeft + (childCenter - trackCenter);
  return Math.max(0, Math.min(nextLeft, max));
}

/** Last valid slide index (0-based). */
export function getMaxSlideIndex(track: HTMLElement): number {
  const n = track.children.length;
  return n <= 1 ? 0 : n - 1;
}

/** Map current scroll position to nearest slide (same targets as {@link getScrollLeftForSlideIndex}). */
export function getNearestSlideIndex(track: HTMLElement): number {
  const n = track.children.length;
  if (n <= 1) return 0;
  const sl = track.scrollLeft;
  const max = Math.max(0, track.scrollWidth - track.clientWidth);
  const trackRect = track.getBoundingClientRect();
  const trackCenter = trackRect.left + trackRect.width / 2;
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < n; i++) {
    const child = track.children[i] as HTMLElement;
    const childRect = child.getBoundingClientRect();
    const childCenter = childRect.left + childRect.width / 2;
    const target = track.scrollLeft + (childCenter - trackCenter);
    const clamped = Math.max(0, Math.min(target, max));
    const d = Math.abs(sl - clamped);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}
