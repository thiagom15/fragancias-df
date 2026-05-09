import { useEffect, useState } from "react";

export default function FlechaSlideHome() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.getElementById("footer");
      const featured = document.getElementById("featured");

      if (!footer) return;
      if (!featured) return;

      const footerRect = footer.getBoundingClientRect();
      const featuredRect = featured.getBoundingClientRect();

      // Detecta si el footer esta visible
      const footerVisible = footerRect.top < window.innerHeight;
      const featuredVisible = featuredRect.top < window.innerHeight;

      setVisible(!footerVisible);
      setVisible(!featuredVisible);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-500 z-10 ${
        visible ? "opacity-75" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        className="animate-bounce cursor-pointer"
        onClick={() =>
          window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth",
          })
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-amber-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7-7-7"
          />
        </svg>
      </button>
    </div>
  );
}
