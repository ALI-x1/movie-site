import { motion } from "framer-motion";
import { BadgeCheck, X } from "lucide-react";
import { useEffect } from "react";
import { typeLabel, type Movie } from "../data/movies";
import { EASE } from "../lib/motion";

interface Props {
  movie: Movie;
  onClose: () => void;
}

export default function PlayerModal({ movie, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] bg-night-950/95 backdrop-blur-xl"
    >
      <div className="flex h-full flex-col">
        <div className="mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between px-4 py-5">
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full bg-crimson-500/15 px-3 py-1.5 text-xs font-bold text-crimson-300 ring-1 ring-crimson-500/30 sm:flex">
              <BadgeCheck className="h-3.5 w-3.5" />
              پیش‌نمایش رسمی
            </span>
            <h3 className="text-sm font-bold sm:text-lg">
              {movie.title}{" "}
              <span className="text-xs font-medium text-zinc-500">
                ({typeLabel(movie)})
              </span>
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="rounded-full bg-white/5 p-2.5 ring-1 ring-white/15 transition hover:scale-110 hover:bg-white/15"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="glow-primary w-full max-w-6xl overflow-hidden rounded-3xl bg-black ring-1 ring-white/15"
          >
            {movie.trailerUrl ? (
              <video
                src={movie.trailerUrl}
                poster={movie.backdrop ?? movie.poster}
                controls
                autoPlay
                playsInline
                muted
                preload="metadata"
                className="aspect-video w-full"
              />
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center rounded-3xl bg-black/50 p-12 text-center text-zinc-500">
                <p className="text-sm">تریلر برای این عنوان ثبت نشده است.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
