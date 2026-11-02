import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSearch, FaCheck, FaPlus, FaTag } from "react-icons/fa";

export default function AdminDashboard() {
  const [perfumes, setPerfumes] = useState([]);
  const [notas, setNotas] = useState([]);
  const [nuevaNota, setNuevaNota] = useState("");

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [precioGlobal, setPrecioGlobal] = useState("");
  const [actualizandoPrecio, setActualizandoPrecio] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: perfumesData } = await supabase
      .from("perfumes")
      .select("*")
      .order("brand", { ascending: true });

    if (perfumesData) {
      setPerfumes(perfumesData);
      if (perfumesData.length > 0) {
        setPrecioGlobal(perfumesData[0].price || 18000);
      }
    }

    const { data: notasData } = await supabase
      .from("notas_admin")
      .select("*")
      .eq("completado", false)
      .order("created_at", { ascending: false });
    if (notasData) setNotas(notasData);

    setLoading(false);
  };

  useEffect(() => {
    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "perfumes" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setPerfumes((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p)),
            );
          } else if (payload.eventType === "INSERT") {
            setPerfumes((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "DELETE") {
            setPerfumes((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notas_admin" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            if (!payload.new.completado) {
              setNotas((prev) => [payload.new, ...prev]);
            }
          } else if (payload.eventType === "DELETE") {
            setNotas((prev) => prev.filter((n) => n.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const handleUpdateGlobalPrice = async (e) => {
    e.preventDefault();
    const nuevoPrecio = Number(precioGlobal);

    if (!nuevoPrecio || nuevoPrecio <= 0) {
      alert("Por favor, ingresá un precio válido.");
      return;
    }

    const confirm = window.confirm(
      `¿Estás seguro de que querés cambiar el precio de TODOS los perfumes a $${nuevoPrecio.toLocaleString("es-AR")}?`,
    );
    if (!confirm) return;

    setActualizandoPrecio(true);

    try {
      const { data: perfumesData, error: fetchError } = await supabase
        .from("perfumes")
        .select("id");

      if (fetchError) throw fetchError;
      if (!perfumesData || perfumesData.length === 0) {
        throw new Error("No se encontraron perfumes para actualizar.");
      }

      const updatePromises = perfumesData.map((p) =>
        supabase.from("perfumes").update({ price: nuevoPrecio }).eq("id", p.id),
      );

      const results = await Promise.all(updatePromises);
      const hasError = results.some((res) => res.error);
      if (hasError)
        throw new Error("Algunos perfumes no se pudieron actualizar.");

      setPerfumes((prev) => prev.map((p) => ({ ...p, price: nuevoPrecio })));
      alert("¡Precio actualizado con éxito en toda la tienda!");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el precio global. Revisá la consola.");
    } finally {
      setActualizandoPrecio(false);
    }
  };

  const agregarNota = async (e) => {
    e.preventDefault();
    if (!nuevaNota.trim()) return;

    await supabase.from("notas_admin").insert([{ texto: nuevaNota }]);

    setNuevaNota("");
  };

  const completarNota = async (id) => {
    await supabase.from("notas_admin").delete().eq("id", id);
  };

  const actualizarStock = async (id, nuevoStock) => {
    if (nuevoStock < 0) return;

    setPerfumes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p)),
    );

    await supabase.from("perfumes").update({ stock: nuevoStock }).eq("id", id);
  };

  const filteredPerfumes = perfumes.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black text-white py-8 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-white/10 pb-6 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-serif italic text-amber-500">
              Panel de Control
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1">
              Gestión de Fragancias DF
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-red-500/20 hover:text-red-400 border border-white/10 px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto text-sm"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 border border-white/10 rounded-lg p-5 lg:sticky lg:top-8">
              <h2 className="text-lg text-white font-medium mb-4 flex items-center gap-2">
                📝 Nuevos Ingresos
              </h2>

              <form onSubmit={agregarNota} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="Anotar nuevos ingresos..."
                  value={nuevaNota}
                  onChange={(e) => setNuevaNota(e.target.value)}
                  className="flex-1 min-w-0 bg-black border border-white/10 text-white px-3 py-2 rounded-md focus:border-amber-500 outline-none text-sm placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  className="bg-amber-500 text-black w-10 h-10 flex items-center justify-center rounded-md hover:bg-amber-600 transition-colors shrink-0"
                >
                  <FaPlus size={14} />
                </button>
              </form>

              <div className="space-y-2 max-h-100 overflow-y-auto pr-1">
                {notas.length === 0 ? (
                  <p className="text-neutral-500 text-xs text-center py-4 bg-black/30 rounded border border-white/5 border-dashed">
                    No hay ingresos pendientes.
                  </p>
                ) : (
                  notas.map((nota) => (
                    <div
                      key={nota.id}
                      className="flex items-center justify-between bg-black border border-white/5 p-3 rounded-md group gap-3"
                    >
                      <span className="text-sm text-neutral-300 wrap-break-word">
                        {nota.texto}
                      </span>
                      <button
                        onClick={() => completarNota(nota.id)}
                        className="text-green-500 hover:text-black hover:bg-green-500 bg-green-500/10 p-2 rounded-md transition-all shrink-0"
                        title="Marcar como completado"
                      >
                        <FaCheck size={12} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-neutral-900 border border-amber-500/30 rounded-lg p-5 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
              <h2 className="text-lg text-white font-medium mb-2 flex items-center gap-2">
                <FaTag className="text-amber-500" /> Precio Global
              </h2>
              <p className="text-neutral-400 text-xs mb-4">
                Cambia el precio de{" "}
                <strong className="text-white">todos los perfumes</strong> al
                mismo tiempo.
              </p>

              <form
                onSubmit={handleUpdateGlobalPrice}
                className="flex flex-col sm:flex-row gap-3"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={precioGlobal}
                    onChange={(e) => setPrecioGlobal(e.target.value)}
                    className="w-full bg-black border border-white/10 text-white pl-8 pr-4 py-3 rounded-md focus:border-amber-500 outline-none text-base font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actualizandoPrecio}
                  className="bg-amber-500 text-black font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-md hover:bg-amber-600 transition disabled:opacity-50 whitespace-nowrap"
                >
                  {actualizandoPrecio ? "Actualizando..." : "Cambiar Precio"}
                </button>
              </form>
            </div>

            <div className="bg-neutral-900 border border-white/10 rounded-lg p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-4">
                <h2 className="text-lg text-white font-medium">
                  📦 Inventario y Stock
                </h2>

                <div className="relative w-full sm:w-64">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm" />
                  <input
                    type="text"
                    placeholder="Buscar perfume o marca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:border-amber-500 outline-none placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {loading ? (
                <p className="text-center text-neutral-500 py-8 text-sm animate-pulse">
                  Cargando inventario...
                </p>
              ) : (
                <div className="space-y-3 max-h-150 overflow-y-auto pr-1">
                  {filteredPerfumes.map((perfume) => (
                    <div
                      key={perfume.id}
                      className="flex flex-col bg-black border border-white/5 p-3 sm:p-4 rounded-lg gap-3 sm:gap-4"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-12 h-12 bg-neutral-900 rounded-md border border-white/5 flex items-center justify-center shrink-0 p-1">
                          <img
                            src={perfume.image_url}
                            alt={perfume.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-amber-500 text-[10px] uppercase tracking-wider truncate mb-0.5">
                            {perfume.brand}
                          </p>
                          <p className="text-white font-medium text-sm truncate">
                            {perfume.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-neutral-900 border border-white/10 rounded-md p-1 w-full">
                        <button
                          onClick={() =>
                            actualizarStock(
                              perfume.id,
                              (perfume.stock || 0) - 1,
                            )
                          }
                          className="w-12 h-10 flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition rounded text-xl font-bold"
                        >
                          -
                        </button>
                        <span
                          className={`flex-1 text-center font-bold text-base ${
                            perfume.stock > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {perfume.stock || 0}
                        </span>
                        <button
                          onClick={() =>
                            actualizarStock(
                              perfume.id,
                              (perfume.stock || 0) + 1,
                            )
                          }
                          className="w-12 h-10 flex items-center justify-center text-white hover:bg-white/10 active:bg-white/20 transition rounded text-xl font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
