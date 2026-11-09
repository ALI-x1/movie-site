import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Play, Star } from "lucide-react";
import { type Movie, typeLabel } from "../data/movies";
import { faRating, toFa } from "../lib/format";
import { cn } from "../utils/cn";
import PosterArt from "./PosterArt";

interface Props {
  movie: Movie;
  onOpen: (m: Movie) => void;
  saved?: boolean;
  onToggleSave?: (m: Movie) => void;
  fluid?: boolean;
  widthClass?: string;
}

export default function MovieCard({
  movie,
  onOpen,
  saved,
  onToggleSave,
  fluid,
  widthClass,
}: Props) {
  const [broken, setBroken] = useState(false);
  const parts = [
    movie.year > 0 ? toFa(movie.year) : null,
    movie.seasons && movie.seasons > 1 ? `فصل ${toFa(movie.seasons)}` : null,
    typeLabel(movie),
  ].filter(Boolean);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn(
        "group relative snap-start",
        fluid
          ? "w-full"
          : cn("shrink-0", widthClass ?? "w-[144px] sm:w-[172px] lg:w-[192px]")
      )}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(movie)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(movie)}
        className="card-sheen relative aspect-[2/3] cursor-pointer overflow-hidden rounded-2xl bg-night-800 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-crimson-500/60 group-hover:shadow-[0_24px_60px_-16px_rgba(255,59,78,0.45)]"
      >
        {movie.poster && !broken ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            decoding="async"
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <PosterArt movie={movie} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/15 transition-opacity duration-500" />

        {movie.badge && (
          <span className="absolute start-2 top-2 z-10 rounded-full bg-crimson-500/90 px-2.5 py-1 text-[10px] font-bold text-white shadow-lg backdrop-blur-sm">
            {movie.badge}
          </span>
        )}

        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(movie);
            }}
            aria-label="افزودن به لیست"
            className="absolute end-2 top-2 z-20 rounded-full bg-black/45 p-2 text-white ring-1 ring-white/20 backdrop-blur-md transition hover:scale-110 hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100"
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-flame-400" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        )}

        {/* play on hover */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="scale-75 rounded-full bg-white/15 p-4 ring-1 ring-white/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-100">
            <Play className="h-6 w-6 fill-white text-white" />
          </span>
        </div>

        {/* bottom info */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 text-start">
          <h3 className="line-clamp-1 text-sm font-bold text-white">
            {movie.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-zinc-300">
            <span className="flex items-center gap-1 font-bold text-flame-400">
              <Star className="h-3 w-3 fill-flame-400" />
              {faRating(movie.rating)}
            </span>
            {parts.map((p, i) => (
              <>
                {i > 0 && <span className="h-1 w-1 rounded-full bg-zinc-500" />}
                <span>{p}</span>
              </>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
