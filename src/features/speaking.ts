import { act } from '@/core/events';
import { esc } from '@/core/dom';
import { t } from '@/core/i18n';
import { refresh } from '@/core/render';
import { recognitionAvailable, speak, startRecognition } from '@/core/audio';
import type { RecognitionHandle } from '@/core/audio';
import { scorePronunciation } from '@/core/scoring';
import type { PronunciationScore } from '@/core/scoring';
import { XP_AWARD } from '@/core/gamification';
import { grantXp, logSession, recordAttempt, unlockBadges } from '@/core/progress';
import { DICTATION } from '@/data/dictation';
import { store } from '@/state';
import { button, card, cefrChip, diffView, progressRing, sectionTitle } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

interface SpeakingState {
  index: number;
  listening: boolean;
  result: PronunciationScore | null;
  rounds: number;
  good: number;
  transcript: string;
}

let session: SpeakingState = { index: 0, listening: false, result: null, rounds: 0, good: 0, transcript: '' };
let handle: RecognitionHandle | null = null;

function drillList() {
  const cefr = store.get().profile.cefr;
  const exact = DICTATION.filter((item) => item.cefr === cefr);
  return (exact.length >= 4 ? exact : DICTATION).slice(0, 6);
}

function render(): string {
  const list = drillList();
  const item = list[session.index % list.length];
  if (!item) return '';
  const available = recognitionAvailable();

  return `<div class="ej-fade grid gap-5 py-6 max-w-2xl mx-auto">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.speaking'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('spk.instruction'))}</p>
    </header>

    ${
      available
        ? ''
        : card(`<div class="flex items-start gap-3">
            <span class="ej-icon-badge" style="background:rgba(250,204,21,.18);color:#facc15">${icon('alert', 18)}</span>
            <div>
              <p class="text-sm font-semibold">${esc(t('spk.unsupported'))}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">${esc(t('spk.allow'))}</p>
            </div>
          </div>`)
    }

    ${card(`
      <div class="flex items-center gap-2 flex-wrap">${cefrChip(item.cefr)}<span class="ej-chip">${esc(item.hint)}</span>
        <span class="ml-auto text-xs text-slate-500 dark:text-slate-400 tabular-nums">${session.rounds + 1} / ${list.length}</span></div>
      <p class="text-2xl font-semibold leading-snug mt-4">${esc(item.text)}</p>
      <div class="flex gap-2 flex-wrap mt-4">
        ${button({ act: 'speak', args: { text: item.text }, label: t('common.listen'), icon: 'volume', variant: 'outline' })}
        ${button({
          act: session.listening ? 'spk-stop' : 'spk-start',
          args: { text: item.text },
          label: session.listening ? t('spk.stop') : t('spk.start'),
          icon: session.listening ? 'stop' : 'mic',
          variant: session.listening ? 'danger' : 'primary',
          disabled: !available,
        })}
      </div>
      ${session.listening ? `<p class="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center gap-2">${icon('mic', 14)} ${esc(t('spk.allow'))}</p>` : ''}

      ${
        session.result
          ? `<div class="grid gap-3 mt-5 border-t border-[color:var(--ej-border)] pt-4">
              <div class="flex items-center gap-4 flex-wrap">
                ${progressRing(session.result.score / 100, { size: 88, label: `${session.result.score}%`, sub: t('common.score'), color: '#fb923c' })}
                <div>
                  <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">${esc(t('spk.heard'))}</div>
                  <p class="text-sm font-medium">${esc(session.result.heard || '—')}</p>
                </div>
              </div>
              ${diffView(session.result.tokens)}
              <div class="flex gap-2 flex-wrap">
                ${button({ act: 'spk-again', args: { text: item.text }, label: t('common.retry'), icon: 'repeat', variant: 'outline' })}
                ${button({ act: 'spk-next', label: t('common.next'), icon: 'arrow', variant: 'primary' })}
              </div>
            </div>`
          : ''
      }
    `)}

    ${
      session.rounds > 0
        ? card(`${sectionTitle(t('common.accuracy'), `${session.good}/${session.rounds} ≥ 80%`, 'gauge')}
            <div class="flex items-center gap-4">
              ${progressRing(session.rounds === 0 ? 0 : session.good / session.rounds, {
                size: 84,
                label: `${Math.round((session.good / session.rounds) * 100)}%`,
                color: '#34d399',
              })}
            </div>`)
        : ''
    }
  </div>`;
}

act('spk-start', (_el, args) => {
  const target = typeof args.text === 'string' ? args.text : '';
  if (!target) return;
  const accent = store.get().prefs.accent;
  session.listening = true;
  session.result = null;
  refresh();
  handle = startRecognition({
    lang: accent,
    onResult: (transcript) => {
      const result = scorePronunciation(target, transcript);
      session.result = result;
      session.transcript = transcript;
      session.listening = false;
      session.rounds += 1;
      if (result.score >= 80) session.good += 1;
      store.set((state) => {
        recordAttempt(state, 'speaking', result.score >= 80 ? 1 : 0, 1);
        grantXp(state, Math.round(XP_AWARD.speaking * (result.score / 100)) + 2, 'speaking');
        const badges = unlockBadges(state);
        for (const badge of badges) {
          toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success', timeout: 4200 });
        }
      });
      refresh();
    },
    onError: (code) => {
      session.listening = false;
      refresh();
      toast({ title: code === 'not-allowed' ? t('spk.allow') : `${t('spk.unsupported')} (${code})`, tone: 'warn' });
    },
    onEnd: () => {
      if (session.listening) {
        session.listening = false;
        refresh();
      }
    },
  });
  if (!handle) {
    session.listening = false;
    refresh();
  }
});

act('spk-stop', () => {
  handle?.stop();
  handle = null;
  session.listening = false;
  refresh();
});

act('spk-again', (_el, args) => {
  session.result = null;
  session.rounds = Math.max(0, session.rounds - 1);
  refresh();
  const text = typeof args.text === 'string' ? args.text : '';
  if (text) {
    const prefs = store.get().prefs;
    speak(text, { rate: prefs.ttsRate, voiceURI: prefs.ttsVoiceURI, accent: prefs.accent });
  }
});

act('spk-next', () => {
  session.index += 1;
  session.result = null;
  const list = drillList();
  if (session.rounds >= list.length) {
    store.set((state) => logSession(state, 'speaking', session.good, Math.max(1, session.rounds), XP_AWARD.speaking));
    session.rounds = 0;
    session.good = 0;
    session.index = 0;
    toast({ title: t('common.finish'), tone: 'success' });
  }
  refresh();
});

export const speakingView: ViewDef = {
  key: 'speaking',
  labelKey: 'nav.speaking',
  icon: 'mic',
  href: '#/speaking',
  pattern: '/speaking',
  nav: true,
  render,
};
