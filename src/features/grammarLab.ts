import { act } from '@/core/events';
import { esc } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { XP_AWARD } from '@/core/gamification';
import { grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { GRAMMAR_TOPICS, drillsByTopic, ruleForTopic } from '@/data/grammar';
import type { GrammarItem } from '@/core/types';
import { store } from '@/state';
import { bar, button, card, cefrChip, progressRing } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

interface GrammarState {
  topic: string;
  index: number;
  picked: number | null;
  correct: number;
  answered: number;
}

let session: GrammarState = { topic: GRAMMAR_TOPICS[0] ?? 'Articles', index: 0, picked: null, correct: 0, answered: 0 };

function drills(): GrammarItem[] {
  return drillsByTopic(session.topic, 6);
}

function render(): string {
  const list = drills();
  const drill = list[session.index];
  const rule = ruleForTopic(session.topic);
  const lang = store.get().prefs.uiLang;

  return `<div class="ej-fade grid gap-5 py-6 max-w-3xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.grammar'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('gram.rules'))} · ${esc(t('gram.drills'))}</p>
    </header>

    <div class="flex gap-2 flex-wrap">
      ${GRAMMAR_TOPICS.map(
        (topic) =>
          `<button type="button" class="ej-btn ${topic === session.topic ? 'ej-btn-primary' : 'ej-btn-outline'} ej-btn-sm"
            data-act="gram-topic" data-args='${esc(JSON.stringify({ topic }))}'>${esc(topic)}</button>`,
      ).join('')}
    </div>

    ${
      rule
        ? card(`
          <div class="flex items-start gap-3">
            <span class="ej-icon-badge">${icon('info', 18)}</span>
            <div class="grid gap-2">
              <h2 class="text-base font-semibold">${esc(lang === 'bn' ? rule.titleBn : rule.title)}</h2>
              <p class="text-sm leading-relaxed">${esc(rule.rule)}</p>
              <p class="text-sm leading-relaxed font-bangla text-slate-500 dark:text-slate-400">${esc(rule.ruleBn)}</p>
              <div class="ej-bad text-sm">${esc(rule.wrong)}</div>
              <div class="ej-good text-sm">${esc(rule.right)}</div>
            </div>
          </div>`)
        : ''
    }

    ${
      drill
        ? card(`
          <div class="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div class="flex items-center gap-2">${cefrChip(drill.cefr)}<span class="ej-chip">${esc(drill.topic)}</span></div>
            <span class="text-xs text-slate-500 dark:text-slate-400 tabular-nums">${session.index + 1} / ${list.length}</span>
          </div>
          <p class="text-lg font-semibold mb-4">${esc(drill.prompt)}</p>
          <div class="grid gap-2">
            ${drill.options
              .map((option, index) => {
                const shown = session.picked !== null;
                const style = shown
                  ? index === drill.answer
                    ? 'border-color:#34d399;background:rgba(52,211,153,.12)'
                    : index === session.picked
                      ? 'border-color:#f43f5e;background:rgba(244,63,94,.12)'
                      : 'opacity:.5'
                  : '';
                return `<button type="button" class="ej-btn ej-btn-outline justify-start" style="${style}" ${
                  shown ? 'disabled' : ''
                } data-act="gram-pick" data-args='${esc(JSON.stringify({ i: index }))}'>${esc(option)}</button>`;
              })
              .join('')}
          </div>
          ${
            session.picked !== null
              ? `<div class="grid gap-2 mt-4">
                  <p class="text-sm flex gap-2"><span class="text-[color:var(--ej-accent)]">${icon('info', 14)}</span><span>${esc(drill.why)}</span></p>
                  <p class="text-sm font-bangla text-slate-500 dark:text-slate-400">${esc(drill.whyBn)}</p>
                  ${button({ act: 'gram-next', label: t('common.next'), icon: 'arrow', variant: 'primary' })}
                </div>`
              : ''
          }
          <div class="grid gap-1 mt-4">${bar(session.answered / list.length, '#f472b6', 6)}</div>`)
        : card(`
          <div class="text-center grid gap-3">
            ${progressRing(list.length === 0 ? 0 : session.correct / list.length, {
              size: 96,
              label: `${session.correct}/${session.answered}`,
              sub: t('common.correct'),
              color: '#f472b6',
            })}
            <div class="flex gap-2 justify-center flex-wrap">
              ${button({ act: 'gram-restart', label: t('common.retry'), icon: 'repeat', variant: 'outline' })}
              ${button({ act: 'gram-next-topic', label: t('common.next'), icon: 'arrow', variant: 'primary' })}
            </div>
          </div>`)
    }
  </div>`;
}

act('gram-topic', (_el, args) => {
  const topic = typeof args.topic === 'string' ? args.topic : session.topic;
  session = { topic, index: 0, picked: null, correct: 0, answered: 0 };
  refresh();
});

act('gram-pick', (_el, args) => {
  const index = Number(args.i);
  const drill = drills()[session.index];
  if (!drill) return;
  session.picked = index;
  session.answered += 1;
  const correct = index === drill.answer;
  if (correct) session.correct += 1;
  store.set((state) => {
    recordAttempt(state, 'grammar', correct ? 1 : 0, 1);
    grantXp(state, correct ? XP_AWARD.quizCorrect : XP_AWARD.quizWrong, 'grammar');
  });
  refresh();
});

act('gram-next', () => {
  const list = drills();
  session.index += 1;
  session.picked = null;
  if (session.index >= list.length) {
    store.set((state) => {
      logSession(state, 'grammar', session.correct, session.answered, XP_AWARD.quizCorrect);
      const badges = unlockBadges(state);
      for (const badge of badges) {
        toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
      }
    });
  }
  refresh();
});

act('gram-restart', () => {
  session = { ...session, index: 0, picked: null, correct: 0, answered: 0 };
  refresh();
});

act('gram-next-topic', () => {
  const index = GRAMMAR_TOPICS.indexOf(session.topic);
  const next = GRAMMAR_TOPICS[(index + 1) % GRAMMAR_TOPICS.length] ?? session.topic;
  session = { topic: next, index: 0, picked: null, correct: 0, answered: 0 };
  refresh();
});

export const grammarView: ViewDef = {
  key: 'grammar',
  labelKey: 'nav.grammar',
  icon: 'grammar',
  href: '#/grammar',
  pattern: '/grammar',
  nav: true,
  render,
};

