import { act } from '@/core/events';
import { esc, qs } from '@/core/dom';
import { t } from '@/core/i18n';
import { setLang } from '@/core/i18n';
import { navigate } from '@/core/router';
import { refresh } from '@/core/render';
import { XP_AWARD } from '@/core/gamification';
import { CEFR_ORDER } from '@/core/types';
import type { CefrLevel, UiLang } from '@/core/types';
import { grantXp, recordAttempt, unlockBadges } from '@/core/progress';
import { PLACEMENT } from '@/data/extras';
import { store } from '@/state';
import { bar, button, cefrChip } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

type Stage = 'setup' | 'quiz' | 'done';

interface Session {
  stage: Stage;
  index: number;
  correct: number;
  result: CefrLevel | null;
}

let session: Session = { stage: 'setup', index: 0, correct: 0, result: null };

export function cefrFromPlacement(correct: number, total: number): CefrLevel {
  const accuracy = total === 0 ? 0 : correct / total;
  if (accuracy >= 0.92) return 'C2';
  if (accuracy >= 0.8) return 'C1';
  if (accuracy >= 0.65) return 'B2';
  if (accuracy >= 0.5) return 'B1';
  if (accuracy >= 0.34) return 'A2';
  return 'A1';
}

function setupView(): string {
  const state = store.get();
  return `<div class="ej-fade max-w-3xl mx-auto py-6">
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-2 ej-chip ej-chip-accent mb-4">${icon('sparkle', 14)}<span>English Janala 2.0</span></div>
      <h1 class="text-3xl sm:text-4xl font-bold tracking-tight">${esc(t('onb.title'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-2">${esc(t('onb.sub'))}</p>
    </div>
    <form class="ej-card grid gap-4" data-act="onb-setup">
      <label class="grid gap-1.5">
        <span class="text-sm font-medium">${esc(t('onb.name'))}</span>
        <input id="onb-name" class="ej-input" maxlength="32" placeholder="রিনা / Rina" value="${esc(state.profile.name)}" />
      </label>
      <div class="grid sm:grid-cols-2 gap-4">
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(t('onb.goal'))}</span>
          <select id="onb-goal" class="ej-select">
            ${['speak', 'exam', 'job', 'school']
              .map(
                (goal) =>
                  `<option value="${goal}" ${state.profile.goal === goal ? 'selected' : ''}>${esc(t(`onb.goal.${goal}`))}</option>`,
              )
              .join('')}
          </select>
        </label>
        <label class="grid gap-1.5">
          <span class="text-sm font-medium">${esc(t('onb.lang'))}</span>
          <select id="onb-lang" class="ej-select">
            <option value="bn" ${state.prefs.uiLang === 'bn' ? 'selected' : ''}>বাংলা</option>
            <option value="en" ${state.prefs.uiLang === 'en' ? 'selected' : ''}>English</option>
          </select>
        </label>
      </div>
      <div class="flex flex-wrap gap-3 pt-2">
        ${button({ act: 'onb-start-placement', type: 'submit', label: t('onb.placement'), icon: 'target' })}
        ${button({ act: 'onb-skip', variant: 'ghost', label: t('onb.skip'), icon: 'arrow' })}
      </div>
    </form>
    <div class="grid sm:grid-cols-3 gap-3 mt-6">
      ${featureCard('repeat', 'Spaced repetition', 'শব্দ ভোলার ঠিক আগের মুহূর্তে কার্ড ফিরে আসে।')}
      ${featureCard('compass', 'Six skill labs', 'পড়া, শোনা, বলা, গ্রামার, লেখা ও শব্দভাণ্ডার।')}
      ${featureCard('lock', 'Offline & private', 'সব ডেটা আপনার ব্রাউজারে, কোনো অ্যাকাউন্ট লাগে না।')}
    </div>
  </div>`;
}

function featureCard(iconName: string, title: string, body: string): string {
  return `<div class="ej-card flex gap-3 items-start">
    <span class="ej-icon-badge">${icon(iconName, 18)}</span>
    <div>
      <div class="text-sm font-semibold">${esc(title)}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${esc(body)}</div>
    </div>
  </div>`;
}

function quizView(): string {
  const item = PLACEMENT[session.index];
  if (!item) return '';
  const progress = session.index / PLACEMENT.length;
  return `<div class="ej-fade max-w-2xl mx-auto py-6">
    <div class="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
      <span>${esc(t('onb.placement'))}</span>
      <span>${esc(`${t('onb.question')} ${session.index + 1} / ${PLACEMENT.length}`)}</span>
    </div>
    ${bar(progress, '#38bdf8', 6)}
    <div class="ej-card mt-5">
      <div class="flex items-center gap-2 mb-3">${cefrChip(item.cefr)}<span class="ej-chip">${esc(item.id)}</span></div>
      <h2 class="text-lg font-semibold mb-4">${esc(item.prompt)}</h2>
      <div class="grid gap-2">
        ${item.options
          .map(
            (option, index) =>
              `<button type="button" class="ej-btn ej-btn-outline justify-start" data-act="onb-answer" data-args='${esc(
                JSON.stringify({ i: index }),
              )}'>${esc(option)}</button>`,
          )
          .join('')}
      </div>
    </div>
  </div>`;
}

function doneView(): string {
  const cefr = session.result ?? 'A2';
  return `<div class="ej-fade max-w-xl mx-auto py-10 text-center">
    <span class="ej-icon-badge mx-auto mb-4" style="width:56px;height:56px">${icon('trophy', 26)}</span>
    <h1 class="text-2xl font-bold mb-2">${esc(t('onb.result'))}</h1>
    <div class="my-5">${cefrChip(cefr)}</div>
    <p class="text-slate-500 dark:text-slate-400 mb-6">${esc(
      `${session.correct} / ${PLACEMENT.length} ${t('common.correct').toLowerCase()} — ${t('onb.sub')}`,
    )}</p>
    ${button({ act: 'onb-finish', label: t('onb.begin'), icon: 'arrow', extra: 'ej-btn-block' })}
  </div>`;
}

function finishOnboarding(): void {
  store.set((state) => {
    state.onboarded = true;
    if (session.result) state.profile.cefr = session.result;
    state.profile.placementScore = session.correct;
    grantXp(state, XP_AWARD.placement);
    recordAttempt(state, 'grammar', session.correct, PLACEMENT.length);
    unlockBadges(state);
  });
  toast({ title: t('toast.deckFull') === 'toast.deckFull' ? 'Ready to learn' : t('toast.deckFull'), body: `CEFR ${session.result ?? 'A2'}`, tone: 'success' });
  navigate('#/');
  refresh();
}

act('onb-setup', (_el, _args, event) => {
  event.preventDefault();
  const name = qs<HTMLInputElement>('#onb-name')?.value.trim() ?? '';
  const goal = qs<HTMLSelectElement>('#onb-goal')?.value ?? 'speak';
  const lang = (qs<HTMLSelectElement>('#onb-lang')?.value ?? 'bn') as UiLang;
  store.set((state) => {
    state.profile.name = name;
    state.profile.goal = goal;
    state.prefs.uiLang = lang;
  });
  setLang(lang);
  refresh();
});

act('onb-start-placement', (el, _args, event) => {
  event.preventDefault();
  const name = qs<HTMLInputElement>('#onb-name')?.value.trim();
  const goal = qs<HTMLSelectElement>('#onb-goal')?.value;
  const lang = qs<HTMLSelectElement>('#onb-lang')?.value as UiLang | undefined;
  store.set((state) => {
    if (name !== undefined) state.profile.name = name;
    if (goal !== undefined) state.profile.goal = goal;
    if (lang !== undefined) state.prefs.uiLang = lang;
  });
  if (lang) setLang(lang);
  session = { stage: 'quiz', index: 0, correct: 0, result: null };
  void el;
  refresh();
});

act('onb-skip', () => {
  store.set((state) => {
    state.onboarded = true;
  });
  navigate('#/');
  refresh();
});

act('onb-answer', (_el, args) => {
  const item = PLACEMENT[session.index];
  if (!item) return;
  const chosen = Number(args.i);
  if (chosen === item.answer) session.correct += 1;
  session.index += 1;
  if (session.index >= PLACEMENT.length) {
    session.result = cefrFromPlacement(session.correct, PLACEMENT.length);
    session.stage = 'done';
  }
  refresh();
});

act('onb-finish', () => {
  finishOnboarding();
});

export const onboardingView: ViewDef = {
  key: 'onboarding',
  labelKey: 'onb.title',
  icon: 'sparkle',
  href: '#/welcome',
  pattern: '/welcome',
  nav: false,
  render: () => {
    if (session.stage === 'quiz') return quizView();
    if (session.stage === 'done') return doneView();
    return setupView();
  },
};

export const CEFR_LIST = CEFR_ORDER;
