import { useState, useEffect } from "react";
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";

export function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.price || 18000) * item.quantity,
    0,
  );

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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-700 ease-in-out ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-112.5 bg-neutral-950 border-l border-white/10 z-50 shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <FaShoppingCart className="text-amber-500 text-lg" />
            <h2 className="text-white font-serif text-lg tracking-wide uppercase">
              Tu Carrito (
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)})
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
                className="flex items-center gap-4 bg-neutral-900/50 border border-white/5 rounded-sm p-3 relative group"
              >
                <div className="w-16 h-16 bg-neutral-900 rounded-sm overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-amber-500 text-[9px] tracking-[0.2em] uppercase truncate">
                    {item.brand}
                  </p>
                  <h3 className="text-white text-xs font-serif truncate tracking-wide mb-1">
                    {item.name}
                  </h3>
                  <div className="text-amber-400 font-bold text-xs">
                    $
                    {((item.price || 18000) * item.quantity).toLocaleString(
                      "es-AR",
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-2">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                    aria-label="Eliminar producto"
                  >
                    <IoTrashOutline size={14} />
                  </button>

                  <div className="flex items-center border border-white/10 rounded-sm bg-black/40">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-2 py-0.5 text-white/60 hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      -
                    </button>
                    <span className="px-2 text-xs text-white font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-0.5 text-white/60 hover:text-white transition-colors cursor-pointer text-xs"
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
              <span className="text-amber-500 font-bold text-base tracking-wide">
                ${totalPrice.toLocaleString("es-AR")}
              </span>
            </div>

            <button
              onClick={handleCheckoutWhatsApp}
              className="cursor-pointer w-full py-4 bg-amber-500 text-black text-[11px] tracking-[0.3em] font-bold hover:bg-amber-600 transition-all duration-300 uppercase rounded-sm active:scale-[0.98] shadow-lg shadow-amber-500/10"
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
