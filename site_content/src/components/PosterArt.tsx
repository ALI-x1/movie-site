import type { Movie } from "../data/movies";

/**
 * Typographic art poster for titles without photographic posters —
 * gradient canvas, giant faded initial, ornaments.
 */
export default function PosterArt({ movie }: { movie: Movie }) {
  const [from, to] = movie.gradient;
  const initial = movie.title.trim().charAt(0);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute -top-12 -start-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -end-10 h-48 w-48 rounded-full bg-black/30 blur-2xl" />

      {/* ornament rings */}
      <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full border border-white/15" />
      <div className="absolute left-1/2 top-12 h-12 w-12 -translate-x-1/2 rounded-full border border-white/10" />

      {/* giant initial letter */}
      <span
        className="absolute -bottom-5 -end-1 select-none font-black leading-none text-white/[0.09]"
        style={{ fontSize: "9.5rem" }}
      >
        {initial}
      </span>

      {/* centered title */}
      <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
        <span className="text-lg font-extrabold leading-relaxed text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
          {movie.title}
        </span>
      </div>
    </div>
  );
}
