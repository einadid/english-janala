import type { ViewDef } from './types';
import { dashboardView } from './dashboard';
import { learnView, learnLevelView } from './learn';
import { reviewView } from './review';
import { readingView, readingDetailView } from './reading';
import { listeningView } from './listening';
import { speakingView } from './speaking';
import { grammarView } from './grammarLab';
import { writingView } from './writing';
import { tutorView } from './tutor';
import { insightsView } from './insights';
import { settingsView } from './settings';

/** Ordered route table. `nav: true` entries appear in the top navigation. */
export const VIEWS: ViewDef[] = [
  dashboardView,
  learnView,
  learnLevelView,
  reviewView,
  readingView,
  readingDetailView,
  listeningView,
  speakingView,
  grammarView,
  writingView,
  tutorView,
  insightsView,
  settingsView,
];
