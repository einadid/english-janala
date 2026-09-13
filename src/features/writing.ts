import { act } from '@/core/events';
import { esc, qs, strArg } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { analyseWriting } from '@/core/scoring';
import { relativeTime } from '@/core/format';
import { XP_AWARD } from '@/core/gamification';
import { grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { WRITING_PROMPTS, getPrompt } from '@/data/prompts';
import { store } from '@/state';
import { bar, button, card, cefrChip, sectionTitle } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

let promptId = WRITING_PROMPTS[0]?.id ?? 'wp-01';
let text = '';

function metricsHtml(value: string): string {
  const metrics = analyseWriting(value);
  const ease = Math.max(0, Math.min(100, metrics.readingEase));
  return `<div class="grid gap-3">
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      ${metric(metrics.words, t('common.words'))}
      ${metric(metrics.sentences, 'sentences')}
      ${metric(Math.round(metrics.avgSentenceLength * 10) / 10, 'avg words/sentence')}
      ${metric(Math.round(metrics.uniqueRatio * 100) + '%', 'variety')}
    </div>
    <div class="grid gap-1">
      <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Reading ease</span><span class="tabular-nums">${Math.round(metrics.readingEase)} · ${esc(metrics.band)}</span>
      </div>
      ${bar(ease / 100, '#facc15', 6)}
    </div>
    <ul class="grid gap-1.5">
      ${metrics.checklist
        .map(
          (item) =>
            `<li class="flex items-center gap-2 text-sm">
              <span style="color:${item.ok ? '#34d399' : 'var(--ej-muted)'}">${icon(item.ok ? 'check' : 'minus', 14)}</span>
              <span class="${item.ok ? '' : 'text-slate-500 dark:text-slate-400'}">${esc(item.label)}</span>
              <span class="ml-auto text-xs text-slate-500 dark:text-slate-400 font-bangla">${esc(item.labelBn)}</span>
            </li>`,
        )
        .join('')}
    </ul>
    ${
      metrics.connectives.length > 0
        ? `<div class="flex flex-wrap gap-1.5">${metrics.connectives
            .map((word) => `<span class="ej-chip ej-chip-accent">${esc(word)}</span>`)
            .join('')}</div>`
        : ''
    }
    ${
      metrics.repeated.length > 0
        ? `<p class="text-xs text-slate-500 dark:text-slate-400">${esc('Repeated:')} ${esc(metrics.repeated.join(', '))}</p>`
        : ''
    }
  </div>`;
}

function metric(value: string | number, label: string): string {
  return `<div class="ej-card !p-3 text-center">
    <div class="text-xl font-bold tabular-nums leading-none">${esc(value)}</div>
    <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">${esc(label)}</div>
  </div>`;
}

function render(): string {
  const prompt = getPrompt(promptId) ?? WRITING_PROMPTS[0];
  const state = store.get();
  const lang = state.prefs.uiLang;
  if (!prompt) return '';
  const drafts = state.drafts.filter((draft) => draft.promptId === prompt.id);

  return `<div class="ej-fade grid gap-5 py-6 max-w-4xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.writing'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('wrt.metrics'))}</p>
    </header>

    <div class="flex gap-2 flex-wrap">
      ${WRITING_PROMPTS.map(
        (entry) =>
          `<button type="button" class="ej-btn ${entry.id === prompt.id ? 'ej-btn-primary' : 'ej-btn-outline'} ej-btn-sm"
            data-act="wrt-prompt" data-args='${esc(JSON.stringify({ id: entry.id }))}'>${esc(lang === 'bn' ? entry.titleBn : entry.title)}</button>`,
      ).join('')}
    </div>

    ${card(`
      <div class="flex items-center gap-2 mb-2">${cefrChip(prompt.cefr)}</div>
      <h2 class="text-lg font-semibold">${esc(lang === 'bn' ? prompt.promptBn : prompt.prompt)}</h2>
      <div class="flex flex-wrap gap-1.5 mt-3">
        ${prompt.starters.map((starter) => `<span class="ej-chip">${esc(starter)}</span>`).join('')}
      </div>
    `)}

    <div class="grid lg:grid-cols-3 gap-5">
      <div class="lg:col-span-2 grid gap-3">
        <textarea id="wrt-input" class="ej-textarea" placeholder="${esc(t('wrt.placeholder'))}" data-act="wrt-typed">${esc(text)}</textarea>
        <div class="flex gap-2 flex-wrap">
          ${button({ act: 'wrt-save', label: t('common.save'), icon: 'check', variant: 'primary' })}
          ${button({ act: 'wrt-clear', label: t('common.retry'), icon: 'refresh', variant: 'ghost' })}
        </div>
      </div>
      <div id="wrt-metrics">${metricsHtml(text)}</div>
    </div>

    ${
      drafts.length > 0
        ? card(`
          ${sectionTitle(t('wrt.drafts'), '', 'bookmark')}
          <div class="grid gap-2">
            ${drafts
              .map(
                (draft) =>
                  `<div class="flex items-center gap-3 ej-card !p-3">
                    <div class="min-w-0 flex-1">
                      <p class="text-sm truncate">${esc(draft.text.slice(0, 90))}${draft.text.length > 90 ? '…' : ''}</p>
                      <p class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">${esc(relativeTime(draft.updatedAt))} · ${esc(
                        t('common.score'),
                      )} ${draft.bestScore}</p>
                    </div>
                    ${button({ act: 'wrt-load', args: { id: draft.id }, label: '', icon: 'pen', variant: 'outline' })}
                    ${button({ act: 'wrt-delete', args: { id: draft.id }, label: '', icon: 'trash', variant: 'danger' })}
                  </div>`,
              )
              .join('')}
          </div>`)
        : ''
    }
  </div>`;
}

function updateMetrics(): void {
  const host = qs<HTMLElement>('#wrt-metrics');
  if (host) host.innerHTML = metricsHtml(text);
}

act('wrt-typed', (el) => {
  text = (el as HTMLTextAreaElement).value;
  updateMetrics();
});

act('wrt-prompt', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : promptId;
  if (id === promptId) return;
  promptId = id;
  text = '';
  refresh();
});

act('wrt-save', () => {
  const metrics = analyseWriting(text);
  if (metrics.words < 5) {
    toast({ title: t('wrt.placeholder'), tone: 'warn' });
    return;
  }
  const score = Math.round(
    Math.max(0, Math.min(100, metrics.checklist.filter((item) => item.ok).length / metrics.checklist.length) * 100),
  );
  store.set((state) => {
    const draft = { id: `${Date.now()}`, promptId, text, updatedAt: Date.now(), bestScore: score };
    state.drafts.unshift(draft);
    state.drafts = state.drafts.slice(0, 20);
    recordAttempt(state, 'writing', score, 100);
    grantXp(state, XP_AWARD.writing, 'writing');
    logSession(state, 'writing', score, 100, XP_AWARD.writing);
    const badges = unlockBadges(state);
    for (const badge of badges) {
      toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
    }
  });
  toast({ title: `${t('common.saved')} · ${score}/100`, tone: 'success' });
  refresh();
});

act('wrt-load', (el) => {
  const id = strArg(el, 'id');
  const draft = store.get().drafts.find((entry) => entry.id === id);
  if (!draft) return;
  text = draft.text;
  promptId = draft.promptId;
  refresh();
});

act('wrt-delete', (el) => {
  const id = strArg(el, 'id');
  store.set((state) => {
    state.drafts = state.drafts.filter((entry) => entry.id !== id);
  });
  refresh();
});

act('wrt-clear', () => {
  text = '';
  refresh();
});

export const writingView: ViewDef = {
  key: 'writing',
  labelKey: 'nav.writing',
  icon: 'pen',
  href: '#/writing',
  pattern: '/writing',
  nav: true,
  render,
  after: () => {
    const input = qs<HTMLTextAreaElement>('#wrt-input');
    if (input) {
      input.addEventListener('input', () => {
        text = input.value;
        updateMetrics();
      });
    }
  },
};
