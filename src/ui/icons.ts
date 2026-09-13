/** Hand-written 24x24 stroke icon set. No icon library, no CDN, no FOIT. */

const PATHS: Record<string, string> = {
  dashboard: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  book: 'M6 4h6v16H6zM18 4h-6v16h6zM12 6v14',
  repeat: 'M17 2l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3',
  reading: 'M4 6h16M4 12h10M4 18h14',
  headphones: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2zM20 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z',
  mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3',
  grammar: 'M4 20l6-15 6 15M6.5 15h7',
  pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3',
  tutor: 'M4 5h16v10H9l-5 4z',
  insights: 'M4 20V10M10 20V4M16 20v-7M2 20h20',
  settings: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M18 18h2',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  play: 'M7 4l12 8-12 8z',
  pause: 'M9 5v14M15 5v14',
  stop: 'M8 8h8v8H8z',
  check: 'M5 13l4 4L19 7',
  close: 'M6 6l12 12M18 6L6 18',
  flame: 'M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 1 0 1-4 1-8z',
  star: 'M12 3l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.4l6-.8z',
  trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M12 13v4M9 20h6',
  volume: 'M4 10v4h3l4 4V6L7 10zM16 9a4 4 0 0 1 0 6',
  right: 'M9 5l7 7-7 7',
  left: 'M15 5l-7 7 7 7',
  down: 'M5 9l7 7 7-7',
  sun: 'M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19',
  moon: 'M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z',
  download: 'M12 4v10M8 11l4 4 4-4M4 19h16',
  upload: 'M12 20V10M8 13l4-4 4 4M4 5h16',
  trash: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  sparkle: 'M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z',
  target: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  seedling: 'M12 20v-6M12 14c0-3 2-5 5-5 0 3-2 5-5 5zM12 14c0-2.5-2-4.5-4.5-4.5C7.5 12 9.5 14 12 14z',
  crown: 'M4 17l1-9 4 4 3-6 3 6 4-4 1 9z',
  compass: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15 9l-2 5-5 2 2-5z',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  info: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8h.01',
  arrow: 'M4 12h15M13 6l6 6-6 6',
  keyboard: 'M3 6h18v12H3zM7 10h.01M11 10h.01M15 10h.01M7 14h10',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3.5 3 14 0 18M12 3c-3 3.5-3 14 0 18',
  zap: 'M13 3L5 14h6l-1 7 8-11h-6z',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20c1.5-4 5-6 8-6s6.5 2 8 6',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  heart: 'M12 20s-7-4.5-7-9a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 4.5-7 9-7 9z',
  bookmark: 'M6 4h12v16l-6-4-6 4z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  refresh: 'M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4',
  gauge: 'M4 17a8 8 0 1 1 16 0M12 17l4-5',
  send: 'M4 12l16-8-6 16-3-6z',
  eye: 'M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  lock: 'M6 11h12v9H6zM9 11V8a3 3 0 0 1 6 0v3',
  flag: 'M6 3v18M6 5h11l-2 4 2 4H6',
  medal: 'M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM9 14l-2 7 5-3 5 3-2-7',
};

export type IconName = keyof typeof PATHS | string;

export function icon(name: IconName, size = 20, extraClass = ''): string {
  const d = PATHS[name] ?? PATHS.info ?? '';
  return `<svg class="icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

export function iconNames(): string[] {
  return Object.keys(PATHS);
}
