import { useState, useEffect, useRef } from "react";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

const DRAG_CLOSE_THRESHOLD = 80;
const DRAG_VELOCITY_THRESHOLD = 0.5;

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  totalCount,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
}) {
  const panelRef = useRef(null);
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
    if (isOpen) {
      window.history.pushState({ cartOpen: true }, "");

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isOpen, onClose]);

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) return;
    let message =
      "Hola! Me gustaría realizar el siguiente pedido de perfumes:\n\n";
    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* (${item.brand}) x${item.quantity} - $${((item.price || 18000) * item.quantity).toLocaleString("es-AR")}\n`;
    });
    message += `\n*Total a pagar: $${totalPrice.toLocaleString("es-AR")}*`;
    window.open(
      `https://wa.me/542364674352?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  const onTouchStart = (e) => {
    if (e.target.closest("button")) return;
    const touch = e.touches[0];
    dragState.current = {
      dragging: true,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      lockedAxis: null,
    };
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!dragState.current.dragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragState.current.startX;
    const deltaY = touch.clientY - dragState.current.startY;

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
      setDragX(window.innerWidth * 2);

      setTimeout(() => {
        onClose();
        setIsSnappingClose(false);
        setDragX(0);
        dragState.current = {
          dragging: false,
          startX: 0,
          startY: 0,
          startTime: 0,
          lockedAxis: null,
        };
      }, 700);
    } else {
      setDragX(0);
      dragState.current = {
        dragging: false,
        startX: 0,
        startY: 0,
        startTime: 0,
        lockedAxis: null,
      };
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
        ref={panelRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={panelStyle}
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-neutral-950 border-l border-white/10 z-50 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform will-change-transform ${
          isOpen || isSnappingClose ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-amber-500 text-lg" />
            <h2 className="text-white font-serif text-lg tracking-wide uppercase">
              Tu Carrito ({totalCount})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer text-white/40 hover:text-amber-500 transition-colors"
            aria-label="Cerrar carrito"
          >
            <IoClose size={28} />
          </button>
        </div>

        <div className="h-[calc(100vh-180px)] overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
              <FaShoppingCart className="text-neutral-700 text-5xl mb-2" />
              <p className="text-neutral-400 text-xs tracking-widest uppercase">
                Tu carrito está vacío
              </p>
              <p className="text-neutral-600 text-[11px]">
                Explora el catálogo y añade tus fragancias favoritas.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 bg-neutral-900/60 border border-white/5 rounded-lg p-4 relative"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-neutral-950 rounded-md overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-amber-500 text-[10px] tracking-[0.2em] uppercase truncate font-medium mb-1">
                      {item.brand}
                    </p>
                    <h3 className="text-white text-sm font-serif truncate tracking-wide mb-2">
                      {item.name}
                    </h3>
                    <div className="text-amber-400 font-bold text-base">
                      $
                      {((item.price || 18000) * item.quantity).toLocaleString(
                        "es-AR",
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-neutral-400 hover:text-red-500 bg-white/5 hover:bg-red-500/10 p-2 rounded-md transition-all cursor-pointer"
                    aria-label="Eliminar producto"
                  >
                    <IoTrashOutline size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
                  <span className="text-neutral-500 text-[11px] uppercase tracking-wider">
                    Cantidad
                  </span>

                  <div className="flex items-center bg-black/50 border border-white/10 rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-4 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-lg font-medium"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-sm text-white font-bold min-w-10 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-4 py-1.5 text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="absolute bottom-0 left-0 w-full bg-neutral-950 border-t border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-400 tracking-wider uppercase text-xs">
                Total a abonar:
              </span>
              <span className="text-amber-500 font-bold text-xl tracking-wide">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>
            <button
              onClick={handleCheckoutWhatsApp}
              className="cursor-pointer w-full py-4 bg-amber-500 text-black text-[11px] tracking-[0.3em] font-bold hover:bg-amber-600 transition-all duration-300 uppercase rounded-md active:scale-[0.98] shadow-lg shadow-amber-500/10"
            >
              Finalizar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
