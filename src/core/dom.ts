/** Tiny DOM helpers. Views return HTML strings; every interpolation is escaped. */

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape any value for safe interpolation into HTML. */
export function esc(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char);
}

/** Escape for use inside a single-quoted HTML attribute. */
export function escAttr(value: unknown): string {
  return esc(value);
}

export function mount(host: Element, html: string): void {
  host.innerHTML = html;
}

export function qs<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null {
  return root.querySelector(selector);
}

export function qsa<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll(selector));
}

export function must<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const found = qs<T>(selector, root);
  if (!found) throw new Error(`Missing element: ${selector}`);
  return found;
}

export function parseArgs(el: Element): Record<string, unknown> {
  const raw = el.getAttribute('data-args');
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

export function strArg(el: Element, key: string): string {
  const value = parseArgs(el)[key];
  return typeof value === 'string' ? value : '';
}

export function numArg(el: Element, key: string): number {
  const value = parseArgs(el)[key];
  return typeof value === 'number' ? value : Number.NaN;
}

export function toggleClass(el: Element, name: string, on: boolean): void {
  el.classList.toggle(name, on);
}

/** Create an element from a tag/class shorthand, e.g. `make('div.card.badge')`. */
export function make<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string): HTMLElementTagNameMap[K] {
  const [name, ...classes] = tag.split('.');
  const el = document.createElement(name as keyof HTMLElementTagNameMap) as HTMLElementTagNameMap[K];
  if (classes.length) el.classList.add(...classes);
  if (text !== undefined) el.textContent = text;
  return el;
}
