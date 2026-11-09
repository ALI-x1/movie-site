import { Flame } from "lucide-react";
import { cn } from "../utils/cn";

const ITEMS = [
  "پخش بی‌وقفه",
  "اکشن",
  "کیفیت 4K",
  "درام",
  "دوبلهٔ اختصاصی",
  "علمی‌تخیلی",
  "زیرنویس فارسی",
  "فانتزی",
  "سینمای جهان",
  "معمایی",
];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="group relative -mx-4 my-6 -rotate-1 overflow-hidden border-y border-white/5 bg-white/[0.02] py-6">
      <div className="animate-marquee flex w-max items-center group-hover:[animation-play-state:paused]">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span
              className={cn(
                "whitespace-nowrap px-6 text-2xl font-black md:text-4xl",
                i % 2 === 0 ? "text-white/90" : "text-stroke"
              )}
            >
              {item}
            </span>
            <Flame className="h-5 w-5 shrink-0 text-crimson-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
