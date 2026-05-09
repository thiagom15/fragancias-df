import { useEffect, useState } from "react";
import home from "../home/home.png";
import CatalogueButton from "../../components/CatalogueButton";
import FlechaSlideHome from "../../components/FlechaSlideHome";
import { WhatsAppButton } from "../../components/WhatsAppButton";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FeaturedSection } from "../../components/FeaturedPerfumes";

export default function HomePage() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 120,
    fullScreen: { enable: false },
    particles: {
      color: { value: "#f59e0b" },
      move: {
        enable: true,
        speed: 0.4,
        direction: "top-right",
        outModes: { default: "out" },
      },
      number: {
        density: { enable: true, area: 800 },
        value: 60,
      },
      opacity: { value: 0.18 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: true,
  };

  return (
    <div className="bg-black w-full">
      {/* Inicio Home */}
      <section className="relative h-screen w-full flex items-center px-10 overflow-hidden">
        <WhatsAppButton />

        {/* Fondo y Capas Inferiores */}
        <div className="absolute inset-0">
          <img
            src={home}
            className="w-full h-full object-cover z-0"
            alt="Home Perfume"
          />
          {/* Overlay con degradado hacia el negro al final para suavizar la transición */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black" />

          {init && (
            <Particles
              id="tsparticles"
              options={particlesOptions}
              className="absolute inset-0 z-10"
            />
          )}
        </div>

        <FlechaSlideHome />

        {/* Contenido */}
        <div className="relative z-20 max-w-xl lg:ml-20">
          <p className="tracking-[0.3em] text-sm mb-4 text-amber-500">
            COLECCIÓN EXCLUSIVA 2026
          </p>

          <h1 className="font-serif text-6xl text-white leading-tight mb-4">
            El arte de la{" "}
            <span className="italic text-amber-500">fragancia</span>
          </h1>
          <p className="tracking-[0.3em] text-white text-sm mb-8">
            EXTRACTOS ÁRABES Y DE DISEÑADOR
          </p>

          <CatalogueButton />
        </div>
      </section>

      {/* NUEVA SECCIÓN DE PERFUMES DESTACADOS */}
      <FeaturedSection />
    </div>
  );
}
