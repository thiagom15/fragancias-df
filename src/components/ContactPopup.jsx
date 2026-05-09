import { useEffect } from "react";

export default function ContactPopup({ isOpen, onClose, title, children }) {
  // Cerrar con la tecla Escape
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
      {/* Overlay con desenfoque */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenedor del Modal */}
      <div className="relative bg-[#1A1A1A] border border-white/10 w-full max-w-lg rounded-sm shadow-2xl transform transition-all z-50">
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-amber-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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

        <div className="p-8">
          {title && (
            <h2 className="font-serif text-2xl text-white mb-4 tracking-wide">
              {title}
            </h2>
          )}
          <div className="text-gray-300">{children}</div>
        </div>

        {/* Detalle decorativo inferior */}
        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    </div>
  );
}
