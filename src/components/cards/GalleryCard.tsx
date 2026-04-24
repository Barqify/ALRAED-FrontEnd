import { LazyImage } from "@/components/ui/LazyImage";
import type { Locale } from "@/lib/i18n";
import { pickTriple } from "@/lib/i18n";
import type { GalleryImage } from "@/lib/types";

export function GalleryCard({
  item,
  locale,
}: {
  item: GalleryImage;
  locale: Locale;
}) {
  const label = pickTriple(item, locale);
  return (
    <div className="gallery-card">
      <LazyImage
        src={item.img}
        alt={label}
        width={600}
        height={400}
        className="h-full w-full object-cover"
        sizes="(max-width: 768px) 75vw, (max-width: 1200px) 320px, 600px"
        unoptimized
      />
      <div className="gallery-card-overlay">
        <div className="gallery-card-title">{label}</div>
      </div>
    </div>
  );
}
