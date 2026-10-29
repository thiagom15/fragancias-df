import { useEffect } from "react";
import { FaPhoneAlt, FaInstagram } from "react-icons/fa";

export default function ContactPopup({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-[#1A1A1A] border border-white/10 w-full max-w-lg rounded-sm shadow-2xl transform transition-all">
        <div className="p-8">
          {title && (
            <h2 className="font-serif text-2xl text-white mb-4 tracking-wide">
              {title}
            </h2>
          )}
          <div className="text-gray-300 space-y-4">
            <a
              href="https://wa.me/5492364674352"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-amber-500 transition-colors group"
            >
              <span className="text-amber-500 group-hover:scale-110 transition-transform">
                <FaPhoneAlt />
              </span>
              +54 9 2364 674352
            </a>

            <a
              href="https://www.instagram.com/fraganciass_df"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm hover:text-amber-500 transition-colors group"
            >
              <span className="text-amber-500 group-hover:scale-110 transition-transform">
                <FaInstagram />
              </span>
              @fraganciass_df
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-amber-500 transition-colors"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    </div>
  );
}
