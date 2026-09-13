/** Reusable presentational components. All return HTML strings. */

import type { Badge } from '@/core/gamification';
import type { CefrLevel, SkillKey, UiLang } from '@/core/types';
import { esc } from '@/core/dom';
import { icon } from './icons';

export const SKILL_META: Record<SkillKey, { icon: string; label: string; labelBn: string; href: string; accent: string }> = {
  vocab: { icon: 'book', label: 'Vocabulary', labelBn: 'শব্দভাণ্ডার', href: '#/learn', accent: '#38bdf8' },
  reading: { icon: 'reading', label: 'Reading', labelBn: 'রিডিং', href: '#/reading', accent: '#34d399' },
  listening: { icon: 'headphones', label: 'Listening', labelBn: 'লিসেনিং', href: '#/listening', accent: '#a78bfa' },
  speaking: { icon: 'mic', label: 'Speaking', labelBn: 'স্পিকিং', href: '#/speaking', accent: '#fb923c' },
  grammar: { icon: 'grammar', label: 'Grammar', labelBn: 'গ্রামার', href: '#/grammar', accent: '#f472b6' },
  writing: { icon: 'pen', label: 'Writing', labelBn: 'রাইটিং', href: '#/writing', accent: '#facc15' },
};

export function card(inner: string, extraClass = ''): string {
  return `<div class="ej-card ${extraClass}">${inner}</div>`;
}

export function sectionTitle(title: string, subtitle = '', icon_ = 'sparkle'): string {
  return `<div class="flex items-start gap-3 mb-4">
    <span class="ej-icon-badge">${icon(icon_, 18)}</span>
    <div>
      <h2 class="text-lg sm:text-xl font-semibold tracking-tight">${esc(title)}</h2>
      ${subtitle ? `<p class="text-sm text-slate-500 dark:text-slate-400">${esc(subtitle)}</p>` : ''}
    </div>
  </div>`;
}

export function statTile(opts: { icon: string; label: string; value: string; hint?: string; accent?: string }): string {
  const accent = opts.accent ?? '#38bdf8';
  return `<div class="ej-card ej-stat">
    <span class="ej-icon-badge" style="background:${accent}22;color:${accent}">${icon(opts.icon, 16)}</span>
    <div>
      <div class="text-2xl font-semibold tabular-nums leading-none">${esc(opts.value)}</div>
      <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">${esc(opts.label)}</div>
      ${opts.hint ? `<div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">${esc(opts.hint)}</div>` : ''}
    </div>
  </div>`;
}

export function progressRing(value: number, opts: { size?: number; label?: string; sub?: string; color?: string } = {}): string {
  const size = opts.size ?? 120;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, value));
  const dash = circumference * clamped;
  const color = opts.color ?? '#38bdf8';
  return `<div class="ej-ring" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.label ?? '')}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="currentColor" class="ej-ring-track" stroke-width="${stroke}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="${stroke}"
        stroke-linecap="round" stroke-dasharray="${dash.toFixed(1)} ${circumference.toFixed(1)}"
        transform="rotate(-90 ${size / 2} ${size / 2})" class="ej-ring-bar"/>
    </svg>
    <div class="ej-ring-label">
      <span class="text-xl font-semibold leading-none">${esc(opts.label ?? '')}</span>
      ${opts.sub ? `<span class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">${esc(opts.sub)}</span>` : ''}
    </div>
  </div>`;
}

export function bar(value: number, color = '#38bdf8', height = 8): string {
  const width = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return `<div class="ej-bar" style="height:${height}px"><span style="width:${width}%;background:${color}"></span></div>`;
}

export interface RadarPoint {
  label: string;
  value: number;
}

/** Hexagonal skill radar drawn in SVG. */
export function radarChart(points: RadarPoint[], size = 260): string {
  if (points.length < 3) return '';
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 34;
  const step = (Math.PI * 2) / points.length;

  const pointAt = (index: number, scale: number): [number, number] => {
    const angle = -Math.PI / 2 + index * step;
    return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
  };

  const rings = [0.25, 0.5, 0.75, 1].map((scale) => {
    const pts = points.map((_, index) => pointAt(index, scale).map((n) => n.toFixed(1)).join(',')).join(' ');
    return `<polygon points="${pts}" class="ej-radar-ring"/>`;
  }).join('');

  const axes = points
    .map((_, index) => {
      const [x, y] = pointAt(index, 1);
      return `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="ej-radar-axis"/>`;
    })
    .join('');

  const shape = points.map((point, index) => pointAt(index, Math.max(0.06, point.value)).map((n) => n.toFixed(1)).join(',')).join(' ');

  const dots = points
    .map((point, index) => {
      const [x, y] = pointAt(index, Math.max(0.06, point.value));
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.5" fill="#38bdf8"/>`;
    })
    .join('');

  const labels = points
    .map((point, index) => {
      const [x, y] = pointAt(index, 1.24);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="ej-radar-label">${esc(point.label)}</text>`;
    })
    .join('');

  return `<svg viewBox="0 0 ${size} ${size}" class="ej-radar" role="img" aria-label="Skill radar">
    ${rings}${axes}
    <polygon points="${shape}" class="ej-radar-shape"/>
    ${dots}${labels}
  </svg>`;
}

export interface SeriesPoint {
  label: string;
  value: number;
}

/** Area + line chart with hover-free value labels. */
export function lineChart(points: SeriesPoint[], opts: { height?: number; color?: string; suffix?: string } = {}): string {
  const height = opts.height ?? 140;
  const width = 560;
  const padding = { top: 14, right: 12, bottom: 22, left: 30 };
  if (points.length === 0) return '';
  const max = Math.max(...points.map((point) => point.value), 1);
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const stepX = points.length > 1 ? innerW / (points.length - 1) : innerW;

  const coords = points.map((point, index) => {
    const x = padding.left + index * stepX;
    const y = padding.top + innerH - (point.value / max) * innerH;
    return [x, y] as const;
  });

  const line = coords.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${(padding.left + innerW).toFixed(1)} ${(padding.top + innerH).toFixed(1)} L${padding.left} ${(padding.top + innerH).toFixed(1)} Z`;
  const color = opts.color ?? '#38bdf8';
  const gridLines = [0, 0.5, 1]
    .map((ratio) => {
      const y = padding.top + innerH - ratio * innerH;
      return `<line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${padding.left + innerW}" y2="${y.toFixed(1)}" class="ej-chart-grid"/>`;
    })
    .join('');
  const yLabels = [0, 0.5, 1]
    .map((ratio) => {
      const y = padding.top + innerH - ratio * innerH;
      return `<text x="${padding.left - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end" class="ej-chart-label">${Math.round(max * ratio)}</text>`;
    })
    .join('');
  const dots = coords
    .map(([x, y], index) => {
      const point = points[index];
      if (!point) return '';
      return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"><title>${esc(point.label)}: ${point.value}${esc(opts.suffix ?? '')}</title></circle></g>`;
    })
    .join('');
  const xLabels = coords
    .map(([x], index) => {
      const point = points[index];
      if (!point) return '';
      const show = points.length <= 8 || index % 2 === 0;
      return show ? `<text x="${x.toFixed(1)}" y="${height - 6}" text-anchor="middle" class="ej-chart-label">${esc(point.label)}</text>` : '';
    })
    .join('');

  return `<svg viewBox="0 0 ${width} ${height}" class="ej-chart" role="img" aria-label="Chart">
    ${gridLines}${yLabels}
    <path d="${area}" fill="${color}" opacity="0.14"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <g fill="${color}">${dots}</g>
    ${xLabels}
  </svg>`;
}

export function badgeChip(badge: Badge, earned: boolean, lang: UiLang): string {
  const name = lang === 'bn' ? badge.nameBn : badge.name;
  const desc = lang === 'bn' ? badge.descBn : badge.desc;
  return `<div class="ej-badge ${earned ? 'is-earned' : ''}" title="${esc(desc)}">
    <span class="ej-badge-icon">${icon(badge.icon, 18)}</span>
    <div class="min-w-0">
      <div class="text-sm font-medium truncate">${esc(name)}</div>
      <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">${esc(desc)}</div>
    </div>
  </div>`;
}

export function cefrChip(level: CefrLevel | string): string {
  return `<span class="ej-chip ej-cefr-${esc(String(level))}">${esc(String(level))}</span>`;
}

export function emptyState(message: string, hint = '', icon_ = 'bookmark'): string {
  return `<div class="ej-empty">
    <span class="ej-icon-badge">${icon(icon_, 20)}</span>
    <p class="text-slate-600 dark:text-slate-300 font-medium">${esc(message)}</p>
    ${hint ? `<p class="text-sm text-slate-500 dark:text-slate-400">${esc(hint)}</p>` : ''}
  </div>`;
}

export function button(opts: {
  act: string;
  args?: Record<string, unknown>;
  label: string;
  icon?: string;
  variant?: 'primary' | 'ghost' | 'outline' | 'danger' | 'soft';
  type?: 'button' | 'submit';
  disabled?: boolean;
  extra?: string;
}): string {
  const variant = opts.variant ?? 'primary';
  const args = opts.args ? ` data-args='${esc(JSON.stringify(opts.args))}'` : '';
  return `<button type="${opts.type ?? 'button'}" data-act="${esc(opts.act)}"${args}
    class="ej-btn ej-btn-${variant} ${opts.extra ?? ''}" ${opts.disabled ? 'disabled' : ''}>
    ${opts.icon ? icon(opts.icon, 16) : ''}<span>${esc(opts.label)}</span></button>`;
}

export function toggle(opts: { act: string; args?: Record<string, unknown>; checked: boolean; label: string; hint?: string; id: string }): string {
  const args = opts.args ? ` data-args='${esc(JSON.stringify(opts.args))}'` : '';
  return `<label class="ej-toggle" for="${esc(opts.id)}">
    <span>
      <span class="text-sm font-medium">${esc(opts.label)}</span>
      ${opts.hint ? `<span class="block text-xs text-slate-500 dark:text-slate-400">${esc(opts.hint)}</span>` : ''}
    </span>
    <input id="${esc(opts.id)}" type="checkbox" data-act="${esc(opts.act)}"${args} ${opts.checked ? 'checked' : ''} class="ej-switch"/>
  </label>`;
}

export function diffView(tokens: Array<{ text: string; status: string }>): string {
  return `<p class="ej-diff">${tokens
    .map((token) => `<span class="tok tok-${esc(token.status)}">${esc(token.text)}</span>`)
    .join(' ')}</p>`;
}
