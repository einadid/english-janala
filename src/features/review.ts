import { act } from '@/core/events';
import { esc, qs } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { speak } from '@/core/audio';
import { dueCards, humaniseInterval, newCard, RATING_LABELS, review as reviewCard, nextIntervalMs } from '@/core/srs';
import type { Rating } from '@/core/srs';
import { XP_AWARD } from '@/core/gamification';
import { applyReview, grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { scoreDictation } from '@/core/scoring';
import type { CardState, Word } from '@/core/types';
import { getWord, VOCABULARY } from '@/data/vocabulary';
import { store } from '@/state';
import { bar, button, card, diffView, emptyState, progressRing } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

type Mode = 'recall' | 'produce' | 'listen' | 'choice';

const MODE_KEYS: Mode[] = ['recall', 'produce', 'listen', 'choice'];
const QUEUE_LIMIT = 20;

interface SessionState {
  queue: string[];
  index: number;
  mode: Mode;
  revealed: boolean;
  typed: string;
  scored: number | null;
  correct: number;
  finished: boolean;
  xpEarned: number;
  choices: string[];
  picked: number | null;
}

let session: SessionState | null = null;

function deckIds(): string[] {
  const state = store.get();
  const now = Date.now();
  const cards = Object.values(state.cards).filter((entry) => getWord(entry.id) !== undefined);
  const due = dueCards(cards, now, QUEUE_LIMIT).map((entry) => entry.id);
  if (due.length >= 4) return due;
  const extra = state.saved.filter((id) => !due.includes(id) && getWord(id) !== undefined).slice(0, QUEUE_LIMIT - due.length);
  return [...due, ...extra];
}

function word(id: string): Word | null {
  return getWord(id) ?? null;
}

function startSession(mode: Mode): void {
  const ids = deckIds();
  session = {
    queue: ids,
    index: 0,
    mode,
    revealed: false,
    typed: '',
    scored: null,
    correct: 0,
    finished: false,
    xpEarned: 0,
    choices: [],
    picked: null,
  };
  if (mode === 'choice') session.choices = buildChoices(ids[0] ?? '');
  refresh();
}

function buildChoices(correctId: string): string[] {
  const target = getWord(correctId);
  if (!target) return [];
  const distractors = VOCABULARY.filter((entry) => entry.id !== correctId && entry.bn !== target.bn)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  return [target, ...distractors]
    .sort(() => Math.random() - 0.5)
    .map((entry) => entry.id);
}

function finish(): void {
  if (!session) return;
  const total = session.index;
  const correct = session.correct;
  store.set((state) => {
    recordAttempt(state, 'vocab', correct, total);
    logSession(state, 'vocab', correct, total, session?.xpEarned ?? 0);
    const badges = unlockBadges(state);
    for (const badge of badges) {
      toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
    }
  });
  session.finished = true;
  refresh();
}

function rate(rating: Rating): void {
  if (!session) return;
  const id = session.queue[session.index];
  const current = session;
  if (!id) return;
  const card = store.get().cards[id] ?? newCard(id);
  const next = reviewCard(card, rating);
  const masteredNow = next.state === 'mastered';
  const xp = XP_AWARD.cardReview + (masteredNow ? XP_AWARD.cardMastered - XP_AWARD.cardReview : 0);
  current.xpEarned += xp;
  if (rating >= 3) current.correct += 1;

  store.set((state) => {
    applyReview(state, id, rating);
    grantXp(state, xp, 'vocab');
  });

  current.index += 1;
  current.revealed = false;
  current.typed = '';
  current.scored = null;
  current.picked = null;
  if (current.index >= current.queue.length) {
    finish();
    return;
  }
  if (current.mode === 'choice') current.choices = buildChoices(current.queue[current.index] ?? '');
  refresh();
}

function startScreen(): string {
  const state = store.get();
  const ids = deckIds();
  const due = Object.values(state.cards).filter((entry) => entry.due <= Date.now()).length;
  return `<div class="ej-fade grid gap-5 py-6 max-w-3xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('rev.title'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('rev.sub'))}</p>
    </header>
    ${card(`
      <div class="flex items-center gap-5 flex-wrap">
        ${progressRing(Math.min(1, due / Math.max(1, QUEUE_LIMIT)), { size: 96, label: `${due}`, sub: t('common.due'), color: '#38bdf8' })}
        <div class="grid gap-1">
          <div class="text-sm font-semibold">${esc(`${ids.length} ${t('rev.queue')}`)}</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">${esc(t('rev.howGood'))}</div>
        </div>
      </div>
    `)}
    ${
      ids.length === 0
        ? emptyState(t('rev.empty'), t('learn.pick'), 'bookmark')
        : `<section class="grid sm:grid-cols-2 gap-3">
            ${MODE_KEYS.map(
              (mode) =>
                `<button type="button" class="ej-card !p-4 text-left flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                  data-act="rev-start" data-args='${esc(JSON.stringify({ mode }))}'>
                  <span class="ej-icon-badge">${icon(mode === 'listen' ? 'headphones' : mode === 'choice' ? 'target' : 'repeat', 18)}</span>
                  <span>
                    <span class="block text-sm font-semibold">${esc(t(`rev.mode.${mode}`))}</span>
                    <span class="block text-xs text-slate-500 dark:text-slate-400">${esc(
                      mode === 'recall' ? 'Recognition → recall' : mode === 'produce' ? 'Bangla cue → type the word' : mode === 'listen' ? 'Audio → type what you hear' : 'Pick the Bangla meaning',
                    )}</span>
                  </span>
                </button>`,
            ).join('')}
          </section>`
    }
  </div>`;
}

function ratingButtons(id: string): string {
  const card = store.get().cards[id] ?? newCard(id);
  const previews: Rating[] = [1, 2, 3, 4];
  return `<div class="grid grid-cols-4 gap-2 mt-4">
    ${previews
      .map((rating) => {
        const projected = reviewCard(card, rating);
        const label = RATING_LABELS[rating];
        return `<button type="button" class="ej-btn ${rating === 1 ? 'ej-btn-danger' : rating === 4 ? 'ej-btn-primary' : 'ej-btn-outline'} !flex-col !gap-0.5 !py-2"
          data-act="rev-rate" data-args='${esc(JSON.stringify({ rating }))}'>
          <span>${esc(label.bn)}</span>
          <span class="text-[10px] opacity-70 tabular-nums">${esc(humaniseInterval(rating === 1 ? 240000 : nextIntervalMs(projected.stability)))}</span>
        </button>`;
      })
      .join('')}
  </div>`;
}

function cardScreen(): string {
  if (!session) return '';
  const id = session.queue[session.index] ?? '';
  const target = word(id);
  if (!target) return emptyState(t('common.empty'));
  const progress = session.index / Math.max(1, session.queue.length);
  const prefs = store.get().prefs;

  const header = `<div class="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
      <span>${esc(t(`rev.mode.${session.mode}`))}</span>
      <span class="tabular-nums">${session.index + 1} / ${session.queue.length}</span>
    </div>${bar(progress, '#38bdf8', 5)}`;

  if (session.mode === 'choice') {
    const picked = session.picked;
    return `<div class="ej-fade grid gap-5 py-6 max-w-2xl mx-auto">${header}
      ${card(`
        <h2 class="text-3xl font-bold tracking-tight">${esc(target.word)}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">${esc(target.ipa)} · ${esc(target.pos)}</p>
        <div class="grid gap-2 mt-5">
          ${session.choices
            .map((choiceId, index) => {
              const choice = getWord(choiceId);
              if (!choice) return '';
              const isAnswer = choiceId === target.id;
              const shown = picked !== null;
              const style = shown
                ? isAnswer
                  ? 'border-color:#34d399;background:rgba(52,211,153,.12)'
                  : picked === index
                    ? 'border-color:#f43f5e;background:rgba(244,63,94,.12)'
                    : 'opacity:.55'
                : '';
              return `<button type="button" class="ej-btn ej-btn-outline justify-start" style="${style}"
                ${shown ? 'disabled' : ''} data-act="rev-choice" data-args='${esc(JSON.stringify({ i: index }))}'>${esc(choice.bn)}</button>`;
            })
            .join('')}
        </div>
        ${picked === null ? '' : `<p class="text-sm mt-4">${esc(target.example)}</p>${ratingButtons(id)}`}
      `)}
    </div>`;
  }

  const prompt =
    session.mode === 'recall'
      ? `<h2 class="text-4xl font-bold tracking-tight">${esc(target.word)}</h2>
         <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${esc(target.ipa)} · ${esc(target.pos)}</p>`
      : session.mode === 'produce'
        ? `<p class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">${esc(t('common.meaning'))}</p>
           <h2 class="text-3xl font-bold font-bangla mt-1">${esc(target.bn)}</h2>`
        : `<div class="grid justify-items-center gap-3 py-4">
             ${button({ act: 'speak', args: { text: target.word }, label: t('lis.play'), icon: 'volume', variant: 'soft' })}
             <span class="text-xs text-slate-500 dark:text-slate-400">${esc(t('lis.instruction'))}</span>
           </div>`;

  const revealBlock = session.revealed
    ? `<div class="grid gap-3 mt-5 border-t border-[color:var(--ej-border)] pt-4">
        <div>
          <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">${esc(target.word)} ${esc(target.ipa)}</div>
          <div class="font-bangla text-xl">${esc(target.bn)}</div>
        </div>
        <p class="text-sm italic text-slate-500 dark:text-slate-400">${esc(target.example)}</p>
        ${session.scored !== null && session.typed ? diffView(scoreDictation(target.word, session.typed).tokens) : ''}
        ${ratingButtons(id)}
      </div>`
    : session.mode === 'recall'
      ? `<div class="mt-5">${button({ act: 'rev-reveal', label: t('common.show'), icon: 'eye', variant: 'primary', extra: 'ej-btn-block' })}</div>`
      : `<form class="mt-5 grid gap-2" data-act="rev-submit">
          <input id="rev-input" class="ej-input" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(
            t('common.start'),
          )}" />
          ${button({ act: 'rev-submit', type: 'submit', label: t('common.check'), icon: 'check', extra: 'ej-btn-block' })}
        </form>`;

  return `<div class="ej-fade grid gap-5 py-6 max-w-2xl mx-auto">${header}
    ${card(`${prompt}${revealBlock}`)}
    <p class="text-xs text-slate-500 dark:text-slate-400 text-center">${esc(
      `${t('rev.nextIn')} ${humaniseInterval(nextIntervalMs((store.get().cards[id] ?? newCard(id)).stability || 1))}`,
    )} · ${esc(t('set.voice'))}: ${esc(prefs.accent)}</p>
  </div>`;
}

function summaryScreen(): string {
  if (!session) return '';
  const accuracy = session.index === 0 ? 0 : session.correct / session.index;
  return `<div class="ej-fade grid gap-5 py-6 max-w-xl mx-auto text-center">
    <span class="ej-icon-badge mx-auto" style="width:56px;height:56px">${icon('trophy', 26)}</span>
    <h1 class="text-2xl font-bold">${esc(t('common.finish'))}</h1>
    <div class="grid grid-cols-3 gap-3">
      ${card(`<div class="text-2xl font-bold tabular-nums">${session.correct}/${session.index}</div><div class="text-xs text-slate-500 dark:text-slate-400">${esc(t('common.correct'))}</div>`)}
      ${card(`<div class="text-2xl font-bold tabular-nums">${Math.round(accuracy * 100)}%</div><div class="text-xs text-slate-500 dark:text-slate-400">${esc(t('common.accuracy'))}</div>`)}
      ${card(`<div class="text-2xl font-bold tabular-nums">+${session.xpEarned}</div><div class="text-xs text-slate-500 dark:text-slate-400">XP</div>`)}
    </div>
    <div class="flex gap-2 justify-center flex-wrap">
      ${button({ act: 'rev-again', label: t('common.retry'), icon: 'repeat', variant: 'outline' })}
      ${button({ act: 'nav', args: { href: '#/insights' }, label: t('nav.insights'), icon: 'insights' })}
    </div>
  </div>`;
}

act('rev-start', (_el, args) => {
  const mode = typeof args.mode === 'string' ? (args.mode as Mode) : 'recall';
  startSession(MODE_KEYS.includes(mode) ? mode : 'recall');
});

act('rev-again', () => {
  const mode = session?.mode ?? 'recall';
  session = null;
  startSession(mode);
});

act('rev-reveal', () => {
  if (!session) return;
  session.revealed = true;
  refresh();
});

act('rev-submit', (_el, _args, event) => {
  event.preventDefault();
  if (!session) return;
  const input = qs<HTMLInputElement>('#rev-input');
  session.typed = input?.value ?? '';
  const id = session.queue[session.index] ?? '';
  const target = getWord(id);
  if (!target) return;
  const result = scoreDictation(target.word, session.typed);
  session.scored = result.score;
  session.revealed = true;
  refresh();
});

act('rev-choice', (_el, args) => {
  if (!session) return;
  const index = Number(args.i);
  session.picked = index;
  const id = session.queue[session.index] ?? '';
  if (session.choices[index] === id) session.correct += 1;
  store.set((state) => {
    recordAttempt(state, 'vocab', session?.choices[index] === id ? 1 : 0, 1);
  });
  refresh();
});

act('rev-rate', (_el, args) => {
  const rating = Number(args.rating);
  if (![1, 2, 3, 4].includes(rating)) return;
  rate(rating as Rating);
});

export const reviewView: ViewDef = {
  key: 'review',
  labelKey: 'nav.review',
  icon: 'repeat',
  href: '#/review',
  pattern: '/review',
  nav: true,
  render: () => {
    if (!session) return startScreen();
    if (session.finished) return summaryScreen();
    return cardScreen();
  },
  after: () => {
    if (!session || session.revealed || session.mode !== 'listen') return;
    const id = session.queue[session.index] ?? '';
    const target = getWord(id);
    if (!target) return;
    const prefs = store.get().prefs;
    speak(target.word, { rate: prefs.ttsRate, voiceURI: prefs.ttsVoiceURI, accent: prefs.accent });
  },
};

export function resetReviewSession(): void {
  session = null;
}

export type { CardState };
