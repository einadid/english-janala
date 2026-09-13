// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { boot } from '@/app';
import { store } from '@/state';
import { PLACEMENT } from '@/data/extras';
import { LEVELS, wordsByLevel } from '@/data/vocabulary';

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

function shell(): void {
  document.body.innerHTML = `
    <div class="ej-topbar" id="topbar"></div>
    <main id="main"></main>
    <footer id="footer"></footer>
    <div id="toasts"></div>
    <div id="overlay"></div>`;
  window.location.hash = '#/';
}

function main(): HTMLElement {
  const el = document.getElementById('main');
  if (!el) throw new Error('no #main');
  return el;
}

function click(selector: string, root: ParentNode = main()): HTMLElement {
  const el = root.querySelector<HTMLElement>(selector);
  if (!el) throw new Error(`no element for ${selector}`);
  el.click();
  return el;
}

function clickAll(selector: string, root: ParentNode = main()): number {
  const nodes = root.querySelectorAll<HTMLElement>(selector);
  for (const node of nodes) node.click();
  return nodes.length;
}

function typeInto(selector: string, value: string): void {
  const el = main().querySelector<HTMLInputElement | HTMLTextAreaElement>(selector);
  if (!el) throw new Error(`no input ${selector}`);
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function submit(selector: string): void {
  const form = main().querySelector<HTMLFormElement>(selector);
  if (!form) throw new Error(`no form ${selector}`);
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

async function go(hash: string): Promise<void> {
  window.location.hash = hash;
  await tick();
  await tick();
}

describe('application smoke test', () => {
  beforeEach(() => {
    shell();
    store.reset();
    boot();
  });

  it('boots into onboarding for a brand new learner', () => {
    expect(main().textContent).toContain('English Janala 2.0');
    expect(main().querySelector('#onb-name')).not.toBeNull();
    expect(document.getElementById('topbar')?.querySelectorAll('.ej-nav a').length ?? 0).toBeGreaterThan(6);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('runs the placement test and unlocks the dashboard', async () => {
    typeInto('#onb-name', 'Rina');
    click('[data-act="onb-start-placement"]');
    await tick();

    for (let index = 0; index < PLACEMENT.length; index += 1) {
      const item = PLACEMENT[index];
      if (!item) break;
      expect(main().textContent).toContain(item.prompt);
      click(`[data-act="onb-answer"][data-args*='"i":${item.answer}']`);
      await tick();
    }

    expect(store.get().profile.name).toBe('Rina');
    click('[data-act="onb-finish"]');
    await tick();
    await tick();

    const state = store.get();
    expect(state.onboarded).toBe(true);
    expect(state.profile.placementScore).toBe(PLACEMENT.length);
    expect(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).toContain(state.profile.cefr);
    expect(main().textContent).toContain('XP');
    expect(main().querySelector('svg.ej-radar')).not.toBeNull();
  });

  it('browses levels, opens a word and fills the review deck', async () => {
    store.set((state) => {
      state.onboarded = true;
      state.profile.name = 'Rahim';
    });
    await go('#/learn');

    const levelLinks = main().querySelectorAll('a[href^="#/learn/"]');
    expect(levelLinks.length).toBe(LEVELS.length);

    await go('#/learn/5');
    const cards = main().querySelectorAll('[data-word]');
    expect(cards.length).toBe(wordsByLevel(5).length);

    click('[data-act="word-details"]');
    await tick();
    expect(document.querySelector('dialog.ej-modal')).not.toBeNull();
    document.querySelector<HTMLDialogElement>('dialog.ej-modal')?.remove();

    click('[data-act="learn-add-all"]');
    await tick();
    expect(store.get().saved.length).toBe(wordsByLevel(5).length);
    expect(store.get().xp.total).toBeGreaterThan(0);
    expect(store.get().xp.streak.current).toBe(1);
  });

  it('searches the whole vocabulary bank', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/learn');
    typeInto('#learn-search', 'climate');
    await tick();
    expect(main().textContent).toContain('climate');
    expect(main().querySelectorAll('[data-word]').length).toBeGreaterThan(0);
  });

  it('runs a spaced repetition session and schedules the card', async () => {
    store.set((state) => {
      state.onboarded = true;
      state.saved = ['l1-01', 'l1-02', 'l1-03'];
      state.cards['l1-01'] = { id: 'l1-01', state: 'new', stability: 0, difficulty: 5, due: Date.now() - 1000, reps: 0, lapses: 0, last: null };
      state.cards['l1-02'] = { id: 'l1-02', state: 'new', stability: 0, difficulty: 5, due: Date.now() - 1000, reps: 0, lapses: 0, last: null };
      state.cards['l1-03'] = { id: 'l1-03', state: 'new', stability: 0, difficulty: 5, due: Date.now() - 1000, reps: 0, lapses: 0, last: null };
    });

    await go('#/review');
    click('[data-act="rev-start"]');
    await tick();
    expect(main().textContent).toContain('1 / 3');

    click('[data-act="rev-reveal"]');
    await tick();
    expect(main().querySelectorAll('[data-act="rev-rate"]').length).toBe(4);

    click('[data-act="rev-rate"][data-args*="3"]');
    await tick();
    const card = store.get().cards['l1-01'];
    expect(card?.reps).toBe(1);
    expect(card?.due).toBeGreaterThan(Date.now());
    expect(main().textContent).toContain('2 / 3');

    // The 1-4 keyboard shortcut rates whatever card is on screen.
    click('[data-act="rev-reveal"]');
    await tick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: '4', bubbles: true }));
    await tick();
    expect(store.get().cards['l1-02']?.reps).toBe(1);
    expect(main().textContent).toContain('3 / 3');
  });

  it('answers a grammar drill and records the attempt', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/grammar');
    const topicButtons = clickAll('[data-act="gram-topic"]');
    expect(topicButtons).toBeGreaterThan(3);
    await tick();

    click('[data-act="gram-pick"]');
    await tick();
    expect(store.get().skills.grammar.attempts).toBe(1);
    expect(main().querySelector('[data-act="gram-next"]')).not.toBeNull();
  });

  it('reads a passage, looks up a word and finishes the check', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/reading/read-01');
    const lookups = main().querySelectorAll('[data-act="read-lookup"]');
    expect(lookups.length).toBeGreaterThan(3);

    expect(main().querySelectorAll('[data-act="read-answer"]').length).toBe(16);
    // The view re-renders after every answer, so re-query for the next live option.
    for (let round = 0; round < 4; round += 1) {
      const live = [...main().querySelectorAll<HTMLElement>('[data-act="read-answer"]')].find(
        (node) => !(node as HTMLButtonElement).disabled,
      );
      if (!live) throw new Error('no enabled option left');
      live.click();
      await tick();
    }

    click('[data-act="read-complete"]');
    await tick();
    expect(store.get().reading['read-01']).toBeDefined();
    expect(store.get().skills.reading.attempts).toBe(4);
    expect(store.get().xp.total).toBeGreaterThan(0);
  });

  it('scores a writing draft live', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/writing');
    const essay =
      'Online classes have changed the way students learn. Although many enjoy the flexibility, others struggle with distractions. ' +
      'Moreover, weak internet makes live lectures difficult. In my opinion, a blended model works best because it combines structure with freedom. ' +
      'Teachers should therefore record every lecture so that students can revisit difficult parts later in the week.';
    typeInto('#wrt-input', essay);
    await tick();
    const metrics = main().querySelector('#wrt-metrics');
    expect(metrics?.textContent).toContain('variety');
    expect(metrics?.textContent).toContain('although');

    click('[data-act="wrt-save"]');
    await tick();
    expect(store.get().drafts.length).toBe(1);
    expect(store.get().skills.writing.xp).toBeGreaterThan(0);
  });

  it('answers the offline tutor', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/tutor');
    typeInto('#tutor-input', 'correct: I am agree with you');
    submit('form[data-act="tutor-ask"]');
    await tick();
    expect(main().textContent).toContain('I agree with you.');

    click('[data-act="tutor-send"]');
    await tick();
    expect(main().querySelectorAll('#tutor-log > *').length).toBeGreaterThan(2);
  });

  it('renders the insights charts', async () => {
    store.set((state) => {
      state.onboarded = true;
      state.xp.total = 400;
      state.xp.daily['2026-09-13'] = 120;
      state.sessions.push({ id: 'x', skill: 'vocab', at: Date.now(), correct: 8, total: 10, xp: 64 });
    });
    await go('#/insights');
    expect(main().querySelectorAll('svg.ej-chart').length).toBeGreaterThanOrEqual(2);
    expect(main().textContent).toContain('XP');
  });

  it('changes preferences from settings', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/settings');
    click('#set-theme');
    await tick();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(store.get().prefs.theme).toBe('light');

    click('#set-motion');
    await tick();
    expect(store.get().prefs.reduceMotion).toBe(true);
    expect(document.documentElement.dataset.motion).toBe('off');
  });

  it('seeds sample progress for exploration', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/settings');
    click('[data-act="set-demo"]');
    await tick();
    const state = store.get();
    expect(Object.keys(state.cards).length).toBe(48);
    expect(Object.keys(state.xp.daily).length).toBe(14);
    expect(state.xp.total).toBeGreaterThan(500);
    expect(state.badges.length).toBeGreaterThan(0);
  });

  it('opens the command palette and jumps to a level', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    await tick();
    const overlay = document.getElementById('overlay');
    expect(overlay?.querySelector('#pal-input')).not.toBeNull();

    const input = overlay?.querySelector<HTMLInputElement>('#pal-input');
    if (!input) throw new Error('no palette input');
    input.value = 'Mastery';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await tick();
    expect(overlay?.querySelectorAll('.ej-palette-item').length ?? 0).toBeGreaterThan(0);

    const item = overlay?.querySelector<HTMLElement>('.ej-palette-item');
    item?.click();
    await tick();
    await tick();
    expect(window.location.hash).toBe('#/learn/10');
    expect(document.getElementById('overlay')?.innerHTML).toBe('');
  });

  it('switches the whole interface language', async () => {
    store.set((state) => {
      state.onboarded = true;
    });
    await go('#/');
    click('[data-act="lang-toggle"]', document);
    await tick();
    expect(store.get().prefs.uiLang).toBe('en');
    expect(document.getElementById('topbar')?.textContent).toContain('Dashboard');
    click('[data-act="lang-toggle"]', document);
    await tick();
    expect(store.get().prefs.uiLang).toBe('bn');
    expect(document.getElementById('topbar')?.textContent).toContain('ড্যাশবোর্ড');
  });
});
