import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clapperboard, Download, Flame, MonitorSmartphone, SearchX, ShieldCheck, Sparkles, Tv, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Footer from "./components/Footer";
import Genres from "./components/Genres";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import MovieCard from "./components/MovieCard";
import MovieModal from "./components/MovieModal";
import MovieRow from "./components/MovieRow";
import Navbar from "./components/Navbar";
import PlayerModal from "./components/PlayerModal";
import TopTen from "./components/TopTen";
import { type Movie } from "./data/movies";
import { useCatalog } from "./data/catalog";
import { fetchDetails, fetchGenre, searchMovies } from "./lib/api";
import { genreSlug } from "./lib/genres";
import { toFa } from "./lib/format";
import { EASE } from "./lib/motion";
import { cn } from "./utils/cn";

const FILTER_GENRES = [
  "همه", "اکشن", "درام", "علمی‌تخیلی", "فانتزی",
  "جنایی", "ماجراجویی", "معمایی", "ترسناک", "کمدی",
];

const FEATURES = [
  {
    icon: Zap,
    title: "پخش بی‌وقفهٔ 4K",
    desc: "با سرورهای پرسرعت اختصاصی، حتی با اینترنت ضعیف بدون قطعی تماشا کن.",
    tint: "from-flame-500 to-crimson-500",
  },
  {
    icon: Download,
    title: "دانلود و تماشای آفلاین",
    desc: "قسمت‌های بعدی سریالت را دانلود کن و در سفر بدون اینترنت ببین.",
    tint: "from-sky-500 to-cyan-400",
  },
  {
    icon: MonitorSmartphone,
    title: "همهٔ دستگاه‌ها",
    desc: "موبایل، تبلت، تلویزیون و لپ‌تاپ؛ تماشایت را از هر جا ادامه بده.",
    tint: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: ShieldCheck,
    title: "پروفایل کودک",
    desc: "فضای امن و کنترل‌شده با محتوای مناسب سن کودکان.",
    tint: "from-emerald-500 to-teal-400",
  },
];

export default function App() {
  const [boot, setBoot] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Movie | null>(null);
  const [playing, setPlaying] = useState<Movie | null>(null);
  const [myList, setMyList] = useState<number[]>([]);
  const [genre, setGenre] = useState("همه");
  const { movies, newReleases, seriesList, trending } = useCatalog();
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [genreItems, setGenreItems] = useState<Movie[]>([]);
  const [genreLoading, setGenreLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 1000);
    return () => clearTimeout(t);
  }, []);

  // lock body/html scroll when overlays are open (ویندوز و گوشی)
  useEffect(() => {
    const block = selected || playing;
    document.documentElement.style.overflow = block ? "hidden" : "";
    document.body.style.overflow = block ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [selected, playing]);

  const isSaved = useCallback((id: number) => myList.includes(id), [myList]);

  const toggleSave = useCallback((m: Movie) => {
    setMyList((l) =>
      l.includes(m.id) ? l.filter((x) => x !== m.id) : [...l, m.id]
    );
  }, []);

  const openPlay = (m: Movie) => {
    setSelected(null);
    setPlaying(m);
  };

  const searching = query.trim().length > 0;

  useEffect(() => {
    const q = query.trim();
    if (!q) { setSearchResults([]); return; }
    let live = true;
    const t = setTimeout(() => {
      searchMovies(q).then((r) => live && setSearchResults(r)).catch(() => live && setSearchResults([]));
    }, 350);
    return () => { live = false; clearTimeout(t); };
  }, [query]);

  useEffect(() => {
    if (genre === "همه") { setGenreItems([]); setGenreLoading(false); return; }
    const slug = genreSlug(genre);
    if (!slug) { setGenreItems([]); return; }
    let live = true;
    setGenreLoading(true);
    fetchGenre(slug)
      .then((r) => live && setGenreItems(r))
      .catch(() => live && setGenreItems([]))
      .finally(() => live && setGenreLoading(false));
    return () => { live = false; };
  }, [genre]);

  useEffect(() => {
    if (!selected || selected.detailed) return;
    const pid = selected.pid;
    fetchDetails(pid)
      .then((d) => setSelected((cur) => (cur && cur.pid === pid ? { ...cur, ...d, rating: d.rating ?? cur.rating } : cur)))
      .catch(() => setSelected((cur) => (cur && cur.pid === pid ? { ...cur, detailed: true, detailError: true } : cur)));
  }, [selected?.pid]);

  const explore = useMemo(
    () => (genre === "همه" ? movies : genreItems),
    [genre, movies, genreItems]
  );

  const myMovies = useMemo(
    () => movies.filter((m) => myList.includes(m.id)),
    [myList, movies]
  );

  const handleMyListClick = () => {
    const id = myList.length ? "mylist" : "home";
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-night-950 text-white">
      {/* ambience */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(255,59,78,0.08),transparent)]" />
      {/* cinematic grain */}
      <div className="grain pointer-events-none fixed inset-0 z-[90] opacity-[0.05]" />

      {/* preloader */}
      <AnimatePresence>
        {boot && (
          <motion.div
            key="boot"
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-night-950"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              className="glow-primary grid h-20 w-20 place-items-center rounded-[1.6rem] bg-gradient-to-br from-crimson-500 to-flame-500"
            >
              <Clapperboard className="h-10 w-10 text-white" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
              className="text-center"
            >
              <p className="text-2xl font-black">
                پرده
                <span className="bg-gradient-to-l from-crimson-400 to-flame-400 bg-clip-text text-transparent">
                  ‌پلاس
                </span>
              </p>
              <p className="mt-1.5 text-xs text-zinc-500">
                دنیای فیلم و سریال، بدون مرز
              </p>
            </motion.div>
            <div className="h-1 w-44 overflow-hidden rounded-full bg-white/10">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.15, ease: EASE, delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-l from-crimson-500 to-flame-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar
        query={query}
        onQueryChange={setQuery}
        myListCount={myList.length}
        onMyListClick={handleMyListClick}
      />

      {searching ? (
        /* ---------- search results ---------- */
        <main className="relative z-10 mx-auto min-h-screen max-w-[1440px] px-4 pb-16 pt-28 lg:px-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black md:text-3xl">نتایج جستجو</h1>
              <p className="mt-2 text-sm text-zinc-400">
                {searchResults.length
                  ? `${toFa(searchResults.length)} عنوان برای «${query}» پیدا شد`
                  : `چیزی برای «${query}» پیدا نشد`}
              </p>
            </div>
            <button
              onClick={() => setQuery("")}
              className="shrink-0 rounded-full bg-white/5 px-5 py-2.5 text-sm font-bold ring-1 ring-white/10 transition hover:bg-white/10"
            >
              بازگشت
            </button>
          </div>

          {searchResults.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {searchResults.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  fluid
                  onOpen={setSelected}
                  saved={isSaved(m.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <SearchX className="h-14 w-14 text-zinc-700" />
              <p className="text-lg font-bold text-zinc-400">نتیجه‌ای یافت نشد</p>
              <p className="text-sm text-zinc-600">
                عنوان، ژانر یا نام کارگردان دیگری را امتحان کنید
              </p>
            </div>
          )}
        </main>
      ) : (
        /* ---------- home ---------- */
        <main className="relative z-10">
          <Hero
            onOpen={setSelected}
            onPlay={openPlay}
            onToggleSave={toggleSave}
            isSaved={isSaved}
          />

          <Marquee />

          <TopTen
            onOpen={setSelected}
            onToggleSave={toggleSave}
            isSaved={isSaved}
          />

          <MovieRow
            id="trending"
            title="پرطرفدار این هفته"
            subtitle="آنچه بقیه این روزها تماشا می‌کنند"
            icon={Flame}
            movies={trending}
            onOpen={setSelected}
            onToggleSave={toggleSave}
            isSaved={isSaved}
          />

          {/* explore archive */}
          <section id="movies" className="py-14">
            <div className="mx-auto max-w-[1440px] px-4 lg:px-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-crimson-500 to-flame-500" />
                <div>
                  <h2 className="text-xl font-extrabold md:text-2xl">
                    کاوش در آرشیو
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500 md:text-sm">
                    {genreLoading ? "در حال بارگذاری…" : `${toFa(explore.length)} عنوان، آمادهٔ تماشا`}
                  </p>
                </div>
              </div>

              <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto pb-1">
                {FILTER_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenre(g)}
                    className={cn(
                      "shrink-0 rounded-full px-4.5 py-2.5 text-sm font-bold ring-1 transition-all duration-300",
                      genre === g
                        ? "glow-primary bg-gradient-to-l from-crimson-600 to-flame-500 text-white ring-transparent"
                        : "bg-white/5 text-zinc-300 ring-white/10 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <motion.div
                layout
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              >
                <AnimatePresence mode="popLayout">
                  {explore.map((m) => (
                    <MovieCard
                      key={m.id}
                      movie={m}
                      fluid
                      onOpen={setSelected}
                      saved={isSaved(m.id)}
                      onToggleSave={toggleSave}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </section>

          <Genres onPick={(g) => { setGenre(g); document.getElementById("movies")?.scrollIntoView({ behavior: "smooth" }); }} />

          <MovieRow
            id="series"
            title="سریال‌های برگزیده"
            subtitle="قسمت‌های جدید، هر هفته"
            icon={Tv}
            movies={seriesList}
            onOpen={setSelected}
            onToggleSave={toggleSave}
            isSaved={isSaved}
          />

          <MovieRow
            id="new"
            title={`تازه‌های ${toFa(2026)}`}
            subtitle="تازه‌ترین اکران‌های پرده‌پلاس"
            icon={Sparkles}
            movies={newReleases}
            onOpen={setSelected}
            onToggleSave={toggleSave}
            isSaved={isSaved}
          />

          {myMovies.length > 0 && (
            <MovieRow
              id="mylist"
              title="لیست من"
              subtitle="ذخیره‌شده برای تماشای بعدی"
              icon={Bookmark}
              movies={myMovies}
              onOpen={setSelected}
              onToggleSave={toggleSave}
              isSaved={isSaved}
            />
          )}

          {/* features */}
          <section className="py-14">
            <div className="mx-auto max-w-[1440px] px-4 lg:px-10">
              <div className="mb-9 text-center">
                <p className="mb-3 text-sm font-bold text-crimson-400">
                  چرا پرده‌پلاس؟
                </p>
                <h2 className="text-3xl font-black md:text-4xl">
                  تجربه‌ای{" "}
                  <span className="bg-gradient-to-l from-crimson-400 to-flame-400 bg-clip-text text-transparent">
                    فراتر از تماشا
                  </span>
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
                    whileHover={{ y: -6 }}
                    className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 transition hover:bg-white/[0.06] hover:ring-white/20"
                  >
                    <span
                      className={cn(
                        "mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br",
                        f.tint
                      )}
                    >
                      <f.icon className="h-5 w-5 text-white" />
                    </span>
                    <h3 className="mb-2 font-extrabold">{f.title}</h3>
                    <p className="text-sm leading-7 text-zinc-400">{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer />

      {/* overlays */}
      <AnimatePresence>
        {selected && (
          <MovieModal
            key={selected.id}
            movie={selected}
            onClose={() => setSelected(null)}
            onPlay={openPlay}
            onToggleSave={toggleSave}
            isSaved={isSaved}
            onSelect={setSelected}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {playing && (
          <PlayerModal movie={playing} onClose={() => setPlaying(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
