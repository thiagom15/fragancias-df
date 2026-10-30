import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DFLogoNav from "../assets/DFLogoNav.avif";
import ContactPopup from "./ContactPopup";
import { ProductDrawer } from "./ProductDrawer";
import { useCart } from "../context/CartContext";
import { supabase } from "../supabaseClient";
import {
  FaInstagram,
  FaPhoneAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount, setIsCartOpen, addToCart } = useCart();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  const navContainerRef = useRef(null);
  const searchBarRef = useRef(null);
  const resultsRef = useRef(null);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setIsMobileMenuOpen(false);
      setIsMobileSearchOpen(false);
      setIsResultsOpen(false);
      if (location.pathname !== path) {
        setSearchTerm("");
        setResults([]);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [navigate, location.pathname],
  );

  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsResultsOpen(false);
  };

  const isAnythingOpen =
    isMobileSearchOpen || isMobileMenuOpen || isResultsOpen || isModalOpen;

  useEffect(() => {
    if (isAnythingOpen) {
      window.history.pushState({ navbarOpen: true }, "");

      const handlePopState = () => {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setIsResultsOpen(false);
        setIsModalOpen(false);
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        if (window.history.state?.navbarOpen) {
          window.history.back();
        }
      };
    }
  }, [isAnythingOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (selectedPerfume) return;
      if (
        event.target.closest('[role="dialog"]') ||
        event.target.closest(".fixed.inset-0")
      ) {
        return;
      }

      const isOutsideNav =
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target);
      const isOutsideSearchBar =
        !searchBarRef.current || !searchBarRef.current.contains(event.target);
      const isOutsideResults =
        !resultsRef.current || !resultsRef.current.contains(event.target);

      if (isOutsideNav && isOutsideSearchBar && isOutsideResults) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
        setIsResultsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedPerfume]);

  useEffect(() => {
    if (!isMobileSearchOpen) return;

    function handleScrollOutside(event) {
      if (window.innerWidth >= 640) return;
      if (selectedPerfume) return;

      const isInsideSearch =
        searchBarRef.current && searchBarRef.current.contains(event.target);
      const isInsideResults =
        resultsRef.current && resultsRef.current.contains(event.target);

      if (isInsideSearch || isInsideResults) return;

      setIsMobileSearchOpen(false);
      setIsResultsOpen(false);
    }

    window.addEventListener("wheel", handleScrollOutside, { passive: true });
    window.addEventListener("touchmove", handleScrollOutside, {
      passive: true,
    });

    return () => {
      window.removeEventListener("wheel", handleScrollOutside);
      window.removeEventListener("touchmove", handleScrollOutside);
    };
  }, [isMobileSearchOpen, selectedPerfume]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      setIsResultsOpen(false);
      return;
    }

    setLoading(true);
    setIsResultsOpen(true);

    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("perfumes")
          .select("*")
          .or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`)
          .limit(8);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Error buscando perfumes:", error.message);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 640 : false;

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center">
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 sm:hidden ${
          isMobileSearchOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => {
          setIsMobileSearchOpen(false);
          setIsResultsOpen(false);
        }}
      />

      <div
        className="w-full px-4 sm:px-6 mt-3 max-w-6xl relative z-50"
        ref={navContainerRef}
      >
        <nav className="relative flex justify-between items-center gap-4 px-6 py-2.5 w-full bg-neutral-950/90 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 z-50">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate("/");
            }}
          >
            <img
              src={DFLogoNav}
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 hover:scale-105"
              alt="DF Fragancias Logo"
            />
          </Link>

          <div className="hidden sm:flex h-10 w-72 md:w-96 mx-2 items-center bg-neutral-900 border border-white/10 rounded-full px-3 focus-within:border-amber-500/60 transition-colors shrink-0">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setIsResultsOpen={setIsResultsOpen}
              handleClear={handleClear}
            />
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              className="relative cursor-pointer text-[11px] tracking-[0.35em] font-light text-neutral-300 hover:text-amber-400 transition-colors duration-300 group"
              onClick={() => handleNavigate("/")}
            >
              INICIO
              <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </button>

            <button
              className="relative cursor-pointer text-[11px] tracking-[0.35em] font-light text-neutral-300 hover:text-amber-400 transition-colors duration-300 group"
              onClick={() => handleNavigate("/catalogue")}
            >
              CATÁLOGO
              <span className="absolute -bottom-1 left-1/2 w-0 h-px bg-amber-500 transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </button>

            <CartButton
              count={totalCount}
              onClick={() => setIsCartOpen(true)}
            />

            <button
              className="cursor-pointer px-4 py-1.5 border border-amber-500/40 text-amber-500 text-[10px] tracking-[0.25em] font-medium rounded-full hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              onClick={() => setIsModalOpen(true)}
            >
              CONTACTO
            </button>
          </div>

          <div className="flex items-center gap-2 sm:hidden shrink-0">
            <CartButton
              count={totalCount}
              onClick={() => setIsCartOpen(true)}
            />

            <button
              className="text-neutral-300 hover:text-amber-400 p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-center"
              onClick={() => {
                const nextState = !isMobileSearchOpen;
                setIsMobileSearchOpen(nextState);
                setIsMobileMenuOpen(false);

                if (nextState && searchTerm.trim()) {
                  setIsResultsOpen(true);
                }
              }}
              aria-label={
                isMobileSearchOpen ? "Cerrar buscador" : "Abrir buscador"
              }
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {isMobileSearchOpen ? (
                  <FaTimes className="text-[18px]" />
                ) : (
                  <FaSearch className="text-[14px]" />
                )}
              </div>
            </button>

            <button
              className="text-neutral-300 hover:text-white p-2 cursor-pointer flex items-center justify-center"
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileSearchOpen(false);
                setIsResultsOpen(false);
              }}
              aria-label={isMobileMenuOpen ? "Cerrar Menú" : "Abrir Menú"}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {isMobileMenuOpen ? (
                  <FaTimes className="text-[18px]" />
                ) : (
                  <FaBars className="text-[18px]" />
                )}
              </div>
            </button>
          </div>
        </nav>

        <div className="absolute w-full left-0 px-4 sm:px-0 top-full mt-2 flex flex-col gap-2 z-50">
          <div
            className={`sm:hidden transition-all duration-300 origin-top ${
              isMobileSearchOpen
                ? "opacity-100 scale-y-100 h-11"
                : "opacity-0 scale-y-0 h-0 overflow-hidden pointer-events-none"
            }`}
          >
            <div
              ref={searchBarRef}
              className="w-full h-full flex items-center bg-neutral-950/95 backdrop-blur-xl border border-amber-500/40 rounded-full px-4 shadow-xl"
            >
              <SearchInput
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                setIsResultsOpen={setIsResultsOpen}
                handleClear={handleClear}
                autoFocus={isMobileSearchOpen}
              />
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden w-full animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-6 bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl flex flex-col items-center gap-5 text-center shadow-2xl">
                <button
                  className="text-xs tracking-[0.3em] font-light text-neutral-200 hover:text-amber-500 uppercase py-1"
                  onClick={() => handleNavigate("/")}
                >
                  Inicio
                </button>
                <button
                  className="text-xs tracking-[0.3em] font-light text-neutral-200 hover:text-amber-500 uppercase py-1"
                  onClick={() => handleNavigate("/catalogue")}
                >
                  Catálogo
                </button>
                <button
                  className="w-full py-2.5 border border-amber-500/50 text-amber-500 text-[11px] tracking-[0.25em] font-medium rounded-full bg-amber-500/10 hover:bg-amber-500 hover:text-black transition-all"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                >
                  CONTACTO
                </button>
              </div>
            </div>
          )}

          {(loading ||
            (isResultsOpen &&
              searchTerm.trim() &&
              (isDesktop || isMobileSearchOpen))) && (
            <div
              ref={resultsRef}
              className="w-full bg-neutral-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-40 transition-all duration-300"
            >
              {loading ? (
                <div className="text-center text-neutral-400 text-xs tracking-widest py-4 uppercase">
                  Buscando fragancias...
                </div>
              ) : results.length === 0 ? (
                <div className="text-center text-neutral-500 text-xs tracking-widest py-4 uppercase">
                  No se encontraron perfumes con "{searchTerm}"
                </div>
              ) : (
                <div>
                  <p className="text-neutral-400 text-[10px] tracking-[0.2em] uppercase mb-3 text-center sm:text-left">
                    Resultados encontrados ({results.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[60vh] overflow-y-auto overscroll-contain p-1">
                    {results.map((perfume) => (
                      <div
                        key={perfume.id}
                        onClick={() => {
                          setSelectedPerfume(perfume);
                        }}
                        className="group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm transition-all duration-500 hover:border-amber-500/50 hover:bg-neutral-900/80"
                      >
                        <div className="relative aspect-3/4 flex items-center justify-center overflow-hidden bg-neutral-900">
                          <img
                            src={perfume.image_url}
                            alt={perfume.name}
                            className="w-full scale-150 h-full object-contain p-3 transition-transform duration-700 group-hover:scale-145"
                          />
                        </div>
                        <div className="bg-black/40 py-1 px-2 text-center text-neutral-500 text-[9px] tracking-wider uppercase border-t border-b border-white/5">
                          Imágen ilustrativa
                        </div>
                        <div className="p-3 text-center flex flex-col grow justify-between">
                          <div>
                            <p className="text-amber-500 text-[9px] tracking-[0.2em] uppercase mb-1 font-medium">
                              {perfume.brand}
                            </p>
                            <h3 className="text-white text-xs font-serif mb-1 tracking-wide line-clamp-1 transition-colors">
                              {perfume.name}
                            </h3>
                          </div>
                          <div className="text-amber-500 font-bold text-xs tracking-wide">
                            $
                            {perfume.price
                              ? Number(perfume.price).toLocaleString("es-AR")
                              : "18.000"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ContactPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contacto"
      >
        <div className="space-y-3 p-2">
          <p className="text-neutral-300 flex items-center gap-3 text-sm">
            <span className="text-amber-500">
              <FaPhoneAlt />
            </span>{" "}
            +54 2364674352
          </p>
          <p className="text-neutral-300 flex items-center gap-3 text-sm">
            <span className="text-amber-500">
              <FaInstagram />
            </span>{" "}
            @fraganciass_df
          </p>
        </div>
      </ContactPopup>

      <ProductDrawer
        isOpen={!!selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        perfume={selectedPerfume}
        onAddToCart={addToCart}
      />
    </header>
  );
}

function SearchInput({
  searchTerm,
  setSearchTerm,
  setIsResultsOpen,
  handleClear,
  autoFocus = false,
}) {
  return (
    <>
      <FaSearch className="text-amber-500 text-xs ml-1 mr-2 shrink-0" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (e.target.value.trim()) setIsResultsOpen(true);
        }}
        onFocus={() => {
          if (searchTerm.trim()) setIsResultsOpen(true);
        }}
        placeholder="Buscar perfume..."
        className="w-full bg-transparent text-white text-xs placeholder-neutral-500 focus:outline-none tracking-wide h-full"
        autoFocus={autoFocus}
      />
      <div className="w-6 flex items-center justify-center shrink-0">
        {searchTerm && (
          <button
            onClick={handleClear}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
          >
            <FaTimes className="text-[10px]" />
          </button>
        )}
      </div>
    </>
  );
}

function CartButton({ count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative text-neutral-300 hover:text-amber-400 p-2 transition-colors cursor-pointer"
      aria-label="Abrir carrito"
    >
      <FaShoppingCart size={18} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-500 text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow">
          {count}
        </span>
      )}
    </button>
  );
}

export default Navbar;
