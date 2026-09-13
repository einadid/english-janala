import { dayKey, levelFromXp } from '@/core/gamification';
import { ask } from '@/core/tutor';
import { counts, skillAccuracy } from '@/core/analytics';
import { retention } from '@/core/srs';
import { cardList } from '@/core/analytics';
import { esc } from '@/core/dom';
import { t } from '@/core/i18n';
import { num } from '@/core/format';
import { LEVELS, VOCABULARY, wordsByLevel } from '@/data/vocabulary';
import { store } from '@/state';
import { bar, button, card, cefrChip, progressRing, radarChart, sectionTitle, SKILL_META, statTile } from '@/ui/components';
import { icon } from '@/ui/icons';
import { renderBlocks } from '@/ui/tutorBlocks';
import type { ViewDef } from './types';

function wordOfTheDay(): (typeof VOCABULARY)[number] {
  const today = dayKey();
  let hash = 0;
  for (let i = 0; i < today.length; i += 1) hash = (hash * 31 + today.charCodeAt(i)) % 100000;
  return VOCABULARY[hash % VOCABULARY.length] as (typeof VOCABULARY)[number];
}

function nextLevelNo(): number {
  const state = store.get();
  const targetCefr = state.profile.cefr;
  const preferred = LEVELS.find((level) => level.cefr === targetCefr) ?? LEVELS[0];
  const incomplete = LEVELS.find((level) => {
    const words = wordsByLevel(level.no);
    const mastered = words.filter((word) => state.cards[word.id]?.state === 'mastered').length;
    return mastered < words.length;
  });
  const chosen = preferred && wordsByLevel(preferred.no).some((word) => state.cards[word.id]?.state !== 'mastered')
    ? preferred
    : incomplete ?? LEVELS[0];
  return chosen?.no ?? 1;
}

export function render(): string {
  const state = store.get();
  const lang = state.prefs.uiLang;
  const stats = counts(state);
  const level = levelFromXp(state.xp.total);
  const cards = cardList(state);
  const strength = retention(cards);
  const skills = skillAccuracy(state);
  const radar = radarChart(
    skills.map((skill) => ({
      label: lang === 'bn' ? SKILL_META[skill.skill].labelBn : SKILL_META[skill.skill].label,
      value: Math.max(0.08, Math.min(1, skill.accuracy * 0.6 + Math.min(1, skill.attempts / 20) * 0.4)),
    })),
  );
  const word = wordOfTheDay();
  const name = state.profile.name || (lang === 'bn' ? 'বন্ধু' : 'friend');
  const plan = ask('plan', { name: state.profile.name, cefr: state.profile.cefr, dueCount: stats.due, streak: state.xp.streak.current });
  const levelNo = nextLevelNo();
  const levelMeta = LEVELS.find((entry) => entry.no === levelNo) ?? LEVELS[0];

  return `<div class="ej-fade grid gap-6 py-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm text-slate-500 dark:text-slate-400">${esc(t('dash.greeting'))}, ${esc(name)} 👋</p>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">${esc(t('dash.today'))}</h1>
        <div class="flex items-center gap-2 mt-2 flex-wrap">
          ${cefrChip(state.profile.cefr)}
          <span class="ej-chip">${icon('flame', 12)}<span>${num(state.xp.streak.current, lang)} ${esc(t('dash.streak'))}</span></span>
          <span class="ej-chip">${icon('zap', 12)}<span>${num(level.level, lang)} ${esc(t('common.level'))}</span></span>
        </div>
      </div>
      <div class="flex items-center gap-4">
        ${progressRing(level.pct, { size: 104, label: `${level.level}`, sub: `${level.toNext} XP → ${level.level + 1}`, color: '#38bdf8' })}
      </div>
    </header>

    <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      ${statTile({ icon: 'zap', label: t('dash.totalXp'), value: num(state.xp.total, lang), accent: '#facc15' })}
      ${statTile({ icon: 'repeat', label: `${stats.due} ${t('dash.dueCards')}`, value: num(stats.due, lang), hint: t('rev.title'), accent: '#38bdf8' })}
      ${statTile({ icon: 'gauge', label: t('dash.retention'), value: `${Math.round(strength * 100)}%`, accent: '#34d399' })}
      ${statTile({ icon: 'book', label: t('common.words'), value: num(stats.wordsSeen, lang), hint: `${num(stats.wordsMastered, lang)} ${t('common.mastered').toLowerCase()}`, accent: '#a78bfa' })}
    </section>

    <section class="grid lg:grid-cols-3 gap-6">
      ${card(`
        ${sectionTitle(t('dash.skills'), '', 'compass')}
        ${radar}
        <div class="grid gap-2 mt-4">
          ${skills
            .map(
              (skill) => `<div class="grid gap-1">
                <div class="flex justify-between text-xs font-medium">
                  <span>${esc(lang === 'bn' ? SKILL_META[skill.skill].labelBn : SKILL_META[skill.skill].label)}</span>
                  <span class="text-slate-500 dark:text-slate-400 tabular-nums">${skill.attempts === 0 ? '—' : `${Math.round(skill.accuracy * 100)}%`}</span>
                </div>
                ${bar(skill.attempts === 0 ? 0 : skill.accuracy, SKILL_META[skill.skill].accent, 6)}
              </div>`,
            )
            .join('')}
        </div>
      `, 'lg:col-span-2')}

      <div class="grid gap-6">
        ${card(`
          ${sectionTitle(t('dash.wordOfDay'), word.ipa, 'star')}
          <div class="text-3xl font-bold tracking-tight">${esc(word.word)}</div>
          <div class="font-bangla text-lg mt-1">${esc(word.bn)}</div>
          <p class="text-sm italic text-slate-500 dark:text-slate-400 mt-3">${esc(word.example)}</p>
          <div class="flex gap-2 mt-4 flex-wrap">
            ${button({ act: 'speak', args: { text: word.word }, label: t('common.listen'), icon: 'volume', variant: 'soft' })}
            ${button({ act: 'deck-add', args: { id: word.id }, label: t('learn.deck'), icon: 'plus', variant: 'outline' })}
          </div>
        `)}
        ${card(`
          ${sectionTitle(t('dash.continueLesson'), `${levelMeta?.title ?? ''} · ${levelMeta?.cefr ?? ''}`, 'book')}
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${esc(levelMeta?.summaryBn ?? levelMeta?.summary ?? '')}</p>
          ${button({ act: 'nav', args: { href: `#/learn/${levelNo}` }, label: t('common.continue'), icon: 'arrow', extra: 'ej-btn-block' })}
        `)}
      </div>
    </section>

    <section>
      ${sectionTitle(t('dash.quick'), '', 'layers')}
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${skills
          .map((skill) => {
            const meta = SKILL_META[skill.skill];
            return `<a href="${esc(meta.href)}" class="ej-card !p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform" style="border-color:${meta.accent}33">
              <span class="ej-icon-badge" style="background:${meta.accent}22;color:${meta.accent}">${icon(meta.icon, 18)}</span>
              <span class="min-w-0">
                <span class="block text-sm font-semibold">${esc(lang === 'bn' ? meta.labelBn : meta.label)}</span>
                <span class="block text-xs text-slate-500 dark:text-slate-400 tabular-nums">${num(skill.attempts, lang)} · ${
                  skill.attempts === 0 ? '—' : `${Math.round(skill.accuracy * 100)}%`
                }</span>
              </span>
              <span class="ml-auto text-slate-400">${icon('right', 16)}</span>
            </a>`;
          })
          .join('')}
      </div>
    </section>

    <section>
      ${card(`${sectionTitle(plan.titleBn && lang === 'bn' ? plan.titleBn : plan.title, '', 'target')}${renderBlocks(plan.blocks)}`)}
    </section>
  </div>`;
}

export const dashboardView: ViewDef = {
  key: 'dashboard',
  labelKey: 'nav.dashboard',
  icon: 'dashboard',
  href: '#/',
  pattern: '/',
  nav: true,
  render,
};
