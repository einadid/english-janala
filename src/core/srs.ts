/**
 * Spaced repetition scheduler.
 *
 * A compact, dependency-free take on the FSRS family of algorithms: every card
 * carries a *stability* (how many days of memory it holds) and a *difficulty*.
 * Recall probability follows a power forgetting curve, and the next interval is
 * the point where recall drops to `requestRetention`.
 *
 * Pure functions only -> fully unit tested in tests/srs.test.ts.
 */

import type { CardState, CardStateName } from './types';

export type Rating = 1 | 2 | 3 | 4;


export const RATING_LABELS: Record<Rating, { en: string; bn: string; key: string }> = {
  1: { en: 'Forgot', bn: 'ভুলে গেছি', key: '1' },
  2: { en: 'Hard', bn: 'কঠিন ছিল', key: '2' },
  3: { en: 'Good', bn: 'ঠিক আছে', key: '3' },
  4: { en: 'Easy', bn: 'সহজ', key: '4' },
};

export const SRS = {
  /** Target recall probability when a card comes back. */
  requestRetention: 0.9,
  /** Power-curve decay constants. */
  decay: -0.5,
  factor: 19 / 81,
  /** Initial stability (days) per rating: again, hard, good, easy. */
  initialStability: { 1: 0.4, 2: 1.2, 3: 3.2, 4: 6.5 } as Record<Rating, number>,
  /** How strongly difficulty modulates growth. */
  growth: 1.05,
  /** Stability exponent used when growing memory. */
  stabilityPower: 0.22,
  /** Bonus applied when the card was nearly forgotten (desirable difficulty). */
  recallBoost: 2.6,
  /** Stability multiplier after a lapse. */
  lapseFactor: 0.35,
  /** Difficulty drift per rating step. */
  difficultyDrift: 0.18,
  minIntervalMs: 4 * 60 * 1000,
  maxIntervalMs: 365 * 24 * 60 * 60 * 1000,
};

export const DAY_MS = 24 * 60 * 60 * 1000;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function newCard(id: string, now = Date.now()): CardState {
  return { id, state: 'new', stability: 0, difficulty: 5, due: now, reps: 0, lapses: 0, last: null };
}

/** Probability that the learner still remembers the card right now (0..1). */
export function retrievability(card: CardState, now = Date.now()): number {
  if (card.reps === 0 || card.stability <= 0) return 0;
  const elapsedDays = Math.max(0, (now - (card.last ?? now)) / DAY_MS);
  // Power forgetting curve: at t == stability, recall equals requestRetention.
  return Math.pow(1 + (SRS.factor * elapsedDays) / card.stability, SRS.decay);
}

/** Interval in ms for a given stability, clamped to sane bounds. */
export function nextIntervalMs(stability: number): number {
  const days = (stability / SRS.factor) * (Math.pow(SRS.requestRetention, 1 / SRS.decay) - 1);
  return clamp(Math.round(days * DAY_MS), SRS.minIntervalMs, SRS.maxIntervalMs);
}

export function stateName(card: CardState, intervalMs: number): CardStateName {
  if (card.reps <= 1) return 'learning';
  if (intervalMs >= 21 * DAY_MS) return 'mastered';
  return 'review';
}

/** Apply one review and return the *next* card state (pure). */
export function review(card: CardState, rating: Rating, now = Date.now()): CardState {
  const first = card.reps === 0;
  const r = first ? 0 : retrievability(card, now);

  let stability: number;
  let difficulty = clamp(card.difficulty + (3 - rating) * SRS.difficultyDrift, 1, 10);

  if (rating === 1) {
    stability = Math.max(0.3, first ? SRS.initialStability[1] : card.stability * SRS.lapseFactor);
    difficulty = clamp(difficulty + 0.25, 1, 10);
  } else if (first) {
    stability = SRS.initialStability[rating];
  } else {
    const difficultyTerm = Math.exp(SRS.growth * (1 - (difficulty - 1) / 9));
    const recallTerm = Math.exp((1 - r) * SRS.recallBoost) - 1;
    const fade = Math.pow(card.stability, -SRS.stabilityPower);
    const ratingBoost = rating === 4 ? 1.6 : rating === 2 ? 0.7 : 1;
    stability = card.stability * (1 + difficultyTerm * recallTerm * fade * ratingBoost) + 0.05;
  }

  stability = clamp(stability, 0.1, 365 * 5);
  const intervalMs = rating === 1 ? SRS.minIntervalMs : nextIntervalMs(stability);
  const reps = card.reps + 1;

  return {
    id: card.id,
    state: rating === 1 ? 'learning' : stateName({ ...card, reps }, intervalMs),
    stability,
    difficulty,
    due: now + intervalMs,
    reps,
    lapses: card.lapses + (rating === 1 ? 1 : 0),
    last: now,
  };
}

/** Cards that are due, hardest memory first (most fragile memories first). */
export function dueCards(cards: CardState[], now = Date.now(), limit?: number): CardState[] {
  const due = cards.filter((card) => card.due <= now);
  due.sort((a, b) => a.due - b.due || a.stability - b.stability);
  return limit === undefined ? due : due.slice(0, limit);
}

/** Fraction of a deck that is still reliably retained (0..1). */
export function retention(cards: CardState[], now = Date.now()): number {
  if (cards.length === 0) return 0;
  const sum = cards.reduce((acc, card) => acc + (card.reps === 0 ? 0 : retrievability(card, now)), 0);
  return sum / cards.length;
}

export function humaniseInterval(ms: number): string {
  if (ms < 60 * 1000) return `${Math.max(1, Math.round(ms / 1000))}s`;
  if (ms < 60 * 60 * 1000) return `${Math.round(ms / 60000)}m`;
  if (ms < DAY_MS) return `${Math.round(ms / (60 * 60 * 1000))}h`;
  const days = Math.round(ms / DAY_MS);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months}mo` : `${(days / 365).toFixed(1)}y`;
}
