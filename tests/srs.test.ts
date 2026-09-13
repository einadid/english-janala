import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  SRS,
  dueCards,
  humaniseInterval,
  newCard,
  nextIntervalMs,
  retention,
  retrievability,
  review,
} from '@/core/srs';

const NOW = Date.UTC(2026, 8, 13, 12, 0, 0);

describe('spaced repetition scheduler', () => {
  it('starts a card as new with zero stability', () => {
    const card = newCard('l1-01', NOW);
    expect(card.state).toBe('new');
    expect(card.stability).toBe(0);
    expect(card.reps).toBe(0);
    expect(retrievability(card, NOW)).toBe(0);
  });

  it('returns exactly the target retention one stability later', () => {
    const once = review(newCard('l1-01', NOW), 3, NOW);
    const oneStabilityLater = NOW + once.stability * DAY_MS;
    expect(retrievability(once, oneStabilityLater)).toBeCloseTo(SRS.requestRetention, 6);
  });

  it('decays towards zero as time passes', () => {
    const card = review(newCard('l1-01', NOW), 3, NOW);
    const soon = retrievability(card, NOW + DAY_MS);
    const later = retrievability(card, NOW + 30 * DAY_MS);
    const yearLater = retrievability(card, NOW + 365 * DAY_MS);
    expect(soon).toBeGreaterThan(later);
    expect(later).toBeLessThan(0.6);
    expect(yearLater).toBeLessThan(0.3);
    expect(yearLater).toBeGreaterThan(0);
  });

  it('schedules the next interval at the requested retention point', () => {
    const stability = 5;
    const interval = nextIntervalMs(stability);
    expect(interval).toBeCloseTo(stability * DAY_MS, -3);
  });

  it('grows memory on success and shrinks it on a lapse', () => {
    const first = review(newCard('l1-02', NOW), 3, NOW);
    const second = review(first, 3, first.due);
    expect(second.stability).toBeGreaterThan(first.stability);
    expect(second.due).toBeGreaterThan(first.due);

    const lapsed = review(second, 1, second.due);
    expect(lapsed.stability).toBeLessThan(second.stability);
    expect(lapsed.state).toBe('learning');
    expect(lapsed.lapses).toBe(second.lapses + 1);
  });

  it('rewards an Easy rating with a longer interval than Good', () => {
    const good = review(newCard('l1-03', NOW), 3, NOW);
    const easy = review(newCard('l1-03', NOW), 4, NOW);
    expect(easy.due).toBeGreaterThan(good.due);
  });

  it('marks long intervals as mastered', () => {
    let card = newCard('l1-04', NOW);
    for (let i = 0; i < 8; i += 1) {
      card = review(card, 4, card.due);
    }
    expect(card.reps).toBe(8);
    expect(['mastered', 'review']).toContain(card.state);
  });

  it('queues due cards oldest first and respects the limit', () => {
    const cards = [
      review(newCard('a', NOW), 3, NOW - 5 * DAY_MS),
      review(newCard('b', NOW), 3, NOW - 9 * DAY_MS),
      review(newCard('c', NOW), 3, NOW + 5 * DAY_MS),
    ];
    const due = dueCards(cards, NOW);
    expect(due.map((card) => card.id)).toEqual(['b', 'a']);
    expect(dueCards(cards, NOW, 1)).toHaveLength(1);
  });

  it('reports retention between 0 and 1', () => {
    const cards = [review(newCard('a', NOW), 3, NOW), review(newCard('b', NOW), 4, NOW)];
    const value = retention(cards, NOW + DAY_MS);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThanOrEqual(1);
    expect(retention([], NOW)).toBe(0);
  });

  it('humanises intervals readably', () => {
    expect(humaniseInterval(30 * 1000)).toBe('30s');
    expect(humaniseInterval(5 * 60 * 1000)).toBe('5m');
    expect(humaniseInterval(3 * 60 * 60 * 1000)).toBe('3h');
    expect(humaniseInterval(12 * DAY_MS)).toBe('12d');
    expect(humaniseInterval(200 * DAY_MS)).toBe('7mo');
    expect(humaniseInterval(600 * DAY_MS)).toBe('1.6y');
  });
});
