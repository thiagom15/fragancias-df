import { useState, useEffect } from "react";
import { Navbar, Footer } from "./components";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import CataloguePage from "./pages/catalogue/CataloguePage";
import { CartDrawer } from "./components/CartDrawer";
import { CartProvider, useCart } from "./context/CartContext";
import { Analytics } from "@vercel/analytics/react";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { supabase } from "./supabaseClient";

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Verificando acceso...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

function MainLayout() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    totalCount,
    totalPrice,
  } = useCart();

  return (
    <div className="bg-black text-white font-sans min-h-screen flex flex-col justify-between">
      <Navbar />

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
        totalCount={totalCount}
        totalPrice={totalPrice}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<MainLayout />} />
      </Routes>
      <Analytics />
    </CartProvider>
  );
}

export default App;
