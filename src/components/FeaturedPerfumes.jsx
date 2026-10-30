import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { ProductDrawer } from "./ProductDrawer";
import { SkeletonCard } from "./SkeletonCard";

export function FeaturedSection() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    async function fetchFeaturedPerfumes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("perfumes")
          .select("*")
          .eq("is_featured", true)
          .limit(8);

        if (error) throw error;

        const dataToRender = data || [];
        setPerfumes([...dataToRender, ...dataToRender, ...dataToRender]);
        setActiveIndex(dataToRender.length);
      } catch (error) {
        console.error("Error cargando perfumes:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedPerfumes();
  }, []);

  const moveCarousel = (direction) => {
    let newIndex = activeIndex + direction;
    const originalLength = perfumes.length / 3;

    if (newIndex < originalLength) {
      newIndex += originalLength;
    } else if (newIndex >= originalLength * 2) {
      newIndex -= originalLength;
    }
    setActiveIndex(newIndex);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        moveCarousel(1);
      } else {
        moveCarousel(-1);
      }
    }
  };

  const cardWidth = "w-[240px] sm:w-[280px]";

  return (
    <section id="featured" className="bg-black py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-10 sm:mb-12 text-center tracking-wide">
          Los más <span className="italic text-amber-500">buscados</span>
        </h2>

        {loading ? (
          <div className="relative w-full flex items-center justify-center h-112.5">
            <div className="w-60 sm:w-70">
              <SkeletonCard />
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button
              onClick={() => moveCarousel(-1)}
              className="hidden sm:flex absolute left-1/2 -ml-55 md:-ml-65 lg:-ml-75 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/80 border border-white/10 hover:bg-amber-500 hover:text-black text-white w-12 h-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xl opacity-100 hover:scale-110 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={() => moveCarousel(1)}
              className="hidden sm:flex absolute right-1/2 -mr-55 md:-mr-65 lg:-mr-75 top-1/2 -translate-y-1/2 z-30 bg-neutral-900/80 border border-white/10 hover:bg-amber-500 hover:text-black text-white w-12 h-12 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-xl opacity-100 hover:scale-110 cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-6 h-6"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div
              className="relative w-full flex items-center justify-center h-112.5"
              style={{ perspective: "1200px" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {perfumes.map((perfume, index) => {
                const offset = index - activeIndex;
                const isActive = offset === 0;

                const rotateY = offset < 0 ? 35 : offset > 0 ? -35 : 0;
                const translateX = offset * 75;
                const translateZ = isActive ? 0 : -80;
                const scale = isActive ? 1 : 0.85;
                const opacity = Math.abs(offset) > 1 ? 0 : 1;

                return (
                  <div
                    key={`${perfume.id}-${index}`}
                    onClick={() => {
                      if (isActive) {
                        setSelectedPerfume(perfume);
                      } else {
                        moveCarousel(offset > 0 ? 1 : -1);
                      }
                    }}
                    style={{
                      position: "absolute",
                      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: opacity,
                      transformStyle: "preserve-3d",
                      zIndex: isActive ? 10 : 1,
                      pointerEvents: opacity === 0 ? "none" : "auto",
                    }}
                    className={`${cardWidth} h-100 transition-all duration-500 ease-out cursor-pointer flex flex-col justify-between relative bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${
                      isActive ? "border-amber-500/50 shadow-amber-500/20" : ""
                    }`}
                  >
                    <div className="relative h-70 w-full flex items-center justify-center overflow-hidden bg-neutral-950 p-6">
                      <img
                        src={perfume.image_url}
                        alt={perfume.name}
                        className={`w-full h-full object-contain transition-transform duration-700 ${
                          isActive ? "scale-110" : "scale-100"
                        }`}
                      />
                    </div>

                    <div className="p-5 text-center flex flex-col bg-neutral-900 h-30 justify-center">
                      <p className="text-amber-500 text-[10px] tracking-[0.25em] uppercase mb-1 font-medium truncate">
                        {perfume.brand}
                      </p>
                      <h3 className="text-white text-lg font-serif mb-2 tracking-wide truncate">
                        {perfume.name}
                      </h3>
                      <div className="text-amber-500 font-bold text-lg tracking-wide">
                        $
                        {perfume.price
                          ? Number(perfume.price).toLocaleString("es-AR")
                          : "18.000"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ProductDrawer
        isOpen={!!selectedPerfume}
        onClose={() => setSelectedPerfume(null)}
        perfume={selectedPerfume}
      />
    </section>
  );
}
