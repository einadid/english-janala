import type { GrammarItem, GrammarRule } from '@/core/types';

/**
 * Grammar Lab content: short rule cards plus instant-feedback drills.
 * Explanations are bilingual because the error patterns come from Bangla.
 */

export const GRAMMAR_RULES: GrammarRule[] = [
  {
    id: 'rule-since-for',
    topic: 'Tenses',
    title: 'since + point, for + period',
    titleBn: 'since + নির্দিষ্ট সময়, for + সময়কাল',
    rule: 'Use "since" with the starting point (since 2019, since Monday) and "for" with a duration (for three years, for two hours). Both need a perfect tense, not present simple.',
    ruleBn: '"since" বসে শুরুর সময়ের সাথে (since 2019), "for" বসে সময়কালের সাথে (for three years)। দুটোতেই perfect tense লাগে।',
    right: 'I have lived here since 2019. / I have lived here for five years.',
    wrong: 'I am living here since 2019.',
  },
  {
    id: 'rule-articles',
    topic: 'Articles',
    title: 'a / an / the / no article',
    titleBn: 'a / an / the / কোনো article নয়',
    rule: 'Bangla has no article, so this is the most common transfer error. A singular countable noun almost always needs a determiner: "I am student" → "I am a student". Use "the" when both speakers know which one you mean.',
    ruleBn: 'বাংলায় article নেই, তাই এখানেই সবচেয়ে বেশি ভুল হয়। একবচন countable noun-এর আগে determiner লাগে: "I am a student"। নির্দিষ্ট কিছু বোঝালে "the"।',
    right: 'She is a teacher at a school near the river.',
    wrong: 'She is teacher at school near river.',
  },
  {
    id: 'rule-agree',
    topic: 'Verbs',
    title: 'agree is a verb, not an adjective',
    titleBn: 'agree ক্রিয়া, বিশেষণ নয়',
    rule: 'Say "I agree with you", never "I am agree with you". The same trap catches "discuss", "mention" and "enter" — they do not take "about", "about" or "into".',
    ruleBn: '"I agree with you" বলুন, "I am agree" নয়। একই ভুল হয় discuss, mention, enter-এর ক্ষেত্রেও — এদের পরে about/into লাগে না।',
    right: 'I agree with you. We discussed the plan. She entered the room.',
    wrong: 'I am agree with you. We discussed about the plan. She entered into the room.',
  },
  {
    id: 'rule-third-person',
    topic: 'Verbs',
    title: 'Third person singular -s',
    titleBn: 'তৃতীয় পুরুষ একবচনে -s',
    rule: 'In present simple, he/she/it takes -s on the main verb and "does" in questions and negatives: "She works", "Does she work?", "She does not work".',
    ruleBn: 'Present simple-এ he/she/it-এর পরে ক্রিয়ায় -s বসে, প্রশ্ন ও নেতিবাচক বাক্যে does: "She works", "Does she work?", "She does not work"।',
    right: 'He speaks English well. He does not speak French.',
    wrong: 'He speak English well. He does not speaks French.',
  },
  {
    id: 'rule-prepositions-time',
    topic: 'Prepositions',
    title: 'in / on / at with time',
    titleBn: 'সময়ের সাথে in / on / at',
    rule: 'at + clock time (at 7 pm), on + day or date (on Friday, on 16 December), in + month, year, season, longer periods (in March, in 2026, in the morning).',
    ruleBn: 'at + ঘণ্টা (at 7 pm), on + দিন বা তারিখ (on Friday), in + মাস, বছর, বড় সময়কাল (in March, in the morning)।',
    right: 'The class starts at 9 am on Monday in January.',
    wrong: 'The class starts in 9 am at Monday on January.',
  },
  {
    id: 'rule-conditionals',
    topic: 'Conditionals',
    title: 'Second and third conditionals',
    titleBn: 'দ্বিতীয় ও তৃতীয় conditional',
    rule: 'Unreal present: If + past simple, would + base verb. Unreal past: If + past perfect, would have + past participle. Never mix "would" into the if-clause.',
    ruleBn: 'বর্তমানের অকল্পিত অবস্থা: If + past simple, would + মূল ক্রিয়া। অতীতের অকল্পিত: If + past perfect, would have + past participle। if-অংশে would বসে না।',
    right: 'If I had more time, I would read more. If I had studied, I would have passed.',
    wrong: 'If I would have more time, I would read more.',
  },
  {
    id: 'rule-countable',
    topic: 'Nouns',
    title: 'Uncountable nouns have no plural',
    titleBn: 'Uncountable noun-এর বহুবচন হয় না',
    rule: 'information, advice, furniture, luggage, equipment, homework, research and news are uncountable. No -s, and use "some / a piece of", not "a".',
    ruleBn: 'information, advice, furniture, luggage, equipment, homework, research, news — এগুলো uncountable। এদের -s হয় না, "a"ও বসে না; ব্যবহার করুন "some / a piece of"।',
    right: 'Can you give me some information? That is good news.',
    wrong: 'Can you give me an information? Those are good newses.',
  },
  {
    id: 'rule-word-order',
    topic: 'Word order',
    title: 'Indirect questions keep statement order',
    titleBn: 'পরোক্ষ প্রশ্নে বাক্যের ক্রম থাকে বর্ণনার মতো',
    rule: 'Inside "Could you tell me…", the subject comes before the verb and there is no do/does/did: "Could you tell me where the station is?"',
    ruleBn: '"Could you tell me…" এর ভেতরে subject আগে, verb পরে, এবং do/does/did বসে না: "Could you tell me where the station is?"',
    right: 'Could you tell me where the station is? I wonder why he left.',
    wrong: 'Could you tell me where is the station? I wonder why did he leave.',
  },
];

const drillRows: Array<[string, string, string, string[], number, string, string, 'A1' | 'A2' | 'B1' | 'B2' | 'C1']> = [
  ['gr-01', 'Articles', 'She is ___ engineer at a private firm.', ['a', 'an', 'the', 'no article'], 1, '"Engineer" starts with a vowel sound, so the indefinite article is "an".', 'engineer শব্দটি স্বরধ্বনি দিয়ে শুরু, তাই "an" বসবে।', 'A1'],
  ['gr-02', 'Articles', 'I waited for ___ bus for forty minutes.', ['a', 'an', 'the', 'no article'], 2, 'Both speakers know which bus you mean — the one on your route — so "the".', 'কোন বাসের কথা বলা হচ্ছে তা দুজনেই জানে, তাই "the"।', 'A1'],
  ['gr-03', 'Verbs', 'He ___ to the office by bus every day.', ['go', 'goes', 'going', 'is go'], 1, 'Third person singular in present simple takes -s.', 'Present simple-এ তৃতীয় পুরুষ একবচনে -s লাগে।', 'A1'],
  ['gr-04', 'Verbs', '___ she work on Saturdays?', ['Do', 'Does', 'Is', 'Has'], 1, 'Questions with he/she/it use the auxiliary "does".', 'he/she/it দিয়ে প্রশ্নে auxiliary হয় "does"।', 'A1'],
  ['gr-05', 'Verbs', 'I completely ___ with your opinion.', ['am agree', 'agree', 'agreeing', 'am agreed'], 1, '"Agree" is a full verb, so no form of "be" is needed.', '"Agree" নিজেই ক্রিয়া, তাই be-verb লাগবে না।', 'A2'],
  ['gr-06', 'Tenses', 'We have lived in Chattogram ___ 2016.', ['for', 'since', 'from', 'during'], 1, '"2016" is a starting point, so use "since".', '২০১৬ একটি শুরুর সময়, তাই "since"।', 'A2'],
  ['gr-07', 'Tenses', 'She has been teaching ___ ten years.', ['since', 'for', 'from', 'at'], 1, '"Ten years" is a duration, so use "for".', 'দশ বছর একটি সময়কাল, তাই "for"।', 'A2'],
  ['gr-08', 'Tenses', 'Yesterday I ___ a very interesting documentary.', ['see', 'saw', 'have seen', 'had see'], 1, 'A finished time word (yesterday) requires past simple.', 'নির্দিষ্ট অতীত সময় (yesterday) থাকলে past simple লাগে।', 'A1'],
  ['gr-09', 'Tenses', 'Look! The children ___ in the rain.', ['play', 'plays', 'are playing', 'played'], 2, '"Look!" signals an action happening now — present continuous.', '"Look!" মানে এখন চলছে — present continuous।', 'A2'],
  ['gr-10', 'Prepositions', 'The meeting starts ___ 9 am ___ Monday.', ['in / at', 'at / on', 'on / in', 'at / in'], 1, 'at + clock time, on + day.', 'ঘণ্টার আগে at, দিনের আগে on।', 'A2'],
  ['gr-11', 'Prepositions', 'She is married ___ a doctor.', ['with', 'to', 'by', 'for'], 1, 'The fixed collocation is "married to".', 'স্থির collocation হলো "married to"।', 'B1'],
  ['gr-12', 'Prepositions', 'We discussed ___ the plan for an hour.', ['about', 'on', 'nothing', 'over'], 2, '"Discuss" is transitive — it takes a direct object with no preposition.', '"Discuss" একটি transitive ক্রিয়া, এর পরে preposition লাগে না।', 'B1'],
  ['gr-13', 'Nouns', 'Could you give me ___ about the course?', ['an advice', 'some advice', 'advices', 'the advices'], 1, '"Advice" is uncountable: no "a", no -s, use "some".', '"Advice" uncountable — না "a", না -s; ব্যবহার করুন "some"।', 'A2'],
  ['gr-14', 'Nouns', 'The news ___ shocking this morning.', ['are', 'were', 'is', 'have been'], 2, '"News" looks plural but takes a singular verb.', '"News" দেখতে বহুবচন হলেও singular verb নেয়।', 'B1'],
  ['gr-15', 'Conditionals', 'If I ___ more time, I would learn to play the guitar.', ['have', 'had', 'will have', 'would have'], 1, 'Unreal present: if + past simple, would + base verb.', 'অকল্পিত বর্তমান: if + past simple, would + মূল ক্রিয়া।', 'B1'],
  ['gr-16', 'Conditionals', 'If she had studied harder, she ___ the exam.', ['would pass', 'will pass', 'would have passed', 'passed'], 2, 'Unreal past: if + past perfect, would have + past participle.', 'অকল্পিত অতীত: if + past perfect, would have + past participle।', 'B2'],
  ['gr-17', 'Word order', 'Could you tell me ___?', ['where is the station', 'where the station is', 'the station is where', 'is where the station'], 1, 'Indirect questions use statement word order.', 'পরোক্ষ প্রশ্নে বর্ণনার ক্রম থাকে।', 'B1'],
  ['gr-18', 'Word order', 'I do not know ___ so early.', ['why did he leave', 'why he left', 'why he did leave', 'he left why'], 1, 'No auxiliary inversion inside the clause.', 'clause-এর ভেতরে auxiliary উল্টে যায় না।', 'B1'],
  ['gr-19', 'Modals', 'You ___ smoke in the hospital; it is prohibited.', ['must not', 'do not have to', 'should not to', 'may not to'], 0, '"Must not" expresses prohibition; "do not have to" means no obligation.', '"Must not" মানে নিষেধ; "do not have to" মানে বাধ্যবাধকতা নেই।', 'B1'],
  ['gr-20', 'Modals', 'You ___ pay; the museum is free today.', ['must not', 'cannot', 'do not have to', 'should not'], 2, 'No obligation = "do not have to".', 'বাধ্যবাধকতা নেই মানে "do not have to"।', 'B1'],
  ['gr-21', 'Passive', 'The bridge ___ in 1998.', ['built', 'was built', 'is built', 'has built'], 1, 'Past simple passive: was/were + past participle.', 'অতীত কালের passive গঠনে was/were + past participle বসে।', 'B1'],
  ['gr-22', 'Passive', 'Mistakes ___; that is how people learn.', ['should make', 'should be made', 'should be make', 'should making'], 1, 'Passive with a modal: modal + be + past participle.', 'Modal সহ passive: modal + be + past participle।', 'B2'],
  ['gr-23', 'Linking', '___ the heavy traffic, we arrived on time.', ['Although', 'Despite', 'However', 'Whereas'], 1, '"Despite" is followed by a noun phrase, not a clause.', '"Despite"-এর পরে noun phrase বসে, clause নয়।', 'B2'],
  ['gr-24', 'Linking', '___ he was exhausted, he finished the report.', ['Despite', 'Although', 'In spite', 'However'], 1, '"Although" introduces a clause with subject + verb.', '"Although"-এর পরে subject + verb সহ clause বসে।', 'B2'],
];

export const GRAMMAR_DRILLS: GrammarItem[] = drillRows.map((row) => ({
  id: row[0],
  topic: row[1],
  prompt: row[2],
  options: row[3],
  answer: row[4],
  why: row[5],
  whyBn: row[6],
  cefr: row[7],
}));

export const GRAMMAR_TOPICS: string[] = [...new Set(GRAMMAR_DRILLS.map((item) => item.topic))];

export function drillsByTopic(topic: string, limit = 6): GrammarItem[] {
  const pool = GRAMMAR_DRILLS.filter((item) => item.topic === topic);
  return (pool.length > 0 ? pool : GRAMMAR_DRILLS).slice(0, limit);
}

export function ruleForTopic(topic: string): GrammarRule | undefined {
  return GRAMMAR_RULES.find((rule) => rule.topic === topic);
}
