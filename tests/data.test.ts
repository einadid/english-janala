import { describe, expect, it } from 'vitest';
import { CEFR_ORDER } from '@/core/types';
import {
  LEVELS,
  LEVEL_CEFR,
  VOCABULARY,
  findWordByText,
  searchWords,
  wordsByLevel,
} from '@/data/vocabulary';
import { PASSAGES } from '@/data/passages';
import { DICTATION } from '@/data/dictation';
import { GRAMMAR_DRILLS, GRAMMAR_RULES } from '@/data/grammar';
import { IDIOMS, PLACEMENT } from '@/data/extras';
import { WRITING_PROMPTS } from '@/data/prompts';
import { ARTICLES, ERROR_PATTERNS, PHRASEBOOKS } from '@/data/tutor';

describe('vocabulary bank', () => {
  it('ships a full curriculum of 120 words across 10 CEFR levels', () => {
    expect(VOCABULARY).toHaveLength(120);
    expect(LEVELS).toHaveLength(10);
    for (const level of LEVELS) {
      expect(wordsByLevel(level.no)).toHaveLength(12);
    }
  });

  it('uses unique ids and unique headwords', () => {
    expect(new Set(VOCABULARY.map((word) => word.id)).size).toBe(VOCABULARY.length);
    expect(new Set(VOCABULARY.map((word) => word.word.toLowerCase())).size).toBe(VOCABULARY.length);
  });

  it('labels every entry with IPA, a part of speech and a Bangla meaning', () => {
    for (const word of VOCABULARY) {
      expect(word.ipa.startsWith('/') && word.ipa.endsWith('/'), `${word.word} IPA`).toBe(true);
      expect(word.pos.length, `${word.word} pos`).toBeGreaterThan(1);
      expect(/[\u0980-\u09FF]/.test(word.bn), `${word.word} Bangla meaning`).toBe(true);
      expect(CEFR_ORDER).toContain(word.cefr);
      expect(LEVEL_CEFR[word.level]).toBe(word.cefr);
    }
  });

  it('gives every word an example that really uses the headword', () => {
    for (const word of VOCABULARY) {
      const stem = word.word.slice(0, Math.min(5, word.word.length)).toLowerCase();
      expect(word.example.toLowerCase().includes(stem), `${word.word} example`).toBe(true);
      expect(/[.?!]$/.test(word.example), `${word.word} example punctuation`).toBe(true);
    }
  });

  it('finds words by text, including light de-inflection', () => {
    expect(findWordByText('brave')?.id).toBeUndefined();
    expect(findWordByText('Agree')?.id).toBe('l5-02');
    expect(findWordByText('argued')?.id).toBe('l5-03');
    expect(findWordByText('cleaned')?.id).toBe('l2-02');
    expect(findWordByText('zzzz')).toBeUndefined();
  });

  it('searches across headword, meaning, synonyms and tags', () => {
    expect(searchWords('bravery')[0]?.word).toBe('courage');
    expect(searchWords('সাহস')[0]?.word).toBe('courage');
    expect(searchWords('science').length).toBeGreaterThan(3);
    expect(searchWords('')).toEqual([]);
  });
});

describe('reading passages', () => {
  it('has valid questions with in-range answers', () => {
    expect(PASSAGES.length).toBeGreaterThanOrEqual(5);
    for (const passage of PASSAGES) {
      expect(passage.body.length).toBeGreaterThan(1);
      expect(passage.gloss.length).toBeGreaterThan(0);
      expect(passage.questions.length).toBe(4);
      for (const question of passage.questions) {
        expect(question.options).toHaveLength(4);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(4);
        expect(question.why.length).toBeGreaterThan(10);
      }
    }
  });

  it('uses unique passage ids', () => {
    expect(new Set(PASSAGES.map((passage) => passage.id)).size).toBe(PASSAGES.length);
  });
});

describe('drill banks', () => {
  it('has valid dictation lines', () => {
    expect(DICTATION.length).toBe(24);
    for (const item of DICTATION) {
      expect(/[.?!]$/.test(item.text)).toBe(true);
      expect(CEFR_ORDER).toContain(item.cefr);
    }
  });

  it('has grammar drills with in-range answers and explanations', () => {
    expect(GRAMMAR_DRILLS.length).toBe(24);
    for (const drill of GRAMMAR_DRILLS) {
      expect(drill.options.length).toBeGreaterThan(1);
      expect(drill.answer).toBeGreaterThanOrEqual(0);
      expect(drill.answer).toBeLessThan(drill.options.length);
      expect(drill.why.length).toBeGreaterThan(10);
      expect(/[\u0980-\u09FF]/.test(drill.whyBn)).toBe(true);
    }
  });

  it('has grammar rule cards with right and wrong examples', () => {
    expect(GRAMMAR_RULES.length).toBeGreaterThanOrEqual(8);
    for (const rule of GRAMMAR_RULES) {
      expect(rule.right.length).toBeGreaterThan(5);
      expect(rule.wrong.length).toBeGreaterThan(5);
      expect(/[\u0980-\u09FF]/.test(rule.ruleBn)).toBe(true);
    }
  });

  it('has idioms, phrasebooks, prompts and articles', () => {
    expect(IDIOMS.length).toBe(12);
    expect(PHRASEBOOKS.length).toBeGreaterThanOrEqual(6);
    expect(WRITING_PROMPTS.length).toBe(5);
    expect(ARTICLES.length).toBeGreaterThanOrEqual(8);
    for (const set of PHRASEBOOKS) {
      for (const line of set.lines) {
        expect(/[\u0980-\u09FF]/.test(line.bn), `${set.id} Bangla line`).toBe(true);
      }
    }
  });

  it('has a placement test with valid answers and rising difficulty', () => {
    expect(PLACEMENT.length).toBe(12);
    const difficulties = PLACEMENT.map((item) => item.difficulty);
    expect(difficulties).toEqual([...difficulties].sort((a, b) => a - b));
    for (const item of PLACEMENT) {
      expect(item.answer).toBeGreaterThanOrEqual(0);
      expect(item.answer).toBeLessThan(item.options.length);
    }
  });

  it('defines error patterns with an explanation in both languages', () => {
    expect(ERROR_PATTERNS.length).toBeGreaterThanOrEqual(14);
    for (const pattern of ERROR_PATTERNS) {
      expect(pattern.right.length).toBeGreaterThan(5);
      expect(pattern.why.length).toBeGreaterThan(10);
      expect(/[\u0980-\u09FF]/.test(pattern.whyBn)).toBe(true);
    }
  });
});
