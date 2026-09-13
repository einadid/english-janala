/**
 * Bilingual UI strings. Bangla is the default because the learners are Bangla
 * speakers; every label has an English twin so the interface can flip instantly.
 */

import type { UiLang } from './types';

interface Entry {
  en: string;
  bn: string;
}

export const DICT: Record<string, Entry> = {
  'app.tagline': { en: 'The adaptive English studio for Bangla speakers', bn: 'বাংলাভাষীদের জন্য অ্যাডাপটিভ ইংরেজি স্টুডিও' },
  'nav.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'nav.learn': { en: 'Learn', bn: 'শিখুন' },
  'nav.review': { en: 'Review', bn: 'রিভিউ' },
  'nav.reading': { en: 'Reading', bn: 'রিডিং' },
  'nav.listening': { en: 'Listening', bn: 'লিসেনিং' },
  'nav.speaking': { en: 'Speaking', bn: 'স্পিকিং' },
  'nav.grammar': { en: 'Grammar', bn: 'গ্রামার' },
  'nav.writing': { en: 'Writing', bn: 'রাইটিং' },
  'nav.tutor': { en: 'Tutor', bn: 'টিউটর' },
  'nav.insights': { en: 'Insights', bn: 'অগ্রগতি' },
  'nav.settings': { en: 'Settings', bn: 'সেটিংস' },
  'nav.menu': { en: 'Menu', bn: 'মেনু' },

  'common.level': { en: 'Level', bn: 'লেভেল' },
  'common.start': { en: 'Start', bn: 'শুরু করুন' },
  'common.continue': { en: 'Continue', bn: 'চালিয়ে যান' },
  'common.next': { en: 'Next', bn: 'পরবর্তী' },
  'common.back': { en: 'Back', bn: 'পেছনে' },
  'common.finish': { en: 'Finish', bn: 'শেষ করুন' },
  'common.retry': { en: 'Try again', bn: 'আবার চেষ্টা করুন' },
  'common.correct': { en: 'Correct', bn: 'সঠিক' },
  'common.wrong': { en: 'Not quite', bn: 'ভুল হয়েছে' },
  'common.meaning': { en: 'Meaning', bn: 'অর্থ' },
  'common.example': { en: 'Example', bn: 'উদাহরণ' },
  'common.synonyms': { en: 'Synonyms', bn: 'সমার্থক শব্দ' },
  'common.listen': { en: 'Listen', bn: 'শুনুন' },
  'common.speak': { en: 'Speak', bn: 'বলুন' },
  'common.save': { en: 'Save', bn: 'সেভ করুন' },
  'common.saved': { en: 'Saved', bn: 'সেভ হয়েছে' },
  'common.score': { en: 'Score', bn: 'স্কোর' },
  'common.accuracy': { en: 'Accuracy', bn: 'নির্ভুলতা' },
  'common.words': { en: 'words', bn: 'শব্দ' },
  'common.of': { en: 'of', bn: 'এর' },
  'common.due': { en: 'due', bn: 'বাকি' },
  'common.empty': { en: 'Nothing here yet', bn: 'এখনো কিছু নেই' },
  'common.check': { en: 'Check', bn: 'যাচাই করুন' },
  'common.show': { en: 'Show answer', bn: 'উত্তর দেখুন' },
  'common.why': { en: 'Why', bn: 'কেন' },
  'common.tip': { en: 'Tip', bn: 'টিপস' },
  'common.optional': { en: 'optional', bn: 'ঐচ্ছিক' },
  'common.new': { en: 'New', bn: 'নতুন' },
  'common.mastered': { en: 'Mastered', bn: 'আয়ত্ত' },

  'dash.greeting': { en: 'Welcome back', bn: 'আবার স্বাগতম' },
  'dash.newHere': { en: 'Welcome to English Janala', bn: 'English জানালায় স্বাগতম' },
  'dash.today': { en: "Today's plan", bn: 'আজকের পরিকল্পনা' },
  'dash.dueCards': { en: 'cards due', bn: 'টি কার্ড রিভিউয়ের অপেক্ষায়' },
  'dash.streak': { en: 'day streak', bn: 'দিনের ধারা' },
  'dash.totalXp': { en: 'total XP', bn: 'মোট এক্সপি' },
  'dash.retention': { en: 'memory strength', bn: 'স্মৃতির শক্তি' },
  'dash.skills': { en: 'Skill radar', bn: 'স্কিল রাডার' },
  'dash.wordOfDay': { en: 'Word of the day', bn: 'আজকের শব্দ' },
  'dash.continueLesson': { en: 'Continue your level', bn: 'আপনার লেভেল চালিয়ে যান' },
  'dash.quick': { en: 'Practice a skill', bn: 'একটি স্কিল অনুশীলন করুন' },

  'onb.title': { en: 'Set up your studio', bn: 'আপনার স্টুডিও সাজান' },
  'onb.sub': { en: 'Thirty seconds now, a personalised path afterwards.', bn: 'এখন ত্রিশ সেকেন্ড, এরপর আপনার নিজস্ব পথ।' },
  'onb.name': { en: 'Your name', bn: 'আপনার নাম' },
  'onb.goal': { en: 'Main goal', bn: 'প্রধান লক্ষ্য' },
  'onb.goal.speak': { en: 'Speak with confidence', bn: 'আত্মবিশ্বাসে কথা বলা' },
  'onb.goal.exam': { en: 'Pass an exam (IELTS / admission)', bn: 'পরীক্ষায় ভালো করা (আইএলটিএস / ভর্তি)' },
  'onb.goal.job': { en: 'Job and interview English', bn: 'চাকরি ও ইন্টারভিউ ইংরেজি' },
  'onb.goal.school': { en: 'School / college syllabus', bn: 'স্কুল / কলেজ সিলেবাস' },
  'onb.lang': { en: 'Interface language', bn: 'ইন্টারফেসের ভাষা' },
  'onb.placement': { en: 'Take the 12-question placement test', bn: '১২ প্রশ্নের প্লেসমেন্ট টেস্ট দিন' },
  'onb.skip': { en: 'Skip for now', bn: 'আপাতত বাদ দিন' },
  'onb.begin': { en: 'Begin learning', bn: 'শেখা শুরু করুন' },
  'onb.result': { en: 'Your estimated level', bn: 'আপনার আনুমানিক লেভেল' },
  'onb.question': { en: 'Question', bn: 'প্রশ্ন' },

  'learn.pick': { en: 'Choose a level', bn: 'একটি লেভেল বেছে নিন' },
  'learn.progress': { en: 'Mastered', bn: 'আয়ত্ত' },
  'learn.openAll': { en: 'Add all to review deck', bn: 'সব রিভিউ ডেকে যোগ করুন' },
  'learn.known': { en: 'I know this', bn: 'এটা আমি জানি' },
  'learn.deck': { en: 'Review deck', bn: 'রিভিউ ডেক' },
  'learn.search': { en: 'Search the whole vocabulary bank', bn: 'সম্পূর্ণ শব্দভাণ্ডারে খুঁজুন' },

  'rev.title': { en: 'Spaced repetition review', bn: 'স্পেসড রিপিটিশন রিভিউ' },
  'rev.sub': { en: 'Cards return exactly when your memory is about to forget them.', bn: 'কার্ডগুলো ফিরে আসে ঠিক যখন আপনার মন ভুলতে বসে।' },
  'rev.queue': { en: 'in the queue', bn: 'টি সারিতে' },
  'rev.empty': { en: 'Nothing due. Your memory is holding.', bn: 'কিছু বাকি নেই। আপনার স্মৃতি ঠিক আছে।' },
  'rev.howGood': { en: 'How well did you recall it?', bn: 'কতটা মনে পড়ল?' },
  'rev.nextIn': { en: 'next in', bn: 'পরবর্তী দেখা' },
  'rev.mode.recall': { en: 'English → Bangla', bn: 'ইংরেজি → বাংলা' },
  'rev.mode.produce': { en: 'Bangla → English', bn: 'বাংলা → ইংরেজি' },
  'rev.mode.listen': { en: 'Listen & type', bn: 'শুনে লিখুন' },
  'rev.mode.choice': { en: 'Pick the meaning', bn: 'অর্থ বেছে নিন' },

  'read.clickHint': { en: 'Tap any word in the text to look it up', bn: 'অর্থ দেখতে লেখার যেকোনো শব্দে ট্যাপ করুন' },
  'read.questions': { en: 'Comprehension check', bn: 'বোঝার পরীক্ষা' },
  'read.lookup': { en: 'Words you looked up', bn: 'আপনি যেসব শব্দ দেখেছেন' },

  'lis.instruction': { en: 'Play the sentence, then type exactly what you hear.', bn: 'বাক্যটি শুনুন, তারপর হুবহু টাইপ করুন।' },
  'lis.speed': { en: 'Speed', bn: 'গতি' },
  'lis.play': { en: 'Play', bn: 'প্লে' },
  'lis.reveal': { en: 'Reveal text', bn: 'লেখা দেখুন' },

  'spk.instruction': { en: 'Say the sentence aloud. Your browser listens and compares.', bn: 'বাক্যটি জোরে বলুন। ব্রাউজার শুনে তুলনা করবে।' },
  'spk.unsupported': { en: 'Speech recognition is not available in this browser. Try Chrome or Edge.', bn: 'এই ব্রাউজারে স্পিচ রিকগনিশন নেই। Chrome বা Edge ব্যবহার করুন।' },
  'spk.start': { en: 'Start listening', bn: 'শোনা শুরু' },
  'spk.stop': { en: 'Stop', bn: 'থামান' },
  'spk.heard': { en: 'We heard', bn: 'আমরা শুনেছি' },
  'spk.allow': { en: 'Allow microphone access when the browser asks.', bn: 'ব্রাউজার চাইলে মাইক্রোফোন অনুমতি দিন।' },

  'gram.rules': { en: 'Rule cards', bn: 'নিয়ম কার্ড' },
  'gram.drills': { en: 'Drills', bn: 'ড্রিল' },

  'wrt.prompt': { en: 'Writing prompt', bn: 'লেখার বিষয়' },
  'wrt.metrics': { en: 'Live feedback', bn: 'তাৎক্ষণিক ফিডব্যাক' },
  'wrt.drafts': { en: 'Your drafts', bn: 'আপনার খসড়া' },
  'wrt.placeholder': { en: 'Write at least 60 words…', bn: 'কমপক্ষে ৬০ শব্দ লিখুন…' },

  'tut.hello': {
    en: 'Ask me anything: “explain present perfect”, “correct: I am agree with you”, “quiz prepositions”, “meaning diligent”, “phrasebook interview”.',
    bn: 'যা খুশি জিজ্ঞেস করুন: “explain present perfect”, “correct: I am agree with you”, “quiz prepositions”, “meaning diligent”, “phrasebook interview”।',
  },
  'tut.offline': { en: 'Offline tutor', bn: 'অফলাইন টিউটর' },
  'tut.offlineNote': {
    en: 'Runs fully in your browser from a curated knowledge base. Connect an LLM key in Settings to upgrade answers.',
    bn: 'সম্পূর্ণ ব্রাউজারে চলে, সাজানো নলেজ বেস থেকে। Settings-এ LLM key দিলে উত্তর আরও সমৃদ্ধ হবে।',
  },

  'ins.retention': { en: 'Retention forecast', bn: 'স্মৃতির পূর্বাভাস' },
  'ins.xpChart': { en: 'XP over the last 14 days', bn: 'গত ১৪ দিনের এক্সপি' },
  'ins.accuracy': { en: 'Accuracy by skill', bn: 'স্কিল অনুযায়ী নির্ভুলতা' },
  'ins.mastery': { en: 'Memory states', bn: 'স্মৃতির অবস্থা' },
  'ins.export': { en: 'Export progress', bn: 'অগ্রগতি এক্সপোর্ট' },
  'ins.import': { en: 'Import progress', bn: 'অগ্রগতি ইমপোর্ট' },
  'ins.sessions': { en: 'Recent sessions', bn: 'সাম্প্রতিক সেশন' },

  'set.appearance': { en: 'Appearance', bn: 'চেহারা' },
  'set.voice': { en: 'Voice & accent', bn: 'কণ্ঠ ও অ্যাকসেন্ট' },
  'set.accessibility': { en: 'Accessibility', bn: 'অ্যাক্সেসিবিলিটি' },
  'set.data': { en: 'Data', bn: 'ডেটা' },
  'set.danger': { en: 'Reset all progress', bn: 'সব অগ্রগতি মুছে ফেলুন' },
  'set.dangerNote': { en: 'This clears every card, draft and badge from this device.', bn: 'এতে এই ডিভাইসের সব কার্ড, খসড়া ও ব্যাজ মুছে যাবে।' },
  'set.confirmReset': { en: 'Reset everything? This cannot be undone.', bn: 'সব মুছে ফেলবেন? এটা ফেরানো যাবে না।' },
  'set.voiceNone': { en: 'No English voice found in this browser', bn: 'এই ব্রাউজারে ইংরেজি ভয়েস পাওয়া যায়নি' },

  'cmd.placeholder': { en: 'Search lessons, words, skills…', bn: 'লেসন, শব্দ, স্কিল খুঁজুন…' },
  'cmd.hint': { en: 'Press Ctrl/⌘ + K', bn: 'Ctrl/⌘ + K চাপুন' },
  'cmd.empty': { en: 'No matches', bn: 'কিছু পাওয়া যায়নি' },

  'badge.earned': { en: 'Badge unlocked', bn: 'ব্যাজ আনলক হয়েছে' },
  'streak.kept': { en: 'Streak kept alive', bn: 'ধারা ধরে রেখেছেন' },
  'toast.saved': { en: 'Added to your review deck', bn: 'রিভিউ ডেকে যোগ হয়েছে' },
  'toast.deckFull': { en: 'The whole level is now in your deck', bn: 'পুরো লেভেল ডেকে যোগ হয়েছে' },
  'toast.copied': { en: 'Progress copied to your clipboard', bn: 'অগ্রগতি ক্লিপবোর্ডে কপি হয়েছে' },
  'footer.made': { en: 'Built for learners who think in Bangla and dream in English.', bn: 'যারা বাংলায় ভাবে আর ইংরেজিতে স্বপ্ন দেখে, তাদের জন্য।' },
};

let currentLang: UiLang = 'bn';
const missing = new Set<string>();

export function setLang(lang: UiLang): void {
  currentLang = lang;
}

export function getLang(): UiLang {
  return currentLang;
}

/** Translate a key, interpolating {placeholders}. Falls back to the key. */
export function t(key: string, vars?: Record<string, string | number>): string {
  const entry = DICT[key];
  if (!entry) {
    missing.add(key);
    return key;
  }
  let text = entry[currentLang] ?? entry.en;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** Translate with an explicit language, regardless of the active UI language. */
export function tIn(lang: UiLang, key: string): string {
  const entry = DICT[key];
  return entry ? entry[lang] : key;
}

export function knownKeys(): string[] {
  return Object.keys(DICT);
}

export function missingKeys(): string[] {
  return [...missing];
}
