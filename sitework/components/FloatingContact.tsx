import { MessageCircle, Phone } from "lucide-react";

const phoneDisplay = "+234 807 773 3373";
const phoneInternational = "+2348077733373";
const whatsappNumber = "2348077733373";
const whatsappMessage = encodeURIComponent("Hello Bridgecare Pharmaceuticals, I need help with your products.");

export function FloatingContact() {
  return (
    <aside className="floating-contact" aria-label="Quick contact options">
      <a className="floating-contact-button call" href={`tel:${phoneInternational}`} aria-label={`Call Bridgecare on ${phoneDisplay}`}>
        <span className="floating-contact-icon"><Phone size={21} strokeWidth={2.2} /></span>
        <span className="floating-contact-copy"><strong>Call</strong><small>{phoneDisplay}</small></span>
      </a>
      <a
        className="floating-contact-button whatsapp"
        href="https://wa.link/bridgecarepharmaltd"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Bridgecare on WhatsApp"
      >
        <span className="floating-contact-icon"><MessageCircle size={22} strokeWidth={2.2} /></span>
        <span className="floating-contact-copy"><strong>WhatsApp</strong><small>Chat with us</small></span>
      </a>
    </aside>
  );
}
