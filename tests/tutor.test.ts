import { describe, expect, it } from 'vitest';
import { analyseSentence, ask } from '@/core/tutor';
import type { TutorContext } from '@/core/tutor';

const CTX: TutorContext = { name: 'Rina', cefr: 'B1', dueCount: 7, streak: 4 };

describe('error patterns', () => {
  it('catches the classic Bangla transfer errors', () => {
    expect(analyseSentence('I am agree with you.')).toHaveLength(1);
    expect(analyseSentence('We discussed about the plan.')).toHaveLength(1);
    expect(analyseSentence('She is married with a doctor.')).toHaveLength(1);
    expect(analyseSentence('He gave me many informations.')).toHaveLength(1);
    expect(analyseSentence('I did not went to school.')).toHaveLength(1);
    expect(analyseSentence('You must to finish it.')).toHaveLength(1);
    expect(analyseSentence('I have twenty years old.')).toHaveLength(1);
    expect(analyseSentence('This is more better than that.')).toHaveLength(1);
  });

  it('leaves correct sentences alone', () => {
    expect(analyseSentence('I agree with you completely.')).toHaveLength(0);
    expect(analyseSentence('She has lived here since 2019.')).toHaveLength(0);
  });

  it('detects "since" used with a duration', () => {
    expect(analyseSentence('I have studied here since three years.')).toHaveLength(1);
  });
});

describe('tutor commands', () => {
  it('answers a correction request with a fixed sentence and a reason', () => {
    const reply = ask('correct: I am agree with you', CTX);
    expect(reply.kind).toBe('correct');
    const good = reply.blocks.find((block) => block.type === 'good');
    expect(good && good.type === 'good' ? good.text : '').toContain('I agree with you.');
    const paras = reply.blocks.filter((block) => block.type === 'para');
    expect(paras.length).toBeGreaterThanOrEqual(2);
  });

  it('explains a grammar topic', () => {
    const reply = ask('explain present perfect', CTX);
    expect(reply.kind).toBe('explain');
    expect(reply.id).toBe('art-present-perfect');
    expect(reply.blocks.some((block) => block.type === 'bad')).toBe(true);
    expect(reply.blocks.some((block) => block.type === 'good')).toBe(true);
  });

  it('defines a word from the bundled bank', () => {
    const reply = ask('meaning resilience', CTX);
    expect(reply.kind).toBe('word');
    const word = reply.blocks.find((block) => block.type === 'word');
    expect(word && word.type === 'word' ? word.word.word : '').toBe('resilience');
  });

  it('quizzes on demand', () => {
    const reply = ask('quiz articles', CTX);
    expect(reply.kind).toBe('quiz');
    const quiz = reply.blocks.find((block) => block.type === 'quiz');
    expect(quiz && quiz.type === 'quiz' ? quiz.drill.topic : '').toBe('Articles');
  });

  it('opens a phrasebook for a situation', () => {
    const reply = ask('phrasebook interview', CTX);
    expect(reply.kind).toBe('phrasebook');
    const list = reply.blocks.find((block) => block.type === 'list');
    expect(list && list.type === 'list' ? list.items.length : 0).toBeGreaterThan(2);
  });

  it('offers an idiom', () => {
    expect(ask('idiom', CTX).kind).toBe('idiom');
  });

  it('builds a personal plan from the learner context', () => {
    const reply = ask('plan', CTX);
    expect(reply.kind).toBe('plan');
    const list = reply.blocks.find((block) => block.type === 'list');
    const items = list && list.type === 'list' ? list.items : [];
    expect(items.some((item) => item.en.includes('7 cards'))).toBe(true);
    expect(items.some((item) => item.en.includes('4-day streak'))).toBe(true);
  });

  it('treats a bare faulty sentence as a correction request', () => {
    const reply = ask('She is married with a doctor', CTX);
    expect(reply.kind).toBe('correct');
  });

  it('falls back to help instead of failing', () => {
    const reply = ask('quantum chromodynamics', CTX);
    expect(['help']).toContain(reply.kind);
    expect(reply.blocks.length).toBeGreaterThan(0);
  });

  it('answers an empty prompt with the help card', () => {
    expect(ask('   ', CTX).kind).toBe('help');
  });
});
