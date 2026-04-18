import type { ReactNode } from "react";
import { AnimateInView } from "@/components/ui/AnimateInView";

export function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <AnimateInView>
      <div className="sec-head">
        <div className="sec-label">{icon}</div>
        <h2 className="sec-title">{title}</h2>
        {description ? <p className="sec-desc">{description}</p> : null}
      </div>
    </AnimateInView>
  );
}
