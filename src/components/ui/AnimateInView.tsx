"use client";

import clsx from "clsx";
import { type ReactNode, useRef } from "react";
import { useInView } from "@/lib/hooks/useInView";

export function AnimateInView({
  children,
  className,
  delayClass,
}: {
  children: ReactNode;
  className?: string;
  delayClass?: "d1" | "d2" | "d3" | "d4" | "d5";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);

  return (
    <div
      ref={ref}
      className={clsx("anim", delayClass, visible && "vis", className)}
    >
      {children}
    </div>
  );
}
