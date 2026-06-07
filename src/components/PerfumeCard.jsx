export default function PerfumeCard({ perfume }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-3/4 mb-6 overflow-hidden bg-[#1A1A1A] rounded-sm flex items-center justify-center border border-white/5">
        <img
          src={perfume.image}
          alt={perfume.name}
          className="w-full h-full object-contain p-6 transition-transform duration-1000 group-hover:scale-110 mix-blend-lighten"
        />

        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="text-left px-1">
        <div className="flex justify-between items-baseline mb-1">
          <h3 className="text-white font-serif text-lg tracking-wide group-hover:text-amber-500 transition-colors uppercase">
            {perfume.name}
          </h3>
          <div className="h-px bg-amber-500/30 grow mx-4 self-center" />{" "}
          <span className="text-amber-500 text-[11px] font-semibold">$120</span>
        </div>

        <p className="text-[9px] text-neutral-500 tracking-[0.25em] uppercase leading-relaxed">
          {perfume.notes}
        </p>
      </div>
    </div>
  );
}
