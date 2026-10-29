import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-black text-neutral-400 px-6 sm:px-10 pb-10 pt-4"
    >
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
    </footer>
  );
}

export default Footer;
