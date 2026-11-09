import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { type Movie } from "../data/movies";
import { useCatalog } from "../data/catalog";
import { toFa } from "../lib/format";
import { EASE } from "../lib/motion";
import MovieCard from "./MovieCard";

interface Props {
  onOpen: (m: Movie) => void;
  onToggleSave: (m: Movie) => void;
  isSaved: (id: number) => boolean;
}

export default function TopTen({ onOpen, onToggleSave, isSaved }: Props) {
  const { top10 } = useCatalog();
  if (!top10.length) return null;

  return (
    <motion.section
      id="top"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative py-14"
    >
      <div className="mx-auto mb-6 flex max-w-[1440px] items-end justify-between px-4 lg:px-10">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-bold text-crimson-400">
            <TrendingUp className="h-4 w-4" />
            تازه‌ترین رتبه‌بندی
          </div>
          <h2 className="text-3xl font-black md:text-4xl">
            ده‌تای برتر{" "}
            <span className="bg-gradient-to-l from-crimson-400 to-flame-400 bg-clip-text text-transparent">
              امروز
            </span>
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm leading-7 text-zinc-500 md:block">
          محبوب‌ترین فیلم‌ها و سریال‌های ۲۴ ساعت گذشته، بر اساس تماشای کاربران
          پرده‌پلاس
        </p>
      </div>

      <div className="no-scrollbar flex snap-x items-end gap-1 overflow-x-auto px-4 pb-4 pt-2 lg:px-10">
        {top10.map((m, i) => (
          <div key={m.id} className="group flex shrink-0 snap-start items-end">
            <span className="rank-num -me-4 select-none text-[6rem] font-black leading-[0.75] transition-all duration-500 sm:-me-5 sm:text-[8rem] md:-me-6 md:text-[9.5rem] lg:text-[11rem]">
              {toFa(i + 1)}
            </span>
            <div className="relative z-10 w-[118px] sm:w-[138px] lg:w-[158px]">
              <MovieCard
                movie={m}
                fluid
                onOpen={onOpen}
                saved={isSaved(m.id)}
                onToggleSave={onToggleSave}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
