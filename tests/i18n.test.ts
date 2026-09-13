import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DICT, getLang, knownKeys, setLang, t, tIn } from '@/core/i18n';

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : full.endsWith('.ts') ? [full] : [];
  });
}

/** Every `t('key')` / `tIn(lang, 'key')` literal that appears in the source. */
function usedKeys(): string[] {
  const files = walk('src');
  const keys = new Set<string>();
  for (const file of files) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/\bt\(\s*'([^']+)'/g)) keys.add(match[1] as string);
    for (const match of source.matchAll(/\btIn\(\s*(?:'[^']+'|[A-Za-z.]+)\s*,\s*'([^']+)'/g)) keys.add(match[1] as string);
  }
  return [...keys];
}

describe('bilingual dictionary', () => {
  it('has an English and a Bangla string for every key', () => {
    for (const key of knownKeys()) {
      const entry = DICT[key];
      expect(entry, `${key} entry`).toBeDefined();
      expect(entry?.en.length, `${key}.en`).toBeGreaterThan(0);
      expect(entry?.bn.length, `${key}.bn`).toBeGreaterThan(0);
      expect(/[\u0980-\u09FF]/.test(entry?.bn ?? ''), `${key}.bn is Bangla`).toBe(true);
    }
  });

  it('has no missing key referenced from the source', () => {
    const missing = usedKeys().filter((key) => !(key in DICT));
    expect(missing).toEqual([]);
  });

  it('translates in the active language', () => {
    setLang('bn');
    expect(getLang()).toBe('bn');
    expect(t('nav.review')).toBe('রিভিউ');
    setLang('en');
    expect(t('nav.review')).toBe('Review');
    setLang('bn');
  });

  it('can translate in an explicit language', () => {
    expect(tIn('en', 'nav.learn')).toBe('Learn');
    expect(tIn('bn', 'nav.learn')).toBe('শিখুন');
  });

  it('interpolates placeholders', () => {
    setLang('en');
    const text = t('dash.greeting');
    expect(text.length).toBeGreaterThan(3);
    setLang('bn');
  });

  it('falls back to the key for an unknown entry', () => {
    expect(t('definitely.not.a.key')).toBe('definitely.not.a.key');
  });
});
