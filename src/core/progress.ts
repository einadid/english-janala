/**
 * The only place that mutates learner progress. Views call these inside
 * `store.set(...)` so XP, streaks, cards and badges stay consistent.
 */

import type { AppState } from './types';
import type { Badge as BadgeDef } from './gamification';
import { BADGES, dayKey, earnedBadges, touchStreak } from './gamification';
import { badgeMetrics } from './analytics';
import { newCard, review } from './srs';
import type { Rating } from './srs';
import type { CardState, SkillKey } from './types';

export function ensureCard(state: AppState, wordId: string, now = Date.now()): CardState {
  const existing = state.cards[wordId];
  if (existing) return existing;
  const created = newCard(wordId, now);
  state.cards[wordId] = created;
  return created;
}

export function addToDeck(state: AppState, wordId: string, now = Date.now()): void {
  ensureCard(state, wordId, now);
  if (!state.saved.includes(wordId)) state.saved.push(wordId);
}

export function removeFromDeck(state: AppState, wordId: string): void {
  state.saved = state.saved.filter((id) => id !== wordId);
}

export function applyReview(state: AppState, wordId: string, rating: Rating, now = Date.now()): CardState {
  const card = ensureCard(state, wordId, now);
  const next = review(card, rating, now);
  state.cards[wordId] = next;
  return next;
}

export function grantXp(state: AppState, amount: number, skill?: SkillKey, now = Date.now()): void {
  if (amount <= 0) return;
  state.xp.total += amount;
  const key = dayKey(now);
  state.xp.daily[key] = (state.xp.daily[key] ?? 0) + amount;
  state.xp.streak = touchStreak(state.xp.streak, key);
  if (skill) {
    const record = state.skills[skill] ?? { xp: 0, correct: 0, attempts: 0 };
    record.xp += amount;
    state.skills[skill] = record;
  }
}

export function recordAttempt(state: AppState, skill: SkillKey, correct: number, attempts: number): void {
  const record = state.skills[skill] ?? { xp: 0, correct: 0, attempts: 0 };
  record.correct += correct;
  record.attempts += attempts;
  state.skills[skill] = record;
}

export function logSession(state: AppState, skill: SkillKey, correct: number, total: number, xp: number, now = Date.now()): void {
  state.sessions.unshift({ id: `${now}-${skill}`, skill, at: now, correct, total, xp });
  state.sessions = state.sessions.slice(0, 40);
}

export function markWordSeen(state: AppState, wordId: string, level: number): void {
  const key = String(level);
  const lesson = state.lessons[key] ?? { startedAt: Date.now(), seen: [] };
  if (!lesson.seen.includes(wordId)) lesson.seen.push(wordId);
  state.lessons[key] = lesson;
}

/** Award any newly satisfied badge and return the fresh ones for a toast. */
export function unlockBadges(state: AppState): BadgeDef[] {
  const satisfied = new Set(earnedBadges(badgeMetrics(state)));
  const fresh = BADGES.filter((badge) => satisfied.has(badge.id) && !state.badges.includes(badge.id));
  if (fresh.length > 0) {
    state.badges = [...state.badges, ...fresh.map((badge) => badge.id)];
  }
  return fresh;
}

