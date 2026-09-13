import type { AppState, SkillKey } from './types';
import { readJSON, writeJSON, removeKey } from './storage';

export const STATE_KEY = 'state:v2';
export const STATE_VERSION = 2;

const SKILLS: SkillKey[] = ['vocab', 'reading', 'listening', 'speaking', 'grammar', 'writing'];

export function createInitialState(now = Date.now()): AppState {
  const skills = {} as Record<SkillKey, { xp: number; correct: number; attempts: number }>;
  for (const skill of SKILLS) skills[skill] = { xp: 0, correct: 0, attempts: 0 };

  return {
    version: STATE_VERSION,
    onboarded: false,
    profile: { name: '', goal: 'speak', cefr: 'A2', createdAt: now, placementScore: 0 },
    prefs: {
      uiLang: 'bn',
      theme: 'dark',
      ttsRate: 0.95,
      ttsVoiceURI: null,
      accent: 'en-GB',
      fontScale: 1,
      dyslexiaFont: false,
      reduceMotion: false,
    },
    xp: { total: 0, daily: {}, streak: { current: 0, longest: 0, lastDay: null } },
    skills,
    cards: {},
    known: [],
    saved: [],
    lessons: {},
    badges: [],
    reading: {},
    drafts: [],
    sessions: [],
  };
}

/** Deep-ish merge so saved state from an older build never breaks the app. */
export function hydrate(saved: Partial<AppState> | null, now = Date.now()): AppState {
  const base = createInitialState(now);
  if (!saved || typeof saved !== 'object') return base;
  return {
    ...base,
    ...saved,
    version: STATE_VERSION,
    profile: { ...base.profile, ...saved.profile },
    prefs: { ...base.prefs, ...saved.prefs },
    xp: { ...base.xp, ...saved.xp, streak: { ...base.xp.streak, ...saved.xp?.streak } },
    skills: { ...base.skills, ...saved.skills },
    cards: saved.cards ?? {},
    known: saved.known ?? [],
    saved: saved.saved ?? [],
    lessons: saved.lessons ?? {},
    badges: saved.badges ?? [],
    reading: saved.reading ?? {},
    drafts: saved.drafts ?? [],
    sessions: saved.sessions ?? [],
  };
}

export type Updater<S> = (state: S) => S | void;

export interface Store<S> {
  get(): S;
  set(updater: Updater<S>): S;
  subscribe(listener: (state: S) => void): () => void;
  replace(next: Partial<S>): S;
  reset(): S;
  persist(): boolean;
}

export function createStore(initial: AppState): Store<AppState> {
  let state: AppState = hydrate(readJSON<Partial<AppState> | null>(STATE_KEY, null) ?? initial);
  const listeners = new Set<(state: AppState) => void>();
  let timer: number | undefined;

  const persistSoon = (): void => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
      writeJSON(STATE_KEY, state);
    }, 120);
  };

  const notify = (): void => {
    for (const listener of listeners) listener(state);
    persistSoon();
  };

  return {
    get: () => state,
    set(updater) {
      const draft: AppState = { ...state };
      const returned = updater(draft);
      state = returned && typeof returned === 'object' ? (returned as AppState) : draft;
      notify();
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    replace(next: Partial<AppState>) {
      state = hydrate(next);
      notify();
      return state;
    },
    reset() {
      removeKey(STATE_KEY);
      state = createInitialState();
      notify();
      return state;
    },
    persist() {
      return writeJSON(STATE_KEY, state);
    },
  };
}
