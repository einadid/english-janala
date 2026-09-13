/**
 * Text scoring utilities: normalisation, edit distance, word alignment,
 * dictation scoring, pronunciation scoring and writing analytics.
 *
 * Pure functions, no DOM access -> unit tested in tests/scoring.test.ts.
 */

export type TokenStatus = 'match' | 'close' | 'missing' | 'extra';

export interface DiffToken {
  text: string;
  status: TokenStatus;
}

export interface DictationScore {
  score: number;
  tokens: DiffToken[];
  matched: number;
  close: number;
  total: number;
}

export interface WritingMetrics {
  words: number;
  sentences: number;
  uniqueWords: number;
  uniqueRatio: number;
  avgSentenceLength: number;
  longestSentence: number;
  syllables: number;
  readingEase: number;
  grade: number;
  connectives: string[];
  repeated: string[];
  longWords: number;
  band: string;
  checklist: { id: string; label: string; labelBn: string; ok: boolean }[];
}

export const CONNECTIVES = [
  'however',
  'although',
  'because',
  'therefore',
  'moreover',
  'furthermore',
  'whereas',
  'while',
  'despite',
  'in addition',
  'as a result',
  'for example',
  'on the other hand',
  'nevertheless',
  'unless',
  'so that',
];

export function normalizeText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(input: string): string[] {
  const normalized = normalizeText(input);
  return normalized.length === 0 ? [] : normalized.split(' ');
}

export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min((current[j - 1] ?? 0) + 1, (previous[j] ?? 0) + 1, (previous[j - 1] ?? 0) + cost);
    }
    previous = current;
  }
  return previous[b.length] ?? 0;
}

/** 1 = identical, 0 = completely different. */
export function similarity(a: string, b: string): number {
  const left = normalizeText(a);
  const right = normalizeText(b);
  if (left.length === 0 && right.length === 0) return 1;
  const distance = levenshtein(left, right);
  return Math.max(0, 1 - distance / Math.max(left.length, right.length));
}

/** Longest-common-subsequence alignment between a target sentence and an answer. */
export function diffTokens(target: string[], answer: string[]): DiffToken[] {
  const rows = target.length;
  const cols = answer.length;
  const table: number[][] = Array.from({ length: rows + 1 }, () => new Array<number>(cols + 1).fill(0));

  for (let i = 1; i <= rows; i += 1) {
    const row = table[i];
    if (!row) continue;
    for (let j = 1; j <= cols; j += 1) {
      const same = target[i - 1] === answer[j - 1] ? 1 : 0;
      row[j] = Math.max(table[i - 1]?.[j] ?? 0, row[j - 1] ?? 0, (table[i - 1]?.[j - 1] ?? 0) + same);
    }
  }

  const ops: DiffToken[] = [];
  let i = rows;
  let j = cols;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && target[i - 1] === answer[j - 1]) {
      ops.push({ text: target[i - 1] as string, status: 'match' });
      i -= 1;
      j -= 1;
    } else if (j > 0 && (i === 0 || (table[i]?.[j - 1] ?? 0) >= (table[i - 1]?.[j] ?? 0))) {
      ops.push({ text: answer[j - 1] as string, status: 'extra' });
      j -= 1;
    } else {
      ops.push({ text: target[i - 1] as string, status: 'missing' });
      i -= 1;
    }
  }
  ops.reverse();

  // A missing word next to a near-miss extra word is a spelling slip, not a gap.
  const merged: DiffToken[] = [];
  for (let k = 0; k < ops.length; k += 1) {
    const token = ops[k];
    if (!token) continue;
    if (token.status === 'missing') {
      const next = ops[k + 1];
      if (next && next.status === 'extra' && similarity(token.text, next.text) >= 0.6) {
        merged.push({ text: token.text, status: 'close' });
        k += 1;
        continue;
      }
    }
    merged.push(token);
  }
  return merged;
}

export function scoreDictation(target: string, answer: string): DictationScore {
  const targetTokens = tokenize(target);
  const answerTokens = tokenize(answer);
  if (targetTokens.length === 0) {
    return { score: 0, tokens: [], matched: 0, close: 0, total: 0 };
  }
  const tokens = diffTokens(targetTokens, answerTokens);
  let matched = 0;
  let close = 0;
  for (const token of tokens) {
    if (token.status === 'match') matched += 1;
    if (token.status === 'close') close += 1;
  }
  const score = Math.round(((matched + close * 0.5) / targetTokens.length) * 100);
  return { score: Math.min(100, Math.max(0, score)), tokens, matched, close, total: targetTokens.length };
}

export function countSyllables(word: string): number {
  const clean = normalizeText(word).replace(/e$/, '');
  if (clean.length === 0) return 0;
  const groups = clean.match(/[aeiouy]+/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 1);
}

export function analyseWriting(text: string): WritingMetrics {
  const tokens = tokenize(text);
  const sentences = splitSentences(text.trim());
  const unique = new Set(tokens);
  const sentenceCount = Math.max(1, sentences.length);
  const wordCount = tokens.length;
  const syllables = tokens.reduce((sum, token) => sum + countSyllables(token), 0);

  const avgSentenceLength = wordCount === 0 ? 0 : wordCount / sentenceCount;
  const longestSentence = sentences.reduce((max, sentence) => Math.max(max, tokenize(sentence).length), 0);
  const readingEase =
    wordCount === 0
      ? 0
      : 206.835 - 1.015 * avgSentenceLength - 84.6 * (syllables / wordCount);
  const grade =
    wordCount === 0 ? 0 : 0.39 * avgSentenceLength + 11.8 * (syllables / wordCount) - 15.59;

  const lowered = ` ${normalizeText(text)} `;
  const connectives = CONNECTIVES.filter((c) => lowered.includes(` ${c} `));

  const counts = new Map<string, number>();
  for (const token of tokens) {
    if (token.length < 5) continue;
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  const repeated = [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  const longWords = tokens.filter((token) => token.length >= 9).length;
  const uniqueRatio = wordCount === 0 ? 0 : unique.size / wordCount;

  const checklist = [
    { id: 'length', label: 'At least 60 words', labelBn: 'কমপক্ষে ৬০ শব্দ', ok: wordCount >= 60 },
    { id: 'sentences', label: '4+ sentences', labelBn: '৪টি বা বেশি বাক্য', ok: sentences.length >= 4 },
    { id: 'connective', label: 'Uses a linking word', labelBn: 'সংযোজক শব্দ ব্যবহার', ok: connectives.length > 0 },
    { id: 'variety', label: 'Varied vocabulary', labelBn: 'বৈচিত্র্যময় শব্দচয়ন', ok: uniqueRatio >= 0.6 },
    { id: 'rhythm', label: 'Balanced sentence length', labelBn: 'বাক্যের দৈর্ঘ্যে ভারসাম্য', ok: avgSentenceLength >= 8 && avgSentenceLength <= 22 },
    { id: 'repeat', label: 'No over-repeated word', labelBn: 'একই শব্দ বারবার নয়', ok: repeated.length === 0 },
  ];

  return {
    words: wordCount,
    sentences: sentences.length,
    uniqueWords: unique.size,
    uniqueRatio,
    avgSentenceLength,
    longestSentence,
    syllables,
    readingEase,
    grade,
    connectives,
    repeated,
    longWords,
    band: bandFromEase(readingEase, wordCount),
    checklist,
  };
}

export function bandFromEase(ease: number, words: number): string {
  if (words === 0) return '—';
  if (ease >= 90) return 'A2';
  if (ease >= 70) return 'B1';
  if (ease >= 50) return 'B2';
  return 'C1';
}

export interface PronunciationScore {
  score: number;
  heard: string;
  targetTokens: string[];
  tokens: DiffToken[];
}

export function scorePronunciation(target: string, heard: string): PronunciationScore {
  const result = scoreDictation(target, heard);
  return { score: result.score, heard: heard.trim(), targetTokens: tokenize(target), tokens: result.tokens };
}

/** Rough CEFR band for an arbitrary accuracy percentage. */
export function cefrFromAccuracy(accuracy: number): string {
  if (accuracy >= 95) return 'C1';
  if (accuracy >= 85) return 'B2';
  if (accuracy >= 70) return 'B1';
  if (accuracy >= 50) return 'A2';
  return 'A1';
}
