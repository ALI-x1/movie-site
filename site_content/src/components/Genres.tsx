import { motion } from "framer-motion";
import { Compass, Drama, Fingerprint, Ghost, Laugh, Rocket, Sparkles, Swords, type LucideIcon } from "lucide-react";

import { EASE } from "../lib/motion";

interface Genre {
  name: string;
  icon: LucideIcon;
  colors: [string, string];
  count: number;
}

const GENRES: Genre[] = [
  { name: "اکشن", icon: Swords, colors: ["#7f1d1d", "#ef4444"], count: 128 },
  { name: "درام", icon: Drama, colors: ["#312e81", "#8b5cf6"], count: 214 },
  { name: "علمی‌تخیلی", icon: Rocket, colors: ["#083344", "#06b6d4"], count: 96 },
  { name: "ترسناک", icon: Ghost, colors: ["#101624", "#475569"], count: 74 },
  { name: "کمدی", icon: Laugh, colors: ["#78350f", "#f59e0b"], count: 153 },
  { name: "معمایی", icon: Fingerprint, colors: ["#134e4a", "#2dd4bf"], count: 88 },
  { name: "ماجراجویی", icon: Compass, colors: ["#1e3a8a", "#60a5fa"], count: 117 },
  { name: "فانتزی", icon: Sparkles, colors: ["#4a044e", "#e879f9"], count: 65 },
];

export default function Genres({ onPick }: { onPick?: (g: string) => void }) {
  return (
    <section id="genres" className="py-14">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-9 w-1.5 rounded-full bg-gradient-to-b from-crimson-500 to-flame-500" />
          <div>
            <h2 className="text-xl font-extrabold md:text-2xl">
              کاوش بر اساس ژانر
            </h2>
            <p className="mt-1 text-xs text-zinc-500 md:text-sm">
              هر حال‌وهوایی که داشته باشی، یک دنیای تازه منتظرت است
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {GENRES.map((g, i) => (
            <motion.button
              key={g.name}
              onClick={() => onPick?.(g.name)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 4) * 0.07 }}
              whileHover={{ y: -6 }}
              className="group relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl p-5 text-start ring-1 ring-white/10 md:h-44"
              style={{
                background: `linear-gradient(140deg, ${g.colors[0]}, ${g.colors[1]})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <g.icon className="absolute -bottom-5 -end-5 h-28 w-28 rotate-12 text-white/15 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
              <span className="relative w-fit rounded-2xl bg-white/15 p-2.5 ring-1 ring-white/25 backdrop-blur-sm">
                <g.icon className="h-5 w-5 text-white" />
              </span>
              <span className="relative">
                <span className="block text-lg font-extrabold md:text-xl">
                  {g.name}
                </span>
                <span className="mt-0.5 block text-xs text-white/70">
                  مشاهدهٔ عناوین
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
