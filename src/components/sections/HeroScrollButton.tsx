"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export function HeroScrollButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="hero-scroll"
      onClick={() =>
        window.scrollBy({
          top: window.innerHeight - 72,
          behavior: "smooth",
        })
      }
    >
      <FontAwesomeIcon icon={faChevronDown} />
      <span>{label}</span>
    </button>
  );
}
