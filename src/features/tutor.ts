import { act } from '@/core/events';
import { esc, qs } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { ask } from '@/core/tutor';
import type { TutorReply } from '@/core/tutor';
import { counts } from '@/core/analytics';
import { GRAMMAR_DRILLS } from '@/data/grammar';
import { TUTOR_SUGGESTIONS } from '@/data/tutor';
import { store } from '@/state';
import { button, card, sectionTitle } from '@/ui/components';
import { icon } from '@/ui/icons';
import { renderBlocks } from '@/ui/tutorBlocks';
import type { ViewDef } from './types';

interface Message {
  role: 'user' | 'tutor';
  text?: string;
  reply?: TutorReply;
}

const messages: Message[] = [];

function context() {
  const state = store.get();
  return {
    name: state.profile.name,
    cefr: state.profile.cefr,
    dueCount: counts(state).due,
    streak: state.xp.streak.current,
  };
}

function send(input: string): void {
  const text = input.trim();
  if (!text) return;
  messages.push({ role: 'user', text });
  messages.push({ role: 'tutor', reply: ask(text, context()) });
  refresh();
  requestAnimationFrame(() => {
    const list = qs<HTMLElement>('#tutor-log');
    if (list) list.scrollTop = list.scrollHeight;
  });
}

function render(): string {
  const lang = store.get().prefs.uiLang;
  return `<div class="ej-fade grid gap-5 py-6 max-w-3xl mx-auto">
    <header class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.tutor'))}</h1>
        <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('tut.offline'))} · ${esc(t('tut.offlineNote'))}</p>
      </div>
      <span class="ej-chip ej-chip-accent">${icon('sparkle', 12)}<span>${esc(lang === 'bn' ? '১০০% অফলাইন' : '100% offline')}</span></span>
    </header>

    ${card(`
      <div id="tutor-log" class="grid gap-4 max-h-[52vh] overflow-y-auto pr-1">
        ${
          messages.length === 0
            ? `<div class="grid gap-2">
                <p class="text-sm leading-relaxed">${esc(t('tut.hello'))}</p>
              </div>`
            : messages
                .map((message) =>
                  message.role === 'user'
                    ? `<div class="flex justify-end"><div class="ej-card !p-3 !rounded-2xl max-w-[85%] !bg-[color:var(--ej-surface-2)]">
                        <p class="text-sm font-medium">${esc(message.text ?? '')}</p></div></div>`
                    : `<div class="grid gap-2">
                        <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <span class="ej-icon-badge" style="width:24px;height:24px">${icon('tutor', 13)}</span>
                          <span>${esc(lang === 'bn' ? message.reply?.titleBn ?? '' : message.reply?.title ?? '')}</span>
                        </div>
                        <div class="grid gap-3">${renderBlocks(message.reply?.blocks ?? [])}</div>
                      </div>`,
                )
                .join('')
        }
      </div>
    `)}

    <form class="flex gap-2" data-act="tutor-ask">
      <input id="tutor-input" class="ej-input" autocomplete="off" placeholder="${esc(t('cmd.placeholder'))}" />
      ${button({ act: 'tutor-ask', type: 'submit', label: '', icon: 'send', variant: 'primary' })}
    </form>

    ${sectionTitle(lang === 'bn' ? 'চেষ্টা করুন' : 'Try one of these', '', 'sparkle')}
    <div class="flex flex-wrap gap-2">
      ${TUTOR_SUGGESTIONS.map(
        (suggestion) =>
          `<button type="button" class="ej-btn ej-btn-soft ej-btn-sm" data-act="tutor-send" data-args='${esc(
            JSON.stringify({ text: suggestion }),
          )}'>${esc(suggestion)}</button>`,
      ).join('')}
    </div>
  </div>`;
}

act('tutor-ask', (_el, _args, event) => {
  event.preventDefault();
  const input = qs<HTMLInputElement>('#tutor-input');
  const value = input?.value ?? '';
  send(value);
});

act('tutor-send', (_el, args) => {
  const value = typeof args.text === 'string' ? args.text : '';
  send(value);
});

act('tutor-quiz', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : '';
  const picked = Number(args.i);
  const drill = GRAMMAR_DRILLS.find((entry) => entry.id === id);
  if (!drill) return;
  const correct = picked === drill.answer;
  store.set((state) => {
    const record = state.skills.grammar;
    record.correct += correct ? 1 : 0;
    record.attempts += 1;
  });
  messages.push({ role: 'user', text: drill.options[picked] ?? '' });
  messages.push({
    role: 'tutor',
    reply: {
      id: `quiz-result-${drill.id}`,
      kind: 'quiz',
      title: correct ? 'Correct' : 'Not quite',
      titleBn: correct ? 'সঠিক' : 'ঠিক হয়নি',
      blocks: [
        correct ? { type: 'good', text: drill.options[drill.answer] ?? '' } : { type: 'bad', text: drill.options[picked] ?? '' },
        { type: 'para', text: drill.why, textBn: drill.whyBn },
        { type: 'chips', items: ['quiz verbs', 'explain articles'] },
      ],
    },
  });
  refresh();
});

export const tutorView: ViewDef = {
  key: 'tutor',
  labelKey: 'nav.tutor',
  icon: 'tutor',
  href: '#/tutor',
  pattern: '/tutor',
  nav: true,
  render,
  after: () => {
    const input = qs<HTMLInputElement>('#tutor-input');
    input?.focus();
    const log = qs<HTMLElement>('#tutor-log');
    if (log) log.scrollTop = log.scrollHeight;
  },
};
