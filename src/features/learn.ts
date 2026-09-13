import { act } from '@/core/events';
import { esc, strArg } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import type { RouteContext } from '@/core/router';
import { LEVELS, searchWords, wordsByLevel } from '@/data/vocabulary';
import { getWord } from '@/data/vocabulary';
import { store } from '@/state';
import { bar, button, card, cefrChip, emptyState } from '@/ui/components';
import { icon } from '@/ui/icons';
import { openModal } from '@/ui/modal';
import { toast } from '@/ui/toast';
import { wordCardHtml, wordModalHtml } from '@/ui/wordCard';
import { addToDeck, grantXp, markWordSeen, unlockBadges } from '@/core/progress';
import { XP_AWARD } from '@/core/gamification';
import type { ViewDef } from './types';

let query = '';

function levelListHtml(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  return `<div class="ej-fade grid gap-5 py-6">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('learn.pick'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('learn.search'))}</p>
    </header>
    <div class="ej-card !p-3 flex items-center gap-2">
      <span class="pl-2 text-slate-400">${icon('search', 18)}</span>
      <input id="learn-search" class="ej-input !border-0 !bg-transparent" placeholder="${esc(t('learn.search'))}" value="${esc(query)}" data-act="learn-search" />
    </div>
    ${
      query.trim()
        ? `<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${
            searchWords(query).length === 0
              ? `<div class="sm:col-span-2 lg:col-span-3">${emptyState(t('cmd.empty'))}</div>`
              : searchWords(query)
                  .map((word) =>
                    wordCardHtml(word, {
                      inDeck: state.saved.includes(word.id),
                      known: state.known.includes(word.id) || state.cards[word.id]?.state === 'mastered',
                    }),
                  )
                  .join('')
          }</section>`
        : `<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${LEVELS.map((level) => {
            const words = wordsByLevel(level.no);
            const mastered = words.filter((word) => state.cards[word.id]?.state === 'mastered').length;
            const seen = words.filter((word) => state.cards[word.id] !== undefined).length;
            const pct = words.length === 0 ? 0 : mastered / words.length;
            const title = lang === 'bn' ? `${level.titleBn} · ${level.title}` : level.title;
            const summary = lang === 'bn' ? level.summaryBn : level.summary;
            return `<a href="#/learn/${level.no}" class="ej-card !p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform">
              <header class="flex items-start justify-between gap-2">
                <span class="ej-icon-badge" style="background:${level.accent}22;color:${level.accent}">${icon('book', 18)}</span>
                ${cefrChip(level.cefr)}
              </header>
              <h2 class="text-lg font-semibold leading-tight">${esc(`${level.no}. ${title}`)}</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">${esc(summary)}</p>
              <div class="mt-auto grid gap-1">
                <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  <span>${mastered}/${words.length} ${esc(t('learn.progress'))}</span>
                  <span>${seen} ${esc(t('common.new').toLowerCase())}</span>
                </div>
                ${bar(pct, level.accent, 6)}
              </div>
            </a>`;
          }).join('')}</section>`
    }
  </div>`;
}

function levelDetailHtml(levelNo: number): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  const level = LEVELS.find((entry) => entry.no === levelNo);
  if (!level) return emptyState(t('cmd.empty'));
  const words = wordsByLevel(levelNo);
  const mastered = words.filter((word) => state.cards[word.id]?.state === 'mastered').length;

  return `<div class="ej-fade grid gap-5 py-6">
    <div class="flex items-center gap-2">
      ${button({ act: 'nav', args: { href: '#/learn' }, label: t('common.back'), icon: 'left', variant: 'ghost' })}
      <a href="#/learn" class="text-sm text-slate-500 dark:text-slate-400">${esc(t('learn.pick'))}</a>
    </div>
    ${card(`
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-2">${cefrChip(level.cefr)}<span class="ej-chip">${esc(`${words.length} ${t('common.words')}`)}</span></div>
          <h1 class="text-2xl font-bold tracking-tight">${esc(`${level.no}. ${lang === 'bn' ? level.titleBn : level.title}`)}</h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">${esc(lang === 'bn' ? level.summaryBn : level.summary)}</p>
        </div>
        <div class="grid gap-2 min-w-[190px]">
          <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>${esc(t('learn.progress'))}</span><span>${mastered}/${words.length}</span>
          </div>
          ${bar(words.length === 0 ? 0 : mastered / words.length, level.accent)}
          ${button({ act: 'learn-add-all', args: { level: level.no }, label: t('learn.openAll'), icon: 'plus', variant: 'soft', extra: 'ej-btn-sm' })}
        </div>
      </div>
    `)}
    ${
      words.length === 0
        ? emptyState(t('common.empty'))
        : `<section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">${words
            .map((word) =>
              wordCardHtml(word, {
                inDeck: state.saved.includes(word.id),
                known: state.known.includes(word.id) || state.cards[word.id]?.state === 'mastered',
              }),
            )
            .join('')}</section>`
    }
  </div>`;
}

act('learn-search', (el) => {
  query = (el as HTMLInputElement).value;
  refresh();
  const input = document.getElementById('learn-search') as HTMLInputElement | null;
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
});

act('learn-add-all', (_el, args) => {
  const levelNo = Number(args.level);
  const words = wordsByLevel(levelNo);
  store.set((state) => {
    let fresh = 0;
    for (const word of words) {
      if (!state.saved.includes(word.id)) fresh += 1;
      addToDeck(state, word.id);
      markWordSeen(state, word.id, word.level);
    }
    // Bulk adding must reward exactly what single-card adding does.
    grantXp(state, fresh * XP_AWARD.wordOpen, 'vocab');
    const badges = unlockBadges(state);
    for (const badge of badges) {
      toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
    }
  });
  toast({ title: t('toast.deckFull'), body: `${words.length} ${t('common.words')}`, tone: 'success' });
  refresh();
});

act('word-details', (el) => {
  const word = getWord(strArg(el, 'id'));
  if (!word) return;
  openModal(wordModalHtml(word), { label: word.word });
});

export function learnRender(ctx: RouteContext): string {
  const id = ctx.params.id;
  if (id) {
    const levelNo = Number(id);
    if (Number.isFinite(levelNo)) return levelDetailHtml(levelNo);
  }
  return levelListHtml();
}

export const learnView: ViewDef = {
  key: 'learn',
  labelKey: 'nav.learn',
  icon: 'book',
  href: '#/learn',
  pattern: '/learn',
  nav: true,
  render: learnRender,
};

export const learnLevelView: ViewDef = {
  key: 'learn-level',
  labelKey: 'nav.learn',
  icon: 'book',
  href: '#/learn',
  pattern: '/learn/:id',
  nav: false,
  render: learnRender,
};
