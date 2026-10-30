import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../supabaseClient";
import { ProductDrawer } from "../../components/ProductDrawer";
import { WhatsAppButton } from "../../components/WhatsAppButton";
import { ScrollToTop } from "../../components/ScrollToTopButton";
import { SkeletonCard } from "../../components/SkeletonCard";
import { useCart } from "../../context/CartContext";

export default function CataloguePage() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerfume, setSelectedPerfume] = useState(null);

  const [marcaFiltro, setMarcaFiltro] = useState("");
  const [generoFiltro, setGeneroFiltro] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchPerfumes() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("perfumes")
          .select("*")
          .eq("is_featured", false);

        if (error) throw error;
        setPerfumes(data || []);
      } catch (error) {
        console.error("Error cargando perfumes:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPerfumes();
  }, []);

  const marcas = useMemo(
    () => [...new Set(perfumes.map((p) => p.brand).filter(Boolean))].sort(),
    [perfumes],
  );

  const perfumesFiltrados = useMemo(() => {
    return perfumes.filter((p) => {
      const coincideMarca = !marcaFiltro || p.brand === marcaFiltro;
      const coincideGenero =
        generoFiltro === "" ||
        (generoFiltro === "male" &&
          (p.is_male === true || p.is_male === null)) ||
        (generoFiltro === "female" &&
          (p.is_male === false || p.is_male === null));
      const coincideTipo =
        tipoFiltro === "" ||
        (tipoFiltro === "arab" && p.is_arab === true) ||
        (tipoFiltro === "no-arab" && p.is_arab === false);

      return coincideMarca && coincideGenero && coincideTipo;
    });
  }, [perfumes, marcaFiltro, generoFiltro, tipoFiltro]);

  const hayFiltrosActivos =
    marcaFiltro !== "" || generoFiltro !== "" || tipoFiltro !== "";

  return (
    <>
      <section id="catalogue" className="bg-black py-22 px-4 sm:px-10 pt-32">
        <WhatsAppButton />
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-neutral-900/50 border border-white/5 rounded-sm p-4 sm:p-6">
              <label className="flex flex-col gap-1.5">
                <span className="text-amber-500 text-[9px] tracking-[0.25em] uppercase">
                  Marca
                </span>
                <select
                  value={marcaFiltro}
                  onChange={(e) => setMarcaFiltro(e.target.value)}
                  className="bg-black border border-white/10 focus:border-amber-500/60 outline-none text-white text-sm px-3 py-2 rounded-sm transition-colors"
                >
                  <option value="">Todas</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-amber-500 text-[9px] tracking-[0.25em] uppercase">
                  Género
                </span>
                <select
                  value={generoFiltro}
                  onChange={(e) => setGeneroFiltro(e.target.value)}
                  className="bg-black border border-white/10 focus:border-amber-500/60 outline-none text-white text-sm px-3 py-2 rounded-sm transition-colors"
                >
                  <option value="">Todos</option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-amber-500 text-[9px] tracking-[0.25em] uppercase">
                  Tipo
                </span>
                <select
                  value={tipoFiltro}
                  onChange={(e) => setTipoFiltro(e.target.value)}
                  className="bg-black border border-white/10 focus:border-amber-500/60 outline-none text-white text-sm px-3 py-2 rounded-sm transition-colors"
                >
                  <option value="">Todos</option>
                  <option value="arab">Árabes</option>
                  <option value="no-arab">No árabes</option>
                </select>
              </label>
            </div>

            {hayFiltrosActivos && (
              <button
                onClick={() => {
                  setMarcaFiltro("");
                  setGeneroFiltro("");
                  setTipoFiltro("");
                }}
                className="mt-3 text-neutral-400 hover:text-amber-500 text-[10px] tracking-[0.25em] uppercase underline underline-offset-4 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              {perfumesFiltrados.map((perfume) => (
                <div
                  key={perfume.id}
                  onClick={() => setSelectedPerfume(perfume)}
                  className="group cursor-pointer flex flex-col justify-between relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm transition-all duration-500 hover:border-amber-500/50 hover:bg-neutral-900/80"
                >
                  <div className="relative aspect-3/4 flex items-center justify-center overflow-hidden bg-neutral-900">
                    <img
                      src={perfume.image_url}
                      alt={perfume.name}
                      className="w-full h-full object-contain p-4 sm:p-6 scale-150 sm:scale-125 sm:group-hover:scale-135 transition-transform duration-700"
                    />
                  </div>
                  <div className="bg-black/40 py-1.5 px-2 sm:px-3 text-center text-neutral-500 text-[9px] sm:text-[11px] tracking-wider uppercase border-t border-b border-white/5">
                    Imágen ilustrativa
                  </div>
                  <div className="p-3 sm:p-6 text-center flex flex-col grow justify-between">
                    <div>
                      <p className="text-amber-500 text-[9px] sm:text-xs tracking-[0.25em] uppercase mb-1 sm:mb-1.5 font-medium">
                        {perfume.brand}
                      </p>
                      <h3 className="text-white text-sm sm:text-xl font-serif mb-2 tracking-wide line-clamp-1 transition-colors duration-300">
                        {perfume.name}
                      </h3>
                    </div>
                    <div>
                      <div className="text-amber-500 font-bold text-sm sm:text-lg tracking-wide">
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
            <p className="text-center text-neutral-500 text-sm tracking-widest py-12">
              Próximamente nuevas fragancias...
            </p>
          )}

          {!loading &&
            perfumes.length > 0 &&
            perfumesFiltrados.length === 0 && (
              <p className="text-center text-neutral-500 text-sm tracking-widest py-12">
                No hay fragancias con esos filtros.
              </p>
            )}
        </div>

        <ProductDrawer
          isOpen={!!selectedPerfume}
          onClose={() => setSelectedPerfume(null)}
          perfume={selectedPerfume}
          onAddToCart={addToCart}
        />
      </section>

      <ScrollToTop />
    </>
  );
}
