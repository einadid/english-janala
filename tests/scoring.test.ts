import { describe, expect, it } from 'vitest';
import {
  analyseWriting,
  bandFromEase,
  cefrFromAccuracy,
  countSyllables,
  diffTokens,
  levenshtein,
  normalizeText,
  scoreDictation,
  scorePronunciation,
  similarity,
  splitSentences,
  tokenize,
} from '@/core/scoring';

describe('text normalisation', () => {
  it('lowercases, strips punctuation and collapses spaces', () => {
    expect(normalizeText('  Hello,   World!  ')).toBe('hello world');
    expect(normalizeText('don’t stop')).toBe('dont stop');
    expect(tokenize('One, two; three.')).toEqual(['one', 'two', 'three']);
    expect(tokenize('   ')).toEqual([]);
  });

  it('counts syllables with a heuristic', () => {
    expect(countSyllables('cat')).toBe(1);
    expect(countSyllables('water')).toBe(2);
    expect(countSyllables('beautiful')).toBe(3);
    expect(countSyllables('')).toBe(0);
  });

  it('splits sentences on terminal punctuation', () => {
    expect(splitSentences('One. Two! Three?')).toHaveLength(3);
    expect(splitSentences('')).toHaveLength(0);
  });
});

describe('edit distance', () => {
  it('computes Levenshtein distance', () => {
    expect(levenshtein('', '')).toBe(0);
    expect(levenshtein('cat', 'cat')).toBe(0);
    expect(levenshtein('cat', 'bat')).toBe(1);
    expect(levenshtein('kitten', 'sitting')).toBe(3);
    expect(levenshtein('', 'abc')).toBe(3);
  });

  it('normalises similarity to 0..1', () => {
    expect(similarity('colour', 'color')).toBeGreaterThan(0.7);
    expect(similarity('cat', 'elephant')).toBeLessThan(0.4);
    expect(similarity('', '')).toBe(1);
  });
});

describe('dictation scoring', () => {
  it('scores a perfect answer 100', () => {
    const result = scoreDictation('I drink tea every morning.', 'i drink tea every morning');
    expect(result.score).toBe(100);
    expect(result.matched).toBe(5);
    expect(result.total).toBe(5);
  });

  it('marks a near miss as close rather than missing', () => {
    const result = scoreDictation('She is cooking in the kitchen', 'she is cookin in the kitchen');
    const statuses = result.tokens.map((token) => token.status);
    expect(statuses).toContain('close');
    expect(result.score).toBeLessThan(100);
    expect(result.score).toBeGreaterThanOrEqual(75);
  });

  it('marks skipped words as missing', () => {
    const result = scoreDictation('They went to the market yesterday', 'they went market yesterday');
    expect(result.tokens.map((token) => token.status)).toContain('missing');
    expect(result.score).toBeLessThan(100);
  });

  it('scores an empty answer zero', () => {
    expect(scoreDictation('Hello there', '').score).toBe(0);
  });

  it('aligns tokens with an LCS diff', () => {
    const tokens = diffTokens(['a', 'b', 'c'], ['a', 'c']);
    expect(tokens.map((token) => token.status)).toEqual(['match', 'missing', 'match']);
  });

  it('scores pronunciation from a transcript', () => {
    const result = scorePronunciation('I agree with you', 'i agree with you');
    expect(result.score).toBe(100);
    expect(result.targetTokens).toEqual(['i', 'agree', 'with', 'you']);
  });
});

describe('writing analytics', () => {
  const essay = `Online classes have changed the way students learn. Although many learners enjoy the
    flexibility, others struggle with distractions at home. Moreover, weak internet connections make live
    lectures difficult in rural areas. In my opinion, a blended model works best because it combines the
    structure of a classroom with the freedom of self study. Teachers should therefore record every lecture
    so that students can revisit difficult parts later.`;

  it('counts words, sentences and linking words', () => {
    const metrics = analyseWriting(essay);
    expect(metrics.words).toBeGreaterThan(50);
    expect(metrics.sentences).toBe(5);
    expect(metrics.connectives).toContain('although');
    expect(metrics.connectives).toContain('moreover');
    expect(metrics.connectives).toContain('therefore');
  });

  it('produces a readability score and band', () => {
    const metrics = analyseWriting(essay);
    expect(metrics.readingEase).toBeGreaterThan(0);
    expect(metrics.readingEase).toBeLessThan(100);
    expect(['A2', 'B1', 'B2', 'C1']).toContain(metrics.band);
    expect(metrics.grade).toBeGreaterThan(0);
  });

  it('runs a checklist against the draft', () => {
    const metrics = analyseWriting(essay);
    const byId = Object.fromEntries(metrics.checklist.map((item) => [item.id, item.ok]));
    expect(byId.length).toBe(true);
    expect(byId.sentences).toBe(true);
    expect(byId.connective).toBe(true);
    expect(byId.rhythm).toBe(true);
  });

  it('handles empty input without dividing by zero', () => {
    const metrics = analyseWriting('');
    expect(metrics.words).toBe(0);
    expect(metrics.readingEase).toBe(0);
    expect(metrics.uniqueRatio).toBe(0);
    expect(metrics.band).toBe('—');
  });

  it('flags a word repeated too often', () => {
    const metrics = analyseWriting('technology technology technology technology and technology matter here.');
    expect(metrics.repeated).toContain('technology');
  });

  it('maps ease and accuracy to CEFR bands', () => {
    expect(bandFromEase(95, 100)).toBe('A2');
    expect(bandFromEase(55, 100)).toBe('B2');
    expect(bandFromEase(40, 100)).toBe('C1');
    expect(bandFromEase(90, 0)).toBe('—');
    expect(cefrFromAccuracy(96)).toBe('C1');
    expect(cefrFromAccuracy(40)).toBe('A1');
  });
});
