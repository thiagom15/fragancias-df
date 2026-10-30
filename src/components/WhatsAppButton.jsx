import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton() {
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setIsFooterVisible(footerRect.top < window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href="https://wa.me/5492364674352?text=Hola%20quiero%20consultar%20por%20un%20perfume"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${
        isFooterVisible
          ? "opacity-0 translate-y-10 invisible pointer-events-none"
          : "opacity-100 translate-y-0 visible"
      }`}
    >
      <div className="bg-amber-500 hover:bg-amber-600 text-black rounded-full p-3 sm:p-4 shadow-lg transition flex items-center justify-center">
        <FaWhatsapp className="text-[18px] sm:text-[20px]" />
      </div>
    </a>
  );
}
