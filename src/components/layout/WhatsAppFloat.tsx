import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { SITE_WHATSAPP } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${SITE_WHATSAPP}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}
