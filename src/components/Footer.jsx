import { FaWhatsapp, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer id="footer" className="bg-black text-neutral-400 px-96 py-10.5">
      {/* Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center text-sm">
        <p>© 2026 DF Fragancias. Todos los derechos reservados.</p>

        {/* Redes */}
        <div className="flex gap-5 rounded-full">
          <a
            href="https://wa.me/5492364674352"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp
              size={25}
              className="cursor-pointer hover:text-green-500"
            />
          </a>

          <a href="https://www.instagram.com/fraganciass_df/">
            <FaInstagram
              size={25}
              className="cursor-pointer hover:text-pink-800"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
