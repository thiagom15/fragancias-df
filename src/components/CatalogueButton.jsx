import { useNavigate } from "react-router-dom";

export default function CatalogueButton() {
  const navigate = useNavigate();

  return (
    <div className="flex">
      <div className="relative group">
        <div className="absolute -inset-1 bg-amber-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <button
          onClick={() => navigate("/catalogue")}
          className="relative inline-block p-px font-semibold leading-6 text-amber-500 bg-neutral-900 cursor-pointer rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.6)]"
        >
          <span className="absolute inset-0 rounded-2xl bg-linear-to-r from-amber-500 via-amber-200 to-amber-500 p-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

          <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
            <div className="relative z-10 flex items-center space-x-3">
              <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-amber-500">
                Explorar catálogo
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-amber-500"
              >
                <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
              </svg>
            </div>
          </span>
        </button>
      </div>
    </div>
  );
}
