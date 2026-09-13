import { boot } from '@/app';
import { applyPrefs } from '@/core/prefs';
import { storageAvailable } from '@/core/storage';
import { store } from '@/state';

applyPrefs(store.get());

if (!storageAvailable()) {
  // Private mode: the app still runs, progress just will not survive a reload.
  console.warn('[english-janala] localStorage unavailable — progress will not persist.');
}

boot();

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('./sw.js').catch(() => undefined);
  });
}
