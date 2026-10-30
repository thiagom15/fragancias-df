import { useState, useEffect } from "react";
import { PerfumeGame } from "./PerfumeGame";
import { SnakeGame } from "./SnakeGame";

export function MiniGameModal({ isOpen, onClose }) {
  const [currentGame, setCurrentGame] = useState("perfume");

  useEffect(() => {
    if (!isOpen) setCurrentGame("perfume");
  }, [isOpen]);

  const toggleGame = () => {
    setCurrentGame((prev) => (prev === "perfume" ? "snake" : "perfume"));
  };

  return (
    <>
      <PerfumeGame
        isOpen={isOpen && currentGame === "perfume"}
        onClose={onClose}
        onNextGame={toggleGame}
      />
      <SnakeGame
        isOpen={isOpen && currentGame === "snake"}
        onClose={onClose}
        onNextGame={toggleGame}
      />
    </>
  );
}
