import { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      const footer = document.getElementById("footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        setIsFooterVisible(footerRect.top < window.innerHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showButton = isVisible && !isFooterVisible;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Volver arriba"
      className={`fixed bottom-17.5 right-4 sm:bottom-22 sm:right-6 z-30 p-2.5 sm:p-4 rounded-full bg-neutral-900/80 backdrop-blur-md border border-amber-500/40 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-300 hover:bg-amber-500 hover:text-black hover:scale-110 active:scale-95 flex items-center justify-center group ${
        showButton
          ? "opacity-100 translate-y-0 visible"
          : "opacity-0 translate-y-10 invisible pointer-events-none"
      }`}
    >
      <FaChevronUp className="text-[16px] sm:text-[20px] transition-transform duration-300 group-hover:-translate-y-1" />
    </button>
  );
}
