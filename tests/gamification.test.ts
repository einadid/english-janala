import { describe, expect, it } from 'vitest';
import {
  BADGES,
  dayKey,
  daysBetween,
  earnedBadges,
  levelFromXp,
  touchStreak,
  xpToCompleteLevel,
} from '@/core/gamification';
import type { BadgeMetrics } from '@/core/gamification';

const EMPTY: BadgeMetrics = {
  xp: 0,
  streak: 0,
  reviews: 0,
  perfectSessions: 0,
  wordsSeen: 0,
  wordsMastered: 0,
  lessons: 0,
  reading: 0,
  listening: 0,
  speaking: 0,
  writing: 0,
  grammar: 0,
  days: 0,
};

describe('day maths', () => {
  it('formats a local day key', () => {
    expect(dayKey(new Date(2026, 8, 13))).toBe('2026-09-13');
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('measures the gap between day keys', () => {
    expect(daysBetween('2026-09-10', '2026-09-13')).toBe(3);
    expect(daysBetween('2026-08-31', '2026-09-01')).toBe(1);
    expect(daysBetween('2026-09-13', '2026-09-13')).toBe(0);
  });
});

describe('streaks', () => {
  it('starts at one on the first practice day', () => {
    const streak = touchStreak({ current: 0, longest: 0, lastDay: null }, '2026-09-13');
    expect(streak).toEqual({ current: 1, longest: 1, lastDay: '2026-09-13' });
  });

  it('grows on consecutive days', () => {
    let streak = touchStreak({ current: 0, longest: 0, lastDay: null }, '2026-09-11');
    streak = touchStreak(streak, '2026-09-12');
    streak = touchStreak(streak, '2026-09-13');
    expect(streak.current).toBe(3);
    expect(streak.longest).toBe(3);
  });

  it('resets after a missed day but keeps the record', () => {
    const streak = touchStreak({ current: 5, longest: 5, lastDay: '2026-09-01' }, '2026-09-05');
    expect(streak.current).toBe(1);
    expect(streak.longest).toBe(5);
  });

  it('is idempotent within one day', () => {
    const once = touchStreak({ current: 2, longest: 2, lastDay: '2026-09-13' }, '2026-09-13');
    expect(once.current).toBe(2);
  });
});

describe('levels', () => {
  it('requires more XP for each level', () => {
    expect(xpToCompleteLevel(2)).toBeGreaterThan(xpToCompleteLevel(1));
    expect(xpToCompleteLevel(5)).toBeGreaterThan(xpToCompleteLevel(4));
  });

  it('places zero XP at level 1', () => {
    const level = levelFromXp(0);
    expect(level.level).toBe(1);
    expect(level.into).toBe(0);
    expect(level.pct).toBe(0);
    expect(level.toNext).toBe(xpToCompleteLevel(1));
  });

  it('advances only when the level is complete', () => {
    const level = levelFromXp(xpToCompleteLevel(1));
    expect(level.level).toBe(2);
    expect(level.into).toBe(0);
    const partial = levelFromXp(xpToCompleteLevel(1) - 1);
    expect(partial.level).toBe(1);
    expect(partial.pct).toBeGreaterThan(0.9);
  });
});

describe('badges', () => {
  it('has unique ids', () => {
    const ids = BADGES.map((badge) => badge.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('awards nothing to a fresh learner', () => {
    expect(earnedBadges(EMPTY)).toEqual([]);
  });

  it('awards the first-step badge after one review', () => {
    expect(earnedBadges({ ...EMPTY, reviews: 1 })).toContain('first-step');
  });

  it('awards the streak badge at three days', () => {
    expect(earnedBadges({ ...EMPTY, streak: 3 })).toContain('streak-3');
    expect(earnedBadges({ ...EMPTY, streak: 2 })).not.toContain('streak-3');
  });

  it('awards the all-rounder badge only when every lab was used', () => {
    const partial = { ...EMPTY, wordsSeen: 5, reading: 1, listening: 1, speaking: 1, writing: 1, grammar: 0 };
    expect(earnedBadges(partial)).not.toContain('poly-skill');
    expect(earnedBadges({ ...partial, grammar: 1 })).toContain('poly-skill');
  });
});
