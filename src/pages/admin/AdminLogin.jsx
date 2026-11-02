import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Email o contraseña incorrectos.");
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-neutral-900 border border-white/10 p-8 rounded-lg shadow-2xl"
      >
        <h2 className="text-2xl text-white font-serif italic mb-6 text-center">
          Acceso Admin
        </h2>

        {error && (
          <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
        )}

        <label className="block mb-4">
          <span className="text-amber-500 text-[10px] uppercase tracking-widest">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 bg-black border border-white/10 text-white px-4 py-3 rounded focus:border-amber-500 outline-none text-sm"
            placeholder="tu@email.com"
          />
        </label>

        <label className="block mb-6">
          <span className="text-amber-500 text-[10px] uppercase tracking-widest">
            Contraseña
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 bg-black border border-white/10 text-white px-4 py-3 rounded focus:border-amber-500 outline-none text-sm"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-black font-bold uppercase tracking-widest py-3 rounded hover:bg-amber-600 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
