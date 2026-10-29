import { useEffect, useState } from "react";
import home from "../../assets/home.avif";
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
    <div className="bg-black w-full overflow-x-hidden relative">
      <section className="relative h-screen w-full flex items-center px-6 sm:px-10 lg:px-20 overflow-hidden">
        <WhatsAppButton />

        <div className="absolute inset-0">
          <img
            src={home}
            className="w-full h-full object-cover z-0"
            alt="DF Fragancias Home"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black" />

          {init && (
            <Particles
              id="tsparticles"
              options={particlesOptions}
              className="absolute inset-0 z-10"
            />
          )}
        </div>

        <FlechaSlideHome />

        <div className="relative z-20 max-w-xl w-full mx-auto sm:mx-0 text-center sm:text-left">
          <p className="tracking-[0.25em] sm:tracking-[0.3em] text-xs sm:text-sm mb-3 sm:mb-4 text-amber-500 font-medium">
            COLECCIÓN EXCLUSIVA 2026
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
            El arte de la{" "}
            <span className="italic text-amber-500">fragancia</span>
          </h1>

          <p className="tracking-[0.2em] sm:tracking-[0.3em] text-neutral-300 text-xs sm:text-sm mb-8 uppercase">
            EXTRACTOS ÁRABES Y DE DISEÑADOR
          </p>

          <div className="flex justify-center sm:justify-start">
            <CatalogueButton />
          </div>
        </div>
      </section>

      <FeaturedSection />
    </div>
  );
}
