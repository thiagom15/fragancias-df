import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("df_cart");
      if (!savedCart) return [];

      const parsed = JSON.parse(savedCart);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter((item) => item && item.id)
        .map((item) => ({
          ...item,
          quantity: Math.max(1, Number(item.quantity) || 1),
          price: Number(item.price) || 18000,
        }));
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("df_cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error guardando carrito:", error);
    }
  }, [cartItems]);

  const addToCart = (perfume) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === perfume.id);
      if (exists) {
        return prev.map((item) =>
          item.id === perfume.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return removeItem(id);
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const clearCart = () => setCartItems([]);

  const totalCount = useMemo(
    () =>
      cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + (Number(item.price) || 18000) * (Number(item.quantity) || 0),
        0,
      ),
    [cartItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
