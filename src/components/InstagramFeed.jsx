import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";

export function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const BEHOLD_URL = import.meta.env.VITE_BEHOLD_FEED_URL;

        const response = await fetch(BEHOLD_URL);
        const data = await response.json();

        setPosts(data.posts ? data.posts.slice(0, 6) : []);
      } catch (error) {
        console.error("Error cargando Instagram:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="bg-black py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <a
            href="https://www.instagram.com/fraganciass_df"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-500 transition-colors group"
          >
            <FaInstagram
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm tracking-[0.2em] uppercase font-medium">
              Seguinos en Instagram
            </span>
          </a>
          <p className="text-neutral-600 text-xs mt-2">@fraganciass_df</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-sm bg-neutral-900 border border-white/5"
            >
              <img
                src={post.mediaUrl}
                alt="Instagram post"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FaInstagram size={24} className="text-amber-500" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
