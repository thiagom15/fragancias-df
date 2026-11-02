import { FaMars, FaVenus } from "react-icons/fa";

export function GenderGlobe({ isMale, className = "" }) {
  return (
    <div
      className={`bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 flex items-center justify-center shadow-lg ${className}`}
    >
      {isMale === true && (
        <FaMars className="text-blue-400 text-[10px] sm:text-xs" />
      )}

      {isMale === false && (
        <FaVenus className="text-pink-400 text-[10px] sm:text-xs" />
      )}

      {isMale === null && (
        <div className="flex items-center gap-1">
          <FaMars className="text-blue-400 text-[10px] sm:text-xs" />
          <div className="w-px h-2.5 bg-white/20"></div>
          <FaVenus className="text-pink-400 text-[10px] sm:text-xs" />
        </div>
      )}
    </div>
  );
}
