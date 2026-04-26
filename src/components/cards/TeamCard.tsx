import { LazyImage } from "@/components/ui/LazyImage";
import type { Locale } from "@/lib/i18n";
import { isRtl } from "@/lib/i18n";
import type { TeamMember } from "@/lib/types";

export function TeamCard({
  member,
  locale,
}: {
  member: TeamMember;
  locale: Locale;
}) {
  const name =
    locale === "ar" ? member.name : locale === "fr" ? member.fr : member.en;
  const role =
    locale === "ar"
      ? member.role
      : locale === "fr"
        ? member.frRole
        : member.enRole;

  return (
    <div
      className="team-card"
      dir={isRtl(locale) ? "rtl" : "ltr"}
      lang={locale}
    >
      <div className="team-avatar relative overflow-hidden">
        <LazyImage
          src={member.img}
          alt={name}
          width={200}
          height={200}
          className="h-full w-full object-cover"
          sizes="(max-width: 768px) 45vw, 200px"
          unoptimized
        />
      </div>
      <h3 className="team-name">{name}</h3>
      <p className="team-role">{role}</p>
    </div>
  );
}
