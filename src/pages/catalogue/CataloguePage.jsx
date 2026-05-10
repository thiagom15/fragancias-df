import { perfumes } from "./Perfumes";
import PerfumeCard from "../../components/PerfumeCard";

export default function Catalogue() {
  return (
    <div className="min-h-screen bg-black text-white px-10 py-32">
      <section className="bg-black py-20 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          {" "}
          {/* Contenedor más estrecho para centrar el diseño */}
          <h2 className="font-serif text-3xl text-white mb-16 text-center tracking-widest">
            CATÁLOGO{" "}
          </h2>
          {/* Grid con gap-y-20 para la separación que pediste entre filas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        </div>
      </section>
      <section className="bg-black py-20 px-4 md:px-20">
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
            {perfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
