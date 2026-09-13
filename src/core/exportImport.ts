import type { AppState } from './types';
import { STATE_VERSION } from './store';

/** Serialise progress for download. */
export function stateToJson(state: AppState): string {
  return JSON.stringify({ app: 'english-janala', version: STATE_VERSION, exportedAt: new Date().toISOString(), state }, null, 2);
}

export function exportState(state: AppState): string {
  const json = stateToJson(state);
  try {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `english-janala-progress-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch {
    /* clipboard fallback is handled by the caller */
  }
  return json;
}

/** Accept either a raw AppState or the wrapped export envelope. */
export function parseState(raw: string): Partial<AppState> | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const record = parsed as Record<string, unknown>;
    if (record.state && typeof record.state === 'object') return record.state as Partial<AppState>;
    return record as Partial<AppState>;
  } catch {
    return null;
  }
}
