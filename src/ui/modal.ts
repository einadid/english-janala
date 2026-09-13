import { parseArgs } from '@/core/dom';
import { closestAct } from '@/core/events';
import { runAct } from '@/core/events';

/** Promise-based <dialog> wrapper. Content is HTML built by the caller. */
export function openModal(html: string, opts: { label?: string } = {}): { close: () => void; el: HTMLDialogElement } {
  const dialog = document.createElement('dialog');
  dialog.className = 'ej-modal';
  dialog.setAttribute('aria-label', opts.label ?? 'Dialog');
  dialog.innerHTML = `<div class="ej-modal-box">${html}</div>`;
  document.body.appendChild(dialog);

  const close = (): void => {
    if (dialog.open) dialog.close();
    dialog.remove();
  };

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
    const trigger = closestAct(event.target, 'data-act');
    if (!trigger) return;
    const actName = trigger.getAttribute('data-act') ?? '';
    if (actName === 'modal-close') {
      event.preventDefault();
      close();
      return;
    }
    runAct(actName, trigger, parseArgs(trigger), event);
  });

  dialog.addEventListener('close', () => dialog.remove());
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
  return { close, el: dialog };
}

/** Fill the modal body in place (used by the review session). */
export function modalBody(dialog: HTMLDialogElement, html: string): void {
  const box = dialog.querySelector('.ej-modal-box');
  if (box) box.innerHTML = html;
}
