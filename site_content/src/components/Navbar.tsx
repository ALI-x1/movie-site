import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Clapperboard, Menu, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toFa } from "../lib/format";
import { EASE } from "../lib/motion";
import { cn } from "../utils/cn";

const LINKS = [
  { label: "خانه", href: "#home" },
  { label: "فیلم‌ها", href: "#movies" },
  { label: "سریال‌ها", href: "#series" },
  { label: "برترین‌ها", href: "#top" },
  { label: "ژانرها", href: "#genres" },
];

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  myListCount: number;
  onMyListClick: () => void;
}

export default function Navbar({
  query,
  onQueryChange,
  myListCount,
  onMyListClick,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "border-b border-white/5 bg-night-950/85 backdrop-blur-xl"
          : "bg-gradient-to-b from-night-950/80 to-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center gap-5 px-4 lg:h-[76px] lg:px-10">
        {/* logo */}
        <a href="#home" className="flex shrink-0 items-center gap-2.5">
          <span className="glow-primary grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-crimson-500 to-flame-500">
            <Clapperboard className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-black tracking-tight">
            پرده
            <span className="bg-gradient-to-l from-crimson-400 to-flame-400 bg-clip-text text-transparent">
              ‌پلاس
            </span>
          </span>
        </a>

        {/* desktop links */}
        <ul className="hidden items-center gap-7 text-sm font-medium text-zinc-300 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative pb-1 transition-colors after:absolute after:-bottom-0.5 after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gradient-to-l after:from-crimson-500 after:to-flame-500 after:transition-all after:duration-300 hover:text-white hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* actions */}
        <div className="ms-auto flex items-center gap-2.5">
          <label className="hidden h-10 w-44 items-center gap-2 rounded-full bg-white/5 px-3.5 ring-1 ring-white/10 transition-all duration-500 focus-within:w-64 focus-within:bg-white/10 focus-within:ring-crimson-500/50 md:flex">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="جستجوی فیلم، سریال..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
            />
            {query && (
              <button onClick={() => onQueryChange("")} aria-label="پاک کردن">
                <X className="h-3.5 w-3.5 text-zinc-400 transition hover:text-white" />
              </button>
            )}
          </label>

          <button
            onClick={onMyListClick}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:ring-crimson-500/60"
            aria-label="لیست من"
          >
            <Bookmark className="h-4 w-4" />
            {myListCount > 0 && (
              <span className="absolute -end-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-crimson-500 text-[10px] font-bold shadow-lg">
                {toFa(myListCount)}
              </span>
            )}
          </button>

          <button
            className="hidden h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-night-700 to-night-800 ring-1 ring-white/15 transition hover:ring-flame-400/60 sm:grid"
            aria-label="پروفایل"
          >
            <User className="h-4 w-4 text-zinc-300" />
          </button>

          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 lg:hidden"
            aria-label="منو"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-white/5 lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              <label className="mb-3 flex h-11 items-center gap-2 rounded-2xl bg-white/5 px-4 ring-1 ring-white/10 md:hidden">
                <Search className="h-4 w-4 text-zinc-400" />
                <input
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="جستجو..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
                />
              </label>
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
