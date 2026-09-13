import { act } from '@/core/events';
import { esc, qs } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { applyPrefs } from '@/core/prefs';
import { listVoices, speak } from '@/core/audio';
import { storageAvailable } from '@/core/storage';
import { parseState } from '@/core/exportImport';
import { dayKey, touchStreak } from '@/core/gamification';
import { newCard, review } from '@/core/srs';
import { addToDeck, markWordSeen, unlockBadges } from '@/core/progress';
import { VOCABULARY } from '@/data/vocabulary';
import { store } from '@/state';
import { button, card, sectionTitle, toggle } from '@/ui/components';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

function render(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  const voices = listVoices(state.prefs.accent);

  return `<div class="ej-fade grid gap-5 py-6 max-w-3xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.settings'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('set.appearance'))} · ${esc(t('set.voice'))} · ${esc(t('set.data'))}</p>
    </header>

    ${card(`${sectionTitle(t('set.appearance'), '', 'sun')}
      <div class="grid gap-3">
        ${toggle({
          act: 'set-theme',
          id: 'set-theme',
          checked: state.prefs.theme === 'dark',
          label: lang === 'bn' ? 'ডার্ক থিম' : 'Dark theme',
          hint: lang === 'bn' ? 'চোখের আরামের জন্য' : 'Easier on the eyes at night',
        })}
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(t('onb.lang'))}</span>
          <select class="ej-select" data-act="set-lang">
            <option value="bn" ${lang === 'bn' ? 'selected' : ''}>বাংলা</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
          </select>
        </label>
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(lang === 'bn' ? 'লেখার আকার' : 'Text size')}</span>
          <select class="ej-select" data-act="set-font">
            <option value="1" ${state.prefs.fontScale === 1 ? 'selected' : ''}>${esc(lang === 'bn' ? 'স্বাভাবিক' : 'Normal')}</option>
            <option value="1.1" ${state.prefs.fontScale === 1.1 ? 'selected' : ''}>${esc(lang === 'bn' ? 'বড়' : 'Large')}</option>
            <option value="1.25" ${state.prefs.fontScale === 1.25 ? 'selected' : ''}>${esc(lang === 'bn' ? 'সবচেয়ে বড়' : 'Largest')}</option>
          </select>
        </label>
      </div>`)}

    ${card(`${sectionTitle(t('set.accessibility'), '', 'eye')}
      <div class="grid gap-3">
        ${toggle({
          act: 'set-toggle',
          args: { key: 'dyslexiaFont' },
          id: 'set-dyslexia',
          checked: state.prefs.dyslexiaFont,
          label: lang === 'bn' ? 'পড়ার সুবিধার জন্য অতিরিক্ত ফাঁকা' : 'Extra letter spacing (dyslexia friendly)',
        })}
        ${toggle({
          act: 'set-toggle',
          args: { key: 'reduceMotion' },
          id: 'set-motion',
          checked: state.prefs.reduceMotion,
          label: lang === 'bn' ? 'অ্যানিমেশন কমান' : 'Reduce motion',
        })}
      </div>`)}

    ${card(`${sectionTitle(t('set.voice'), '', 'volume')}
      <div class="grid gap-3">
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(lang === 'bn' ? 'অ্যাকসেন্ট' : 'Accent')}</span>
          <select class="ej-select" data-act="set-accent">
            <option value="en-GB" ${state.prefs.accent === 'en-GB' ? 'selected' : ''}>British (en-GB)</option>
            <option value="en-US" ${state.prefs.accent === 'en-US' ? 'selected' : ''}>American (en-US)</option>
          </select>
        </label>
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(lang === 'bn' ? 'ভয়েস' : 'Voice')}</span>
          ${
            voices.length === 0
              ? `<p class="text-sm text-slate-500 dark:text-slate-400">${esc(t('set.voiceNone'))}</p>`
              : `<select class="ej-select" data-act="set-voice">
                  ${voices
                    .map(
                      (voice) =>
                        `<option value="${esc(voice.uri)}" ${
                          state.prefs.ttsVoiceURI === voice.uri ? 'selected' : ''
                        }>${esc(voice.name)} · ${esc(voice.lang)}</option>`,
                    )
                    .join('')}
                </select>`
          }
        </label>
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(t('lis.speed'))}: <span class="tabular-nums">${state.prefs.ttsRate}x</span></span>
          <input type="range" min="0.5" max="1.4" step="0.05" value="${state.prefs.ttsRate}" class="w-full accent-[color:var(--ej-accent)]" data-act="set-rate" />
        </label>
        ${button({ act: 'set-preview', label: t('common.listen'), icon: 'volume', variant: 'soft' })}
      </div>`)}

    ${card(`${sectionTitle(t('set.data'), storageAvailable() ? (lang === 'bn' ? 'ব্রাউজারে সংরক্ষিত' : 'Saved in this browser') : (lang === 'bn' ? 'স্টোরেজ নেই' : 'Storage unavailable'), 'lock')}
      <div class="grid gap-3">
        <p class="text-sm text-slate-500 dark:text-slate-400">${esc(t('set.dangerNote'))}</p>
        <div class="flex flex-wrap gap-2">
          ${button({ act: 'data-export', label: t('ins.export'), icon: 'download', variant: 'outline' })}
          ${button({ act: 'data-import-pick', args: { id: 'settings-file' }, label: t('ins.import'), icon: 'upload', variant: 'outline' })}
          ${button({ act: 'set-demo', label: lang === 'bn' ? 'নমুনা অগ্রগতি লোড করুন' : 'Load sample progress', icon: 'sparkle', variant: 'soft' })}
          ${button({ act: 'data-reset', label: t('set.danger'), icon: 'trash', variant: 'danger' })}
        </div>
        <input id="settings-file" type="file" accept="application/json" class="hidden" data-act="data-import" />
      </div>`)}

    ${card(`${sectionTitle(lang === 'bn' ? 'কীবোর্ড শর্টকাট' : 'Keyboard shortcuts', '', 'keyboard')}
      <div class="grid sm:grid-cols-2 gap-2 text-sm">
        ${shortcut('Ctrl / ⌘ + K', lang === 'bn' ? 'কমান্ড প্যালেট' : 'Command palette')}
        ${shortcut('G then D', lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard')}
        ${shortcut('G then L', lang === 'bn' ? 'শিখুন' : 'Learn')}
        ${shortcut('G then R', lang === 'bn' ? 'রিভিউ' : 'Review')}
        ${shortcut('G then T', lang === 'bn' ? 'টিউটর' : 'Tutor')}
        ${shortcut('Esc', lang === 'bn' ? 'বন্ধ করুন' : 'Close overlays')}
      </div>`)}
  </div>`;
}

function shortcut(keys: string, label: string): string {
  return `<div class="flex items-center justify-between gap-3">
    <span class="text-slate-500 dark:text-slate-400">${esc(label)}</span>
    <kbd class="ej-chip font-mono">${esc(keys)}</kbd>
  </div>`;
}

function persistPrefs(): void {
  applyPrefs(store.get());
  refresh();
}

act('set-theme', () => {
  store.set((state) => {
    state.prefs.theme = state.prefs.theme === 'dark' ? 'light' : 'dark';
  });
  persistPrefs();
});

act('set-lang', (el) => {
  const value = (el as HTMLSelectElement).value === 'en' ? 'en' : 'bn';
  store.set((state) => {
    state.prefs.uiLang = value;
  });
  persistPrefs();
});

act('set-font', (el) => {
  const value = Number((el as HTMLSelectElement).value);
  store.set((state) => {
    state.prefs.fontScale = value === 1.25 ? 1.25 : value === 1.1 ? 1.1 : 1;
  });
  persistPrefs();
});

act('set-accent', (el) => {
  const value = (el as HTMLSelectElement).value === 'en-US' ? 'en-US' : 'en-GB';
  store.set((state) => {
    state.prefs.accent = value;
    state.prefs.ttsVoiceURI = null;
  });
  persistPrefs();
});

act('set-voice', (el) => {
  const value = (el as HTMLSelectElement).value;
  store.set((state) => {
    state.prefs.ttsVoiceURI = value || null;
  });
  refresh();
});

act('set-rate', (el) => {
  const value = Number((el as HTMLInputElement).value);
  store.set((state) => {
    state.prefs.ttsRate = Number.isFinite(value) ? value : 0.95;
  });
  applyPrefs(store.get());
  refresh();
});

act('set-preview', () => {
  const prefs = store.get().prefs;
  const sample = store.get().prefs.uiLang === 'bn' ? 'Practice makes a language yours.' : 'Practice makes a language yours.';
  speak(sample, { rate: prefs.ttsRate, voiceURI: prefs.ttsVoiceURI, accent: prefs.accent });
});

act('set-toggle', (_el, args) => {
  const key = typeof args.key === 'string' ? args.key : '';
  if (key !== 'dyslexiaFont' && key !== 'reduceMotion') return;
  store.set((state) => {
    state.prefs[key] = !state.prefs[key];
  });
  persistPrefs();
});

act('data-import', async (el) => {
  const input = el as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const raw = await file.text();
  const parsed = parseState(raw);
  if (!parsed) {
    toast({ title: t('cmd.empty'), tone: 'error' });
    return;
  }
  store.replace(parsed);
  applyPrefs(store.get());
  toast({ title: t('ins.import'), tone: 'success' });
  refresh();
});

act('data-reset', () => {
  if (!window.confirm(t('set.confirmReset'))) return;
  store.reset();
  applyPrefs(store.get());
  toast({ title: t('set.danger'), tone: 'warn' });
  refresh();
});

/** Seed a believable history so the analytics views can be explored immediately. */
act('set-demo', () => {
  const now = Date.now();
  store.set((state) => {
    const sample = VOCABULARY.slice(0, 48);
    sample.forEach((word, index) => {
      addToDeck(state, word.id, now);
      markWordSeen(state, word.id, word.level);
      let card = state.cards[word.id] ?? newCard(word.id, now);
      const ratings = [3, 4, 3, 2][index % 4] as 2 | 3 | 4;
      for (let rep = 0; rep < (index % 4) + 1; rep += 1) {
        card = review(card, ratings, now - (6 - rep) * 24 * 60 * 60 * 1000);
      }
      state.cards[word.id] = card;
    });

    state.xp.total = 0;
    state.xp.daily = {};
    for (let day = 13; day >= 0; day -= 1) {
      const key = dayKey(new Date(now - day * 24 * 60 * 60 * 1000));
      const value = 40 + ((index0(day) * 37) % 160);
      state.xp.daily[key] = value;
      state.xp.total += value;
      state.xp.streak = touchStreak(state.xp.streak, key);
    }

    const skills: Array<[keyof typeof state.skills, number, number]> = [
      ['vocab', 132, 168],
      ['reading', 14, 16],
      ['listening', 96, 130],
      ['speaking', 5, 9],
      ['grammar', 27, 38],
      ['writing', 62, 100],
    ];
    for (const [skill, correct, attempts] of skills) {
      state.skills[skill] = { xp: correct * 8, correct, attempts };
    }

    state.sessions = skills.map(([skill, correct, attempts], index) => ({
      id: `demo-${skill}`,
      skill,
      at: now - index * 3600 * 1000,
      correct,
      total: attempts,
      xp: correct * 8,
    }));

    unlockBadges(state);
  });
  toast({ title: t('set.data'), body: '48 cards · 14 days', tone: 'success' });
  applyPrefs(store.get());
  refresh();
});

function index0(day: number): number {
  return day + 3;
}

export const settingsView: ViewDef = {
  key: 'settings',
  labelKey: 'nav.settings',
  icon: 'settings',
  href: '#/settings',
  pattern: '/settings',
  nav: true,
  render,
  after: () => {
    qs<HTMLInputElement>('#settings-file')?.addEventListener('change', () => undefined);
  },
};
