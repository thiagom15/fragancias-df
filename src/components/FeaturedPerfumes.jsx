import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ProductDrawer } from "./ProductDrawer";

export function FeaturedSection() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

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
        setPerfumes(data || []);
      } catch (error) {
        console.error("Error cargando perfumes:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedPerfumes();
  }, []);

  return (
    <section
      id="featured"
      className="bg-black py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl sm:text-4xl text-white mb-10 sm:mb-12 text-center tracking-wide">
          Los más <span className="italic text-amber-500">buscados</span>
        </h2>

        {loading ? (
          <div className="text-white text-center py-20 tracking-widest opacity-50 text-sm">
            CARGANDO COLECCIÓN...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                onClick={() => setSelectedPerfume(perfume)}
                className="group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm transition-all duration-500 hover:border-amber-500/50 hover:bg-neutral-900/80"
              >
                <div className="relative aspect-3/4 flex items-center justify-center overflow-hidden bg-neutral-900">
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-contain p-6 scale-150 sm:scale-150 sm:group-hover:scale-145 transition-transform duration-700"
                  />
                </div>

                <div className="bg-black/40 py-1.5 px-3 text-center text-neutral-500 text-[10px] sm:text-[11px] tracking-wider uppercase border-t border-b border-white/5">
                  Imágen ilustrativa
                </div>

                <div className="p-5 sm:p-6 text-center flex flex-col grow justify-between">
                  <div>
                    <p className="text-amber-500 text-[10px] sm:text-xs tracking-[0.25em] uppercase mb-1.5 font-medium">
                      {perfume.brand}
                    </p>
                    <h3 className="text-white text-lg sm:text-xl font-serif mb-2 tracking-wide line-clamp-1 transition-colors duration-300">
                      {perfume.name}
                    </h3>
                  </div>

                  <div>
                    <div className="text-amber-500 font-bold text-base sm:text-lg tracking-wide">
                      $
                      {perfume.price
                        ? Number(perfume.price).toLocaleString("es-AR")
                        : "18.000"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && perfumes.length === 0 && (
          <p className="text-center text-neutral-500 text-sm tracking-widest">
            Próximamente nuevas fragancias...
          </p>
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
