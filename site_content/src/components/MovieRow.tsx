import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import type { Movie } from "../data/movies";
import { EASE } from "../lib/motion";
import MovieCard from "./MovieCard";

interface Props {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  movies: Movie[];
  onOpen: (m: Movie) => void;
  onToggleSave: (m: Movie) => void;
  isSaved: (id: number) => boolean;
}

export default function MovieRow({
  id,
  title,
  subtitle,
  icon: Icon,
  movies,
  onOpen,
  onToggleSave,
  isSaved,
}: Props) {
  const track = useRef<HTMLDivElement>(null);

  // RTL: "next" means scrolling visually to the left (negative left)
  const scroll = (dir: "next" | "prev") => {
    const el = track.current;
    if (!el) return;
    const amt = el.clientWidth * 0.82;
    el.scrollBy({ left: dir === "next" ? -amt : amt, behavior: "smooth" });
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative py-7"
    >
      <div className="mx-auto mb-5 flex max-w-[1440px] items-end justify-between px-4 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-crimson-500 to-flame-500" />
          <div>
            <h2 className="flex items-center gap-2 text-xl font-extrabold md:text-2xl">
              {title}
              {Icon && <Icon className="h-5 w-5 text-flame-400" />}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs text-zinc-500 md:text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scroll("prev")}
            aria-label="قبلی"
            className="rounded-full bg-white/5 p-2.5 ring-1 ring-white/10 transition hover:bg-crimson-500/20 hover:ring-crimson-500/50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("next")}
            aria-label="بعدی"
            className="rounded-full bg-white/5 p-2.5 ring-1 ring-white/10 transition hover:bg-crimson-500/20 hover:ring-crimson-500/50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-proximity gap-3.5 overflow-x-auto scroll-smooth px-4 py-2 lg:px-10"
        >
          {movies.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              onOpen={onOpen}
              saved={isSaved(m.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 end-0 hidden w-20 bg-gradient-to-r from-night-950 to-transparent md:block" />
        <div className="pointer-events-none absolute inset-y-0 start-0 hidden w-20 bg-gradient-to-l from-night-950 to-transparent md:block" />
      </div>
    </motion.section>
  );
}
