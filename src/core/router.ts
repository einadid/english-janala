/** Hash router with named parameters: `#/learn/:id`. No dependencies. */

export interface RouteContext {
  path: string;
  params: Record<string, string>;
  query: URLSearchParams;
}

type ChangeListener = (ctx: RouteContext) => void;

interface Compiled {
  pattern: string;
  keys: string[];
  re: RegExp;
}

const routes: Compiled[] = [];
const listeners = new Set<ChangeListener>();
let started = false;

function compile(pattern: string): Compiled {
  const keys: string[] = [];
  const source = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) {
        keys.push(segment.slice(1));
        return '([^/]+)';
      }
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return { pattern, keys, re: new RegExp(`^${source}$`) };
}

export function addRoute(pattern: string): void {
  routes.push(compile(pattern));
}

export function onChange(listener: ChangeListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function parseHash(hash: string): { path: string; query: URLSearchParams } {
  const raw = hash.replace(/^#/, '') || '/';
  const [path = '/', queryString = ''] = raw.split('?');
  const clean = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return { path: clean || '/', query: new URLSearchParams(queryString) };
}

export function match(path: string): { pattern: string; params: Record<string, string> } | null {
  for (const route of routes) {
    const found = route.re.exec(path);
    if (!found) continue;
    const params: Record<string, string> = {};
    route.keys.forEach((key, index) => {
      params[key] = decodeURIComponent(found[index + 1] ?? '');
    });
    return { pattern: route.pattern, params };
  }
  return null;
}

export function current(): RouteContext {
  const { path, query } = parseHash(typeof window === 'undefined' ? '' : window.location.hash);
  const found = match(path);
  return { path, params: found?.params ?? {}, query };
}

export function navigate(to: string, opts: { replace?: boolean } = {}): void {
  const target = to.startsWith('#') ? to : `#${to}`;
  if (opts.replace) {
    window.history.replaceState(null, '', target);
    emit();
    return;
  }
  if (window.location.hash === target) {
    emit();
    return;
  }
  window.location.hash = target;
}

function emit(): void {
  const ctx = current();
  for (const listener of listeners) listener(ctx);
}

export function start(): void {
  if (started) return;
  started = true;
  window.addEventListener('hashchange', emit);
  if (!window.location.hash) window.location.hash = '#/';
  emit();
}
