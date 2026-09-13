import type { AppState } from './types';
import { setLang } from './i18n';

/** Push learner preferences onto <html>/<body> and the i18n module. */
export function applyPrefs(state: AppState): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.toggle('dark', state.prefs.theme === 'dark');
  root.lang = state.prefs.uiLang === 'bn' ? 'bn' : 'en';
  root.dataset.fontScale = String(state.prefs.fontScale);
  root.dataset.dyslexia = String(state.prefs.dyslexiaFont);
  root.dataset.motion = state.prefs.reduceMotion ? 'off' : 'on';
  setLang(state.prefs.uiLang);
}
