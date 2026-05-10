import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DFLogoNav from "../assets/DFLogoNav.png";
import ContactPopup from "./ContactPopup";
import { FaInstagram, FaPhoneAlt } from "react-icons/fa";

export function Navbar() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función auxiliar para navegar y subir
  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" }); // "smooth" le da un deslizamiento suave
  };

  return (
    <div className="fixed flex justify-between items-center px-5 pl-10 pr-10 py-1 w-full z-50 bg-black/60">
      <Link
        to="/"
        className="flex items-center gap-2 h-auto w-auto"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img
          src={DFLogoNav}
          className="w-auto h-23 object-contain pr-4"
          alt="Logo"
        />
      </Link>
      <div className="hidden md:flex items-center gap-12">
        <button
          className="relative cursor-pointer text-[11px] tracking-[0.4em] font-light text-white/60 hover:text-white transition-all duration-500 group"
          onClick={() => handleNavigate("/")}
        >
          INICIO
          <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-amber-500 transition-all duration-500 group-hover:w-full group-hover:left-0" />
        </button>
        <button
          className="relative cursor-pointer text-[11px] tracking-[0.4em] font-light text-white/60 hover:text-white transition-all duration-500 group"
          onClick={() => handleNavigate("/catalogue")}
        >
          CATÁLOGO
          <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-amber-500 transition-all duration-500 group-hover:w-full group-hover:left-0" />
        </button>
        <button
          className="cursor-pointer px-6 py-2 border border-amber-500/40 text-amber-500 text-[10px] tracking-[0.3em] font-medium rounded-full hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
          onClick={() => setIsModalOpen(true)}
        >
          CONTACTO
        </button>
      </div>
      <div className="flex gap-4 text-lg">
        <span>🔍</span>
      </div>
      <ContactPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contacto"
      >
        <div className="space-y-2">
          <p className="text-gray-300 flex items-center gap-2">
            <span className="text-amber-500">
              <FaPhoneAlt />
            </span>{" "}
            +54 2364674352
          </p>
          <p className="text-gray-300 flex items-center gap-2">
            <span className="text-amber-500">
              <FaInstagram />
            </span>{" "}
            @fraganciass_df
          </p>
        </div>
      </ContactPopup>
    </div>
  );
}
