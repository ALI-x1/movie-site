import type { Download, Movie, MovieType } from "../data/movies";

const BASE: string = (import.meta as any).env?.VITE_API_BASE ?? "";
export const API_BASE = BASE;
const PALETTE: [string, string][] = [
  ["#3a1c04", "#c26a12"], ["#08202b", "#155e75"], ["#1c1503", "#a16207"],
  ["#240a2e", "#7e22ce"], ["#0b2a1c", "#15803d"], ["#2b0a0a", "#b91c1c"],
];
const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

export interface ApiItem {
  pid: string; type?: MovieType; title: string; poster: string;
  rating: string | number | null; year: string | number | null;
}

export function toMovie(i: ApiItem, type: MovieType = "movie"): Movie {
  const rating = Number(i.rating) || 0;
  return {
    id: hash(i.pid), pid: i.pid, title: i.title, originalTitle: "",
    type: i.type ?? type, year: Number(i.year) || 0, duration: "",
    rating, match: Math.round(rating * 10), genres: [], description: "",
    poster: i.poster || undefined, backdrop: i.poster || undefined,
    gradient: PALETTE[hash(i.pid) % PALETTE.length], age: "", quality: "",
    director: "", cast: [],
  };
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(BASE + path);
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

export interface Home {
  movies: ApiItem[]; series: ApiItem[]; topMovies: ApiItem[]; topSeries: ApiItem[];
  _diag?: unknown;
}

export async function fetchHome(): Promise<Home> {
  let r: Response;
  try {
    r = await fetch(BASE + "/api/home");
  } catch (e) {
    throw new Error("اتصال به ووکر ناموفق (آدرس غلط/CORS/ووکر خاموش): " + String(e));
  }
  const t = await r.text();
  if (!r.ok) throw new Error("جواب ووکر HTTP " + r.status + " | " + t.slice(0, 150));
  try {
    return JSON.parse(t) as Home;
  } catch {
    throw new Error("جواب ووکر JSON نیست (احتمالاً کد جدید دیپلوی نشده): " + t.slice(0, 150));
  }
}

export async function searchMovies(q: string): Promise<Movie[]> {
  const d = await get<{ items: ApiItem[] }>("/api/search?q=" + encodeURIComponent(q));
  return d.items.map((i) => toMovie(i));
}

export async function fetchDetails(pid: string): Promise<Partial<Movie>> {
  const d = await get<any>("/api/movie?pid=" + encodeURIComponent(pid));
  const downloads: Download[] = d.downloads ?? [];
  const best = ["2160p", "1080p", "720p", "480p"].find((q) => downloads.some((x) => x.quality === q));
  return {
    description: d.plot || "", rating: Number(d.imdbRating) || undefined,
    genres: String(d.genre || "").split(/[،,]/).map((s) => s.trim()).filter(Boolean),
    duration: d.runtime || "", trailerUrl: d.trailerUrl || undefined,
    type: d.hasSeasons ? "series" : undefined, quality: best?.toUpperCase() ?? "",
    downloads, detailed: true,
  };
}

export async function fetchGenre(slug: string): Promise<Movie[]> {
  const d = await get<{ items: ApiItem[] }>("/api/category?genre=" + slug + "&type=movie&page=1");
  return d.items.map((i) => toMovie(i, "movie"));
}
