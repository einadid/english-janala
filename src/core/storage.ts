/** Namespaced, failure-tolerant JSON storage (works in private mode / no storage). */

const PREFIX = 'english-janala';

export function storageKey(key: string): string {
  return `${PREFIX}:${key}`;
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(storageKey(key));
  } catch {
    /* ignore */
  }
}

export function storageAvailable(): boolean {
  try {
    const probe = storageKey('__probe__');
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
