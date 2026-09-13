/**
 * Browser speech I/O.
 *
 * Text-to-speech for models and listening drills, SpeechRecognition for the
 * speaking lab. Both are feature-detected; the UI degrades gracefully when a
 * browser (or the sandbox iframe) refuses them.
 */

export interface VoiceInfo {
  uri: string;
  name: string;
  lang: string;
}

type RecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function synth(): SpeechSynthesis | null {
  return typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
}

export function ttsAvailable(): boolean {
  return synth() !== null;
}

export function listVoices(accent: 'en-US' | 'en-GB'): VoiceInfo[] {
  const engine = synth();
  if (!engine) return [];
  return engine
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith('en'))
    .map((voice) => ({ uri: voice.voiceURI, name: voice.name, lang: voice.lang }))
    .sort((a, b) => {
      const aMatch = a.lang.toLowerCase().startsWith(accent.toLowerCase()) ? 0 : 1;
      const bMatch = b.lang.toLowerCase().startsWith(accent.toLowerCase()) ? 0 : 1;
      return aMatch - bMatch || a.name.localeCompare(b.name);
    });
}

export function waitForVoices(timeoutMs = 2500): Promise<VoiceInfo[]> {
  return new Promise((resolve) => {
    const engine = synth();
    if (!engine) {
      resolve([]);
      return;
    }
    let settled = false;
    const done = (): void => {
      if (settled) return;
      settled = true;
      resolve(listVoices('en-GB'));
    };
    engine.addEventListener?.('voiceschanged', done, { once: true });
    window.setTimeout(done, timeoutMs);
    if (engine.getVoices().length > 0) window.setTimeout(done, 50);
  });
}

function pickVoice(preferredURI: string | null, accent: 'en-US' | 'en-GB'): SpeechSynthesisVoice | null {
  const engine = synth();
  if (!engine) return null;
  const voices = engine.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith('en'));
  if (voices.length === 0) return null;
  if (preferredURI) {
    const preferred = voices.find((voice) => voice.voiceURI === preferredURI);
    if (preferred) return preferred;
  }
  const byAccent = voices.find((voice) => voice.lang.toLowerCase().startsWith(accent.toLowerCase()));
  return byAccent ?? voices[0] ?? null;
}

export interface SpeakOptions {
  rate?: number;
  voiceURI?: string | null;
  accent?: 'en-US' | 'en-GB';
  onEnd?: () => void;
}

/** Speak text. Returns false when speech synthesis is unavailable. */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  const engine = synth();
  if (!engine || !text.trim()) return false;
  engine.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickVoice(options.voiceURI ?? null, options.accent ?? 'en-GB');
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = options.accent ?? 'en-GB';
  }
  utterance.rate = options.rate ?? 0.95;
  utterance.pitch = 1;
  if (options.onEnd) utterance.onend = () => options.onEnd?.();
  engine.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  synth()?.cancel();
}

export function speakingNow(): boolean {
  return synth()?.speaking ?? false;
}

export function recognitionAvailable(): boolean {
  return typeof window !== 'undefined' && getRecognitionCtor() !== null;
}

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export interface RecognitionHandle {
  stop: () => void;
}

export interface RecognitionOptions {
  lang?: string;
  onResult: (transcript: string) => void;
  onError?: (code: string) => void;
  onEnd?: () => void;
}

export function startRecognition(options: RecognitionOptions): RecognitionHandle | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;
  let recognition: SpeechRecognitionLike;
  try {
    recognition = new Ctor();
  } catch {
    return null;
  }
  recognition.lang = options.lang ?? 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const alternatives = event.results[0];
    const best = alternatives?.[0];
    if (best) options.onResult(best.transcript);
  };
  recognition.onerror = (event) => options.onError?.(event.error);
  recognition.onend = () => options.onEnd?.();

  try {
    recognition.start();
  } catch {
    options.onError?.('start-failed');
    return null;
  }
  return {
    stop: () => {
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
    },
  };
}
