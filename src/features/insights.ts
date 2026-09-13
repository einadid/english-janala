import { act } from '@/core/events';
import { esc, strArg } from '@/core/dom';
import { t } from '@/core/i18n';
import { shortDate, relativeTime } from '@/core/format';
import { accuracyOf, badgeMetrics, cardList, counts, dailySeries, retentionForecast, skillAccuracy } from '@/core/analytics';
import { levelFromXp } from '@/core/gamification';
import { BADGES } from '@/core/gamification';
import { retention } from '@/core/srs';
import { exportState } from '@/core/exportImport';
import { VOCABULARY } from '@/data/vocabulary';
import { store } from '@/state';
import { badgeChip, bar, button, card, lineChart, progressRing, sectionTitle, SKILL_META, statTile } from '@/ui/components';
import { icon } from '@/ui/icons';
import { toast } from '@/ui/toast';
import type { ViewDef } from './types';

function render(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  const stats = counts(state);
  const cards = cardList(state);
  const strength = retention(cards);
  const level = levelFromXp(state.xp.total);
  const series = dailySeries(state, 14);
  const forecast = retentionForecast(cards, 14);
  const skills = skillAccuracy(state);
  const metrics = badgeMetrics(state);
  const totalWords = VOCABULARY.length;

  return `<div class="ej-fade grid gap-5 py-6">
    <header>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('nav.insights'))}</h1>
      <p class="text-slate-500 dark:text-slate-400 mt-1">${esc(t('app.tagline'))}</p>
    </header>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      ${statTile({ icon: 'zap', label: 'XP', value: `${state.xp.total}`, hint: `Lv ${level.level} · ${level.toNext} to next`, accent: '#facc15' })}
      ${statTile({ icon: 'flame', label: t('dash.streak'), value: `${state.xp.streak.current}`, hint: `best ${state.xp.streak.longest}`, accent: '#fb923c' })}
      ${statTile({ icon: 'target', label: t('common.accuracy'), value: `${Math.round(accuracyOf(state) * 100)}%`, accent: '#34d399' })}
      ${statTile({ icon: 'book', label: t('common.words'), value: `${stats.wordsSeen}/${totalWords}`, hint: `${stats.wordsMastered} ${t('common.mastered').toLowerCase()}`, accent: '#38bdf8' })}
    </section>

    <section class="grid lg:grid-cols-2 gap-5">
      ${card(`${sectionTitle(t('ins.xpChart'), '', 'insights')}${lineChart(
        series.map((point) => ({ label: shortDate(point.key), value: point.xp })),
        { color: '#38bdf8', suffix: ' XP' },
      )}`)}
      ${card(`${sectionTitle(t('ins.retention'), `${Math.round(strength * 100)}% today`, 'gauge')}${lineChart(
        forecast.map((point) => ({ label: `+${point.day}d`, value: Math.round(point.retention * 100) })),
        { color: '#a78bfa', suffix: '%' },
      )}<p class="text-xs text-slate-500 dark:text-slate-400 mt-2">${esc(
        lang === 'bn'
          ? 'কোনো রিভিউ না করলে আগামী ১৪ দিনে স্মৃতির শক্তি কেমন কমবে তার পূর্বাভাস।'
          : 'Projected memory strength over the next 14 days if you review nothing.',
      )}</p>`)}
    </section>

    <section class="grid lg:grid-cols-2 gap-5">
      ${card(`${sectionTitle(t('ins.accuracy'), '', 'target')}
        <div class="grid gap-3">
          ${skills
            .map(
              (skill) => `<div class="grid gap-1">
                <div class="flex justify-between text-sm">
                  <span class="font-medium">${esc(lang === 'bn' ? SKILL_META[skill.skill].labelBn : SKILL_META[skill.skill].label)}</span>
                  <span class="tabular-nums text-slate-500 dark:text-slate-400">${skill.correct}/${skill.attempts}</span>
                </div>
                ${bar(skill.accuracy, SKILL_META[skill.skill].accent)}
              </div>`,
            )
            .join('')}
        </div>`)}

      ${card(`${sectionTitle(t('ins.mastery'), `${cards.length} cards`, 'layers')}
        <div class="flex items-center gap-5 flex-wrap">
          ${progressRing(totalWords === 0 ? 0 : stats.wordsSeen / totalWords, {
            size: 104,
            label: `${stats.wordsSeen}`,
            sub: `/ ${totalWords} ${t('common.words')}`,
            color: '#34d399',
          })}
          <div class="grid gap-1.5 flex-1 min-w-[180px] text-sm">
            ${row(t('common.new'), stats.due, '#38bdf8')}
            ${row('learning', stats.learning, '#facc15')}
            ${row('review', stats.review, '#a78bfa')}
            ${row(t('common.mastered'), stats.mastered, '#34d399')}
          </div>
        </div>`)}
    </section>

    <section>
      ${card(`${sectionTitle(lang === 'bn' ? 'ব্যাজ' : 'Badges', `${state.badges.length}/${BADGES.length}`, 'trophy')}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${BADGES.map((badge) => badgeChip(badge, state.badges.includes(badge.id), lang)).join('')}
        </div>`)}
    </section>

    <section>
      ${card(`${sectionTitle(t('ins.sessions'), '', 'clock')}
        ${
          state.sessions.length === 0
            ? `<p class="text-sm text-slate-500 dark:text-slate-400">${esc(t('common.empty'))}</p>`
            : `<div class="grid gap-2">
                ${state.sessions
                  .slice(0, 8)
                  .map(
                    (session) => `<div class="flex items-center gap-3 text-sm">
                      <span class="ej-icon-badge" style="width:28px;height:28px;background:${SKILL_META[session.skill].accent}22;color:${
                        SKILL_META[session.skill].accent
                      }">${icon(SKILL_META[session.skill].icon, 14)}</span>
                      <span class="font-medium">${esc(lang === 'bn' ? SKILL_META[session.skill].labelBn : SKILL_META[session.skill].label)}</span>
                      <span class="tabular-nums text-slate-500 dark:text-slate-400">${session.correct}/${session.total}</span>
                      <span class="ml-auto text-xs text-slate-500 dark:text-slate-400 tabular-nums">${esc(relativeTime(session.at))} · +${session.xp} XP</span>
                    </div>`,
                  )
                  .join('')}
              </div>`
        }
        <div class="text-xs text-slate-500 dark:text-slate-400 mt-3 tabular-nums">${esc(
          `${t('dash.retention')}: ${Math.round(strength * 100)}% · ${t('common.level')} ${level.level} · ${metrics.days} ${lang === 'bn' ? 'দিন অনুশীলন' : 'active days'}`,
        )}</div>`)}
    </section>

    <section class="flex flex-wrap gap-2">
      ${button({ act: 'data-export', label: t('ins.export'), icon: 'download', variant: 'outline' })}
      ${button({ act: 'data-copy', label: lang === 'bn' ? 'ক্লিপবোর্ডে কপি' : 'Copy to clipboard', icon: 'globe', variant: 'ghost' })}
    </section>
  </div>`;
}

function row(label: string, value: number, color: string): string {
  return `<div class="flex items-center gap-2">
    <span style="width:8px;height:8px;border-radius:99px;background:${color};display:inline-block"></span>
    <span>${esc(label)}</span>
    <span class="ml-auto tabular-nums text-slate-500 dark:text-slate-400">${value}</span>
  </div>`;
}

act('data-export', () => {
  exportState(store.get());
  toast({ title: t('ins.export'), tone: 'success' });
});

act('data-copy', async () => {
  try {
    await navigator.clipboard.writeText(exportState(store.get()));
    toast({ title: t('toast.copied'), tone: 'success' });
  } catch {
    toast({ title: t('ins.export'), tone: 'info' });
  }
});

act('data-import-pick', (el) => {
  const id = strArg(el, 'id') || 'settings-file';
  document.getElementById(id)?.click();
});

export const insightsView: ViewDef = {
  key: 'insights',
  labelKey: 'nav.insights',
  icon: 'insights',
  href: '#/insights',
  pattern: '/insights',
  nav: true,
  render,
};
