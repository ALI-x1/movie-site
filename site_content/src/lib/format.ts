const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Convert latin digits to Persian digits (and decimal dot to ٫) */
export const toFa = (value: number | string): string =>
  String(value)
    .replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)])
    .replace(/\./g, "٫");

export const faPercent = (n: number) => `٪${toFa(n)}`;

export const faRating = (n: number) => toFa(n.toFixed(1));
