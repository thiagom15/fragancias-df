import { IoClose } from "react-icons/io5";

export function ProductDrawer({ isOpen, onClose, perfume }) {
  if (!perfume) return null;

  const handleWhatsApp = () => {
    const message = `Hola! Me gustaría consultar por el perfume: ${perfume.name} de ${perfume.brand}`;
    window.open(
      `https://wa.me/542364674352?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-60 transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-112.5 bg-neutral-950 border-l border-white/10 z-70 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className={`cursor-pointer absolute top-6 left-6 text-white/40 hover:text-amber-500 transition-all duration-500 z-10 ${
            isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          }`}
        >
          <IoClose size={32} />
        </button>

        <div
          className={`h-full overflow-y-auto p-10 flex flex-col transition-opacity duration-1000 delay-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full aspect-square bg-white/5 rounded-sm overflow-hidden mb-10 flex items-center justify-center">
            <img
              src={perfume.image_url}
              alt={perfume.name}
              className="w-4/5 h-4/5 object-contain"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-amber-500 text-[10px] tracking-[0.5em] uppercase mb-2">
                {perfume.brand}
              </p>
              <h2 className="text-4xl text-white font-serif italic leading-tight">
                {perfume.name}
              </h2>
            </div>

            <div className="pt-8 border-t border-white/10">
              <h3 className="text-[9px] tracking-[0.4em] text-white/30 mb-4 uppercase">
                Notas Principales
              </h3>
              <p className="text-gray-300 leading-relaxed font-light text-lg">
                {perfume.notes}
              </p>
            </div>

            <button
              onClick={handleWhatsApp}
              className="cursor-pointer w-full mt-12 py-5 bg-amber-500 text-black text-[11px] tracking-[0.3em] font-bold hover:bg-amber-600 transition-all duration-300 uppercase rounded-sm active:scale-[0.98]"
            >
              Consultar precio y stock
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
