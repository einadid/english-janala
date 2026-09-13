import { act } from '@/core/events';
import { esc, numArg, strArg } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import type { RouteContext } from '@/core/router';
import { XP_AWARD } from '@/core/gamification';
import { grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { findWordByText, getWord } from '@/data/vocabulary';
import { PASSAGES, getPassage } from '@/data/passages';
import { store } from '@/state';
import { bar, button, card, cefrChip, sectionTitle } from '@/ui/components';
import { icon } from '@/ui/icons';
import { openModal } from '@/ui/modal';
import { toast } from '@/ui/toast';
import { wordModalHtml } from '@/ui/wordCard';
import type { ViewDef } from './types';

interface QuizState {
  answers: Record<number, number>;
  completed: boolean;
}

const quizzes = new Map<string, QuizState>();

function stateFor(id: string): QuizState {
  const existing = quizzes.get(id);
  if (existing) return existing;
  const created: QuizState = { answers: {}, completed: false };
  quizzes.set(id, created);
  return created;
}

/** Escape a paragraph, then wrap every known word in a look-up button. */
export function linkify(paragraph: string): string {
  return esc(paragraph).replace(/[A-Za-z]+(?:&#39;[A-Za-z]+)*/g, (match) => {
    const plain = match.replace(/&#39;/g, "'");
    const found = findWordByText(plain);
    if (!found) return match;
    return `<button type="button" class="ej-wordlink" data-act="read-lookup" data-args='${esc(
      JSON.stringify({ id: found.id }),
    )}'>${match}</button>`;
  });
}

function listHtml(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  return `<div class="ej-fade grid gap-5 py-6">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.reading'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('read.clickHint'))}</p>
    </header>
    <section class="grid sm:grid-cols-2 gap-4">
      ${PASSAGES.map((passage) => {
        const done = state.reading[passage.id];
        return `<a href="#/reading/${esc(passage.id)}" class="ej-card !p-5 grid gap-3 hover:-translate-y-0.5 transition-transform">
          <div class="flex items-center gap-2">${cefrChip(passage.cefr)}<span class="ej-chip">${icon('clock', 12)}<span>${esc(`${passage.minutes} min`)}</span></span>
          ${done ? `<span class="ej-chip ej-chip-accent">${icon('check', 12)}<span>${done.score}%</span></span>` : ''}</div>
          <h2 class="text-lg font-semibold leading-tight">${esc(lang === 'bn' ? `${passage.titleBn} · ${passage.title}` : passage.title)}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 line-clamp-3">${esc(passage.body[0] ?? '')}</p>
        </a>`;
      }).join('')}
    </section>
  </div>`;
}

function detailHtml(id: string): string {
  const passage = getPassage(id);
  if (!passage) return listHtml();
  const quiz = stateFor(passage.id);
  const lang = store.get().prefs.uiLang;
  const answered = Object.keys(quiz.answers).length;
  const correct = passage.questions.reduce((sum, question, index) => sum + (quiz.answers[index] === question.answer ? 1 : 0), 0);

  return `<div class="ej-fade grid gap-5 py-6 max-w-3xl mx-auto">
    <div class="flex items-center gap-2">
      ${button({ act: 'nav', args: { href: '#/reading' }, label: t('common.back'), icon: 'left', variant: 'ghost' })}
    </div>
    <header class="grid gap-2">
      <div class="flex items-center gap-2 flex-wrap">${cefrChip(passage.cefr)}<span class="ej-chip">${icon('clock', 12)}<span>${esc(`${passage.minutes} min`)}</span></span></div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(lang === 'bn' ? passage.titleBn : passage.title)}</h1>
      <p class="text-xs text-slate-500 dark:text-slate-400">${icon('info', 12)} ${esc(t('read.clickHint'))}</p>
    </header>

    ${card(
      passage.body
        .map((paragraph) => `<p class="text-[1.05rem] leading-8 mb-4 last:mb-0">${linkify(paragraph)}</p>`)
        .join(''),
    )}

    ${card(`
      ${sectionTitle(t('read.lookup'), '', 'bookmark')}
      <div class="flex flex-wrap gap-1.5">
        ${(store.get().reading[passage.id]?.lookedUp ?? []).length === 0
          ? `<span class="text-sm text-slate-500 dark:text-slate-400">—</span>`
          : (store.get().reading[passage.id]?.lookedUp ?? [])
              .map((wordId) => getWord(wordId))
              .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
              .map(
                (entry) =>
                  `<button type="button" class="ej-chip" data-act="read-lookup" data-args='${esc(JSON.stringify({ id: entry.id }))}'>${esc(entry.word)} · ${esc(entry.bn)}</button>`,
              )
              .join('')}
      </div>
    `)}

    ${card(`
      ${sectionTitle(`${t('read.questions')} · ${correct}/${passage.questions.length}`, '', 'target')}
      <div class="grid gap-5">
        ${passage.questions
          .map((question, qIndex) => {
            const picked = quiz.answers[qIndex];
            return `<div class="grid gap-2">
              <p class="text-sm font-semibold">${qIndex + 1}. ${esc(question.q)}</p>
              <div class="grid gap-2">
                ${question.options
                  .map((option, oIndex) => {
                    const isPicked = picked === oIndex;
                    const isAnswer = question.answer === oIndex;
                    const style =
                      picked === undefined
                        ? ''
                        : isAnswer
                          ? 'border-color:#34d399;background:rgba(52,211,153,.12)'
                          : isPicked
                            ? 'border-color:#f43f5e;background:rgba(244,63,94,.12)'
                            : 'opacity:.5';
                    return `<button type="button" class="ej-btn ej-btn-outline justify-start" style="${style}" ${
                      picked !== undefined ? 'disabled' : ''
                    } data-act="read-answer" data-args='${esc(JSON.stringify({ q: qIndex, i: oIndex }))}'>${esc(option)}</button>`;
                  })
                  .join('')}
              </div>
              ${
                picked !== undefined
                  ? `<p class="text-xs text-slate-500 dark:text-slate-400 flex gap-1.5"><span class="text-[color:var(--ej-accent)]">${icon(
                      'info',
                      12,
                    )}</span><span>${esc(question.why)}</span></p>`
                  : ''
              }
            </div>`;
          })
          .join('')}
      </div>
      <div class="grid gap-2 mt-5">
        ${bar(answered / passage.questions.length, '#34d399', 6)}
        ${button({
          act: 'read-complete',
          args: { id: passage.id },
          label: t('common.finish'),
          icon: 'check',
          disabled: answered < passage.questions.length,
          extra: 'ej-btn-block',
        })}
      </div>
    `)}
  </div>`;
}

act('read-lookup', (el) => {
  const word = getWord(strArg(el, 'id'));
  if (!word) return;
  store.set((state) => {
    const route = window.location.hash.replace('#/reading/', '');
    const entry = state.reading[route] ?? { score: 0, lookedUp: [], completedAt: 0 };
    if (!entry.lookedUp.includes(word.id)) entry.lookedUp.push(word.id);
    state.reading[route] = entry;
  });
  openModal(wordModalHtml(word), { label: word.word });
});

act('read-answer', (el, _args) => {
  const route = window.location.hash.replace('#/reading/', '');
  const quiz = stateFor(route);
  const q = numArg(el, 'q');
  const i = numArg(el, 'i');
  if (!Number.isFinite(q) || !Number.isFinite(i)) return;
  quiz.answers[q] = i;
  refresh();
});

act('read-complete', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : '';
  const passage = getPassage(id);
  if (!passage) return;
  const quiz = stateFor(id);
  const correct = passage.questions.reduce((sum, question, index) => sum + (quiz.answers[index] === question.answer ? 1 : 0), 0);
  const total = passage.questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  quiz.completed = true;

  store.set((state) => {
    const entry = state.reading[id] ?? { score: 0, lookedUp: [], completedAt: 0 };
    entry.score = score;
    entry.completedAt = Date.now();
    state.reading[id] = entry;
    recordAttempt(state, 'reading', correct, total);
    grantXp(state, XP_AWARD.passage + correct * XP_AWARD.quizCorrect, 'reading');
    logSession(state, 'reading', correct, total, XP_AWARD.passage);
    const badges = unlockBadges(state);
    for (const badge of badges) {
      toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
    }
  });
  toast({ title: `${t('common.score')}: ${score}%`, tone: score >= 70 ? 'success' : 'warn' });
  refresh();
});

export function readingRender(ctx: RouteContext): string {
  const id = ctx.params.id;
  return id ? detailHtml(id) : listHtml();
}

export const readingView: ViewDef = {
  key: 'reading',
  labelKey: 'nav.reading',
  icon: 'reading',
  href: '#/reading',
  pattern: '/reading',
  nav: true,
  render: readingRender,
};

export const readingDetailView: ViewDef = {
  key: 'reading-detail',
  labelKey: 'nav.reading',
  icon: 'reading',
  href: '#/reading',
  pattern: '/reading/:id',
  nav: false,
  render: readingRender,
};
