import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/201098765432"
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float"
      aria-label="WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
    </a>
  );
}
