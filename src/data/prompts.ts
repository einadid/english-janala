import type { CefrLevel } from '@/core/types';

export interface WritingPrompt {
  id: string;
  title: string;
  titleBn: string;
  cefr: CefrLevel;
  prompt: string;
  promptBn: string;
  starters: string[];
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'wp-01',
    title: 'My daily routine',
    titleBn: 'আমার দৈনন্দিন রুটিন',
    cefr: 'A2',
    prompt: 'Describe a normal weekday from the moment you wake up to the moment you sleep. Mention one thing you would like to change.',
    promptBn: 'ঘুম থেকে ওঠা থেকে ঘুমানো পর্যন্ত একটি সাধারণ কর্মদিবসের বর্ণনা দিন। শেষে বলুন কোন একটি জিনিস আপনি বদলাতে চান।',
    starters: ['First of all,', 'After that,', 'However,', 'In the end,'],
  },
  {
    id: 'wp-02',
    title: 'A person who influenced me',
    titleBn: 'যে মানুষটি আমাকে প্রভাবিত করেছে',
    cefr: 'B1',
    prompt: 'Write about a person who changed the way you think or work. Explain what they did and why it mattered.',
    promptBn: 'যিনি আপনার চিন্তা বা কাজের ধরন বদলে দিয়েছেন তাঁর সম্পর্কে লিখুন। তিনি কী করেছিলেন এবং কেন সেটি গুরুত্বপূর্ণ ছিল তা ব্যাখ্যা করুন।',
    starters: ['The person I want to describe is', 'What made her different was', 'Because of this,', 'Looking back,'],
  },
  {
    id: 'wp-03',
    title: 'Online classes: better or worse?',
    titleBn: 'অনলাইন ক্লাস: ভালো না খারাপ?',
    cefr: 'B1',
    prompt: 'Some students prefer online classes, others prefer the classroom. Discuss both sides and give your own opinion with a reason.',
    promptBn: 'কেউ অনলাইন ক্লাস পছন্দ করেন, কেউ ক্লাসরুম। দুই পক্ষই আলোচনা করুন এবং কারণসহ নিজের মতামত দিন।',
    starters: ['On the one hand,', 'On the other hand,', 'In my opinion,', 'For example,'],
  },
  {
    id: 'wp-04',
    title: 'Traffic in my city',
    titleBn: 'আমার শহরের যানজট',
    cefr: 'B2',
    prompt: 'Explain one cause of traffic congestion in your city, one effect on daily life, and one realistic solution. Support your solution with a reason.',
    promptBn: 'আপনার শহরের যানজটের একটি কারণ, দৈনন্দিন জীবনে তার একটি প্রভাব এবং একটি বাস্তবসম্মত সমাধান লিখুন। সমাধানের পক্ষে কারণ দিন।',
    starters: ['One major cause is', 'As a result,', 'A realistic solution would be', 'This would work because'],
  },
  {
    id: 'wp-05',
    title: 'Should AI write our essays?',
    titleBn: 'আমাদের রচনা কি এআই লিখবে?',
    cefr: 'C1',
    prompt: 'Artificial intelligence can now produce a competent essay in seconds. Argue whether schools should allow or ban it, and consider what happens to learning in each case.',
    promptBn: 'এখন এআই কয়েক সেকেন্ডে মানসম্মত রচনা লিখতে পারে। স্কুলের এটি অনুমতি দেওয়া উচিত নাকি নিষিদ্ধ করা — যুক্তি দিন, এবং দুই ক্ষেত্রে শেখার কী হয় তা বিবেচনা করুন।',
    starters: ['It is tempting to argue that', 'Nevertheless,', 'The deeper question is', 'A more pragmatic position might be'],
  },
];

export function getPrompt(id: string): WritingPrompt | undefined {
  return WRITING_PROMPTS.find((prompt) => prompt.id === id);
}
