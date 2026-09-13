/** Display formatting helpers (language aware). */

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBanglaNumeral(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => BN_DIGITS[Number(digit)] ?? digit);
}

/** Format a number, switching to Bangla digits when the UI language is Bangla. */
export function num(value: number, lang: 'en' | 'bn'): string {
  const text = String(Math.round(value));
  return lang === 'bn' ? toBanglaNumeral(text) : text;
}

export function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function round(value: number, places = 0): number {
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

export function relativeTime(timestamp: number, now = Date.now()): string {
  const diff = now - timestamp;
  const abs = Math.abs(diff);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < minute) return 'just now';
  if (abs < hour) return `${Math.round(abs / minute)}m ago`;
  if (abs < day) return `${Math.round(abs / hour)}h ago`;
  if (abs < 30 * day) return `${Math.round(abs / day)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function shortDate(dayKey: string): string {
  const [, month, day] = dayKey.split('-');
  return `${day}/${month}`;
}

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Pick a deterministic colour from a stable hash of a string. */
export function hueFrom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 360;
  return hash;
}
