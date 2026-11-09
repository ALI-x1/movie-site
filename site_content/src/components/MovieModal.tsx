import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  Play,
  Star,
  Tv,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { typeLabel, type Movie } from "../data/movies";
import { useCatalog } from "../data/catalog";
import { faRating, toFa } from "../lib/format";
import { EASE } from "../lib/motion";
import { cn } from "../utils/cn";
import PosterArt from "./PosterArt";

interface Props {
  movie: Movie;
  onClose: () => void;
  onPlay: (m: Movie) => void;
  onToggleSave: (m: Movie) => void;
  isSaved: (id: number) => boolean;
  onSelect: (m: Movie) => void;
}

const qRank = (q: string) => ["480p", "720p", "1080p", "2160p"].indexOf((q || "").toLowerCase());

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-bold ring-1 transition",
        active
          ? "bg-gradient-to-l from-crimson-600 to-flame-500 text-white ring-transparent"
          : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10"
      )}
    >
      {children}
    </button>
  );
}

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 animate-pulse rounded-full bg-white/10" style={{ width: `${95 - i * 12}%` }} />
      ))}
    </div>
  );
}

export default function MovieModal({ movie, onClose, onPlay, onToggleSave, isSaved, onSelect }: Props) {
  const { movies } = useCatalog();
  const saved = isSaved(movie.id);
  const [kind, setKind] = useState<"all" | "dub" | "sub">("all");
  const [season, setSeason] = useState<number | null>(null);
  const [qualityFilter, setQualityFilter] = useState<string | "all">("all");
  const [limit, setLimit] = useState(12);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setKind("all");
    setSeason(null);
    setQualityFilter("all");
    setLimit(12);
  }, [movie.pid]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const dls = movie.downloads ?? [];
  const seasons = [...new Set(dls.map((d) => d.season).filter((s): s is number => typeof s === "number"))].sort((a, b) => a - b);
  const episodeCount = new Set(dls.filter((d) => d.episode != null).map((d) => `${d.season}-${d.episode}`)).size;
  const hasDub = dls.some((d) => d.isDubbed);
  const hasSub = dls.some((d) => !d.isDubbed);
  const activeSeason = season ?? seasons[0] ?? null;
  const qualities = [...new Set(dls.map((d) => d.quality).filter(Boolean))].sort(
    (a, b) => qRank(b) - qRank(a),
  );
  const rows = dls
    .filter(
      (d) =>
        (kind === "all" || (kind === "dub") === d.isDubbed) &&
        (activeSeason === null || d.season === activeSeason) &&
        (qualityFilter === "all" || d.quality === qualityFilter),
    )
    .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0) || qRank(b.quality) - qRank(a.quality));

  const byGenre = movies.filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)));
  const rest = movies.filter((m) => m.id !== movie.id && m.type === movie.type && !byGenre.includes(m));
  const similar = [...byGenre, ...rest].slice(0, 6);
  const headerImage = movie.backdrop ?? movie.poster;

  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(link);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("لینک را کپی کنید:", link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
    >
      <div className="absolute inset-0 bg-night-950/80 backdrop-blur-md" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-night-900 shadow-2xl ring-1 ring-white/10 sm:rounded-3xl"
      >
        {/* header */}
        <div className="relative h-56 shrink-0 sm:h-72">
          {headerImage ? (
            <img src={headerImage} alt={movie.title} className="h-full w-full object-cover object-top" />
          ) : (
            <PosterArt movie={movie} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/40 to-night-900/10" />
          <button
            onClick={onClose}
            aria-label="بستن"
            className="absolute end-4 top-4 rounded-full bg-black/50 p-2.5 ring-1 ring-white/20 backdrop-blur-md transition hover:scale-110 hover:bg-black/80"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-5 bottom-4 sm:inset-x-7">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-crimson-500/90 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">
                {typeLabel(movie)}
              </span>
              {movie.quality && (
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold ring-1 ring-white/20 backdrop-blur-sm">
                  {movie.quality}
                </span>
              )}
              {hasDub && (
                <span className="rounded-full bg-emerald-500/80 px-3 py-1 text-[11px] font-bold backdrop-blur-sm">دوبله فارسی</span>
              )}
            </div>
            <h2 className="text-2xl font-black leading-tight sm:text-4xl">{movie.title}</h2>
          </div>
        </div>

        {/* body */}
        <div className="space-y-6 overflow-y-auto px-5 py-6 sm:px-8">
          {/* meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm text-zinc-300">
            {movie.rating > 0 && (
              <span className="flex items-center gap-1.5 font-bold text-flame-400">
                <Star className="h-4 w-4 fill-flame-400" />
                {faRating(movie.rating)} <span className="text-[10px] font-semibold text-zinc-500">IMDb</span>
              </span>
            )}
            {movie.year > 0 && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-zinc-500" />
                {toFa(movie.year)}
              </span>
            )}
            {movie.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-zinc-500" />
                {movie.duration}
              </span>
            )}
            {seasons.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Tv className="h-4 w-4 text-zinc-500" />
                {toFa(seasons.length)} فصل · {toFa(episodeCount)} قسمت
              </span>
            )}
          </div>
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span key={g} className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-zinc-400">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => document.getElementById("dl-box")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="glow-primary flex items-center gap-2 rounded-full bg-gradient-to-l from-crimson-600 via-crimson-500 to-flame-500 px-6 py-3 text-sm font-extrabold transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <Download className="h-4 w-4" />
              دانلود
            </button>
            {movie.trailerUrl && (
              <button
                onClick={() => onPlay(movie)}
                className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 transition hover:bg-white/15"
              >
                <Play className="h-4 w-4 fill-white" />
                تریلر
              </button>
            )}
            <button
              onClick={() => onToggleSave(movie)}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold ring-1 transition",
                saved
                  ? "bg-flame-500/15 text-flame-400 ring-flame-500/40"
                  : "bg-white/5 text-zinc-200 ring-white/15 hover:bg-white/10"
              )}
            >
              {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {saved ? "در لیست شماست" : "افزودن به لیست"}
            </button>
          </div>

          {/* summary */}
          <div>
            <h3 className="mb-2 text-xs font-extrabold tracking-wide text-zinc-500">خلاصه داستان</h3>
            {!movie.detailed ? (
              <Skeleton lines={4} />
            ) : movie.description ? (
              <p className="text-sm leading-8 text-zinc-300">{movie.description}</p>
            ) : (
              <p className="text-sm text-zinc-500">خلاصه‌ای برای این عنوان ثبت نشده است.</p>
            )}
            {movie.detailError && (
              <p className="mt-3 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-300 ring-1 ring-red-500/20">
                دریافت اطلاعات کامل ناموفق بود. مودال را ببندید و دوباره باز کنید.
              </p>
            )}
          </div>

          {/* download box */}
          <div id="dl-box" className="scroll-mt-4 rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-extrabold">
                <Download className="h-4 w-4 text-flame-400" />
                لینک‌های دانلود
              </h3>
              {rows.length > 0 && <span className="text-[11px] text-zinc-500">{toFa(rows.length)} فایل</span>}
            </div>

            {!movie.detailed ? (
              <Skeleton lines={3} />
            ) : dls.length === 0 ? (
              <p className="text-sm text-zinc-500">لینک دانلودی برای این عنوان پیدا نشد.</p>
            ) : (
              <>
                {/* فیلتر کیفیت */}
                {qualities.length > 1 && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                    <Chip
                      active={qualityFilter === "all"}
                      onClick={() => {
                        setQualityFilter("all");
                        setLimit(12);
                      }}
                    >
                      همه کیفیت‌ها
                    </Chip>
                    {qualities.map((q) => (
                      <Chip
                        key={q}
                        active={qualityFilter === q}
                        onClick={() => {
                          setQualityFilter(q);
                          setLimit(12);
                        }}
                      >
                        {q.toUpperCase()}
                      </Chip>
                    ))}
                  </div>
                )}

                {/* فیلتر دوبله / زیرنویس */}
                {(hasDub || hasSub) && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                    <Chip active={kind === "all"} onClick={() => setKind("all")}>
                      همه
                    </Chip>
                    {hasDub && (
                      <Chip active={kind === "dub"} onClick={() => setKind("dub")}>
                        دوبله فارسی
                      </Chip>
                    )}
                    {hasSub && (
                      <Chip active={kind === "sub"} onClick={() => setKind("sub")}>
                        زیرنویس فارسی
                      </Chip>
                    )}
                  </div>
                )}

                {/* انتخاب فصل (سریال) */}
                {seasons.length > 1 && (
                  <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto pb-1">
                    {seasons.map((s) => (
                      <Chip
                        key={s}
                        active={activeSeason === s}
                        onClick={() => {
                          setSeason(s);
                          setLimit(12);
                        }}
                      >
                        فصل {toFa(s)}
                      </Chip>
                    ))}
                  </div>
                )}

                <ul className="space-y-2">
                  {rows.slice(0, limit).map((d, i) => (
                    <li key={`${d.link}-${i}`} className="flex items-center gap-2 rounded-xl bg-night-800/70 p-2.5 ring-1 ring-white/5">
                      <span className="shrink-0 rounded-lg bg-crimson-500/90 px-2 py-1 text-[11px] font-black">
                        {(d.quality || "").toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-bold text-zinc-200">
                          {d.episode != null
                            ? `فصل ${toFa(d.season ?? activeSeason)} · قسمت ${toFa(d.episode)}`
                            : movie.title}
                        </p>
                        <p className="truncate text-[10px] text-zinc-500">
                          {d.isDubbed ? "دوبله فارسی" : "زیرنویس فارسی"} ·
                          <span dir="ltr">{d.fileName}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => copy(d.link)}
                        aria-label="کپی لینک"
                        className="shrink-0 rounded-lg bg-white/5 p-2 text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10"
                      >
                        {copied === d.link ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                      <a
                        href={d.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex shrink-0 items-center gap-1 rounded-lg bg-gradient-to-l from-crimson-600 to-flame-500 px-3 py-2 text-[11px] font-extrabold"
                      >
                        <Download className="h-3.5 w-3.5" />
                        دانلود
                      </a>
                    </li>
                  ))}
                </ul>
                {rows.length > limit && (
                  <button
                    onClick={() => setLimit((l) => l + 12)}
                    className="mt-3 w-full rounded-xl bg-white/5 py-2.5 text-xs font-bold text-zinc-300 ring-1 ring-white/10 transition hover:bg-white/10"
                  >
                    نمایش بیشتر ({toFa(rows.length - limit)} فایل دیگر)
                  </button>
                )}
              </>
            )}
          </div>

          {/* suggestions */}
          {similar.length > 0 && (
            <div>
              <h3 className="mb-4 text-xs font-extrabold tracking-wide text-zinc-500">پیشنهاد برای شما</h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {similar.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className="group relative aspect-[2/3] overflow-hidden rounded-xl ring-1 ring-white/10 transition hover:ring-crimson-500/50"
                  >
                    {m.poster ? (
                      <img
                        src={m.poster}
                        alt={m.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <PosterArt movie={m} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                    <span className="absolute inset-x-2 bottom-2 line-clamp-2 text-right text-[11px] font-bold">{m.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
