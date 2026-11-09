import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchHome, toMovie } from "../lib/api";
import { LOCAL_MOVIES } from "../data/fallback";
import type { Movie } from "./movies";

interface Catalog {
  movies: Movie[]; heroSlides: Movie[]; top10: Movie[]; trending: Movie[];
  newReleases: Movie[]; seriesList: Movie[]; loading: boolean; error: boolean;
  message: string; log: string;
}
const initial: Catalog = {
  movies: [], heroSlides: [], top10: [], trending: [], newReleases: [],
  seriesList: [], loading: true, error: false, message: "", log: "",
};
const Ctx = createContext<Catalog>(initial);
export const useCatalog = () => useContext(Ctx);

function fallbackCopy(t: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = t;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand("copy"); } catch { ok = false; }
  document.body.removeChild(ta);
  return ok;
}

async function copyText(t: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(t);
      return true;
    }
  } catch { /* fallthrough */ }
  return fallbackCopy(t);
}

function DebugBanner({ message, log }: { message: string; log: string }) {
  const [st, setSt] = useState<"idle" | "ok" | "fail">("idle");
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 99999, background: "#7f1d1d", color: "#fff", padding: "10px 12px", fontSize: 12 }}>
      <div style={{ direction: "rtl", textAlign: "right", wordBreak: "break-word" }}>⚠ {message}</div>
      <button
        onClick={async () => setSt((await copyText(log)) ? "ok" : "fail")}
        style={{ marginTop: 8, width: "100%", padding: "10px 0", borderRadius: 10, border: 0, background: "#fff", color: "#7f1d1d", fontWeight: 700, fontSize: 14 }}
      >
        {st === "ok" ? "✓ کپی شد؛ توی چت پیست کن" : "📋 کپی کامل لاگ"}
      </button>
      {st === "fail" && (
        <textarea
          readOnly
          value={log}
          onFocus={(e) => e.currentTarget.select()}
          style={{ marginTop: 8, width: "100%", height: 120, direction: "ltr", fontSize: 11, color: "#000" }}
        />
      )}
    </div>
  );
}

/* ---------- کاتالوگ فیل‌بک محلی (حتی بدون سرور بک‌اند) ---------- */
const LOCAL_CATALOG: Catalog = (() => {
  const all = LOCAL_MOVIES;
  return {
    movies: all,
    heroSlides: all.filter((x) => x.poster).slice(0, 3),
    top10: all.slice(0, 10),
    trending: all.slice(0, 12),
    newReleases: all.filter((x) => x.type === "movie"),
    seriesList: all.filter((x) => x.type === "series"),
    loading: false, error: false, message: "", log: "",
  };
})();

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Catalog>(initial);
  useEffect(() => {
    let live = true;
    fetchHome()
      .then((h) => {
        const m = h.movies.map((i) => toMovie(i, "movie"));
        const s = h.series.map((i) => toMovie(i, "series"));
        const tm = h.topMovies.map((i) => toMovie(i, "movie"));
        const seen = new Set<number>();
        const all = [...m, ...s, ...tm, ...h.topSeries.map((i) => toMovie(i, "series"))]
          .filter((x) => !seen.has(x.id) && seen.add(x.id));
        if (!live) return;
        if (all.length === 0) {
          setState(LOCAL_CATALOG);
          return;
        }
        setState({
          movies: all, heroSlides: m.filter((x) => x.poster).slice(0, 3),
          top10: (tm.length ? tm : m).slice(0, 10), trending: m.slice(0, 12),
          newReleases: m, seriesList: s, loading: false, error: false,
          message: "", log: "",
        });
      })
      .catch(() => {
        if (!live) return;
        // بک‌اند در دسترس نیست → از كاتالوگ محلی استفاده می‌کنیم تا سایت بدون خطا اجرا شود
        setState(LOCAL_CATALOG);
      });
    return () => { live = false; };
  }, []);
  const v = useMemo(() => state, [state]);
  return (
    <Ctx.Provider value={v}>
      {children}
      {((import.meta as any).env?.DEV && state.message) && (
        <DebugBanner message={state.message} log={state.log} />
      )}
    </Ctx.Provider>
  );
}
