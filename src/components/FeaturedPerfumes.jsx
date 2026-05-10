import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function FeaturedSection() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedPerfumes() {
      try {
        setLoading(true);
        // Traemos solo los perfumes marcados como destacados (is_featured = true)
        const { data, error } = await supabase
          .from("perfumes")
          .select("*")
          .eq("is_featured", true);

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
    <section id="featured" className="bg-black py-22 px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-white mb-12 text-center">
          Los más <span className="italic text-amber-500">buscados</span>
        </h2>

        {/* Estado de carga */}
        {loading ? (
          <div className="text-white text-center py-20 tracking-widest opacity-50">
            CARGANDO COLECCIÓN...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm transition-all duration-500 hover:border-amber-500/50"
              >
                {/* Imagen del perfume */}
                <div className="aspect-3/4 flex items-center justify-center overflow-hidden bg-neutral-900">
                  <img
                    src={perfume.image_url}
                    alt={perfume.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 p-4"
                  />
                </div>

                {/* Info */}
                <div className="pb-6 pl-6 pr-6 text-center">
                  <hr className="h-px border-0 bg-linear-to-r from-transparent via-neutral-700 to-transparent mb-6" />

                  <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                    {perfume.brand}
                  </p>
                  <h3 className="text-white text-xl font-serif mb-2">
                    {perfume.name}
                  </h3>
                  <p className="text-gray-400 text-sm italic mb-4">
                    {perfume.notes || perfume.description}
                  </p>

                  <button className="w-full py-2 bg-transparent rounded-2xl border border-white/20 text-white text-xs tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                    VER DETALLES
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Si no hay perfumes destacados */}
        {!loading && perfumes.length === 0 && (
          <p className="text-center text-gray-500">
            Próximamente nuevas fragancias...
          </p>
        )}
      </div>
    </section>
  );
}
