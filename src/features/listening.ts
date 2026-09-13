import { act } from '@/core/events';
import { esc, qs } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { speak } from '@/core/audio';
import { scoreDictation } from '@/core/scoring';
import type { DictationScore } from '@/core/scoring';
import { XP_AWARD } from '@/core/gamification';
import { grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { dictationByLevel } from '@/data/dictation';
import { store } from '@/state';
import { bar, button, card, cefrChip, diffView, progressRing, sectionTitle } from '@/ui/components';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

interface ListeningState {
  index: number;
  checked: boolean;
  result: DictationScore | null;
  revealed: boolean;
  correctTokens: number;
  totalTokens: number;
  rounds: number;
}

let state: ListeningState | null = null;

function items() {
  const cefr = store.get().profile.cefr;
  return dictationByLevel(cefr, 6);
}

function play(text: string, rate?: number): void {
  const prefs = store.get().prefs;
  speak(text, { rate: rate ?? prefs.ttsRate, voiceURI: prefs.ttsVoiceURI, accent: prefs.accent });
}

function ensure(): ListeningState {
  if (!state) {
    state = { index: 0, checked: false, result: null, revealed: false, correctTokens: 0, totalTokens: 0, rounds: 0 };
  }
  return state;
}

function render(): string {
  const session = ensure();
  const list = items();
  const item = list[session.index % list.length];
  if (!item) return '';
  const speed = store.get().prefs.ttsRate;
  const accuracy = session.totalTokens === 0 ? 0 : session.correctTokens / session.totalTokens;

  return `<div class="ej-fade grid gap-5 py-6 max-w-2xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.listening'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('lis.instruction'))}</p>
    </header>

    ${card(`
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div class="flex items-center gap-2">${cefrChip(item.cefr)}<span class="ej-chip">${esc(item.hint)}</span></div>
        <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">${session.rounds + 1} / ${list.length}</span>
      </div>
      <div class="flex items-center gap-5 mt-5 flex-wrap">
        ${progressRing(session.checked && session.result ? session.result.score / 100 : 0, {
          size: 92,
          label: session.checked && session.result ? `${session.result.score}%` : '—',
          sub: t('common.score'),
          color: '#a78bfa',
        })}
        <div class="grid gap-2 flex-1 min-w-[220px]">
          <div class="flex gap-2 flex-wrap">
            ${button({ act: 'lis-play', args: { text: item.text }, label: t('lis.play'), icon: 'play', variant: 'primary' })}
            ${button({ act: 'lis-play', args: { text: item.text, rate: 0.6 }, label: `${t('lis.speed')} 0.6x`, icon: 'volume', variant: 'outline' })}
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">${esc(`${t('lis.speed')}: ${speed}x`)}</span>
        </div>
      </div>

      ${
        session.checked && session.result
          ? `<div class="grid gap-3 mt-5 border-t border-[color:var(--ej-border)] pt-4">
              <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">${esc(t('common.check'))}</div>
              ${diffView(session.result.tokens)}
              <p class="text-sm text-slate-500 dark:text-slate-400 tabular-nums">${session.result.matched}/${session.result.total} ${esc(
                t('common.correct').toLowerCase(),
              )}</p>
              ${session.revealed ? `<p class="ej-good text-sm font-medium">${esc(item.text)}</p>` : ''}
              <div class="flex gap-2 flex-wrap">
                ${button({ act: 'lis-reveal', label: t('lis.reveal'), icon: 'eye', variant: 'ghost', disabled: session.revealed })}
                ${button({ act: 'lis-next', label: t('common.next'), icon: 'arrow', variant: 'primary' })}
              </div>
            </div>`
          : `<form class="grid gap-2 mt-5" data-act="lis-check">
              <input id="lis-input" class="ej-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Type what you hear…" />
              ${button({ act: 'lis-check', type: 'submit', label: t('common.check'), icon: 'check', extra: 'ej-btn-block' })}
            </form>`
      }
    `)}

    ${
      session.rounds > 0
        ? card(`${sectionTitle(t('common.accuracy'), '', 'gauge')}
            <div class="flex items-center gap-4">
              ${progressRing(accuracy, { size: 84, label: `${Math.round(accuracy * 100)}%`, color: '#34d399' })}
              <p class="text-sm text-slate-500 dark:text-slate-400 tabular-nums">${session.correctTokens}/${session.totalTokens} ${esc(
                t('common.words'),
              )}</p>
            </div>
            ${bar(accuracy, '#34d399')}`)
        : ''
    }
  </div>`;
}

act('lis-play', (_el, args) => {
  const text = typeof args.text === 'string' ? args.text : '';
  const rate = typeof args.rate === 'number' ? args.rate : undefined;
  play(text, rate);
});

act('lis-check', (_el, _args, event) => {
  event.preventDefault();
  const session = ensure();
  const list = items();
  const item = list[session.index % list.length];
  if (!item) return;
  const answer = qs<HTMLInputElement>('#lis-input')?.value ?? '';
  const result = scoreDictation(item.text, answer);
  session.result = result;
  session.checked = true;
  session.correctTokens += result.matched;
  session.totalTokens += result.total;
  store.set((state) => {
    recordAttempt(state, 'listening', result.matched, result.total);
    grantXp(state, Math.round(XP_AWARD.dictation * (result.score / 100)) + 2, 'listening');
  });
  refresh();
});

act('lis-reveal', () => {
  const session = ensure();
  session.revealed = true;
  refresh();
});

act('lis-next', () => {
  const session = ensure();
  session.index += 1;
  session.rounds += 1;
  session.checked = false;
  session.result = null;
  session.revealed = false;
  const list = items();
  if (session.rounds >= list.length) {
    store.set((state) => {
      logSession(state, 'listening', session.correctTokens, Math.max(1, session.totalTokens), XP_AWARD.dictation);
      const badges = unlockBadges(state);
      for (const badge of badges) {
        toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
      }
    });
    session.rounds = 0;
    session.index = 0;
    session.correctTokens = 0;
    session.totalTokens = 0;
    toast({ title: t('common.finish'), tone: 'success' });
  }
  refresh();
});

export const listeningView: ViewDef = {
  key: 'listening',
  labelKey: 'nav.listening',
  icon: 'headphones',
  href: '#/listening',
  pattern: '/listening',
  nav: true,
  render,
  after: () => {
    const input = qs<HTMLInputElement>('#lis-input');
    input?.focus();
  },
};
