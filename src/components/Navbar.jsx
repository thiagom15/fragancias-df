import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import DFLogoNav from "../assets/DFLogoNav.png";
import ContactPopup from "./ContactPopup";
import { useState } from "react";

export function Navbar() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    /* Logo */
    <div className="fixed flex justify-between items-center px-5 pl-10 pr-10 py-1 w-full z-50  bg-black/60">
      <Link to="/" className="flex items-center gap-2 h-auto w-auto">
        <img src={DFLogoNav} className="w-auto h-23 object-contain pr-4" />
      </Link>

      {/* Links */}
      <div className="hidden md:flex gap-10 text-sm tracking-widest">
        <button
          className="cursor-pointer"
          onClick={() => navigate("/catalogue")}
        >
          {" "}
          CATÁLOGO{" "}
        </button>
        <button
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          className="text-amber-500 underline"
        >
          <ContactPopup
            className="z-50"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Notas de la Fragancia"
          >
            <p className="text-gray-300">
              Descubre las notas de la fragancia y su historia.
            </p>
          </ContactPopup>
          CONTACTO
        </button>
      </div>

      {/* Buscador */}
      <div className="flex gap-4 text-lg">
        <span>🔍</span>
      </div>
    </div>
  );
}
