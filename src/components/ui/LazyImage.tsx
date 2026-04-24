"use client";

import Image from "next/image";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

type ImageProps = ComponentPropsWithoutRef<typeof Image>;

/**
 * Default `next/image` for below-the-fold content: lazy load, async decode,
 * and low fetch priority unless `priority` is set (LCP / above-fold).
 */
export const LazyImage = forwardRef<ElementRef<typeof Image>, ImageProps>(
  function LazyImage(
    { priority, loading, decoding, fetchPriority, alt, ...rest },
    ref,
  ) {
    const isPriority = Boolean(priority);
    return (
      <Image
        ref={ref}
        alt={alt}
        priority={priority}
        loading={loading ?? (!isPriority ? "lazy" : undefined)}
        decoding={decoding ?? (!isPriority ? "async" : undefined)}
        fetchPriority={fetchPriority ?? (!isPriority ? "low" : undefined)}
        {...rest}
      />
    );
  },
);

LazyImage.displayName = "LazyImage";
