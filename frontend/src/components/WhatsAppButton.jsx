import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "91XXXXXXXXXX"; //enter number

const WhatsAppButton = () => (
  <a
    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I have a question about Oats Crush.")}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="fixed bottom-5 right-5 z-40 bg-[#25D366] rounded-full p-3.5 shadow-lg hover:scale-105 transition"
  >
    <FaWhatsapp size={26} className="text-white" />
  </a>
);

export default WhatsAppButton;