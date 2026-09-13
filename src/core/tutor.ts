/**
 * The offline tutor engine.
 *
 * A tiny command parser over a curated knowledge base: it explains grammar,
 * corrects the transfer errors Bangla speakers actually make, quizzes the
 * learner, defines words and offers phrasebooks. Everything runs locally; an
 * LLM backend can be slotted in behind the same `ask()` contract.
 */

import type { CefrLevel, GrammarItem, Word } from './types';
import { ARTICLES, ERROR_PATTERNS, PHRASEBOOKS } from '@/data/tutor';
import type { ErrorPattern } from '@/data/tutor';
import { GRAMMAR_DRILLS } from '@/data/grammar';
import { IDIOMS } from '@/data/extras';
import { findWordByText, searchWords } from '@/data/vocabulary';

export type TutorBlock =
  | { type: 'para'; text: string; textBn: string }
  | { type: 'bad'; text: string }
  | { type: 'good'; text: string }
  | { type: 'list'; items: Array<{ en: string; bn: string }> }
  | { type: 'chips'; items: string[] }
  | { type: 'quiz'; drill: GrammarItem }
  | { type: 'word'; word: Word };

export interface TutorReply {
  id: string;
  kind: 'explain' | 'correct' | 'quiz' | 'word' | 'phrasebook' | 'idiom' | 'plan' | 'help';
  title: string;
  titleBn: string;
  blocks: TutorBlock[];
}

export interface TutorContext {
  name: string;
  cefr: CefrLevel;
  dueCount: number;
  streak: number;
}

export interface Correction {
  pattern: ErrorPattern;
}

const pick = <T,>(items: T[]): T | undefined => (items.length === 0 ? undefined : items[Math.floor(Math.random() * items.length)]);

/** Find every known error pattern inside a sentence. */
export function analyseSentence(sentence: string): Correction[] {
  const found: Correction[] = [];
  for (const pattern of ERROR_PATTERNS) {
    if (pattern.match.test(sentence)) found.push({ pattern });
  }
  return found;
}

function replyFromCorrection(corrections: Correction[], original: string): TutorReply {
  const blocks: TutorBlock[] = [{ type: 'para', text: `You wrote: “${original}”`, textBn: `আপনি লিখেছেন: “${original}”` }];
  for (const { pattern } of corrections) {
    blocks.push({ type: 'bad', text: pattern.wrong }, { type: 'good', text: pattern.right }, {
      type: 'para',
      text: pattern.why,
      textBn: pattern.whyBn,
    });
  }
  if (corrections.length === 0) {
    blocks.push(
      {
        type: 'para',
        text: 'I did not spot a known error pattern here. Read it aloud — if a word stumbles, that is usually where the problem is.',
        textBn: 'পরিচিত কোনো ভুলের নমুনা পাইনি। জোরে পড়ে দেখুন — যে শব্দে আটকান, সমস্যা সাধারণত সেখানেই।',
      },
      { type: 'chips', items: ['explain articles', 'quiz verbs', 'phrasebook interview'] },
    );
  }
  return {
    id: 'correct',
    kind: 'correct',
    title: corrections.length === 0 ? 'No known error found' : `${corrections.length} issue${corrections.length > 1 ? 's' : ''} found`,
    titleBn: corrections.length === 0 ? 'কোনো পরিচিত ভুল পাওয়া যায়নি' : `${corrections.length}টি সমস্যা পাওয়া গেছে`,
    blocks,
  };
}

function replyFromArticle(query: string): TutorReply | null {
  const needle = query.toLowerCase();
  const article =
    ARTICLES.find((entry) => entry.triggers.some((trigger) => needle.includes(trigger))) ??
    ARTICLES.find((entry) => needle.includes(entry.id.replace('art-', '')));
  if (!article) return null;
  return {
    id: article.id,
    kind: 'explain',
    title: article.title,
    titleBn: article.titleBn,
    blocks: [
      { type: 'para', text: article.body, textBn: article.bodyBn },
      { type: 'bad', text: article.wrong },
      { type: 'good', text: article.right },
      { type: 'chips', items: [`quiz ${article.id.replace('art-', '')}`] },
    ],
  };
}

function replyFromWord(query: string): TutorReply | null {
  const needle = query.trim().toLowerCase();
  const word = findWordByText(needle) ?? searchWords(needle, 1)[0];
  if (!word) return null;
  return {
    id: `word-${word.id}`,
    kind: 'word',
    title: word.word,
    titleBn: word.word,
    blocks: [{ type: 'word', word }],
  };
}

function replyFromQuiz(topic: string): TutorReply {
  const needle = topic.trim().toLowerCase();
  const pool = needle ? GRAMMAR_DRILLS.filter((drill) => drill.topic.toLowerCase().includes(needle)) : [];
  const drill = pick(pool.length > 0 ? pool : GRAMMAR_DRILLS);
  if (!drill) {
    return { id: 'quiz', kind: 'quiz', title: 'Quiz', titleBn: 'কুইজ', blocks: [] };
  }
  return {
    id: `quiz-${drill.id}`,
    kind: 'quiz',
    title: `Quick quiz: ${drill.topic}`,
    titleBn: `দ্রুত কুইজ: ${drill.topic}`,
    blocks: [{ type: 'quiz', drill }],
  };
}

function replyFromPhrasebook(query: string): TutorReply {
  const needle = query.trim().toLowerCase();
  const matched = PHRASEBOOKS.filter(
    (entry) => needle !== '' && (entry.situation.toLowerCase().includes(needle) || entry.id.includes(needle)),
  );
  const set = matched[0] ?? pick(PHRASEBOOKS) ?? PHRASEBOOKS[0];
  if (!set) {
    return { id: 'phrase', kind: 'phrasebook', title: 'Phrasebook', titleBn: 'ফ্রেজবুক', blocks: [] };
  }
  return {
    id: `phrase-${set.id}`,
    kind: 'phrasebook',
    title: set.situation,
    titleBn: set.situationBn,
    blocks: [{ type: 'list', items: set.lines }],
  };
}

function replyIdiom(): TutorReply {
  const idiom = pick(IDIOMS) ?? IDIOMS[0];
  if (!idiom) {
    return { id: 'idiom', kind: 'idiom', title: 'Idiom', titleBn: 'বাগধারা', blocks: [] };
  }
  return {
    id: idiom.id,
    kind: 'idiom',
    title: idiom.idiom,
    titleBn: idiom.idiom,
    blocks: [
      { type: 'para', text: idiom.meaning, textBn: idiom.meaningBn },
      { type: 'good', text: idiom.example },
      { type: 'chips', items: ['idiom', 'phrasebook greetings'] },
    ],
  };
}

function replyPlan(ctx: TutorContext): TutorReply {
  const greeting = ctx.name ? `${ctx.name}, here is your plan for today.` : 'Here is your plan for today.';
  const greetingBn = ctx.name ? `${ctx.name}, আজকের জন্য আপনার পরিকল্পমা।` : 'আজকের জন্য আপনার পরিকল্পমা।';
  const items: Array<{ en: string; bn: string }> = [
    ctx.dueCount > 0
      ? { en: `Clear the ${ctx.dueCount} cards waiting in your review queue.`, bn: `রিভিউ সারিতে অপেক্ষমাণ ${ctx.dueCount}টি কার্ড শেষ করুন।` }
      : { en: 'Add 10 new words to your deck from the next level.', bn: 'পরের লেভেল থেকে ১০টি নতুন শব্দ ডেকে যোগ করুন।' },
    { en: 'Read one passage and look up every unfamiliar word.', bn: 'একটি প্যাসেজ পড়ুন এবং অচেনা প্রতিটি শব্দ দেখে নিন।' },
    { en: 'Do one dictation round at 0.8x speed.', bn: '০.৮x গতিতে এক রাউন্ড dictation করুন।' },
    { en: 'Say three sentences from your deck out loud.', bn: 'ডেক থেকে তিনটি বাক্য জোরে বলুন।' },
    { en: 'Write 60 words about your day and check the metrics.', bn: 'আপনার দিন নিয়ে ৬০ শব্দ লিখুন এবং মেট্রিক্স দেখুন।' },
  ];
  if (ctx.streak > 0) {
    items.push({ en: `Keep the ${ctx.streak}-day streak alive — five minutes is enough.`, bn: `${ctx.streak} দিনের ধারা ধরে রাখুন — পাঁচ মিনিটই যথেষ্ট।` });
  }
  return {
    id: 'plan',
    kind: 'plan',
    title: 'Your daily plan',
    titleBn: 'আপনার দৈনিক পরিকল্পনা',
    blocks: [
      { type: 'para', text: greeting, textBn: greetingBn },
      { type: 'list', items },
      { type: 'chips', items: ['quiz tenses', 'phrasebook opinion'] },
    ],
  };
}

function replyHelp(): TutorReply {
  return {
    id: 'help',
    kind: 'help',
    title: 'What I can do',
    titleBn: 'আমি যা পারি',
    blocks: [
      {
        type: 'para',
        text: 'Type a command or just paste a sentence. I explain grammar, catch the errors Bangla speakers make most, quiz you, define words and open phrasebooks.',
        textBn: 'কমান্ড লিখুন অথবা সরাসরি বাক্য পেস্ট করুন। আমি গ্রামার বোঝাই, বাংলাভাষীদের সাধারণ ভুল ধরি, কুইজ নিই, শব্দের অর্থ দিই এবং phrasebook খুলে দিই।',
      },
      { type: 'chips', items: ['explain conditionals', 'correct: She is married with a doctor.', 'quiz articles', 'meaning resilient', 'phrasebook doctor', 'idiom', 'plan'] },
    ],
  };
}

/** Answer a free-text question. Never throws; always returns something useful. */
export function ask(input: string, ctx: TutorContext): TutorReply {
  const raw = input.trim();
  if (!raw) return replyHelp();

  const lowered = raw.toLowerCase();
  const after = (prefix: string): string =>
    lowered.startsWith(prefix) ? raw.slice(prefix.length).replace(/^[\s:–-]+/, '').trim() : '';

  const correctionInput = after('correct') || after('সংশোধন');
  if (correctionInput) return replyFromCorrection(analyseSentence(correctionInput), correctionInput);

  const explainInput = after('explain') || after('what is') || after('ব্যাখ্যা');
  if (explainInput) {
    const article = replyFromArticle(explainInput);
    if (article) return article;
    const word = replyFromWord(explainInput);
    if (word) return word;
  }

  const quizInput = after('quiz') || after('কুইজ');
  if (quizInput !== '' && (lowered.startsWith('quiz') || lowered.startsWith('কুইজ'))) return replyFromQuiz(quizInput);

  const meaningInput = after('meaning') || after('synonym') || after('অর্থ');
  if (meaningInput) {
    const word = replyFromWord(meaningInput);
    if (word) return word;
  }

  const phraseInput = after('phrasebook') || after('phrase') || after('ফ্রেজ');
  if (phraseInput !== '' && (lowered.startsWith('phrasebook') || lowered.startsWith('phrase') || lowered.startsWith('ফ্রেজ'))) {
    return replyFromPhrasebook(phraseInput);
  }

  if (/^idiom\b/.test(lowered)) return replyIdiom();
  if (/^plan\b/.test(lowered) || lowered === 'পরিকল্পনা') return replyPlan(ctx);
  if (/^(help|\?|সাহায্য)\b/.test(lowered)) return replyHelp();

  // Free-form sentence: treat it as a correction request.
  if (raw.split(/\s+/).length >= 3) {
    const corrections = analyseSentence(raw);
    if (corrections.length > 0) return replyFromCorrection(corrections, raw);
  }

  const article = replyFromArticle(lowered);
  if (article) return article;
  const word = replyFromWord(lowered);
  if (word) return word;

  return {
    ...replyHelp(),
    blocks: [
      {
        type: 'para',
        text: `I do not have “${raw}” in my offline knowledge base yet. Try one of these instead.`,
        textBn: `“${raw}” এখনো আমার অফলাইন নলেজ বেসে নেই। এগুলো থেকে একটি চেষ্টা করুন।`,
      },
      { type: 'chips', items: ['explain articles', 'quiz prepositions', 'phrasebook interview', 'plan'] },
    ],
  };
}
