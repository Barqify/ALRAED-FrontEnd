import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFaIcon } from "@/lib/icons";
import type { CertItem } from "@/lib/types";

export function CertBadge({ cert }: { cert: CertItem }) {
  return (
    <div className="cert-badge">
      <div className="cert-icon">
        <FontAwesomeIcon icon={getFaIcon(cert.i)} />
      </div>
      <span className="cert-name">{cert.n}</span>
    </div>
  );
}
