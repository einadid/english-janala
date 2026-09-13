import type { Idiom, PlacementItem } from '@/core/types';

export const IDIOMS: Idiom[] = [
  {
    id: 'idi-01',
    idiom: 'break the ice',
    meaning: 'to start a conversation in an awkward situation',
    meaningBn: 'অস্বস্তিকর পরিস্থিতিতে কথা শুরু করা',
    example: 'He told a small joke to break the ice at the interview.',
  },
  {
    id: 'idi-02',
    idiom: 'a piece of cake',
    meaning: 'something very easy',
    meaningBn: 'খুব সহজ কাজ',
    example: 'After months of practice, the exam felt like a piece of cake.',
  },
  {
    id: 'idi-03',
    idiom: 'hit the books',
    meaning: 'to study hard',
    meaningBn: 'কঠিন পড়াশোনা করা',
    example: 'The admission test is next week, so I must hit the books.',
  },
  {
    id: 'idi-04',
    idiom: 'once in a blue moon',
    meaning: 'very rarely',
    meaningBn: 'খুবই কম, কদাচিৎ',
    example: 'He visits his hometown once in a blue moon.',
  },
  {
    id: 'idi-05',
    idiom: 'on the same page',
    meaning: 'in agreement, sharing the same understanding',
    meaningBn: 'একই বোঝাপড়ায় থাকা',
    example: 'Before the meeting, let us make sure we are on the same page.',
  },
  {
    id: 'idi-06',
    idiom: 'bite off more than you can chew',
    meaning: 'to take on more work than you can handle',
    meaningBn: 'সামর্থ্যের চেয়ে বেশি কাজ নেওয়া',
    example: 'She bit off more than she could chew by taking two jobs.',
  },
  {
    id: 'idi-07',
    idiom: 'the ball is in your court',
    meaning: 'it is now your turn to act or decide',
    meaningBn: 'এবার সিদ্ধান্ত বা পদক্ষেপ আপনার',
    example: 'I have sent the proposal; the ball is in your court now.',
  },
  {
    id: 'idi-08',
    idiom: 'burn the midnight oil',
    meaning: 'to work or study late into the night',
    meaningBn: 'গভীর রাত পর্যন্ত কাজ বা পড়াশোনা করা',
    example: 'Students burn the midnight oil before the finals.',
  },
  {
    id: 'idi-09',
    idiom: 'get the hang of something',
    meaning: 'to learn the skills needed for something',
    meaningBn: 'কোনো কাজের কৌশল আয়ত্ত করা',
    example: 'After two weeks I finally got the hang of the new software.',
  },
  {
    id: 'idi-10',
    idiom: 'cut corners',
    meaning: 'to do something cheaply or quickly at the cost of quality',
    meaningBn: 'মানের বিনিময়ে সস্তা বা দ্রুত কাজ করা',
    example: 'The building collapsed because the builders cut corners.',
  },
  {
    id: 'idi-11',
    idiom: 'keep an eye on',
    meaning: 'to watch carefully',
    meaningBn: 'খেয়াল রাখা',
    example: 'Please keep an eye on my bag while I buy tickets.',
  },
  {
    id: 'idi-12',
    idiom: 'a blessing in disguise',
    meaning: 'something that seemed bad but turned out good',
    meaningBn: 'আপাত খারাপ কিন্তু ফলে ভালো কিছু',
    example: 'Losing that job was a blessing in disguise; I found a better one.',
  },
];

const placementRows: Array<[string, 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2', number, string, string[], number]> = [
  ['pl-01', 'A1', 1, 'Choose the correct sentence.', ['She have two brothers.', 'She has two brothers.', 'She having two brothers.', 'She haves two brothers.'], 1],
  ['pl-02', 'A1', 1, 'Fill in: I ___ tea every morning.', ['drinks', 'drinking', 'drink', 'drank'], 2],
  ['pl-03', 'A2', 2, 'Fill in: We have lived here ___ 2015.', ['for', 'since', 'from', 'at'], 1],
  ['pl-04', 'A2', 2, 'Choose the correct sentence.', ['He is agree with me.', 'He agrees with me.', 'He agree with me.', 'He does agrees with me.'], 1],
  ['pl-05', 'A2', 2, 'Fill in: The bridge ___ in 1998.', ['built', 'was built', 'is built', 'has built'], 1],
  ['pl-06', 'B1', 3, 'Fill in: If I ___ more time, I would travel.', ['have', 'had', 'will have', 'would have'], 1],
  ['pl-07', 'B1', 3, 'Choose the correct indirect question.', ['Do you know where is the bank?', 'Do you know where the bank is?', 'Do you know where does the bank is?', 'You know where is the bank?'], 1],
  ['pl-08', 'B1', 3, 'Fill in: She asked me ___ I had finished the report.', ['that', 'whether', 'what', 'which'], 1],
  ['pl-09', 'B2', 4, 'Fill in: ___ the heavy rain, the match continued.', ['Although', 'Despite', 'However', 'Whereas'], 1],
  ['pl-10', 'B2', 4, 'Choose the sentence with the most precise hedging.', [
    'The result is definitely true.',
    'The result appears to be consistent with earlier studies.',
    'The result is ok.',
    'Everybody knows the result.',
  ], 1],
  ['pl-11', 'C1', 5, 'Fill in: Had the plan been announced earlier, the confusion ___ avoided.', ['will be', 'would have been', 'would be', 'had been'], 1],
  ['pl-12', 'C2', 6, 'Which word best replaces “short-lived” in a formal essay?', ['Ephemeral', 'Ubiquitous', 'Pragmatic', 'Candid'], 0],
];

export const PLACEMENT: PlacementItem[] = placementRows.map((row) => ({
  id: row[0],
  cefr: row[1],
  difficulty: row[2],
  prompt: row[3],
  options: row[4],
  answer: row[5],
}));
