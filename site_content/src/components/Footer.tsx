import {
  AtSign,
  Camera,
  Clapperboard,
  Heart,
  MonitorPlay,
  Send,
} from "lucide-react";
import { toFa } from "../lib/format";

const QUICK = [
  { label: "خانه", href: "#home" },
  { label: "فیلم‌ها", href: "#movies" },
  { label: "سریال‌ها", href: "#series" },
  { label: "برترین‌ها", href: "#top" },
  { label: "ژانرها", href: "#genres" },
];

const GENRE_LINKS = ["اکشن", "درام", "علمی‌تخیلی", "ترسناک", "کمدی", "مستند"];

const SOCIALS = [
  { icon: Camera, label: "اینستاگرام" },
  { icon: AtSign, label: "ایکس" },
  { icon: MonitorPlay, label: "یوتیوب" },
  { icon: Send, label: "تلگرام" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/5 bg-night-900/60">
      <div className="mx-auto max-w-[1440px] px-4 py-14 lg:px-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          {/* brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-crimson-500 to-flame-500">
                <Clapperboard className="h-5 w-5 text-white" />
              </span>
              <span className="text-xl font-black">
                پرده
                <span className="bg-gradient-to-l from-crimson-400 to-flame-400 bg-clip-text text-transparent">
                  ‌پلاس
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-7 text-zinc-400">
              خانهٔ سینمای تو؛ هزاران فیلم و سریال با کیفیت ۴K، دوبلهٔ اختصاصی و
              بدون وقفه، هرجا که باشی.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((s) => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition hover:scale-110 hover:bg-crimson-500/20 hover:ring-crimson-500/50"
                >
                  <s.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div>
            <h4 className="mb-4 text-sm font-extrabold text-white">
              دسترسی سریع
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {QUICK.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="transition hover:text-crimson-400"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* genres */}
          <div>
            <h4 className="mb-4 text-sm font-extrabold text-white">ژانرها</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {GENRE_LINKS.map((g) => (
                <li key={g}>
                  <a href="#genres" className="transition hover:text-crimson-400">
                    {g}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* newsletter */}
          <div>
            <h4 className="mb-4 text-sm font-extrabold text-white">
              از تازه‌ها باخبر شوید
            </h4>
            <p className="text-sm leading-7 text-zinc-400">
              هر هفته خلاصهٔ تازه‌ترین فیلم‌ها و سریال‌ها در صندوق ایمیل شما.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="ایمیل شما"
                className="h-11 w-full rounded-2xl bg-white/5 px-4 text-sm outline-none ring-1 ring-white/10 transition placeholder:text-zinc-500 focus:ring-crimson-500/60"
              />
              <button
                aria-label="عضویت"
                className="glow-primary grid h-11 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-l from-crimson-600 to-flame-500 transition hover:scale-105"
              >
                <Send className="h-4 w-4 -scale-x-100" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row">
          <p>© {toFa(1405)} پرده‌پلاس — تمامی حقوق محتوا محفوظ است.</p>
          <p className="flex items-center gap-1.5">
            ساخته‌شده با
            <Heart className="h-3.5 w-3.5 fill-crimson-500 text-crimson-500" />
            برای عاشقان سینما
          </p>
        </div>
      </div>
    </footer>
  );
}
