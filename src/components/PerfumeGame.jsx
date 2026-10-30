import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { FaSprayCan } from "react-icons/fa";

export function PerfumeGame({ isOpen, onClose, onNextGame }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ top: "50%", left: "50%" });

  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const movePerfume = () => {
    if (!isPlaying) return;
    const top = Math.floor(Math.random() * 75) + 15;
    const left = Math.floor(Math.random() * 75) + 15;
    setPosition({ top: `${top}%`, left: `${left}%` });
    setScore((prev) => prev + 1);
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlaying(true);
    movePerfume();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md h-125 bg-neutral-950 border border-amber-500/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="flex justify-between items-center p-5 border-b border-white/10 z-10 bg-neutral-900/50">
          <h2 className="text-amber-500 font-serif italic text-xl tracking-wide">
            Fragancia Secreta
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={onNextGame}
              className="text-white/40 hover:text-amber-500 transition-colors cursor-pointer"
              title="Cambiar juego"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <button
              onClick={onClose}
              className="text-white/40 hover:text-amber-500 transition-colors cursor-pointer"
            >
              <IoClose size={26} />
            </button>
          </div>
        </div>

        <div className="flex justify-between p-5 text-white font-mono text-sm tracking-widest z-10 absolute top-16 w-full pointer-events-none">
          <span>PUNTOS: {score}</span>
          <span
            className={
              timeLeft <= 5 && isPlaying
                ? "text-red-500 animate-pulse"
                : "text-amber-500"
            }
          >
            TIEMPO: {timeLeft}s
          </span>
        </div>

        <div className="relative flex-1 cursor-crosshair bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-neutral-900 to-black">
          {!isPlaying && timeLeft > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 p-6 text-center">
              <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                Encontraste el perfume oculto <br />
                <br />
                Atrapá la fragancia la mayor cantidad de veces posible en 15
                segundos.
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.4)]"
              >
                Comenzar
              </button>
            </div>
          )}

          {timeLeft === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 p-6 text-center">
              <h3 className="text-3xl text-white font-serif italic mb-2">
                ¡Tiempo!
              </h3>
              <p className="text-amber-500 text-5xl font-bold mb-8">{score}</p>
              <button
                onClick={startGame}
                className="px-6 py-2.5 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black text-xs tracking-[0.2em] uppercase font-bold rounded-full transition-colors"
              >
                Reintentar
              </button>
            </div>
          )}

          {isPlaying && (
            <button
              onClick={movePerfume}
              style={{ top: position.top, left: position.left }}
              className="absolute w-16 h-16 -ml-8 -mt-8 text-amber-500 flex items-center justify-center transition-all duration-100 ease-out hover:scale-125 active:scale-90 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]"
            >
              <FaSprayCan size={40} />
            </button>
          )}
        </div>

        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    </div>,
    document.body,
  );
}
