const featuredPerfumes = [
  {
    id: 1,
    name: "Oud Wood",
    brand: "Tom Ford",
    price: "$210",
    image: "/images/Perfume1.jfif",
    notes: "Madera, Especias",
  },
  {
    id: 1,
    name: "Oud Wood",
    brand: "Tom Ford",
    price: "$210",
    image: "/images/Perfume1.jfif",
    notes: "Madera, Especias",
  },
  {
    id: 1,
    name: "Oud Wood",
    brand: "Tom Ford",
    price: "$210",
    image: "/images/Perfume1.jfif",
    notes: "Madera, Especias",
  },
  {
    id: 1,
    name: "Oud Wood",
    brand: "Tom Ford",
    price: "$210",
    image: "/images/Perfume1.jfif",
    notes: "Madera, Especias",
  },
];

export function FeaturedSection() {
  return (
    <section id="featured" className="bg-black py-24 px-10">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl text-white mb-12 text-center">
          Los más <span className="italic text-amber-500">buscados</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredPerfumes.map((perfume) => (
            <div
              key={perfume.id}
              className="group relative overflow-hidden bg-neutral-900/50 border border-white/5 rounded-sm transition-all duration-500 hover:border-amber-500/50"
            >
              {/* Imagen del perfume */}
              <div className="aspect-3/4 p-8 flex items-center justify-center overflow-hidden">
                <img
                  src={perfume.image}
                  alt={perfume.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Info Overlay */}
              <div className="p-6 text-center">
                <p className="text-amber-500 text-xs tracking-widest uppercase mb-1">
                  {perfume.brand}
                </p>
                <h3 className="text-white text-xl font-serif mb-2">
                  {perfume.name}
                </h3>
                <p className="text-gray-400 text-sm italic mb-4">
                  {perfume.notes}
                </p>

                <button className="w-full py-2 bg-transparent border border-white/20 text-white text-xs tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                  VER DETALLES
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
