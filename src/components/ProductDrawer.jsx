import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

const DRAG_CLOSE_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 0.5;

export function ProductDrawer({
  isOpen,
  onClose,
  perfume,
  origin = "catalogue",
}) {
  const { addToCart } = useCart();

  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startTime: 0,
    lockedAxis: null,
  });

  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSnappingClose, setIsSnappingClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsSnappingClose(false);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setDragX(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && origin !== "search") {
      window.history.pushState({ productOpen: true }, "");

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen, origin, onClose]);

  if (!perfume) return null;

  const handleWhatsApp = () => {
    const message = `Hola! Me gustaría consultar por el perfume: ${perfume.name} de ${perfume.brand}`;
    window.open(
      `https://wa.me/542364674352?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const handleAddAndClose = () => {
    addToCart(perfume);
    onClose();
  };

  const onTouchStart = (e) => {
    if (e.target.closest("button")) return;
    const t = e.touches[0];
    dragState.current = {
      dragging: true,
      startX: t.clientX,
      startY: t.clientY,
      startTime: Date.now(),
      lockedAxis: null,
    };
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!dragState.current.dragging) return;
    const t = e.touches[0];
    const deltaX = t.clientX - dragState.current.startX;
    const deltaY = t.clientY - dragState.current.startY;

    if (!dragState.current.lockedAxis) {
      if (Math.abs(deltaX) > Math.abs(deltaY))
        dragState.current.lockedAxis = "x";
      else if (Math.abs(deltaY) > 8) dragState.current.lockedAxis = "y";
    }

    if (dragState.current.lockedAxis !== "x") return;
    setDragX(deltaX > 0 ? deltaX : 0);
  };

  const onTouchEnd = () => {
    if (!dragState.current.dragging) return;
    dragState.current.dragging = false;
    setIsDragging(false);

    const elapsed = Date.now() - dragState.current.startTime;
    const velocity = dragX / Math.max(elapsed, 1);

    if (dragX > DRAG_CLOSE_THRESHOLD || velocity > DRAG_VELOCITY_THRESHOLD) {
      setIsSnappingClose(true);
      setDragX(window.innerWidth);

      setTimeout(() => {
        onClose();
        setIsSnappingClose(false);
        setDragX(0);
      }, 700);
    } else {
      setDragX(0);
    }
  };

  const panelStyle = isDragging
    ? { transform: `translateX(${dragX}px)`, transition: "none" }
    : isSnappingClose
      ? {
          transform: `translateX(${dragX}px)`,
          transition: "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }
      : undefined;

  const overlayStyle = isSnappingClose
    ? { opacity: 0, transition: "opacity 700ms ease-in-out" }
    : undefined;

  return (
    <>
      <div
        style={overlayStyle}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-700 ease-in-out ${
          isOpen && !isSnappingClose
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={panelStyle}
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-neutral-950 border-l border-white/10 z-50 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform ${
          isOpen || isSnappingClose ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className={`cursor-pointer absolute top-5 left-5 sm:top-6 sm:left-6 text-white/40 hover:text-amber-500 transition-all duration-500 z-20 ${
            isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"
          }`}
          aria-label="Cerrar detalle"
        >
          <IoClose size={28} className="sm:w-8 sm:h-8" />
        </button>

        <div
          className={`h-full overflow-y-auto px-6 py-12 sm:p-10 flex flex-col justify-between transition-opacity duration-700 ${isOpen ? "opacity-100" : "opacity-0"}`}
        >
          <div>
            <div className="w-full aspect-square bg-white/5 rounded-sm overflow-hidden mb-6 sm:mb-10 flex items-center justify-center border border-white/5">
              <img
                src={perfume.image_url}
                alt={perfume.name}
                className="w-4/5 h-4/5 object-contain p-2"
              />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-amber-500 text-[10px] tracking-[0.4em] uppercase mb-2 font-medium">
                  {perfume.brand}
                </p>
                <h2 className="text-3xl sm:text-4xl text-white font-serif italic leading-tight">
                  {perfume.name}
                </h2>
              </div>

              {perfume.price && (
                <div className="text-amber-500 font-bold text-lg sm:text-xl tracking-wide">
                  ${Number(perfume.price).toLocaleString("es-AR")}
                </div>
              )}

              {perfume.notes && (
                <div className="pt-6 sm:pt-8 border-t border-white/10">
                  <h3 className="text-[9px] tracking-[0.4em] text-white/40 mb-3 uppercase">
                    Notas Principales
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-light text-base sm:text-lg">
                    {perfume.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mt-8 sm:mt-12">
            <button
              onClick={handleAddAndClose}
              className="cursor-pointer w-full py-4 bg-neutral-900 border border-amber-500/50 text-amber-400 text-[11px] tracking-[0.3em] font-bold hover:bg-amber-500 hover:text-black transition-all duration-300 uppercase rounded-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <FaShoppingCart size={14} />
              Añadir al Carrito
            </button>

            <button
              onClick={handleWhatsApp}
              className="cursor-pointer w-full py-4 bg-amber-500 text-black text-[11px] tracking-[0.3em] font-bold hover:bg-amber-600 transition-all duration-300 uppercase rounded-sm shadow-lg"
            >
              Compra por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDrawer;
