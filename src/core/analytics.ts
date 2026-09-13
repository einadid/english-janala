/** Derived analytics: everything the Insights view shows, computed from state. */

import type { AppState, CardState, SkillKey } from './types';
import type { BadgeMetrics } from './gamification';
import { dayKey } from './gamification';
import { DAY_MS, retrievability } from './srs';

export const SKILL_KEYS: SkillKey[] = ['vocab', 'reading', 'listening', 'speaking', 'grammar', 'writing'];

export interface SkillAccuracy {
  skill: SkillKey;
  attempts: number;
  correct: number;
  accuracy: number;
  xp: number;
}

export function skillAccuracy(state: AppState): SkillAccuracy[] {
  return SKILL_KEYS.map((skill) => {
    const record = state.skills[skill] ?? { xp: 0, correct: 0, attempts: 0 };
    return {
      skill,
      attempts: record.attempts,
      correct: record.correct,
      accuracy: record.attempts === 0 ? 0 : record.correct / record.attempts,
      xp: record.xp,
    };
  });
}

export function cardList(state: AppState): CardState[] {
  return Object.values(state.cards);
}

export function counts(state: AppState): {
  wordsSeen: number;
  wordsMastered: number;
  due: number;
  learning: number;
  review: number;
  mastered: number;
} {
  const cards = cardList(state);
  const now = Date.now();
  const seen = new Set<string>([...Object.keys(state.cards), ...state.known, ...state.saved]);
  return {
    wordsSeen: seen.size,
    wordsMastered: cards.filter((card) => card.state === 'mastered').length,
    due: cards.filter((card) => card.due <= now).length,
    learning: cards.filter((card) => card.state === 'learning').length,
    review: cards.filter((card) => card.state === 'review').length,
    mastered: cards.filter((card) => card.state === 'mastered').length,
  };
}

export function badgeMetrics(state: AppState): BadgeMetrics {
  const cards = cardList(state);
  const stats = counts(state);
  const sessions = state.sessions;
  const perfect = sessions.filter((s) => s.total > 0 && s.correct === s.total).length;
  const skillCount = (skill: SkillKey): number => sessions.filter((s) => s.skill === skill).length;
  const highSpeaking = sessions.filter((s) => s.skill === 'speaking' && s.total > 0 && s.correct / s.total >= 0.9).length;

  return {
    xp: state.xp.total,
    streak: state.xp.streak.current,
    reviews: cards.reduce((sum, card) => sum + card.reps, 0),
    perfectSessions: perfect,
    wordsSeen: stats.wordsSeen,
    wordsMastered: stats.wordsMastered,
    lessons: Object.keys(state.lessons).length,
    reading: Object.keys(state.reading).length,
    listening: skillCount('listening'),
    speaking: highSpeaking,
    writing: state.drafts.length,
    grammar: skillCount('grammar'),
    days: Object.keys(state.xp.daily).length,
  };
}

export interface DayPoint {
  key: string;
  xp: number;
}

/** XP per day for the trailing window, zero-filled so charts never have gaps. */
export function dailySeries(state: AppState, days = 14, today = dayKey()): DayPoint[] {
  const points: DayPoint[] = [];
  const [y, m, d] = today.split('-').map(Number);
  const base = Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1);
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(base - i * DAY_MS);
    const key = dayKey(date);
    points.push({ key, xp: state.xp.daily[key] ?? 0 });
  }
  return points;
}

export interface RetentionPoint {
  day: number;
  retention: number;
}

/** Projected memory strength if the learner does nothing for N days. */
export function retentionForecast(cards: CardState[], days = 14, now = Date.now()): RetentionPoint[] {
  const points: RetentionPoint[] = [];
  for (let day = 0; day <= days; day += 1) {
    const at = now + day * DAY_MS;
    const active = cards.filter((card) => card.reps > 0);
    const value = active.length === 0 ? 0 : active.reduce((sum, card) => sum + retrievability(card, at), 0) / active.length;
    points.push({ day, retention: value });
  }
  return points;
}

export function accuracyOf(state: AppState): number {
  const attempts = SKILL_KEYS.reduce((sum, skill) => sum + (state.skills[skill]?.attempts ?? 0), 0);
  const correct = SKILL_KEYS.reduce((sum, skill) => sum + (state.skills[skill]?.correct ?? 0), 0);
  return attempts === 0 ? 0 : correct / attempts;
}

export function todayXp(state: AppState, today = dayKey()): number {
  return state.xp.daily[today] ?? 0;
}
