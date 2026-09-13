/**
 * Delegated action registry.
 *
 * Views never attach inline handlers. They emit `data-act="name"` plus a JSON
 * `data-args` payload, and this module routes the event to the registered
 * handler. One listener for the whole document, zero leaks, easy to test.
 */

export type ActHandler = (el: HTMLElement, args: Record<string, unknown>, event: Event) => void;

const handlers = new Map<string, ActHandler>();

export function act(name: string, handler: ActHandler): string {
  handlers.set(name, handler);
  return name;
}

export function hasAct(name: string): boolean {
  return handlers.has(name);
}

export function runAct(name: string, el: HTMLElement, args: Record<string, unknown>, event: Event): boolean {
  const handler = handlers.get(name);
  if (!handler) return false;
  handler(el, args, event);
  return true;
}

/** Closest ancestor (or self) carrying the given attribute. */
export function closestAct(target: EventTarget | null, attr = 'data-act'): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const found = target.closest<HTMLElement>(`[${attr}]`);
  if (!found) return null;
  if (found instanceof HTMLButtonElement && found.disabled) return null;
  return found;
}
