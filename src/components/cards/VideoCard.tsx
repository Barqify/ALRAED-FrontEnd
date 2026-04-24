"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { VideoItem } from "@/lib/types";

export function VideoCard({
  video,
  locale,
}: {
  video: VideoItem;
  locale: Locale;
}) {
  const [active, setActive] = useState(false);
  const title = pickTriple(video.title, locale);

  return (
    <div className={`video-card ${active ? "active" : ""}`}>
      <button
        type="button"
        className="video-placeholder block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
        onClick={(e) => {
          e.stopPropagation();
          setActive(true);
        }}
      >
        <Image
          src={video.thumb}
          alt={title}
          width={400}
          height={220}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 85vw, 320px"
          loading="lazy"
          decoding="async"
          unoptimized
        />
        <div className="play-overlay">
          <div className="video-play-btn">
            <FontAwesomeIcon icon={faPlay} />
          </div>
        </div>
      </button>
      <iframe
        className="video-iframe"
        src={video.url}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      <div className="video-card-title">{title}</div>
    </div>
  );
}
