import type { Word } from '@/core/types';
import { esc } from '@/core/dom';
import { t } from '@/core/i18n';
import { button } from './components';
import { icon } from './icons';

/** Vocabulary card used in the Learn grid. */
export function wordCardHtml(word: Word, opts: { inDeck?: boolean; known?: boolean } = {}): string {
  const known = opts.known ?? false;
  return `<article class="ej-card !p-5 flex flex-col gap-3" data-word="${esc(word.id)}">
    <header class="flex items-start justify-between gap-2">
      <div class="min-w-0">
        <h3 class="text-2xl font-bold tracking-tight truncate">${esc(word.word)}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${esc(word.ipa)} · <span class="ej-chip">${esc(word.pos)}</span></p>
      </div>
      <span class="ej-chip">${esc(word.cefr)}</span>
    </header>
    <p class="font-bangla text-lg leading-snug">${esc(word.bn)}</p>
    <p class="text-sm italic text-slate-500 dark:text-slate-400">${esc(word.example)}</p>
    ${
      word.synonyms.length > 0
        ? `<div class="flex flex-wrap gap-1.5">${word.synonyms
            .map((syn) => `<span class="ej-chip">${esc(syn)}</span>`)
            .join('')}</div>`
        : ''
    }
    <footer class="flex items-center gap-2 mt-auto pt-1">
      ${button({ act: 'word-details', args: { id: word.id }, label: '', icon: 'info', variant: 'soft' })}
      ${button({ act: 'speak', args: { text: word.word }, label: '', icon: 'volume', variant: 'soft' })}
      ${button({
        act: opts.inDeck ? 'deck-remove' : 'deck-add',
        args: { id: word.id },
        label: '',
        icon: opts.inDeck ? 'check' : 'plus',
        variant: 'outline',
      })}
      <span class="ml-auto">${known ? `<span class="ej-chip ej-chip-accent">${icon('check', 12)}<span>${esc(t('common.mastered'))}</span></span>` : ''}</span>
    </footer>
  </article>`;
}

/** Full detail view shown inside a dialog. */
export function wordModalHtml(word: Word): string {
  return `<div class="grid gap-4">
    <header class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-3xl font-bold tracking-tight">${esc(word.word)}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">${esc(word.ipa)} · ${esc(word.pos)} · ${esc(word.cefr)}</p>
      </div>
      ${button({ act: 'speak', args: { text: word.word }, label: '', icon: 'volume', variant: 'soft' })}
    </header>
    <div>
      <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${esc(t('common.meaning'))}</div>
      <p class="font-bangla text-xl">${esc(word.bn)}</p>
    </div>
    <div>
      <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${esc(t('common.example'))}</div>
      <p class="text-sm italic">${esc(word.example)}</p>
      ${button({ act: 'speak', args: { text: word.example }, label: '', icon: 'volume', variant: 'ghost', extra: 'mt-2 ej-btn-sm' })}
    </div>
    <div>
      <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1">${esc(t('common.synonyms'))}</div>
      ${
        word.synonyms.length > 0
          ? `<div class="flex flex-wrap gap-1.5">${word.synonyms.map((syn) => `<span class="ej-chip">${esc(syn)}</span>`).join('')}</div>`
          : `<p class="text-sm text-slate-500 dark:text-slate-400">—</p>`
      }
    </div>
    <footer class="flex gap-2 flex-wrap pt-1">
      ${button({ act: 'deck-add', args: { id: word.id }, label: t('learn.deck'), icon: 'plus', variant: 'outline' })}
      ${button({ act: 'word-known', args: { id: word.id }, label: t('learn.known'), icon: 'check', variant: 'soft' })}
      ${button({ act: 'modal-close', label: t('common.finish'), variant: 'primary' })}
    </footer>
  </div>`;
}
