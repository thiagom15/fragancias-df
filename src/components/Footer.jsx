import { useState } from "react";
import { FaWhatsapp, FaInstagram, FaSprayCan } from "react-icons/fa";
import { MiniGame } from "./MiniGame";

export function Footer() {
  const [isGameOpen, setIsGameOpen] = useState(false);

  return (
    <footer
      id="footer"
      className="bg-black text-neutral-400 px-6 sm:px-10 pb-10 pt-4 relative overflow-hidden"
    >
      <button
        onClick={() => setIsGameOpen(true)}
        className="absolute bottom-0 left-0 z-90 w-4 h-4 flex items-center justify-center text-amber-500/30 hover:text-amber-500 transition-all duration-300 hover:scale-125 cursor-pointer"
        aria-label="Abrir juego secreto"
      >
        <span className="pointer-events-none">
          <FaSprayCan size={12} />
        </span>
      </button>

      <div className="max-w-5xl mx-auto">
        <hr className="h-px border-0 bg-linear-to-r from-transparent via-neutral-700 to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 sm:gap-0 text-xs sm:text-sm">
          <p className="tracking-wide">
            © 2026 Fragancias DF. Todos los derechos reservados.
          </p>

          <div className="flex gap-6">
            <a
              href="https://wa.me/5492364674352"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <FaWhatsapp
                size={22}
                className="cursor-pointer hover:text-green-500 transition-colors"
              />
            </a>

            <a
              href="https://www.instagram.com/fraganciass_df/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:scale-110"
            >
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-pink-600 transition-colors"
              />
            </a>
          </div>
        </div>
      </div>

      <MiniGame isOpen={isGameOpen} onClose={() => setIsGameOpen(false)} />
    </footer>
  );
}

export default Footer;
