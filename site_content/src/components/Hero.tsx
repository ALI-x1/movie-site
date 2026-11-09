import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { BookmarkCheck, BookmarkPlus, Calendar, ChevronDown, Clock, Info, Play, Sparkles, Star, Tv } from "lucide-react";
import { useEffect, useState } from "react";
import { typeLabel, type Movie } from "../data/movies";
import { useCatalog } from "../data/catalog";
import { faRating, toFa } from "../lib/format";
import { EASE } from "../lib/motion";
import { cn } from "../utils/cn";

interface Props {
  onOpen: (m: Movie) => void;
  onPlay: (m: Movie) => void;
  onToggleSave: (m: Movie) => void;
  isSaved: (id: number) => boolean;
}

export default function Hero({ onOpen, onPlay, onToggleSave, isSaved }: Props) {
  const { heroSlides } = useCatalog();
  const [index, setIndex] = useState(0);
  const slide = heroSlides[index] ?? heroSlides[0];
  const saved = slide ? isSaved(slide.id) : false;

  useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % Math.max(1, heroSlides.length)),
      7000
    );
    return () => clearInterval(t);
  }, [index]);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 160]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  if (!slide) return <div className="h-[70vh]" />;

  return (
    <section
      id="home"
      className="relative h-[100svh] min-h-[640px] overflow-hidden"
    >
      {/* backdrop parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <AnimatePresence>
          <motion.img
            key={slide.id}
            src={slide.backdrop ?? slide.poster}
            alt={slide.title}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1.03 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
          />
        </AnimatePresence>
      </motion.div>

      {/* cinematic gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/25 to-night-950/30" />
      <div className="absolute inset-0 bg-gradient-to-l from-night-950/95 via-night-950/40 to-transparent" />

      {/* content */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-24 lg:px-10 lg:pb-28"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.35 } }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
              className="mb-5 flex flex-wrap items-center gap-2"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold ring-1 ring-white/15 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-flame-400" />
                پرده‌پلاس اورجینال
              </span>
              <span className="rounded-full bg-crimson-500/20 px-3.5 py-1.5 text-xs font-bold text-crimson-300 ring-1 ring-crimson-500/30 backdrop-blur-md">
                {typeLabel(slide)}
              </span>
              {slide.age && (<span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/15 backdrop-blur-md">{slide.age}</span>)}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
              className="text-4xl font-black leading-[1.15] drop-shadow-2xl sm:text-6xl lg:text-7xl"
            >
              {slide.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300"
            >
              <span className="flex items-center gap-1.5 font-bold text-flame-400">
                <Star className="h-4 w-4 fill-flame-400" />
                {faRating(slide.rating)}
              </span>
              {slide.year > 0 && (<span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-zinc-500" />{toFa(slide.year)}</span>)}
              {slide.duration && (<span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-zinc-500" />{slide.duration}</span>)}
              {slide.type === "series" && slide.seasons && (
                <span className="flex items-center gap-1.5">
                  <Tv className="h-4 w-4 text-zinc-500" />
                  {toFa(slide.seasons ?? 1)} فصل
                </span>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.38 }}
              className="mt-5 max-w-xl text-sm leading-8 text-zinc-300/95 sm:text-base line-clamp-3"
            >
              {slide.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.46 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => onPlay(slide)}
                className="glow-primary flex items-center gap-2.5 rounded-full bg-gradient-to-l from-crimson-600 via-crimson-500 to-flame-500 px-8 py-3.5 text-sm font-extrabold transition-transform duration-300 hover:scale-105 active:scale-95"
              >
                <Play className="h-5 w-5 fill-white" />
                پخش {typeLabel(slide)}
              </button>
              <button
                onClick={() => onOpen(slide)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-sm font-bold ring-1 ring-white/20 backdrop-blur-md transition hover:bg-white/20"
              >
                <Info className="h-5 w-5" />
                اطلاعات بیشتر
              </button>
              <button
                onClick={() => onToggleSave(slide)}
                aria-label="افزودن به لیست من"
                className={cn(
                  "rounded-full p-3.5 ring-1 backdrop-blur-md transition hover:scale-110",
                  saved
                    ? "bg-flame-500/20 text-flame-400 ring-flame-500/40"
                    : "bg-white/10 ring-white/20 hover:bg-white/20"
                )}
              >
                {saved ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <BookmarkPlus className="h-5 w-5" />
                )}
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* slide indicators */}
        <div className="mt-12 flex items-center gap-2.5">
          {heroSlides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`اسلاید ${toFa(i + 1)}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-500",
                i === index
                  ? "w-12 bg-gradient-to-l from-crimson-500 to-flame-500"
                  : "w-6 bg-white/25 hover:bg-white/40"
              )}
            />
          ))}
          <span className="ms-2 text-xs font-bold text-zinc-400">
            {toFa(index + 1)} <span className="text-zinc-600">/</span>{" "}
            {toFa(heroSlides.length)}
          </span>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-zinc-500 lg:flex">
        <span className="text-[10px] font-semibold tracking-widest">
          اسکرول کنید
        </span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </div>
    </section>
  );
}
