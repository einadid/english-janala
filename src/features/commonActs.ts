import { act } from '@/core/events';
import { navigate } from '@/core/router';
import { refresh } from '@/core/render';
import { speak, stopSpeaking } from '@/core/audio';
import { XP_AWARD } from '@/core/gamification';
import { addToDeck, grantXp, markWordSeen, removeFromDeck, unlockBadges } from '@/core/progress';
import { getWord } from '@/data/vocabulary';
import { store } from '@/state';
import { t } from '@/core/i18n';
import { toast } from '@/ui/toast';
import { BADGES } from '@/core/gamification';

/** Actions shared by more than one view. Registered once at boot. */

act('nav', (_el, args) => {
  const href = typeof args.href === 'string' ? args.href : '#/';
  navigate(href);
});

act('speak', (_el, args) => {
  const text = typeof args.text === 'string' ? args.text : '';
  if (!text) return;
  const prefs = store.get().prefs;
  const spoken = speak(text, { rate: prefs.ttsRate, voiceURI: prefs.ttsVoiceURI, accent: prefs.accent });
  if (!spoken) toast({ title: t('set.voiceNone'), tone: 'warn' });
});

act('stop-speak', () => {
  stopSpeaking();
});

act('deck-add', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : '';
  const word = getWord(id);
  if (!word) return;
  store.set((state) => {
    const fresh = !state.saved.includes(id);
    addToDeck(state, id);
    markWordSeen(state, id, word.level);
    if (fresh) grantXp(state, XP_AWARD.wordOpen, 'vocab');
    if (fresh) {
      const badges = unlockBadges(state);
      for (const badge of badges) {
        toast({ title: `${t('badge.earned')}: ${badge.name}`, body: badge.desc, tone: 'success' });
      }
      toast({ title: t('toast.saved'), body: word.word, tone: 'success', timeout: 1800 });
    }
  });
  refresh();
});

act('deck-remove', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : '';
  store.set((state) => removeFromDeck(state, id));
  refresh();
});

act('word-known', (_el, args) => {
  const id = typeof args.id === 'string' ? args.id : '';
  const word = getWord(id);
  store.set((state) => {
    if (word && !state.known.includes(id)) {
      state.known.push(id);
      markWordSeen(state, id, word.level);
      grantXp(state, XP_AWARD.wordOpen, 'vocab');
    }
    const badges = unlockBadges(state);
    for (const badge of badges) {
      const badgeDef = BADGES.find((entry) => entry.id === badge.id);
      if (badgeDef) toast({ title: `${t('badge.earned')}: ${badgeDef.name}`, body: badgeDef.desc, tone: 'success' });
    }
  });
  refresh();
});

export {};
