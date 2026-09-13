import type { DictationItem } from '@/core/types';

/**
 * Listening / dictation bank. Each line is read aloud by the browser voice at
 * the learner's chosen speed and scored with a word-level diff.
 */

const rows: Array<[string, string, 'A1' | 'A2' | 'B1' | 'B2' | 'C1', string]> = [
  ['dic-01', 'I drink tea every morning.', 'A1', 'Present simple + habit'],
  ['dic-02', 'She is cooking in the kitchen.', 'A1', 'Present continuous'],
  ['dic-03', 'They went to the market yesterday.', 'A1', 'Past simple'],
  ['dic-04', 'He does not like crowded buses.', 'A1', 'Negative with does'],
  ['dic-05', 'Can you help me with my homework?', 'A1', 'Question form'],
  ['dic-06', 'My brother has lived in Dhaka since 2019.', 'A2', 'since vs for'],
  ['dic-07', 'We should have left earlier to catch the bus.', 'A2', 'modal + perfect'],
  ['dic-08', 'If it rains, the match will be cancelled.', 'A2', 'first conditional'],
  ['dic-09', 'The report was written by two junior colleagues.', 'A2', 'passive voice'],
  ['dic-10', 'She has been studying English for three years.', 'A2', 'present perfect continuous'],
  ['dic-11', 'Although the journey was long, nobody complained.', 'B1', 'linking word'],
  ['dic-12', 'I would rather stay at home than go out tonight.', 'B1', 'would rather'],
  ['dic-13', 'The government announced a new education policy yesterday.', 'B1', 'news register'],
  ['dic-14', 'He asked me whether I had finished the assignment.', 'B1', 'reported question'],
  ['dic-15', 'You had better apologise before it becomes serious.', 'B1', 'had better'],
  ['dic-16', 'The researchers emphasised that the sample size was small.', 'B2', 'academic register'],
  ['dic-17', 'Despite the heavy rain, the protest continued peacefully.', 'B2', 'despite + noun'],
  ['dic-18', 'Not only did the cost rise, but service quality also fell.', 'B2', 'inversion'],
  ['dic-19', 'The policy is unlikely to reduce unemployment in the short term.', 'B2', 'hedging'],
  ['dic-20', 'Her argument was compelling, though it ignored a crucial detail.', 'B2', 'concession'],
  ['dic-21', 'The distinction between the two terms is subtle but significant.', 'C1', 'abstract nouns'],
  ['dic-22', 'Such claims remain controversial and largely unverified.', 'C1', 'formal hedging'],
  ['dic-23', 'Had we known earlier, the outcome would have been different.', 'C1', 'third conditional inversion'],
  ['dic-24', 'The proposal advocates a pragmatic rather than an idealistic approach.', 'C1', 'advanced collocation'],
];

export const DICTATION: DictationItem[] = rows.map((row) => ({
  id: row[0],
  text: row[1],
  cefr: row[2],
  hint: row[3],
}));

export function dictationByLevel(cefr: string, limit = 6): DictationItem[] {
  const exact = DICTATION.filter((item) => item.cefr === cefr);
  const pool = exact.length >= 3 ? exact : DICTATION;
  return pool.slice(0, limit);
}
