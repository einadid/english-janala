import { describe, expect, it } from 'vitest';
import { STATE_VERSION, createInitialState, hydrate } from '@/core/store';
import { applyReview, addToDeck, grantXp, markWordSeen, recordAttempt, unlockBadges } from '@/core/progress';

const NOW = Date.UTC(2026, 8, 13, 12, 0, 0);

describe('state shape', () => {
  it('creates a fresh learner with all six skills', () => {
    const state = createInitialState(NOW);
    expect(state.version).toBe(STATE_VERSION);
    expect(state.onboarded).toBe(false);
    expect(Object.keys(state.skills).sort()).toEqual(
      ['grammar', 'listening', 'reading', 'speaking', 'vocab', 'writing'].sort(),
    );
    expect(state.xp.total).toBe(0);
    expect(state.profile.createdAt).toBe(NOW);
  });

  it('repairs partial saved state instead of crashing', () => {
    const state = hydrate({ onboarded: true, xp: { total: 42, daily: {}, streak: { current: 2, longest: 5, lastDay: '2026-09-12' } } }, NOW);
    expect(state.onboarded).toBe(true);
    expect(state.xp.total).toBe(42);
    expect(state.xp.streak.longest).toBe(5);
    expect(state.prefs.uiLang).toBe('bn');
    expect(state.cards).toEqual({});
  });

  it('tolerates a null save', () => {
    expect(hydrate(null, NOW).version).toBe(STATE_VERSION);
  });
});

describe('progress mutations', () => {
  it('adds a word to the deck and marks it seen', () => {
    const state = createInitialState(NOW);
    addToDeck(state, 'l1-01', NOW);
    markWordSeen(state, 'l1-01', 1);
    expect(state.saved).toContain('l1-01');
    expect(state.cards['l1-01']).toBeDefined();
    expect(state.lessons['1']?.seen).toContain('l1-01');
    addToDeck(state, 'l1-01', NOW);
    expect(state.saved.filter((id) => id === 'l1-01')).toHaveLength(1);
  });

  it('records a review and moves the card into the future', () => {
    const state = createInitialState(NOW);
    const card = applyReview(state, 'l2-03', 3, NOW);
    expect(card.reps).toBe(1);
    expect(card.due).toBeGreaterThan(NOW);
    expect(state.cards['l2-03']?.due).toBe(card.due);
  });

  it('awards XP, touches the streak and records attempts', () => {
    const state = createInitialState(NOW);
    grantXp(state, 50, 'vocab', NOW);
    recordAttempt(state, 'vocab', 7, 10);
    expect(state.xp.total).toBe(50);
    expect(state.xp.daily['2026-09-13']).toBe(50);
    expect(state.xp.streak.current).toBe(1);
    expect(state.skills.vocab).toEqual({ xp: 50, correct: 7, attempts: 10 });
  });

  it('unlocks a badge only once', () => {
    const state = createInitialState(NOW);
    applyReview(state, 'l1-01', 3, NOW);
    const first = unlockBadges(state);
    expect(first.map((badge) => badge.id)).toContain('first-step');
    expect(unlockBadges(state)).toEqual([]);
  });
});
