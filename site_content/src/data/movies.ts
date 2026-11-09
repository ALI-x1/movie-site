export type MovieType = "movie" | "series";

export interface Download {
  link: string; fileName: string; quality: string; isDubbed: boolean;
  season?: number | null; episode?: number | null;
}

export interface Movie {
  id: number; pid: string; title: string; originalTitle: string; type: MovieType;
  year: number; duration: string; rating: number; match: number; genres: string[];
  description: string; poster?: string; backdrop?: string; gradient: [string, string];
  badge?: string; age: string; quality: string; director: string; cast: string[];
  seasons?: number; episodes?: number;
  trailerUrl?: string; downloads?: Download[]; detailed?: boolean; detailError?: boolean;
}

export const typeLabel = (m: Movie) => (m.type === "movie" ? "فیلم" : "سریال");

export const allGenres = [
  "اکشن", "درام", "علمی‌تخیلی", "ترسناک", "کمدی",
  "معمایی", "ماجراجویی", "فانتزی", "جنایی", "مستند",
];
