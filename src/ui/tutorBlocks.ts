import { esc } from '@/core/dom';
import { t } from '@/core/i18n';
import type { TutorBlock } from '@/core/tutor';
import { icon } from './icons';

/** Render tutor engine blocks as HTML (shared by the Tutor view and Dashboard). */
export function renderBlocks(blocks: TutorBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'para':
          return `<div class="grid gap-1">
            <p class="text-sm leading-relaxed">${esc(block.text)}</p>
            <p class="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-bangla">${esc(block.textBn)}</p>
          </div>`;
        case 'bad':
          return `<div class="ej-bad text-sm font-medium">${esc(block.text)}</div>`;
        case 'good':
          return `<div class="ej-good text-sm font-medium">${esc(block.text)}</div>`;
        case 'list':
          return `<ul class="grid gap-2">${block.items
            .map(
              (item) =>
                `<li class="flex items-start gap-2 text-sm"><span class="text-[color:var(--ej-accent)] mt-0.5">${icon('check', 14)}</span>
                  <span><span class="font-medium">${esc(item.en)}</span><span class="block text-slate-500 dark:text-slate-400 font-bangla">${esc(item.bn)}</span></span>
                </li>`,
            )
            .join('')}</ul>`;
        case 'chips':
          return `<div class="flex flex-wrap gap-2">${block.items
            .map(
              (item) =>
                `<button type="button" class="ej-btn ej-btn-soft ej-btn-sm" data-act="tutor-send" data-args='${esc(
                  JSON.stringify({ text: item }),
                )}'>${esc(item)}</button>`,
            )
            .join('')}</div>`;
        case 'word': {
          const word = block.word;
          return `<div class="ej-card !p-4">
            <div class="flex items-baseline gap-2 flex-wrap">
              <span class="text-xl font-bold">${esc(word.word)}</span>
              <span class="text-sm text-slate-500 dark:text-slate-400">${esc(word.ipa)}</span>
              <span class="ej-chip">${esc(word.pos)}</span>
              <span class="ej-chip">${esc(word.cefr)}</span>
            </div>
            <p class="font-bangla text-lg mt-2">${esc(word.bn)}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400 italic mt-2">${esc(word.example)}</p>
            ${
              word.synonyms.length > 0
                ? `<div class="flex flex-wrap gap-1.5 mt-3">${word.synonyms
                    .map((syn) => `<span class="ej-chip">${esc(syn)}</span>`)
                    .join('')}</div>`
                : ''
            }
            <div class="flex gap-2 mt-3">
              <button type="button" class="ej-btn ej-btn-sm ej-btn-soft" data-act="speak" data-args='${esc(
                JSON.stringify({ text: word.word }),
              )}'>${icon('volume', 14)}<span>${esc(t('common.listen'))}</span></button>
              <button type="button" class="ej-btn ej-btn-sm ej-btn-outline" data-act="deck-add" data-args='${esc(
                JSON.stringify({ id: word.id }),
              )}'>${icon('plus', 14)}<span>${esc(t('learn.deck'))}</span></button>
            </div>
          </div>`;
        }
        case 'quiz':
          return `<div class="ej-card !p-4">
            <p class="text-sm font-medium mb-3">${esc(block.drill.prompt)}</p>
            <div class="grid gap-2">
              ${block.drill.options
                .map(
                  (option, index) =>
                    `<button type="button" class="ej-btn ej-btn-outline justify-start" data-act="tutor-quiz" data-args='${esc(
                      JSON.stringify({ id: block.drill.id, i: index }),
                    )}'>${esc(option)}</button>`,
                )
                .join('')}
            </div>
          </div>`;
        default:
          return '';
      }
    })
    .join('');
}
