import type { ToastOptions } from '@/core/types';
import { esc } from '@/core/dom';
import { icon } from './icons';

const TONE_ICON: Record<string, string> = {
  info: 'info',
  success: 'check',
  warn: 'alert',
  error: 'alert',
};

const TONE_COLOR: Record<string, string> = {
  info: '#38bdf8',
  success: '#34d399',
  warn: '#facc15',
  error: '#f43f5e',
};

/** Show a toast. Returns the element so callers can dismiss it early. */
export function toast(options: ToastOptions): HTMLElement | null {
  const host = document.getElementById('toasts');
  if (!host) return null;
  const tone = options.tone ?? 'info';
  const el = document.createElement('div');
  el.className = 'ej-toast';
  el.setAttribute('role', 'status');
  el.innerHTML = `
    <span class="ej-icon-badge" style="background:${TONE_COLOR[tone]}22;color:${TONE_COLOR[tone]}">${icon(TONE_ICON[tone] ?? 'info', 16)}</span>
    <div class="min-w-0">
      <div class="text-sm font-semibold">${esc(options.title)}</div>
      ${options.body ? `<div class="text-xs text-slate-500 dark:text-slate-400">${esc(options.body)}</div>` : ''}
    </div>`;
  host.appendChild(el);
  const timeout = options.timeout ?? 3200;
  window.setTimeout(() => {
    el.classList.add('is-out');
    window.setTimeout(() => el.remove(), 220);
  }, timeout);
  return el;
}

export function toastText(title: string, tone: ToastOptions['tone'] = 'info'): void {
  toast({ title, tone });
}
