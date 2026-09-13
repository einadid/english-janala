/** Progress maths: day keys, streaks, XP levels, badges. Pure and unit tested. */

export interface Streak {
  current: number;
  longest: number;
  lastDay: string | null;
}

export interface BadgeMetrics {
  xp: number;
  streak: number;
  reviews: number;
  perfectSessions: number;
  wordsSeen: number;
  wordsMastered: number;
  lessons: number;
  reading: number;
  listening: number;
  speaking: number;
  writing: number;
  grammar: number;
  days: number;
}

export interface Badge {
  id: string;
  icon: string;
  name: string;
  nameBn: string;
  desc: string;
  descBn: string;
  check: (m: BadgeMetrics) => boolean;
}

export const DAY_MS = 24 * 60 * 60 * 1000;

/** Local-time day key, e.g. 2026-09-13. */
export function dayKey(date: Date | number = new Date()): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const left = Date.UTC(ay ?? 0, (am ?? 1) - 1, ad ?? 0);
  const right = Date.UTC(by ?? 0, (bm ?? 1) - 1, bd ?? 0);
  return Math.round((right - left) / DAY_MS);
}

/** Apply today's practice to the streak counter. */
export function touchStreak(streak: Streak, today = dayKey()): Streak {
  if (streak.lastDay === today) return streak;
  const gap = streak.lastDay ? daysBetween(streak.lastDay, today) : Infinity;
  const current = gap === 1 ? streak.current + 1 : 1;
  return { current, longest: Math.max(streak.longest, current), lastDay: today };
}

/** XP required to *complete* a level (levels start at 1). */
export function xpToCompleteLevel(level: number): number {
  return Math.round(120 * Math.pow(level, 1.35));
}

export interface LevelProgress {
  level: number;
  into: number;
  needed: number;
  pct: number;
  toNext: number;
}

export function levelFromXp(totalXp: number): LevelProgress {
  let level = 1;
  let spent = 0;
  while (totalXp - spent >= xpToCompleteLevel(level) && level < 99) {
    spent += xpToCompleteLevel(level);
    level += 1;
  }
  const needed = xpToCompleteLevel(level);
  const into = Math.max(0, totalXp - spent);
  return {
    level,
    into,
    needed,
    pct: needed === 0 ? 0 : Math.min(1, into / needed),
    toNext: Math.max(0, needed - into),
  };
}

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    icon: 'seedling',
    name: 'First Step',
    nameBn: 'প্রথম ধাপ',
    desc: 'Complete your first review',
    descBn: 'প্রথম রিভিউ শেষ করুন',
    check: (m) => m.reviews >= 1,
  },
  {
    id: 'streak-3',
    icon: 'flame',
    name: 'Three Day Flame',
    nameBn: 'তিন দিনের শিখা',
    desc: 'Practise 3 days in a row',
    descBn: 'টানা ৩ দিন অনুশীলন',
    check: (m) => m.streak >= 3,
  },
  {
    id: 'streak-7',
    icon: 'fire',
    name: 'Week Warrior',
    nameBn: 'সপ্তাহ যোদ্ধা',
    desc: 'Practise 7 days in a row',
    descBn: 'টানা ৭ দিন অনুশীলন',
    check: (m) => m.streak >= 7,
  },
  {
    id: 'word-25',
    icon: 'book',
    name: 'Word Collector',
    nameBn: 'শব্দ সংগ্রাহক',
    desc: 'Open 25 vocabulary cards',
    descBn: '২৫টি শব্দ কার্ড দেখুন',
    check: (m) => m.wordsSeen >= 25,
  },
  {
    id: 'master-20',
    icon: 'crown',
    name: 'Memory Master',
    nameBn: 'স্মৃতি সম্রাট',
    desc: 'Master 20 words',
    descBn: '২০টি শব্দ আয়ত্ত করুন',
    check: (m) => m.wordsMastered >= 20,
  },
  {
    id: 'review-100',
    icon: 'repeat',
    name: 'Repetition Engine',
    nameBn: 'পুনরাবৃত্তি ইঞ্জিন',
    desc: '100 spaced reviews',
    descBn: '১০০টি স্পেসড রিভিউ',
    check: (m) => m.reviews >= 100,
  },
  {
    id: 'perfect-session',
    icon: 'target',
    name: 'Bullseye',
    nameBn: 'নিখুঁত লক্ষ্য',
    desc: 'Finish a session with 100% accuracy',
    descBn: '১০০% নির্ভুলতায় সেশন শেষ',
    check: (m) => m.perfectSessions >= 1,
  },
  {
    id: 'poly-skill',
    icon: 'compass',
    name: 'All-Rounder',
    nameBn: 'সবদিক দিয়ে এগিয়ে',
    desc: 'Practise all six skill labs',
    descBn: 'ছয়টি স্কিল ল্যাবে অনুশীলন',
    check: (m) => m.reading > 0 && m.listening > 0 && m.speaking > 0 && m.writing > 0 && m.grammar > 0 && m.wordsSeen > 0,
  },
  {
    id: 'writer',
    icon: 'pen',
    name: 'Storyteller',
    nameBn: 'গল্পকার',
    desc: 'Submit 3 writing drafts',
    descBn: '৩টি লেখা জমা দিন',
    check: (m) => m.writing >= 3,
  },
  {
    id: 'speaker',
    icon: 'mic',
    name: 'Voice Found',
    nameBn: 'কণ্ঠস্বর',
    desc: 'Score 90+ on 5 speaking drills',
    descBn: '৫টি স্পিকিং ড্রিলে ৯০+',
    check: (m) => m.speaking >= 5,
  },
  {
    id: 'scholar',
    icon: 'star',
    name: 'Scholar',
    nameBn: 'পণ্ডিত',
    desc: 'Earn 2000 XP',
    descBn: '২০০০ এক্সপি অর্জন',
    check: (m) => m.xp >= 2000,
  },
];

export function earnedBadges(metrics: BadgeMetrics): string[] {
  return BADGES.filter((badge) => badge.check(metrics)).map((badge) => badge.id);
}

export const XP_AWARD = {
  wordOpen: 2,
  cardReview: 6,
  cardMastered: 12,
  quizCorrect: 8,
  quizWrong: 1,
  passage: 15,
  dictation: 10,
  speaking: 10,
  writing: 20,
  placement: 25,
} as const;
