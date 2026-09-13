/**
 * Knowledge base for the offline tutor: short explainer articles, phrasebooks
 * for real situations and — the part that matters most for Bangla speakers —
 * a set of transfer-error patterns with corrections.
 */

export interface TutorArticle {
  id: string;
  triggers: string[];
  title: string;
  titleBn: string;
  body: string;
  bodyBn: string;
  right: string;
  wrong: string;
}

export interface PhraseSet {
  id: string;
  situation: string;
  situationBn: string;
  lines: Array<{ en: string; bn: string }>;
}

export interface ErrorPattern {
  id: string;
  match: RegExp;
  fix: RegExp | null;
  replacement: string | null;
  wrong: string;
  right: string;
  why: string;
  whyBn: string;
}

export const ARTICLES: TutorArticle[] = [
  {
    id: 'art-present-perfect',
    triggers: ['present perfect', 'have done', 'has done', 'perfect tense', 'হ্যাজ ডান'],
    title: 'Present perfect: the bridge between past and now',
    titleBn: 'Present perfect: অতীত আর এখনকার সেতু',
    body: 'Use have/has + past participle when a past action still matters now, or when the time period is not finished. Bangla has no exact equivalent, so learners often use past simple where English needs the perfect.',
    bodyBn: 'যখন অতীতের কাজ এখনো ফলপ্রসূ, অথবা সময়কাল শেষ হয়নি, তখন have/has + past participle ব্যবহার করুন। বাংলায় এর হুবহু রূপ নেই বলে আমরা প্রায়ই past simple ব্যবহার করে ফেলি।',
    right: 'I have lost my key. (I still do not have it.) / She has lived here since 2019.',
    wrong: 'I lost my key yesterday evening and I have not found it yet.',
  },
  {
    id: 'art-articles',
    triggers: ['article', 'a an the', 'use of the', 'determiner'],
    title: 'Articles: the smallest words, the biggest habit',
    titleBn: 'Article: সবচেয়ে ছোট শব্দ, সবচেয়ে বড় অভ্যাস',
    body: 'Ask two questions before every singular countable noun: is it one of many (a/an) or the specific one we both know (the)? If the noun is uncountable or plural in a general sense, use nothing.',
    bodyBn: 'প্রতিটি একবচন countable noun-এর আগে দুটি প্রশ্ন করুন: এটি অনেকের একটি (a/an) নাকি নির্দিষ্ট একটি (the)? Uncountable বা সাধারণ অর্থে বহুবচন হলে কিছু বসবে না।',
    right: 'A doctor advised me to drink more water. The doctor I met yesterday was kind.',
    wrong: 'Doctor advised me to drink water.',
  },
  {
    id: 'art-prepositions',
    triggers: ['preposition', 'in on at', 'time preposition'],
    title: 'Prepositions of time and place',
    titleBn: 'সময় ও স্থানের preposition',
    body: 'Time: at 7 pm, on Friday, in March. Place: at the door, on the table, in the room. Collocations are simply memorised: good at, interested in, afraid of, married to, depend on.',
    bodyBn: 'সময়: at 7 pm, on Friday, in March। স্থান: at the door, on the table, in the room। Collocation মুখস্থ করতে হয়: good at, interested in, afraid of, married to, depend on।',
    right: 'I am good at English and interested in linguistics.',
    wrong: 'I am good in English and interested on linguistics.',
  },
  {
    id: 'art-conditionals',
    triggers: ['conditional', 'if clause', 'would have', 'second conditional', 'third conditional'],
    title: 'Conditionals without the panic',
    titleBn: 'Conditional নিয়ে ঘাবড়ানোর দরকার নেই',
    body: 'Zero: If you heat water, it boils. First: If it rains, I will stay. Second (unreal now): If I had time, I would read. Third (unreal past): If I had studied, I would have passed. The "would" never appears in the if-clause.',
    bodyBn: 'Zero: If you heat water, it boils। First: If it rains, I will stay। Second (এখনকার অকল্পিত): If I had time, I would read। Third (অতীতের অকল্পিত): If I had studied, I would have passed। if-অংশে would বসে না।',
    right: 'If I had left earlier, I would have caught the bus.',
    wrong: 'If I would have left earlier, I would have caught the bus.',
  },
  {
    id: 'art-passive',
    triggers: ['passive', 'was built', 'be verb'],
    title: 'Passive voice: hide the doer, keep the action',
    titleBn: 'Passive voice: কর্তা লুকান, কাজ রাখুন',
    body: 'Form: be + past participle. Use it when the action matters more than the person doing it, which is common in reports, news and academic writing.',
    bodyBn: 'গঠন: be + past participle। যখন কাজটা কর্তার চেয়ে গুরুত্বপূর্ণ তখন ব্যবহার করুন — খবর, রিপোর্ট ও একাডেমিক লেখায় এটি বেশি দেখা যায়।',
    right: 'The results were published last month.',
    wrong: 'The results published last month.',
  },
  {
    id: 'art-reported',
    triggers: ['reported speech', 'indirect speech', 'he said that'],
    title: 'Reported speech: shift back one tense',
    titleBn: 'Reported speech: এক ধাপ পেছনে সরান',
    body: 'Present simple → past simple, will → would, can → could, "today" → "that day". Questions lose their inversion and the question mark.',
    bodyBn: 'Present simple → past simple, will → would, can → could, "today" → "that day"। প্রশ্নে inversion আর প্রশ্নবোধক চিহ্ন থাকে না।',
    right: 'She said that she was tired and would call me that night.',
    wrong: 'She said that she is tired and will call me tonight.',
  },
  {
    id: 'art-collocations',
    triggers: ['collocation', 'word partners', 'make or do'],
    title: 'Collocations: make, do, have, take',
    titleBn: 'Collocation: make, do, have, take',
    body: 'English verbs have favourite partners. make a decision, make progress, do homework, do research, have breakfast, have a rest, take a photo, take a break. Learn chunks, not single words.',
    bodyBn: 'ইংরেজি ক্রিয়ার প্রিয় সঙ্গী আছে। make a decision, make progress, do homework, do research, have breakfast, have a rest, take a photo, take a break। শব্দ নয়, গুচ্ছ মুখস্থ করুন।',
    right: 'We made a decision and did the research quickly.',
    wrong: 'We did a decision and made the research quickly.',
  },
  {
    id: 'art-pronunciation',
    triggers: ['pronunciation', 'stress', 'speak clearly', 'accent'],
    title: 'Pronunciation: stress matters more than accent',
    titleBn: 'উচ্চারণ: অ্যাকসেন্টের চেয়ে stress বড় কথা',
    body: 'English is a stress-timed language: the stressed syllable is longer, louder and higher. Getting word stress right (phoTOgraphy vs PHOtograph) helps listeners far more than perfect vowel sounds. Slow down, group words into phrases, and pause at commas.',
    bodyBn: 'ইংরেজি stress-timed ভাষা: stressed অক্ষর দীর্ঘ, জোরে ও উঁচু স্বরে আসে। সঠিক word stress (phoTOgraphy বনাম PHOtograph) শ্রোতার জন্য নিখুঁত vowel-এর চেয়েও বেশি কাজে দেয়। ধীরে বলুন, শব্দগুলোকে গুছে নিন, কমাতে থামুন।',
    right: 'PHOtograph → phoTOgraphy → photoGRAPHic',
    wrong: 'Saying every syllable with equal strength sounds robotic, not clear.',
  },
  {
    id: 'art-speaking-fluency',
    triggers: ['fluency', 'speak fluently', 'speaking practice', 'hesitate'],
    title: 'Fluency: buy time politely',
    titleBn: 'সাবলীলতা: সময় কেনার ভদ্র উপায়',
    body: 'Fluent speakers do not know more words; they handle gaps better. Use fillers ("Well…", "Let me think…", "How should I put it?"), paraphrase when a word escapes you, and never apologise for your English.',
    bodyBn: 'সাবলীল বক্তা বেশি শব্দ জানেন না, তিনি শূন্যস্থান সামলাতে পারেন। Filler ব্যবহার করুন ("Well…", "Let me think…", "How should I put it?"), শব্দ মনে না এলে অন্যভাবে বলুন, আর নিজের ইংরেজির জন্য ক্ষমা চাইবেন না।',
    right: 'Let me think… it is a kind of tool used to measure pressure.',
    wrong: 'Sorry, my English is very bad, I cannot say.',
  },
  {
    id: 'art-ielts',
    triggers: ['ielts', 'exam', 'band score', 'admission'],
    title: 'Exam English: answer the question asked',
    titleBn: 'পরীক্ষার ইংরেজি: যে প্রশ্ন হয়েছে তারই উত্তর দিন',
    body: 'In IELTS Writing Task 2 examiners reward a clear position, paragraphing and a range of structures — not long sentences that wander. Plan for five minutes, write four paragraphs, and leave two minutes to check articles and verb forms, which is where most marks are lost.',
    bodyBn: 'IELTS Writing Task 2-এ পরীক্ষক স্পষ্ট অবস্থান, অনুচ্ছেদ বিন্যাস ও বৈচিত্র্যময় গঠনকে পুরস্কৃত করেন — এলোমেলো লম্বা বাক্যকে নয়। পাঁচ মিনিট পরিকল্পনা করুন, চার অনুচ্ছেদ লিখুন, শেষ দুই মিনিটে article ও verb form দেখুন — বেশিরভাগ নম্বর সেখানেই কাটা পড়ে।',
    right: 'Clear position → two body paragraphs with one idea each → short conclusion.',
    wrong: 'One enormous paragraph with six ideas and no linking words.',
  },
];

export const PHRASEBOOKS: PhraseSet[] = [
  {
    id: 'ph-greeting',
    situation: 'Greetings and small talk',
    situationBn: 'সম্ভাষণ ও হালকা আলাপ',
    lines: [
      { en: 'How is it going?', bn: 'কেমন চলছে?' },
      { en: 'Long time no see — what have you been up to?', bn: 'অনেকদিন দেখা নেই — কী করছিলেন?' },
      { en: 'I cannot complain. How about you?', bn: 'অভিযোগ করার কিছু নেই। আপনি?' },
      { en: 'It was lovely talking to you.', bn: 'আপনার সাথে কথা বলে ভালো লাগল।' },
      { en: 'I had better get going.', bn: 'আমার এখন ওঠা উচিত।' },
    ],
  },
  {
    id: 'ph-interview',
    situation: 'Job interview',
    situationBn: 'চাকরির ইন্টারভিউ',
    lines: [
      { en: 'Thank you for having me today.', bn: 'আজ আমাকে ডাকার জন্য ধন্যবাদ।' },
      { en: 'I have three years of experience in customer support.', bn: 'কাস্টমার সাপোর্টে আমার তিন বছরের অভিজ্ঞতা আছে।' },
      { en: 'Could you tell me more about the day-to-day responsibilities?', bn: 'দৈনন্দিন দায়িত্বগুলো সম্পর্কে আরেকটু বলবেন কি?' },
      { en: 'I work well under pressure and I am happy to take feedback.', bn: 'চাপের মধ্যেও কাজ করতে পারি এবং ফিডব্যাক নিতে স্বাচ্ছন্দ্যবোধ করি।' },
      { en: 'What would success look like in the first six months?', bn: 'প্রথম ছয় মাসে সফলতা দেখতে কেমন হবে?' },
    ],
  },
  {
    id: 'ph-restaurant',
    situation: 'Restaurant and café',
    situationBn: 'রেস্টুরেন্ট ও ক্যাফে',
    lines: [
      { en: 'A table for two, please.', bn: 'দুইজনের জন্য টেবিল দিন।' },
      { en: 'Could I see the menu, please?', bn: 'মেনুটা দেখতে পারি?' },
      { en: 'What do you recommend?', bn: 'আপনি কী সুপারিশ করবেন?' },
      { en: 'I am allergic to peanuts.', bn: 'আমার চিনাবাদামে অ্যালার্জি আছে।' },
      { en: 'Could we have the bill, please?', bn: 'বিলটা দিতে পারবেন?' },
    ],
  },
  {
    id: 'ph-doctor',
    situation: 'At the doctor',
    situationBn: 'ডাক্তারের কাছে',
    lines: [
      { en: 'I have had a headache since Tuesday.', bn: 'মঙ্গলবার থেকে মাথাব্যথা হচ্ছে।' },
      { en: 'It comes and goes.', bn: 'কখনো হয়, কখনো যায়।' },
      { en: 'Do I need any tests?', bn: 'কোনো পরীক্ষা লাগবে কি?' },
      { en: 'How often should I take this medicine?', bn: 'ওষুধটা কতবার খাব?' },
      { en: 'Should I avoid anything in particular?', bn: 'বিশেষ কিছু এড়িয়ে চলতে হবে কি?' },
    ],
  },
  {
    id: 'ph-classroom',
    situation: 'In class and in meetings',
    situationBn: 'ক্লাস ও মিটিংয়ে',
    lines: [
      { en: 'Could you repeat that, please?', bn: 'আবার একটু বলবেন?' },
      { en: 'Sorry, I did not catch that.', bn: 'দুঃখিত, আমি বুঝতে পারিনি।' },
      { en: 'Could you speak a little more slowly?', bn: 'একটু ধীরে বলবেন?' },
      { en: 'Just to make sure I understand — you mean…?', bn: 'আমি ঠিক বুঝলাম কি না দেখি — আপনি বলছেন…?' },
      { en: 'May I add something here?', bn: 'এখানে আমি কিছু যোগ করতে পারি?' },
    ],
  },
  {
    id: 'ph-opinion',
    situation: 'Giving an opinion politely',
    situationBn: 'ভদ্রভাবে মতামত দেওয়া',
    lines: [
      { en: 'From my point of view…', bn: 'আমার দৃষ্টিতে…' },
      { en: 'I see what you mean, but I would put it differently.', bn: 'আপনার কথা বুঝতে পেরেছি, তবে আমি অন্যভাবে বলতাম।' },
      { en: 'That is a fair point; however, there is another side to it.', bn: 'কথাটা যুক্তিসঙ্গত, তবে আরেকটি দিকও আছে।' },
      { en: 'I am not entirely convinced, to be honest.', bn: 'সত্যি বলতে, আমি পুরোপুরি আশ্বস্ত নই।' },
      { en: 'Could you give me an example of that?', bn: 'এটার একটা উদাহরণ দেবেন?' },
    ],
  },
];

export const ERROR_PATTERNS: ErrorPattern[] = [
  {
    id: 'err-am-agree',
    match: /\b(am|is|are|was|were)\s+agree\b/i,
    fix: /\b(am|is|are|was|were)\s+agree\b/i,
    replacement: 'agree',
    wrong: 'I am agree with you.',
    right: 'I agree with you.',
    why: '"Agree" is already a verb, so no form of "be" goes in front of it.',
    whyBn: '"Agree" নিজেই ক্রিয়া, তাই এর আগে be-verb বসে না।',
  },
  {
    id: 'err-discuss-about',
    match: /\bdiscuss(ed|es|ing)?\s+about\b/i,
    fix: /\bdiscuss(ed|es|ing)?\s+about\b/i,
    replacement: 'discussed',
    wrong: 'We discussed about the plan.',
    right: 'We discussed the plan.',
    why: '"Discuss" takes a direct object; "about" is redundant.',
    whyBn: '"Discuss"-এর পরে সরাসরি object বসে, "about" বাড়তি।',
  },
  {
    id: 'err-enter-into',
    match: /\benter(ed|s|ing)?\s+into\s+(the|a|an)\s+(room|building|house|office)/i,
    fix: /\binto\s+/i,
    replacement: '',
    wrong: 'She entered into the room.',
    right: 'She entered the room.',
    why: '"Enter" a physical place needs no preposition.',
    whyBn: 'কোনো স্থানে "enter" করতে preposition লাগে না।',
  },
  {
    id: 'err-married-with',
    match: /\bmarried\s+with\b/i,
    fix: /\bmarried\s+with\b/i,
    replacement: 'married to',
    wrong: 'She is married with a doctor.',
    right: 'She is married to a doctor.',
    why: 'The fixed collocation is "married to".',
    whyBn: 'স্থির collocation হলো "married to"।',
  },
  {
    id: 'err-be-since',
    match: /\b(am|is|are)\s+([a-z]+ing|\w+ed)?\s*(here|there)?\s*since\b/i,
    fix: null,
    replacement: null,
    wrong: 'I am living here since 2019.',
    right: 'I have lived here since 2019. / I have been living here since 2019.',
    why: 'A period that started in the past and continues now needs a perfect tense, not present continuous.',
    whyBn: 'অতীতে শুরু হয়ে এখনো চলছে এমন সময়কালে perfect tense লাগে, present continuous নয়।',
  },
  {
    id: 'err-since-duration',
    match: /\bsince\s+[a-z0-9-]+\s+(years?|months?|weeks?|days?|hours?)\b/i,
    fix: /\bsince\s+([a-z0-9-]+\s+\w+s?)\b/i,
    replacement: 'for $1',
    wrong: 'I have studied here since three years.',
    right: 'I have studied here for three years.',
    why: 'Use "for" with a duration and "since" with a starting point.',
    whyBn: 'সময়কাল বোঝাতে "for", শুরুর সময় বোঝাতে "since"।',
  },
  {
    id: 'err-uncountable',
    match: /\b(informations|advices|furnitures|luggages|equipments|homeworks|researches|peoples|childrens)\b/i,
    fix: null,
    replacement: null,
    wrong: 'He gave me many informations.',
    right: 'He gave me a lot of information.',
    why: 'These nouns are uncountable in English: no plural -s, and use "some / a lot of / a piece of".',
    whyBn: 'এই noun-গুলো uncountable: বহুবচনে -s হয় না, ব্যবহার করুন "some / a lot of / a piece of"।',
  },
  {
    id: 'err-a-advice',
    match: /\b(a|an)\s+(advice|information|equipment|furniture|luggage|homework|research|news)\b/i,
    fix: null,
    replacement: null,
    wrong: 'Can you give me an advice?',
    right: 'Can you give me some advice? / Can you give me a piece of advice?',
    why: 'Uncountable nouns cannot take "a/an". Use "some" or "a piece of".',
    whyBn: 'Uncountable noun-এর আগে "a/an" বসে না। ব্যবহার করুন "some" বা "a piece of"।',
  },
  {
    id: 'err-double-comparative',
    match: /\b(more\s+better|most\s+best|more\s+easier|less\s+better)\b/i,
    fix: null,
    replacement: null,
    wrong: 'This method is more better than the old one.',
    right: 'This method is better than the old one.',
    why: '"Better" is already comparative; do not stack "more" on top of it.',
    whyBn: '"Better" নিজেই তুলনামূলক, এর আগে "more" বসে না।',
  },
  {
    id: 'err-have-age',
    match: /\b(have|has)\s+[a-z0-9-]+\s+years?\s+old\b/i,
    fix: null,
    replacement: null,
    wrong: 'I have twenty years old.',
    right: 'I am twenty years old.',
    why: 'English expresses age with "be", not "have".',
    whyBn: 'ইংরেজিতে বয়স বোঝাতে "have" নয়, "be" ব্যবহার হয়।',
  },
  {
    id: 'err-modal-to',
    match: /\b(can|could|must|should|will|would|may|might)\s+to\s+\w+/i,
    fix: /\b(can|could|must|should|will|would|may|might)\s+to\s+/i,
    replacement: '$1 ',
    wrong: 'You must to finish the report today.',
    right: 'You must finish the report today.',
    why: 'Modal verbs are followed by the base verb without "to".',
    whyBn: 'Modal verb-এর পরে "to" ছাড়া মূল ক্রিয়া বসে।',
  },
  {
    id: 'err-did-past',
    match: /\b(did\s+not|didn't|did)\s+([a-z]+ed|went|saw|came|took|made|gave|found|bought|brought)\b/i,
    fix: null,
    replacement: null,
    wrong: 'I did not went to school yesterday.',
    right: 'I did not go to school yesterday.',
    why: 'After "did", the main verb stays in its base form.',
    whyBn: '"did"-এর পরে মূল ক্রিয়া base form-এ থাকে।',
  },
  {
    id: 'err-one-of-my-friend',
    match: /\bone\s+of\s+(my|the|our|their|his|her)\s+(friend|student|book|idea|reason|colleague)s?\b(?!s)/i,
    fix: null,
    replacement: null,
    wrong: 'One of my friend is a doctor.',
    right: 'One of my friends is a doctor.',
    why: '"One of" is always followed by a plural noun.',
    whyBn: '"One of"-এর পরে সবসময় বহুবচন noun বসে।',
  },
  {
    id: 'err-too-much-countable',
    match: /\btoo\s+much\s+(people|books|things|problems|questions|students|words|mistakes|cars|phones)\b/i,
    fix: /\btoo\s+much\b/i,
    replacement: 'too many',
    wrong: 'There are too much people in the room.',
    right: 'There are too many people in the room.',
    why: '"Too many" goes with countable plurals; "too much" with uncountables.',
    whyBn: 'গণনাযোগ্য বহুবচনের সাথে "too many", uncountable-এর সাথে "too much"।',
  },
  {
    id: 'err-i-am-having',
    match: /\b(i\s+am|he\s+is|she\s+is)\s+having\s+(a\s+)?(car|house|brother|sister|problem|headache|two|three)\b/i,
    fix: null,
    replacement: null,
    wrong: 'I am having two brothers.',
    right: 'I have two brothers.',
    why: 'For possession, use the simple present "have", not the continuous form.',
    whyBn: 'মালিকানা বোঝাতে present continuous নয়, সাধারণ "have" ব্যবহার করুন।',
  },
  {
    id: 'err-good-in',
    match: /\bgood\s+in\s+(english|maths|math|singing|drawing|sports|programming)\b/i,
    fix: /\bgood\s+in\b/i,
    replacement: 'good at',
    wrong: 'She is good in English.',
    right: 'She is good at English.',
    why: 'The collocation is "good at" a subject or activity.',
    whyBn: 'বিষয় বা কাজের ক্ষেত্রে collocation হলো "good at"।',
  },
];

export const TUTOR_SUGGESTIONS: string[] = [
  'explain present perfect',
  'correct: I am agree with you',
  'correct: I am living here since 2019',
  'quiz prepositions',
  'meaning diligent',
  'phrasebook interview',
  'idiom',
  'plan',
];
