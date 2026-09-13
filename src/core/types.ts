/**
 * Domain model for English Janala.
 *
 * Everything the app knows about the learner, the curriculum and the spaced
 * repetition memory lives in plain, serialisable data structures so the whole
 * progress can be exported, imported or synced to a backend later.
 */

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type UiLang = 'en' | 'bn';
export type Theme = 'light' | 'dark';
export type SkillKey = 'vocab' | 'reading' | 'listening' | 'speaking' | 'grammar' | 'writing';

export const CEFR_ORDER: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export interface Level {
  no: number;
  title: string;
  titleBn: string;
  cefr: CefrLevel;
  summary: string;
  summaryBn: string;
  accent: string;
}

export interface Word {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  bn: string;
  example: string;
  synonyms: string[];
  level: number;
  cefr: CefrLevel;
  tags: string[];
}

export interface ComprehensionQuestion {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Passage {
  id: string;
  title: string;
  titleBn: string;
  cefr: CefrLevel;
  minutes: number;
  body: string[];
  gloss: string[];
  questions: ComprehensionQuestion[];
}

export interface DictationItem {
  id: string;
  text: string;
  cefr: CefrLevel;
  hint: string;
}

export interface GrammarItem {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
  whyBn: string;
  cefr: CefrLevel;
}

export interface GrammarRule {
  id: string;
  topic: string;
  title: string;
  titleBn: string;
  rule: string;
  ruleBn: string;
  right: string;
  wrong: string;
}

export interface Idiom {
  id: string;
  idiom: string;
  meaning: string;
  meaningBn: string;
  example: string;
}

export interface PlacementItem {
  id: string;
  cefr: CefrLevel;
  difficulty: number;
  prompt: string;
  options: string[];
  answer: number;
}

export type CardStateName = 'new' | 'learning' | 'review' | 'mastered';

export interface CardState {
  id: string;
  state: CardStateName;
  /** Days of memory at the last review. */
  stability: number;
  /** Perceived difficulty, 1 (easy) .. 10 (hard). */
  difficulty: number;
  /** Epoch ms when the card is due again. */
  due: number;
  reps: number;
  lapses: number;
  last: number | null;
}

export interface SkillRecord {
  xp: number;
  correct: number;
  attempts: number;
}

export interface WritingDraft {
  id: string;
  promptId: string;
  text: string;
  updatedAt: number;
  bestScore: number;
}

export interface SessionLog {
  id: string;
  skill: SkillKey;
  at: number;
  correct: number;
  total: number;
  xp: number;
}

export interface AppState {
  version: number;
  onboarded: boolean;
  profile: {
    name: string;
    goal: string;
    cefr: CefrLevel;
    createdAt: number;
    placementScore: number;
  };
  prefs: {
    uiLang: UiLang;
    theme: Theme;
    ttsRate: number;
    ttsVoiceURI: string | null;
    accent: 'en-US' | 'en-GB';
    fontScale: 1 | 1.1 | 1.25;
    dyslexiaFont: boolean;
    reduceMotion: boolean;
  };
  xp: {
    total: number;
    daily: Record<string, number>;
    streak: { current: number; longest: number; lastDay: string | null };
  };
  skills: Record<SkillKey, SkillRecord>;
  cards: Record<string, CardState>;
  known: string[];
  saved: string[];
  lessons: Record<string, { startedAt: number; seen: string[] }>;
  badges: string[];
  reading: Record<string, { score: number; lookedUp: string[]; completedAt: number }>;
  drafts: WritingDraft[];
  sessions: SessionLog[];
}

export interface ToastOptions {
  title: string;
  body?: string;
  tone?: 'info' | 'success' | 'warn' | 'error';
  timeout?: number;
}
