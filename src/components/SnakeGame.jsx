import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { FaGamepad, FaApple } from "react-icons/fa";

const GRID_SIZE = 15;
const INITIAL_SNAKE = [{ x: 7, y: 7 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export function SnakeGame({ isOpen, onClose, onNextGame }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (
        !snake.some(
          (segment) => segment.x === newFood.x && segment.y === newFood.y,
        )
      )
        break;
    }
    setFood(newFood);
  }, [snake]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = { x: head.x + direction.x, y: head.y + direction.y };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y,
          )
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((prev) => prev + 10);
          generateFood();
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, SPEED);
    return () => clearInterval(interval);
  }, [isPlaying, direction, food, gameOver, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying || gameOver) return;
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
        ].includes(e.key)
      )
        e.preventDefault();

      switch (e.key) {
        case "ArrowUp":
        case "w":
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
        case "s":
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
        case "a":
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
        case "d":
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isPlaying, gameOver]);

  const handleTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    if (!isPlaying || gameOver) return;
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };
    const deltaX = touchEnd.x - touchStart.current.x;
    const deltaY = touchEnd.y - touchStart.current.y;

    if (Math.abs(deltaX) < 20 && Math.abs(deltaY) < 20) return;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0 && direction.x === 0) setDirection({ x: 1, y: 0 });
      else if (deltaX < 0 && direction.x === 0) setDirection({ x: -1, y: 0 });
    } else {
      if (deltaY > 0 && direction.y === 0) setDirection({ x: 0, y: 1 });
      else if (deltaY < 0 && direction.y === 0) setDirection({ x: 0, y: -1 });
    }
  };

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    generateFood();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-neutral-950 border border-amber-500/30 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(245,158,11,0.15)]">
        <div className="flex justify-between items-center p-5 border-b border-white/10 z-10 bg-neutral-900/50">
          <h2 className="text-amber-500 font-serif italic text-xl tracking-wide flex items-center gap-2">
            <FaGamepad /> Snake Secreto
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

        <div className="flex justify-between p-4 text-white font-mono text-sm tracking-widest bg-black/40">
          <span>PUNTOS: {score}</span>
        </div>

        <div
          className="relative aspect-square w-full bg-neutral-950 p-2 touch-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="w-full h-full relative border border-white/10"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {snake.map((segment, index) => (
              <div
                key={index}
                className={`w-full h-full rounded-sm ${index === 0 ? "bg-amber-500 z-10" : "bg-amber-500/60"}`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                }}
              />
            ))}
            <div
              className="w-full h-full flex items-center justify-center text-red-500"
              style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1 }}
            >
              <FaApple className="w-[80%] h-[80%]" />
            </div>
          </div>

          {!isPlaying && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20 p-6 text-center">
              {gameOver ? (
                <>
                  <h3 className="text-3xl text-red-500 font-serif italic mb-2">
                    ¡Game Over!
                  </h3>
                  <p className="text-amber-500 text-5xl font-bold mb-8">
                    {score}
                  </p>
                  <button
                    onClick={startGame}
                    className="px-6 py-2.5 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black text-xs tracking-[0.2em] uppercase font-bold rounded-full transition-colors"
                  >
                    Reintentar
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                    Encontraste otro juego oculto. <br />
                    <br />
                    <span className="hidden sm:inline">
                      Usá las{" "}
                      <strong className="text-white">
                        flechas del teclado
                      </strong>{" "}
                      para moverte.
                    </span>
                    <span className="sm:hidden">
                      Usá{" "}
                      <strong className="text-white">
                        el dedo para deslizar
                      </strong>{" "}
                      y moverte.
                    </span>
                  </p>
                  <button
                    onClick={startGame}
                    className="px-8 py-3 bg-amber-500 text-black font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  >
                    Comenzar
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />
      </div>
    </div>,
    document.body,
  );
}
