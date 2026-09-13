import { applyPrefs } from '@/core/prefs';
import { esc, parseArgs, qs } from '@/core/dom';
import { act, closestAct, runAct } from '@/core/events';
import { t, getLang } from '@/core/i18n';
import { setRenderer } from '@/core/render';
import { addRoute, current, match, navigate, onChange, start as startRouter } from '@/core/router';
import type { RouteContext } from '@/core/router';
import { levelFromXp } from '@/core/gamification';
import { counts } from '@/core/analytics';
import { num } from '@/core/format';
import { searchWords, LEVELS } from '@/data/vocabulary';
import { store } from '@/state';
import { icon } from '@/ui/icons';
import { onboardingView } from '@/features/onboarding';
import { VIEWS } from '@/features';
import './features/commonActs';

interface PaletteItem {
  id: string;
  title: string;
  sub: string;
  icon: string;
  run: () => void;
}

let paletteOpen = false;
let paletteCursor = 0;
let paletteQuery = '';
let paletteItems: PaletteItem[] = [];
let pendingG = false;

function activeViewKey(path: string): string {
  const found = VIEWS.find((view) => match(path)?.pattern === view.pattern && view.nav);
  if (found) return found.key;
  if (path.startsWith('/learn')) return 'learn';
  if (path.startsWith('/reading')) return 'reading';
  return '';
}

function topbarHtml(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  const level = levelFromXp(state.xp.total);
  const stats = counts(state);
  const path = current().path;
  const active = activeViewKey(path);

  return `<div class="ej-shell flex items-center gap-3 py-2.5">
    <a href="#/" class="ej-brand shrink-0">
      <img src="./assets/logo.png" alt="" />
      <span>English</span><span class="font-bangla">জানালা</span>
    </a>
    <nav class="ej-nav flex-1" aria-label="Main">
      ${VIEWS.filter((view) => view.nav)
        .map(
          (view) =>
            `<a href="${esc(view.href)}" class="${view.key === active ? 'is-active' : ''}">${icon(view.icon, 15)}<span>${esc(
              t(view.labelKey),
            )}</span></a>`,
        )
        .join('')}
    </nav>
    <div class="flex items-center gap-1.5 shrink-0">
      <span class="ej-chip hidden sm:inline-flex" title="XP">${icon('zap', 12)}<span class="tabular-nums">${num(state.xp.total, lang)}</span></span>
      <span class="ej-chip hidden sm:inline-flex" title="Streak">${icon('flame', 12)}<span class="tabular-nums">${num(
        state.xp.streak.current,
        lang,
      )}</span></span>
      <button type="button" class="ej-btn ej-btn-ghost ej-btn-sm" data-act="palette" aria-label="${esc(t('cmd.placeholder'))}">${icon('search', 16)}</button>
      <button type="button" class="ej-btn ej-btn-ghost ej-btn-sm" data-act="theme-toggle" aria-label="Theme">${icon(
        state.prefs.theme === 'dark' ? 'sun' : 'moon',
        16,
      )}</button>
      <button type="button" class="ej-btn ej-btn-ghost ej-btn-sm" data-act="lang-toggle" aria-label="Language">${icon('globe', 16)}<span class="hidden sm:inline">${esc(
        lang === 'bn' ? 'EN' : 'বাং',
      )}</span></button>
      ${
        stats.due > 0
          ? `<a href="#/review" class="ej-btn ej-btn-primary ej-btn-sm hidden md:inline-flex">${icon('repeat', 14)}<span class="tabular-nums">${num(
              stats.due,
              lang,
            )}</span></a>`
          : ''
      }
      <span class="ej-chip ej-chip-accent hidden lg:inline-flex">Lv ${num(level.level, lang)}</span>
    </div>
  </div>`;
}

function footerHtml(): string {
  const lang = getLang();
  return `<div class="flex flex-wrap items-center justify-between gap-4 py-8 text-sm text-slate-500 dark:text-slate-400">
    <div class="flex items-center gap-2">
      <img src="./assets/logo.png" alt="" class="w-5 h-5 rounded" />
      <span class="font-semibold text-slate-600 dark:text-slate-300">English <span class="font-bangla">জানালা</span></span>
      <span>· v2.0</span>
    </div>
    <p class="${lang === 'bn' ? 'font-bangla' : ''}">${esc(t('footer.made'))}</p>
  </div>`;
}

function buildPaletteItems(): PaletteItem[] {
  const navItems: PaletteItem[] = VIEWS.filter((view) => view.nav).map((view) => ({
    id: `nav-${view.key}`,
    title: t(view.labelKey),
    sub: view.href,
    icon: view.icon,
    run: () => navigate(view.href),
  }));
  const levelItems: PaletteItem[] = LEVELS.map((level) => ({
    id: `level-${level.no}`,
    title: `${level.no}. ${level.title}`,
    sub: `${level.cefr} · ${level.titleBn}`,
    icon: 'book',
    run: () => navigate(`#/learn/${level.no}`),
  }));
  const wordItems: PaletteItem[] = searchWords(paletteQuery, 8).map((word) => ({
    id: `word-${word.id}`,
    title: word.word,
    sub: `${word.bn} · ${word.cefr}`,
    icon: 'star',
    run: () => {
      navigate(`#/learn/${word.level}`);
      window.setTimeout(() => {
        const el = document.querySelector<HTMLElement>(`[data-act="word-details"][data-args*="${word.id}"]`);
        el?.click();
      }, 60);
    },
  }));
  const actionItems: PaletteItem[] = [
    {
      id: 'act-theme',
      title: t('set.appearance'),
      sub: 'toggle theme',
      icon: 'moon',
      run: () => {
        store.set((state) => {
          state.prefs.theme = state.prefs.theme === 'dark' ? 'light' : 'dark';
        });
        applyPrefs(store.get());
      },
    },
    {
      id: 'act-reset',
      title: t('set.danger'),
      sub: 'settings',
      icon: 'trash',
      run: () => navigate('#/settings'),
    },
  ];
  const query = paletteQuery.trim().toLowerCase();
  const all = [...navItems, ...levelItems, ...wordItems, ...actionItems];
  if (!query) return all;
  return all.filter((item) => `${item.title} ${item.sub}`.toLowerCase().includes(query));
}

function paletteHtml(): string {
  paletteItems = buildPaletteItems();
  paletteCursor = Math.max(0, Math.min(paletteCursor, paletteItems.length - 1));
  return `<div class="ej-palette" data-act="palette-backdrop">
    <div class="ej-palette-box" data-act-stop>
      <div class="flex items-center gap-2 px-3 py-2.5 border-b border-[color:var(--ej-border)]">
        <span class="text-slate-400">${icon('search', 16)}</span>
        <input id="pal-input" class="ej-input !border-0 !bg-transparent !shadow-none" placeholder="${esc(t('cmd.placeholder'))}" value="${esc(
          paletteQuery,
        )}" data-act="pal-input" autocomplete="off" />
        <kbd class="ej-chip font-mono">esc</kbd>
      </div>
      <div class="ej-palette-list">
        ${
          paletteItems.length === 0
            ? `<div class="px-4 py-6 text-sm text-slate-500 dark:text-slate-400">${esc(t('cmd.empty'))}</div>`
            : paletteItems
                .map(
                  (item, index) =>
                    `<div class="ej-palette-item ${index === paletteCursor ? 'is-cursor' : ''}" data-act="pal-run" data-args='${esc(
                      JSON.stringify({ id: item.id }),
                    )}'>
                      <span class="ej-icon-badge" style="width:28px;height:28px">${icon(item.icon, 14)}</span>
                      <span class="min-w-0 flex-1">
                        <span class="block text-sm font-medium truncate">${esc(item.title)}</span>
                        <small class="block truncate">${esc(item.sub)}</small>
                      </span>
                    </div>`,
                )
                .join('')
        }
      </div>
    </div>
  </div>`;
}

function openPalette(): void {
  paletteOpen = true;
  paletteQuery = '';
  paletteCursor = 0;
  const overlay = qs<HTMLElement>('#overlay');
  if (!overlay) return;
  overlay.innerHTML = paletteHtml();
  const input = qs<HTMLInputElement>('#pal-input');
  input?.focus();
}

function closePalette(): void {
  paletteOpen = false;
  const overlay = qs<HTMLElement>('#overlay');
  if (overlay) overlay.innerHTML = '';
}

function runPaletteItem(id: string): void {
  const item = paletteItems.find((entry) => entry.id === id);
  closePalette();
  item?.run();
  refreshShell();
}

export function refreshShell(): void {
  const topbar = qs<HTMLElement>('#topbar');
  const footer = qs<HTMLElement>('#footer');
  if (topbar) topbar.innerHTML = topbarHtml();
  if (footer) footer.innerHTML = footerHtml();
}

function renderRoute(): void {
  const state = store.get();
  applyPrefs(state);
  refreshShell();

  const ctx: RouteContext = current();
  const main = qs<HTMLElement>('#main');
  if (!main) return;

  if (!state.onboarded) {
    main.innerHTML = onboardingView.render(ctx);
    onboardingView.after?.(ctx);
    return;
  }

  const found = match(ctx.path);
  const view = VIEWS.find((entry) => entry.pattern === found?.pattern) ?? VIEWS[0];
  if (!view) return;
  main.innerHTML = view.render(ctx);
  main.classList.remove('ej-fade');
  void main.offsetWidth;
  main.classList.add('ej-fade');
  view.after?.(ctx);
  try {
    window.scrollTo({ top: 0, behavior: state.prefs.reduceMotion ? 'auto' : 'smooth' });
  } catch {
    /* environments without smooth scrolling */
  }
}

function delegate(event: Event): void {
  if (event.type === 'click') {
    const trigger = closestAct(event.target);
    if (!trigger) return;
    const name = trigger.getAttribute('data-act') ?? '';
    if (name === 'palette-backdrop' && event.target === trigger) {
      closePalette();
      return;
    }
    if (runAct(name, trigger, parseArgs(trigger), event)) return;
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const name = target.getAttribute('data-act');
  if (!name) return;
  runAct(name, target, parseArgs(target), event);
}

function onKeydown(event: KeyboardEvent): void {
  const meta = event.metaKey || event.ctrlKey;
  if (meta && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (paletteOpen) closePalette();
    else openPalette();
    return;
  }

  if (event.key === 'Escape') {
    if (paletteOpen) {
      closePalette();
      return;
    }
    const dialog = document.querySelector<HTMLDialogElement>('dialog[open]');
    dialog?.close();
    return;
  }

  if (paletteOpen) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      paletteCursor = Math.min(paletteCursor + 1, paletteItems.length - 1);
      const overlay = qs<HTMLElement>('#overlay');
      if (overlay) overlay.innerHTML = paletteHtml();
      qs<HTMLInputElement>('#pal-input')?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      paletteCursor = Math.max(paletteCursor - 1, 0);
      const overlay = qs<HTMLElement>('#overlay');
      if (overlay) overlay.innerHTML = paletteHtml();
      qs<HTMLInputElement>('#pal-input')?.focus();
      return;
    }
    if (event.key === 'Enter') {
      const item = paletteItems[paletteCursor];
      if (item) {
        event.preventDefault();
        runPaletteItem(item.id);
      }
      return;
    }
  }

  const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
  if (typing || paletteOpen) return;

  // 1-4 rates the card that is currently on screen in the review lab.
  if (['1', '2', '3', '4'].includes(event.key)) {
    const button = document.querySelector<HTMLElement>(`[data-act="rev-rate"][data-args*='"rating":${event.key}']`);
    if (button) {
      event.preventDefault();
      button.click();
      return;
    }
  }

  if (event.key.toLowerCase() === 'g') {
    pendingG = true;
    window.setTimeout(() => {
      pendingG = false;
    }, 900);
    return;
  }
  if (pendingG) {
    const map: Record<string, string> = { d: '#/', l: '#/learn', r: '#/review', t: '#/tutor', i: '#/insights', s: '#/settings', w: '#/writing' };
    const target = map[event.key.toLowerCase()];
    if (target) {
      event.preventDefault();
      navigate(target);
    }
    pendingG = false;
  }
}

function registerActions(): void {
  document.addEventListener('click', delegate);
  document.addEventListener('input', delegate);
  document.addEventListener('change', delegate);
  document.addEventListener('submit', delegate);
  document.addEventListener('keydown', onKeydown);
}

function registerPaletteActions(): void {
  act('palette', () => openPalette());
  act('palette-backdrop', () => closePalette());
  act('pal-input', (el) => {
    paletteQuery = (el as HTMLInputElement).value;
    paletteCursor = 0;
    const overlay = qs<HTMLElement>('#overlay');
    if (!overlay) return;
    overlay.innerHTML = paletteHtml();
    const input = qs<HTMLInputElement>('#pal-input');
    input?.focus();
    input?.setSelectionRange(input.value.length, input.value.length);
  });
  act('pal-run', (el) => {
    const id = parseArgs(el).id;
    if (typeof id === 'string') runPaletteItem(id);
  });
  act('theme-toggle', () => {
    store.set((state) => {
      state.prefs.theme = state.prefs.theme === 'dark' ? 'light' : 'dark';
    });
    applyPrefs(store.get());
    refreshShell();
  });
  act('lang-toggle', () => {
    store.set((state) => {
      state.prefs.uiLang = state.prefs.uiLang === 'bn' ? 'en' : 'bn';
    });
    applyPrefs(store.get());
    renderRoute();
  });
}

export function boot(): void {
  for (const view of VIEWS) addRoute(view.pattern);
  addRoute(onboardingView.pattern);

  registerActions();
  registerPaletteActions();
  setRenderer(renderRoute);
  onChange(() => renderRoute());

  store.subscribe(() => refreshShell());

  renderRoute();
  startRouter();
}
