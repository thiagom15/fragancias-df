export default function PerfumeCard({ perfume }) {
  return (
    <div
      className="
      group
      bg-neutral-950
      rounded-2xl
      overflow-hidden
      transition-all
      duration-500
      hover:-translate-y-1
      hover:shadow-2xl
      "
    >
      {/* CONTENEDOR IMAGEN */}
      <div className="relative overflow-hidden bg-black">
        {/* IMAGEN */}
        <img
          src={perfume.image}
          loading="lazy"
          className="
          block
          w-full
          h-80
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.02]
          "
        />

        {/* OVERLAY */}
        <div
          className="
            absolute
            inset-0
            bg-black/40
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-500
            flex
            items-center
            justify-center
          "
        >
          <button
            className="
              border
              border-amber-500
              text-amber-500
              px-4
              py-2
              rounded-full
              text-sm
              tracking-widest
              hover:bg-amber-500
              hover:text-black
              transition-all
            "
          >
            VER PERFUME
          </button>
        </div>
      </div>

      {/* TEXTO */}
      <div className="p-5">
        <h2 className="text-xl font-serif mb-2">{perfume.name}</h2>

        <p className="text-sm text-neutral-400 leading-relaxed">
          {perfume.notes.join(" • ")}
        </p>
      </div>
    </div>
  );
}
