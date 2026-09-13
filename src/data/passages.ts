import type { Passage } from '@/core/types';

/**
 * Reading passages with a comprehension check. Words in the passage that also
 * exist in the vocabulary bank are clickable — the reader view wires that up.
 */

export const PASSAGES: Passage[] = [
  {
    id: 'read-01',
    title: 'Rina Finds Her Voice',
    titleBn: 'রিনার কণ্ঠস্বর খুঁজে পাওয়া',
    cefr: 'A2',
    minutes: 2,
    body: [
      'Rina works in a small garments office in Gazipur. Every morning she answers phone calls from foreign buyers, and every morning her heart beats fast. She knows the words, but her mouth feels heavy.',
      'One Friday her manager said, "Rina, tomorrow you will speak in the meeting." She wanted to say no. Instead she went home, opened her notebook, and wrote five sentences about the order. She read them aloud, slowly, in front of a mirror. She read them ten times.',
      'The next day the room was crowded and quiet. Rina stood up. Her voice was small at first, but she finished all five sentences. Nobody laughed. The manager simply said, "Thank you, Rina."',
      'She still feels nervous before every meeting. But now she knows a secret: courage is not the absence of fear. Courage is preparation plus one deep breath.',
    ],
    gloss: [
      'my mouth feels heavy — আমার মুখ দিয়ে কথা বেরোতে চায় না',
      'read them aloud — জোরে জোরে পড়া',
      'the absence of fear — ভয়ের অনুপস্থিতি',
    ],
    questions: [
      {
        q: 'Why does Rina’s heart beat fast every morning?',
        options: [
          'Because the office is too hot',
          'Because she must answer calls from foreign buyers',
          'Because she runs to work',
          'Because she is ill',
        ],
        answer: 1,
        why: 'The first paragraph links the phone calls from foreign buyers with her fear.',
      },
      {
        q: 'What did Rina do on Friday night?',
        options: [
          'She asked for a holiday',
          'She called the buyer',
          'She wrote five sentences and practised aloud',
          'She slept early',
        ],
        answer: 2,
        why: 'She wrote five sentences about the order and read them aloud ten times.',
      },
      {
        q: 'How did the manager react after her speech?',
        options: ['He laughed', 'He said nothing', 'He thanked her', 'He asked her to sit down'],
        answer: 2,
        why: 'The manager simply said, "Thank you, Rina."',
      },
      {
        q: 'What is the main message of the story?',
        options: [
          'Speak only when your manager asks',
          'Preparation turns fear into courage',
          'Mirrors help you learn words',
          'Meetings should be short',
        ],
        answer: 1,
        why: 'The closing line defines courage as preparation plus one deep breath.',
      },
    ],
  },
  {
    id: 'read-02',
    title: 'The Night Bus to Bandarban',
    titleBn: 'বান্দরবনের নাইট বাস',
    cefr: 'B1',
    minutes: 3,
    body: [
      'The coach left Dhaka at eleven at night, when the city finally agreed to be quiet. Outside the window the streetlights turned into a broken necklace, and inside, thirty strangers shared the same silence.',
      'I had planned the journey for two months. I had printed a map, saved the numbers of two local guides and argued with my brother about the budget. Yet the thing I remember most was not planned at all: a small boy in the seat behind me who kept asking his mother, "Are we nearly there?" every fifteen minutes, with absolute hope each time.',
      'By dawn the road had narrowed and the hills had arrived, folded one behind another like green cloth. The driver stopped at a tea stall where the steam rose straight up into cold air. We drank from small glasses and nobody spoke about work, politics or money. For twenty minutes we were simply travellers.',
      'Later, walking beside the Sangu river, I understood something about travel that no guidebook states clearly. We rarely travel to see a place. We travel to become, for a few days, a person who is not tired of their own routine.',
    ],
    gloss: [
      'a broken necklace — ভাঙা হারের মতো (এলোমেলো আলো)',
      'folded one behind another — একটার পেছনে একটা ভাঁজ করা',
      'tired of their own routine — নিজের রুটিনে ক্লান্ত',
    ],
    questions: [
      {
        q: 'What does the writer compare the streetlights to?',
        options: ['A river', 'A broken necklace', 'Green cloth', 'Steam'],
        answer: 1,
        why: 'The lights "turned into a broken necklace" as the bus moved.',
      },
      {
        q: 'What surprised the writer the most?',
        options: [
          'The printed map',
          'The argument about the budget',
          'A boy repeatedly asking if they had arrived',
          'The cold air at the tea stall',
        ],
        answer: 2,
        why: 'The writer says the memorable thing was not planned at all — the hopeful boy.',
      },
      {
        q: 'At the tea stall, the passengers…',
        options: [
          'discussed politics loudly',
          'worked on their laptops',
          'stayed quiet and drank tea',
          'argued with the driver',
        ],
        answer: 2,
        why: 'Nobody spoke about work, politics or money for twenty minutes.',
      },
      {
        q: 'According to the writer, why do people really travel?',
        options: [
          'To take photographs of hills',
          'To escape their family',
          'To become someone not worn out by routine',
          'To spend their savings',
        ],
        answer: 2,
        why: 'The final sentence states we travel to become a person not tired of their own routine.',
      },
    ],
  },
  {
    id: 'read-03',
    title: 'Why New Words Slip Away',
    titleBn: 'নতুন শব্দ কেন হারিয়ে যায়',
    cefr: 'B1',
    minutes: 3,
    body: [
      'In 1885 the German psychologist Hermann Ebbinghaus tested his own memory. He memorised lists of meaningless syllables, then recorded how much he still remembered as hours and days passed. The result was a curve that falls steeply at first and then slowly flattens.',
      'The curve explains a familiar pain. You meet a new word on Sunday. By Wednesday you can still recognise it. By the next Sunday the meaning has become fog. Nothing is wrong with your brain; forgetting is simply what brains do when they are not told otherwise.',
      'The good news is that the curve can be bent. If you meet the word again just before you are about to lose it, the memory becomes stronger and the next forgetting takes longer. Ten minutes on day one, then day three, then day seven, then day twenty — that pattern beats one long cramming session every time.',
      'This is the logic behind spaced repetition. The difficulty is not the method; the method is simple. The difficulty is showing up on the small days, when nothing dramatic happens and the only reward is that you still remember.',
    ],
    gloss: [
      'the meaning has become fog — অর্থ ঝাপসা হয়ে গেছে',
      'the curve can be bent — রেখাকে বাঁকানো যায়',
      'cramming session — একবারে গাদা করে মুখস্থ',
    ],
    questions: [
      {
        q: 'What did Ebbinghaus record?',
        options: [
          'How fast people read',
          'How much he remembered over time',
          'How many words a student knows',
          'How long a class should be',
        ],
        answer: 1,
        why: 'He recorded how much he still remembered as hours and days passed.',
      },
      {
        q: 'According to the passage, forgetting is…',
        options: [
          'a sign of a weak brain',
          'caused by difficult words',
          'normal behaviour of the brain',
          'only common in students',
        ],
        answer: 2,
        why: '"Nothing is wrong with your brain; forgetting is simply what brains do."',
      },
      {
        q: 'When is the best moment to review a word?',
        options: [
          'Immediately after learning it',
          'Just before you are about to forget it',
          'Only before an exam',
          'Once a year',
        ],
        answer: 1,
        why: 'Meeting the word again just before losing it strengthens the memory.',
      },
      {
        q: 'What does the writer say is the real difficulty?',
        options: [
          'Understanding the method',
          'Finding good word lists',
          'Practising on ordinary days',
          'Remembering meaningless syllables',
        ],
        answer: 2,
        why: 'The method is simple; the difficulty is showing up on small, undramatic days.',
      },
    ],
  },
  {
    id: 'read-04',
    title: 'The Air We Share',
    titleBn: 'যে বাতাস আমরা ভাগ করে নিই',
    cefr: 'B2',
    minutes: 4,
    body: [
      'Air pollution is the rarest kind of problem: it is invisible to the people who suffer from it most. A resident of north Dhaka cannot see the fine particles that enter her lungs, yet they are measured every day by monitoring stations that report numbers far beyond what the World Health Organization considers safe.',
      'The sources are well documented. Brick kilns on the city’s edge, diesel engines in traffic that barely moves, dust from construction sites that never seem to finish, and the burning of waste in open plots. Each source is individually rational. Together they are lethal.',
      'What makes the situation harder is inequality of exposure. Wealthier households can buy air purifiers, travel in sealed cars and live on higher floors. The people who breathe worst are the rickshaw pullers, street vendors and construction workers who spend twelve hours at street level, and who are least able to move away or take a day off.',
      'Solutions exist and none of them are mysterious: cleaner kilns, better public transport, water on construction sites, strict enforcement instead of seasonal campaigns. The missing ingredient is not technology. It is the political will to accept small inconveniences now in exchange for fewer hospital beds later.',
    ],
    gloss: [
      'inequality of exposure — কার কতটুকু ঝুঁকিতে আছে তার অসমতা',
      'individually rational — একেকটা আলাদাভাবে যুক্তিসঙ্গত',
      'seasonal campaigns — মৌসুমি প্রচারণা',
    ],
    questions: [
      {
        q: 'Why does the writer call air pollution "the rarest kind of problem"?',
        options: [
          'Because it happens rarely',
          'Because those most affected cannot see it',
          'Because scientists disagree about it',
          'Because it only affects big cities',
        ],
        answer: 1,
        why: 'It is invisible to the people who suffer from it most.',
      },
      {
        q: 'The phrase "Each source is individually rational" suggests that…',
        options: [
          'each polluter has a logical reason for what they do',
          'the sources are easy to count',
          'the government approves every source',
          'pollution is caused by rational people only',
        ],
        answer: 0,
        why: 'Every single activity makes sense to the person doing it, yet the sum is lethal.',
      },
      {
        q: 'Which group is described as most exposed?',
        options: [
          'Residents of high floors',
          'People who own air purifiers',
          'Street-level workers',
          'Health officials',
        ],
        answer: 2,
        why: 'Rickshaw pullers, vendors and construction workers spend twelve hours at street level.',
      },
      {
        q: 'What does the writer identify as the missing ingredient?',
        options: ['Money', 'Technology', 'Political will', 'International help'],
        answer: 2,
        why: 'The final sentence names political will, not technology, as what is missing.',
      },
    ],
  },
  {
    id: 'read-05',
    title: 'The Attention Economy',
    titleBn: 'মনোযোগের অর্থনীতি',
    cefr: 'C1',
    minutes: 4,
    body: [
      'For most of human history, information was scarce and attention was abundant. A village had one storyteller, one printed almanac, perhaps one letter a month. Today the relationship has inverted with almost no public debate: information is infinite and attention is the only genuinely scarce resource each of us owns.',
      'Markets respond to scarcity by pricing it. What is unusual about the attention economy is that the price is hidden. You do not pay for the feed; the feed is paid for with the minutes of your evening, which are then sold onward. Because the transaction is invisible, it feels free, and things that feel free are rarely defended.',
      'The design consequences follow predictably. When the goal is minutes rather than meaning, products optimise for interruption: autoplay, red badges, infinite scroll. None of these is malicious in isolation. Their cumulative effect, however, is a form of cognition that is constantly interrupted and therefore rarely deep. Research on task switching has repeatedly shown that returning to focused work after an interruption carries a measurable cost in both time and accuracy.',
      'The remedy is unfashionably boring. Attention is not defended by outrage but by friction: turning off notifications, leaving the phone in another room, reading one long article to the end. Such measures feel trivial precisely because they are small. But small habits, sustained, are the only currency strong enough to buy back a thought.',
    ],
    gloss: [
      'inverted with almost no public debate — প্রায় কোনো আলোচনা ছাড়াই উল্টে গেছে',
      'optimise for interruption — বাধা সৃষ্টির জন্য নকশা করা',
      'buy back a thought — একটি চিন্তাকে ফিরে কেনা',
    ],
    questions: [
      {
        q: 'How has the relationship between information and attention changed?',
        options: [
          'Both have become scarce',
          'Information is now infinite, attention is scarce',
          'Attention has become infinite',
          'Neither has changed',
        ],
        answer: 1,
        why: 'The first paragraph describes an inversion of the historical relationship.',
      },
      {
        q: 'Why does the writer say the price of the feed is "hidden"?',
        options: [
          'Because companies refuse to publish prices',
          'Because the user pays with time rather than money',
          'Because advertisements are illegal',
          'Because the technology is secret',
        ],
        answer: 1,
        why: 'The feed is paid for with minutes of your evening, sold onward invisibly.',
      },
      {
        q: 'According to research cited, what does task switching cost?',
        options: ['Money only', 'Time and accuracy', 'Sleep', 'Social relationships'],
        answer: 1,
        why: 'Returning to focused work after an interruption costs measurable time and accuracy.',
      },
      {
        q: 'The writer describes the remedy as "unfashionably boring" because it involves…',
        options: [
          'buying expensive software',
          'public campaigns',
          'small, unglamorous habits',
          'deleting every account',
        ],
        answer: 2,
        why: 'Friction and small sustained habits, not outrage, defend attention.',
      },
    ],
  },
];

export function getPassage(id: string): Passage | undefined {
  return PASSAGES.find((passage) => passage.id === id);
}
