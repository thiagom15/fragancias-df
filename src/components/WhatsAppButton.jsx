import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5492364674352?text=Hola%20quiero%20consultar%20por%20un%20perfume"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-20"
    >
      <div className="bg-amber-500 hover:bg-amber-600 text-black rounded-full p-4 shadow-lg transition">
        <FaWhatsapp size={20} />
      </div>
    </a>
  );
}
