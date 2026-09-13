import { createStore, createInitialState } from '@/core/store';

/** The single app-wide store instance (hydrated from localStorage). */
export const store = createStore(createInitialState());

export type StoreApi = typeof store;
