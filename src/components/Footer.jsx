import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-black text-neutral-400 px-10 md:px-96 pb-10"
    >
      <hr className="h-px border-0 bg-linear-to-r from-transparent via-neutral-700 to-transparent mb-10" />

      {/* Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="tracking-wide">
          © 2026 DF Fragancias. Todos los derechos reservados.
        </p>

        {/* Redes */}
        <div className="flex gap-6 mt-4 md:mt-0">
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
    </footer>
  );
}
