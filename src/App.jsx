import { Navbar, Footer } from "./components";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CataloguePage from "./pages/catalogue/CataloguePage";
import CartDrawer from "./components/CartDrawer";
import { CartProvider, useCart } from "./context/CartContext";

function MainLayout() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQuantity, removeItem } =
    useCart();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col justify-between">
      <Navbar onOpenCart={() => setIsCartOpen(true)} cartItems={cartItems} />

      <main className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
        </Routes>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <MainLayout />
    </CartProvider>
  );
}

export default App;
