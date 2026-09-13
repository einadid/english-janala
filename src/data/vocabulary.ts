import type { CefrLevel, Level, Word } from '@/core/types';

/**
 * The bundled curriculum. Everything ships inside the app: no network call is
 * needed to learn, review or revise. A remote content API can later override
 * or extend these arrays without touching the UI.
 */

export const LEVELS: Level[] = [
  {
    no: 1,
    title: 'Foundations',
    titleBn: 'ভিত্তি',
    cefr: 'A1',
    summary: 'The 12 words you meet on day one of any English conversation.',
    summaryBn: 'ইংরেজি কথোপকথনের প্রথম দিনেই যে ১২টি শব্দ সামনে আসে।',
    accent: '#38bdf8',
  },
  {
    no: 2,
    title: 'Everyday Actions',
    titleBn: 'প্রাত্যহিক কাজ',
    cefr: 'A1',
    summary: 'Verbs and adverbs that carry a whole day of small talk.',
    summaryBn: 'সারাদিনের ছোটখাটো কথা বলায় যে ক্রিয়া ও ক্রিয়াবিশেষণ লাগে।',
    accent: '#22d3ee',
  },
  {
    no: 3,
    title: 'People & Places',
    titleBn: 'মানুষ ও স্থান',
    cefr: 'A2',
    summary: 'Describe your neighbourhood, your town and the people in it.',
    summaryBn: 'আপনার পাড়া, শহর আর সেখানকার মানুষকে বর্ণনা করুন।',
    accent: '#34d399',
  },
  {
    no: 4,
    title: 'Work & Study',
    titleBn: 'কাজ ও পড়াশোনা',
    cefr: 'A2',
    summary: 'Classroom, office and interview vocabulary.',
    summaryBn: 'ক্লাসরুম, অফিস আর ইন্টারভিউর শব্দভাণ্ডার।',
    accent: '#a3e635',
  },
  {
    no: 5,
    title: 'Ideas & Opinions',
    titleBn: 'ধারণা ও মতামত',
    cefr: 'B1',
    summary: 'Agree, disagree and give reasons without freezing.',
    summaryBn: 'একমত, দ্বিমত আর কারণ দেখানো — থেমে না গিয়ে।',
    accent: '#facc15',
  },
  {
    no: 6,
    title: 'Feelings & Life',
    titleBn: 'অনুভূতি ও জীবন',
    cefr: 'B1',
    summary: 'Talk about how you feel, not only about what happened.',
    summaryBn: 'কী ঘটেছে নয়, কেমন লাগছে — সেটাই বলুন।',
    accent: '#fb923c',
  },
  {
    no: 7,
    title: 'Society & Media',
    titleBn: 'সমাজ ও গণমাধ্যম',
    cefr: 'B2',
    summary: 'The language of news, debate and civic life.',
    summaryBn: 'খবর, বিতর্ক আর নাগরিক জীবনের ভাষা।',
    accent: '#f472b6',
  },
  {
    no: 8,
    title: 'Science & Technology',
    titleBn: 'বিজ্ঞান ও প্রযুক্তি',
    cefr: 'B2',
    summary: 'Explain data, research and machines clearly.',
    summaryBn: 'উপাত্ত, গবেষণা আর যন্ত্র পরিষ্কারভাবে ব্যাখ্যা করুন।',
    accent: '#a78bfa',
  },
  {
    no: 9,
    title: 'Precision & Argument',
    titleBn: 'নির্ভুলতা ও যুক্তি',
    cefr: 'C1',
    summary: 'Build arguments that survive a hostile question.',
    summaryBn: 'যুক্তি গড়ুন যা কঠিন প্রশ্নেও ভাঙে না।',
    accent: '#818cf8',
  },
  {
    no: 10,
    title: 'Mastery & Style',
    titleBn: 'দক্ষতা ও ভঙ্গি',
    cefr: 'C2',
    summary: 'Nuance, irony and the words that make writing sing.',
    summaryBn: 'সূক্ষ্মতা, ব্যঙ্গ আর যেসব শব্দ লেখাকে প্রাণ দেয়।',
    accent: '#f43f5e',
  },
];

export const LEVEL_CEFR: Record<number, CefrLevel> = {
  1: 'A1',
  2: 'A1',
  3: 'A2',
  4: 'A2',
  5: 'B1',
  6: 'B1',
  7: 'B2',
  8: 'B2',
  9: 'C1',
  10: 'C2',
};

/** [id, word, ipa, part of speech, Bangla meaning, example, level, synonyms?, tags?] */
type Row = [string, string, string, string, string, string, number, string[]?, string[]?];

const ROWS: Row[] = [
  // Level 1 — A1 Foundations
  ['l1-01', 'apple', '/ˈæp.əl/', 'noun', 'আপেল', 'She eats an apple every morning.', 1, [], ['food']],
  ['l1-02', 'family', '/ˈfæm.əl.i/', 'noun', 'পরিবার', 'My family lives in Dhaka.', 1, ['relatives', 'household'], ['people']],
  ['l1-03', 'water', '/ˈwɔː.tər/', 'noun', 'পানি', 'Please give me a glass of water.', 1, [], ['food']],
  ['l1-04', 'school', '/skuːl/', 'noun', 'স্কুল', 'The school starts at eight o’clock.', 1, [], ['place']],
  ['l1-05', 'friend', '/frend/', 'noun', 'বন্ধু', 'Rahim is my best friend.', 1, ['companion', 'mate'], ['people']],
  ['l1-06', 'happy', '/ˈhæp.i/', 'adjective', 'খুশি, সুখী', 'I am happy to see you today.', 1, ['glad', 'pleased'], ['feeling']],
  ['l1-07', 'eat', '/iːt/', 'verb', 'খাওয়া', 'We eat rice twice a day.', 1, ['consume'], ['action']],
  ['l1-08', 'go', '/ɡəʊ/', 'verb', 'যাওয়া', 'They go to work by bus.', 1, ['travel', 'leave'], ['action']],
  ['l1-09', 'big', '/bɪɡ/', 'adjective', 'বড়', 'Dhaka is a very big city.', 1, ['large', 'huge'], ['description']],
  ['l1-10', 'book', '/bʊk/', 'noun', 'বই', 'This book is easy to read.', 1, [], ['object']],
  ['l1-11', 'morning', '/ˈmɔː.nɪŋ/', 'noun', 'সকাল', 'I drink tea every morning.', 1, [], ['time']],
  ['l1-12', 'beautiful', '/ˈbjuː.tɪ.fəl/', 'adjective', 'সুন্দর', 'The village looks beautiful after rain.', 1, ['lovely', 'pretty'], ['description']],

  // Level 2 — A1 Everyday Actions
  ['l2-01', 'breakfast', '/ˈbrek.fəst/', 'noun', 'নাস্তা', 'I have breakfast at seven.', 2, [], ['food']],
  ['l2-02', 'clean', '/kliːn/', 'verb', 'পরিষ্কার করা', 'She cleans her room every Friday.', 2, ['tidy', 'wash'], ['action']],
  ['l2-03', 'help', '/help/', 'verb', 'সাহায্য করা', 'Can you help me with my homework?', 2, ['assist', 'support'], ['action']],
  ['l2-04', 'busy', '/ˈbɪz.i/', 'adjective', 'ব্যস্ত', 'He is busy with his office work.', 2, ['occupied'], ['description']],
  ['l2-05', 'tired', '/ˈtaɪəd/', 'adjective', 'ক্লান্ত', 'I feel tired after the long journey.', 2, ['exhausted', 'weary'], ['feeling']],
  ['l2-06', 'kitchen', '/ˈkɪtʃ.ən/', 'noun', 'রান্নাঘর', 'Mother is cooking in the kitchen.', 2, [], ['place']],
  ['l2-07', 'always', '/ˈɔːl.weɪz/', 'adverb', 'সবসময়', 'She always speaks the truth.', 2, ['constantly'], ['frequency']],
  ['l2-08', 'sometimes', '/ˈsʌm.taɪmz/', 'adverb', 'মাঝে মাঝে', 'Sometimes we walk to the market.', 2, ['occasionally'], ['frequency']],
  ['l2-09', 'weekend', '/ˌwiːkˈend/', 'noun', 'সাপ্তাহিক ছুটি', 'We visit our grandparents at the weekend.', 2, [], ['time']],
  ['l2-10', 'cheap', '/tʃiːp/', 'adjective', 'সস্তা', 'These shoes are cheap but strong.', 2, ['inexpensive', 'affordable'], ['description']],
  ['l2-11', 'expensive', '/ɪkˈspen.sɪv/', 'adjective', 'ব্যয়বহুল', 'A new laptop is expensive here.', 2, ['costly', 'pricey'], ['description']],
  ['l2-12', 'answer', '/ˈɑːn.sər/', 'noun', 'উত্তর', 'Please answer my question again.', 2, ['reply', 'response'], ['communication']],

  // Level 3 — A2 People & Places
  ['l3-01', 'neighbour', '/ˈneɪ.bər/', 'noun', 'প্রতিবেশী', 'Our neighbour grows flowers on the roof.', 3, [], ['people']],
  ['l3-02', 'crowded', '/ˈkraʊ.dɪd/', 'adjective', 'জনাকীর্ণ', 'The bus stand is crowded in the evening.', 3, ['packed', 'congested'], ['description']],
  ['l3-03', 'journey', '/ˈdʒɜː.ni/', 'noun', 'যাত্রা', 'The journey to Sylhet takes five hours.', 3, ['trip', 'voyage'], ['travel']],
  ['l3-04', 'village', '/ˈvɪl.ɪdʒ/', 'noun', 'গ্রাম', 'My village is beside a river.', 3, [], ['place']],
  ['l3-05', 'polite', '/pəˈlaɪt/', 'adjective', 'ভদ্র, বিনয়ী', 'She is polite to everyone in the office.', 3, ['courteous', 'well-mannered'], ['character']],
  ['l3-06', 'honest', '/ˈɒn.ɪst/', 'adjective', 'সৎ', 'He is an honest shopkeeper.', 3, ['truthful', 'sincere'], ['character']],
  ['l3-07', 'lazy', '/ˈleɪ.zi/', 'adjective', 'অলস', 'Do not be lazy on a working day.', 3, ['idle'], ['character']],
  ['l3-08', 'hospital', '/ˈhɒs.pɪ.təl/', 'noun', 'হাসপাতাল', 'The hospital is two kilometres away.', 3, [], ['place']],
  ['l3-09', 'foreign', '/ˈfɒr.ən/', 'adjective', 'বিদেশি', 'Foreign tourists love Cox’s Bazar.', 3, ['overseas'], ['description']],
  ['l3-10', 'stranger', '/ˈstreɪn.dʒər/', 'noun', 'অচেনা মানুষ', 'A stranger asked me for directions.', 3, ['outsider'], ['people']],
  ['l3-11', 'hometown', '/ˈhəʊm.taʊn/', 'noun', 'নিজ শহর', 'Chattogram is my hometown.', 3, [], ['place']],
  ['l3-12', 'guest', '/ɡest/', 'noun', 'অতিথি', 'We served tea to our guests.', 3, ['visitor'], ['people']],

  // Level 4 — A2 Work & Study
  ['l4-01', 'homework', '/ˈhəʊm.wɜːk/', 'noun', 'বাড়ির কাজ', 'Finish your homework before dinner.', 4, ['assignment'], ['study']],
  ['l4-02', 'subject', '/ˈsʌb.dʒekt/', 'noun', 'বিষয়', 'Mathematics is my favourite subject.', 4, ['topic'], ['study']],
  ['l4-03', 'exam', '/ɪɡˈzæm/', 'noun', 'পরীক্ষা', 'The final exam starts next week.', 4, ['test', 'assessment'], ['study']],
  ['l4-04', 'pass', '/pɑːs/', 'verb', 'পাশ করা', 'She passed the exam with good marks.', 4, ['succeed'], ['study']],
  ['l4-05', 'fail', '/feɪl/', 'verb', 'ব্যর্থ হওয়া', 'He failed to submit the form on time.', 4, ['flunk'], ['study']],
  ['l4-06', 'salary', '/ˈsæl.ər.i/', 'noun', 'বেতন', 'His monthly salary is thirty thousand taka.', 4, ['wage', 'pay'], ['work']],
  ['l4-07', 'interview', '/ˈɪn.tə.vjuː/', 'noun', 'ইন্টারভিউ', 'The interview lasted twenty minutes.', 4, ['meeting'], ['work']],
  ['l4-08', 'skill', '/skɪl/', 'noun', 'দক্ষতা', 'Communication is a vital skill.', 4, ['ability', 'expertise'], ['work']],
  ['l4-09', 'practise', '/ˈpræk.tɪs/', 'verb', 'অনুশীলন করা', 'Practise speaking for ten minutes daily.', 4, ['rehearse', 'drill'], ['study']],
  ['l4-10', 'improve', '/ɪmˈpruːv/', 'verb', 'উন্নতি করা', 'Reading daily will improve your grammar.', 4, ['enhance', 'boost'], ['study']],
  ['l4-11', 'deadline', '/ˈded.laɪn/', 'noun', 'শেষ সময়সীমা', 'The deadline is Friday evening.', 4, ['due date'], ['work']],
  ['l4-12', 'colleague', '/ˈkɒl.iːɡ/', 'noun', 'সহকর্মী', 'My colleague helped me finish the report.', 4, ['co-worker'], ['work']],

  // Level 5 — B1 Ideas & Opinions
  ['l5-01', 'opinion', '/əˈpɪn.jən/', 'noun', 'মতামত', 'In my opinion, honesty matters most.', 5, ['view', 'belief'], ['communication']],
  ['l5-02', 'agree', '/əˈɡriː/', 'verb', 'একমত হওয়া', 'I agree with your suggestion.', 5, ['concur'], ['communication']],
  ['l5-03', 'argue', '/ˈɑːɡ.juː/', 'verb', 'তর্ক করা', 'They argued about the new rule.', 5, ['debate', 'dispute'], ['communication']],
  ['l5-04', 'suggest', '/səˈdʒest/', 'verb', 'প্রস্তাব করা', 'I suggest leaving early tomorrow.', 5, ['propose', 'recommend'], ['communication']],
  ['l5-05', 'reason', '/ˈriː.zən/', 'noun', 'কারণ', 'There is a good reason for the delay.', 5, ['cause', 'explanation'], ['communication']],
  ['l5-06', 'decide', '/dɪˈsaɪd/', 'verb', 'সিদ্ধান্ত নেওয়া', 'She decided to study abroad.', 5, ['determine', 'choose'], ['thinking']],
  ['l5-07', 'purpose', '/ˈpɜː.pəs/', 'noun', 'উদ্দেশ্য', 'The purpose of the meeting is clear.', 5, ['aim', 'goal'], ['thinking']],
  ['l5-08', 'advantage', '/ədˈvɑːn.tɪdʒ/', 'noun', 'সুবিধা', 'Online classes have many advantages.', 5, ['benefit'], ['thinking']],
  ['l5-09', 'drawback', '/ˈdrɔː.bæk/', 'noun', 'অসুবিধা, ত্রুটি', 'The main drawback is the cost.', 5, ['disadvantage', 'weakness'], ['thinking']],
  ['l5-10', 'however', '/haʊˈev.ər/', 'adverb', 'তবে, যাই হোক', 'The plan is good; however, it is costly.', 5, ['nevertheless'], ['linking']],
  ['l5-11', 'instead', '/ɪnˈsted/', 'adverb', 'পরিবর্তে', 'Take the bus instead of a rickshaw.', 5, ['alternatively'], ['linking']],
  ['l5-12', 'whether', '/ˈweð.ər/', 'conjunction', 'কিনা', 'I do not know whether he will come.', 5, ['if'], ['linking']],

  // Level 6 — B1 Feelings & Life
  ['l6-01', 'anxious', '/ˈæŋk.ʃəs/', 'adjective', 'উদ্বিগ্ন', 'She felt anxious before the interview.', 6, ['worried', 'nervous'], ['feeling']],
  ['l6-02', 'confident', '/ˈkɒn.fɪ.dənt/', 'adjective', 'আত্মবিশ্বাসী', 'He is confident about his English now.', 6, ['self-assured'], ['feeling']],
  ['l6-03', 'proud', '/praʊd/', 'adjective', 'গর্বিত', 'We are proud of our daughter.', 6, ['satisfied'], ['feeling']],
  ['l6-04', 'lonely', '/ˈləʊn.li/', 'adjective', 'একাকী', 'He felt lonely in the new city.', 6, ['solitary'], ['feeling']],
  ['l6-05', 'grateful', '/ˈɡreɪt.fəl/', 'adjective', 'কৃতজ্ঞ', 'I am grateful for your help.', 6, ['thankful'], ['feeling']],
  ['l6-06', 'regret', '/rɪˈɡret/', 'verb', 'আক্ষেপ করা', 'I regret not practising every day.', 6, ['repent'], ['feeling']],
  ['l6-07', 'courage', '/ˈkʌr.ɪdʒ/', 'noun', 'সাহস', 'It takes courage to speak a new language.', 6, ['bravery'], ['character']],
  ['l6-08', 'patience', '/ˈpeɪ.ʃəns/', 'noun', 'ধৈর্য', 'Learning a language needs patience.', 6, ['tolerance'], ['character']],
  ['l6-09', 'disappointed', '/ˌdɪs.əˈpɔɪn.tɪd/', 'adjective', 'হতাশ', 'She was disappointed by the result.', 6, ['let down'], ['feeling']],
  ['l6-10', 'delighted', '/dɪˈlaɪ.tɪd/', 'adjective', 'আনন্দিত', 'We were delighted by the good news.', 6, ['thrilled', 'overjoyed'], ['feeling']],
  ['l6-11', 'nervous', '/ˈnɜː.vəs/', 'adjective', 'নার্ভাস, উত্তেজিত', 'I get nervous before exams.', 6, ['tense', 'uneasy'], ['feeling']],
  ['l6-12', 'curious', '/ˈkjʊə.ri.əs/', 'adjective', 'কৌতূহলী', 'Children are curious about everything.', 6, ['inquisitive'], ['character']],

  // Level 7 — B2 Society & Media
  ['l7-01', 'society', '/səˈsaɪ.ə.ti/', 'noun', 'সমাজ', 'Social media has changed society.', 7, ['community'], ['society']],
  ['l7-02', 'equality', '/iˈkwɒl.ə.ti/', 'noun', 'সমতা', 'Gender equality is still a struggle.', 7, ['fairness'], ['society']],
  ['l7-03', 'poverty', '/ˈpɒv.ə.ti/', 'noun', 'দারিদ্র্য', 'Education can reduce poverty.', 7, ['hardship'], ['society']],
  ['l7-04', 'government', '/ˈɡʌv.ən.mənt/', 'noun', 'সরকার', 'The government announced a new policy.', 7, ['administration'], ['society']],
  ['l7-05', 'policy', '/ˈpɒl.ə.si/', 'noun', 'নীতি', 'The new policy helps poor students.', 7, ['rule', 'strategy'], ['society']],
  ['l7-06', 'citizen', '/ˈsɪt.ɪ.zən/', 'noun', 'নাগরিক', 'Every citizen has a duty to vote.', 7, ['resident'], ['society']],
  ['l7-07', 'protest', '/ˈprəʊ.test/', 'noun', 'বিক্ষোভ', 'Workers held a peaceful protest.', 7, ['demonstration'], ['society']],
  ['l7-08', 'unemployment', '/ˌʌn.ɪmˈplɔɪ.mənt/', 'noun', 'বেকারত্ব', 'Unemployment rises every winter.', 7, ['joblessness'], ['society']],
  ['l7-09', 'corruption', '/kəˈrʌp.ʃən/', 'noun', 'দুর্নীতি', 'Corruption slows national growth.', 7, ['dishonesty'], ['society']],
  ['l7-10', 'media', '/ˈmiː.di.ə/', 'noun', 'গণমাধ্যম', 'The media covered the flood widely.', 7, ['press'], ['society']],
  ['l7-11', 'awareness', '/əˈweə.nəs/', 'noun', 'সচেতনতা', 'The campaign raised health awareness.', 7, ['consciousness'], ['society']],
  ['l7-12', 'responsibility', '/rɪˌspɒn.səˈbɪl.ə.ti/', 'noun', 'দায়িত্ব', 'Protecting rivers is our responsibility.', 7, ['duty', 'obligation'], ['society']],

  // Level 8 — B2 Science & Technology
  ['l8-01', 'technology', '/tekˈnɒl.ə.dʒi/', 'noun', 'প্রযুক্তি', 'Technology changed the way we learn.', 8, [], ['science']],
  ['l8-02', 'research', '/rɪˈsɜːtʃ/', 'noun', 'গবেষণা', 'Her research focuses on clean energy.', 8, ['investigation', 'study'], ['science']],
  ['l8-03', 'data', '/ˈdeɪ.tə/', 'noun', 'উপাত্ত', 'The data shows a clear trend.', 8, ['figures', 'statistics'], ['science']],
  ['l8-04', 'experiment', '/ɪkˈsper.ɪ.mənt/', 'noun', 'পরীক্ষা-নিরীক্ষা', 'The experiment failed twice before it worked.', 8, ['trial'], ['science']],
  ['l8-05', 'environment', '/ɪnˈvaɪ.rən.mənt/', 'noun', 'পরিবেশ', 'Plastic harms the environment.', 8, ['surroundings'], ['science']],
  ['l8-06', 'climate', '/ˈklaɪ.mət/', 'noun', 'জলবায়ু', 'Climate change affects our harvest.', 8, ['weather patterns'], ['science']],
  ['l8-07', 'pollution', '/pəˈluː.ʃən/', 'noun', 'দূষণ', 'Air pollution is rising in Dhaka.', 8, ['contamination'], ['science']],
  ['l8-08', 'invention', '/ɪnˈven.ʃən/', 'noun', 'আবিষ্কার', 'The telephone was a great invention.', 8, ['creation'], ['science']],
  ['l8-09', 'digital', '/ˈdɪdʒ.ɪ.təl/', 'adjective', 'ডিজিটাল', 'Digital payments save a lot of time.', 8, ['electronic'], ['science']],
  ['l8-10', 'artificial', '/ˌɑː.tɪˈfɪʃ.əl/', 'adjective', 'কৃত্রিম', 'Artificial intelligence now writes drafts.', 8, ['synthetic'], ['science']],
  ['l8-11', 'renewable', '/rɪˈnjuː.ə.bəl/', 'adjective', 'নবায়নযোগ্য', 'Solar power is renewable and clean.', 8, ['sustainable'], ['science']],
  ['l8-12', 'efficient', '/ɪˈfɪʃ.ənt/', 'adjective', 'কার্যকর, দক্ষ', 'This engine is far more efficient.', 8, ['effective', 'productive'], ['science']],

  // Level 9 — C1 Precision & Argument
  ['l9-01', 'ambiguous', '/æmˈbɪɡ.ju.əs/', 'adjective', 'অস্পষ্ট, দ্ব্যর্থক', 'The contract is ambiguous on this point.', 9, ['vague', 'unclear'], ['argument']],
  ['l9-02', 'inevitable', '/ɪnˈev.ɪ.tə.bəl/', 'adjective', 'অনিবার্য', 'Change is inevitable in any growing city.', 9, ['unavoidable'], ['argument']],
  ['l9-03', 'comprehensive', '/ˌkɒm.prɪˈhen.sɪv/', 'adjective', 'ব্যাপক, পূর্ণাঙ্গ', 'The report gives a comprehensive overview.', 9, ['thorough', 'complete'], ['argument']],
  ['l9-04', 'controversial', '/ˌkɒn.trəˈvɜː.ʃəl/', 'adjective', 'বিতর্কিত', 'The decision remains deeply controversial.', 9, ['disputed', 'contentious'], ['argument']],
  ['l9-05', 'subtle', '/ˈsʌt.əl/', 'adjective', 'সূক্ষ্ম', 'There is a subtle difference in meaning.', 9, ['delicate'], ['argument']],
  ['l9-06', 'advocate', '/ˈæd.və.keɪt/', 'verb', 'সমর্থন করা', 'Experts advocate early language learning.', 9, ['support', 'endorse'], ['argument']],
  ['l9-07', 'undermine', '/ˌʌn.dəˈmaɪn/', 'verb', 'দুর্বল করা', 'Rumours undermine public trust.', 9, ['weaken', 'erode'], ['argument']],
  ['l9-08', 'emphasise', '/ˈem.fə.saɪz/', 'verb', 'গুরুত্ব দেওয়া', 'Teachers emphasise daily practice.', 9, ['stress', 'highlight'], ['argument']],
  ['l9-09', 'hypothesis', '/haɪˈpɒθ.ə.sɪs/', 'noun', 'অনুমান, প্রস্তাবনা', 'The hypothesis still needs more evidence.', 9, ['theory', 'premise'], ['argument']],
  ['l9-10', 'paradox', '/ˈpær.ə.dɒks/', 'noun', 'স্ববিরোধী বিষয়', 'It is a paradox that busy people find more time.', 9, ['contradiction'], ['argument']],
  ['l9-11', 'prevalent', '/ˈprev.əl.ənt/', 'adjective', 'প্রচলিত, ব্যাপক', 'Misinformation is prevalent online.', 9, ['widespread'], ['argument']],
  ['l9-12', 'reluctant', '/rɪˈlʌk.tənt/', 'adjective', 'অনিচ্ছুক', 'He was reluctant to speak in public.', 9, ['hesitant', 'unwilling'], ['argument']],

  // Level 10 — C2 Mastery & Style
  ['l10-01', 'ubiquitous', '/juːˈbɪk.wɪ.təs/', 'adjective', 'সর্বব্যাপী', 'Smartphones are ubiquitous in Dhaka now.', 10, ['omnipresent'], ['style']],
  ['l10-02', 'ephemeral', '/ɪˈfem.ər.əl/', 'adjective', 'ক্ষণস্থায়ী', 'Fame on social media is often ephemeral.', 10, ['fleeting', 'transient'], ['style']],
  ['l10-03', 'meticulous', '/məˈtɪk.jə.ləs/', 'adjective', 'অতিযত্নশীল', 'She is meticulous about her grammar.', 10, ['thorough', 'precise'], ['style']],
  ['l10-04', 'eloquent', '/ˈel.ə.kwənt/', 'adjective', 'বাগ্মী', 'Her eloquent speech moved the audience.', 10, ['articulate'], ['style']],
  ['l10-05', 'pragmatic', '/præɡˈmæt.ɪk/', 'adjective', 'বাস্তববাদী', 'We need a pragmatic solution, not slogans.', 10, ['practical'], ['style']],
  ['l10-06', 'quintessential', '/ˌkwɪn.tɪˈsen.ʃəl/', 'adjective', 'আদর্শ উদাহরণ', 'This café is the quintessential Dhaka hangout.', 10, ['typical', 'classic'], ['style']],
  ['l10-07', 'juxtapose', '/ˌdʒʌk.stəˈpəʊz/', 'verb', 'পাশাপাশি রাখা', 'The essay juxtaposes wealth and poverty.', 10, ['contrast'], ['style']],
  ['l10-08', 'nuance', '/ˈnjuː.ɑːns/', 'noun', 'সূক্ষ্ম পার্থক্য', 'Translation must respect nuance.', 10, ['subtlety'], ['style']],
  ['l10-09', 'resilience', '/rɪˈzɪl.i.əns/', 'noun', 'ঘুরে দাঁড়ানোর ক্ষমতা', 'The resilience of flood victims is remarkable.', 10, ['toughness'], ['style']],
  ['l10-10', 'candid', '/ˈkæn.dɪd/', 'adjective', 'অকপট', 'He gave a candid answer about his failures.', 10, ['frank'], ['style']],
  ['l10-11', 'obsolete', '/ˈɒb.səl.iːt/', 'adjective', 'অচল, বাতিল', 'That grammar rule is nearly obsolete.', 10, ['outdated'], ['style']],
  ['l10-12', 'serendipity', '/ˌser.ənˈdɪp.ə.ti/', 'noun', 'কাকতালীয় আনন্দময় আবিষ্কার', 'Meeting my mentor was pure serendipity.', 10, ['luck', 'chance'], ['style']],
];

export const VOCABULARY: Word[] = ROWS.map((row) => ({
  id: row[0],
  word: row[1],
  ipa: row[2],
  pos: row[3],
  bn: row[4],
  example: row[5],
  level: row[6],
  cefr: LEVEL_CEFR[row[6]] ?? 'B1',
  synonyms: row[7] ?? [],
  tags: row[8] ?? [],
}));

export const WORD_INDEX: Map<string, Word> = new Map(VOCABULARY.map((word) => [word.id, word]));
export const WORD_BY_TEXT: Map<string, Word> = new Map(
  VOCABULARY.map((word) => [word.word.toLowerCase(), word]),
);

export function wordsByLevel(level: number): Word[] {
  return VOCABULARY.filter((word) => word.level === level);
}

export function getWord(id: string): Word | undefined {
  return WORD_INDEX.get(id);
}

export function findWordByText(text: string): Word | undefined {
  const clean = text.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return undefined;
  const direct = WORD_BY_TEXT.get(clean);
  if (direct) return direct;
  // Naive de-inflection so "argued" still finds "argue".
  for (const suffix of ['ed', 'ing', 'es', 's']) {
    if (clean.endsWith(suffix) && clean.length - suffix.length >= 4) {
      const stem = clean.slice(0, clean.length - suffix.length);
      const found = WORD_BY_TEXT.get(stem) ?? WORD_BY_TEXT.get(`${stem}e`);
      if (found) return found;
    }
  }
  return undefined;
}

export function searchWords(query: string, limit = 24): Word[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const scored = VOCABULARY.map((word) => {
    const haystack = `${word.word} ${word.bn} ${word.synonyms.join(' ')} ${word.tags.join(' ')}`.toLowerCase();
    const inWord = word.word.toLowerCase().startsWith(needle) ? 0 : word.word.toLowerCase().includes(needle) ? 1 : 2;
    return { word, rank: haystack.includes(needle) ? inWord : 99 };
  }).filter((entry) => entry.rank < 99);
  scored.sort((a, b) => a.rank - b.rank || a.word.level - b.word.level);
  return scored.slice(0, limit).map((entry) => entry.word);
}

export function totalWords(): number {
  return VOCABULARY.length;
}
