import clsx from "clsx";
import type { ReactNode } from "react";
import { AnimateInView } from "@/components/ui/AnimateInView";

export function SectionHeader({
  icon,
  title,
  description,
  /** Optional full-width block below the title (e.g. photo, embed). Configure via `src/data/settings.json` where supported. */
  media,
  className,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  media?: ReactNode;
  className?: string;
}) {
  return (
    <AnimateInView className={className}>
      <div
        className={clsx(
          "sec-head",
          media ? "sec-head--with-media" : undefined,
        )}
      >
        <div className="sec-label">{icon}</div>
        <h2 className="sec-title">{title}</h2>
        {description ? <p className="sec-desc">{description}</p> : null}
      </div>
      {media ? <div className="sec-media">{media}</div> : null}
    </AnimateInView>
  );
}
