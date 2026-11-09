const MAP: Record<string, string> = {
  "اکشن": "action", "درام": "drama", "علمیتخیلی": "sci-fi", "ترسناک": "horror",
  "کمدی": "comedy", "معمایی": "mystery", "ماجراجویی": "adventure", "فانتزی": "fantasy",
  "جنایی": "crime", "مستند": "documentary", "انیمیشن": "animation", "عاشقانه": "romance",
};
const norm = (s: string) => s.replace(/[\u200c\s]/g, "");
export const genreSlug = (name: string): string | null => MAP[norm(name)] ?? null;
