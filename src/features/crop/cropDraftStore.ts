import { create } from 'zustand';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { clamp } from '@/lib/number';

export type CropSource = {
  uri: string;
  durationMs: number;
  width: number;
  height: number;
  fileName: string | null;
};

type CropDraftState = {
  source: CropSource | null;
  startMs: number;
  setSource: (source: CropSource) => void;
  setStartMs: (startMs: number) => void;
  reset: () => void;
};

const initialState = {
  source: null,
  startMs: 0,
};

export const useCropDraftStore = create<CropDraftState>()((set, get) => ({
  ...initialState,

  setSource: (source) => set({ source, startMs: 0 }),

  setStartMs: (startMs) => {
    const { source } = get();
    const maxStart = source ? Math.max(0, source.durationMs - CLIP_DURATION_MS) : 0;

    set({ startMs: clamp(Math.round(startMs), 0, maxStart) });
  },

  reset: () => set(initialState),
}));

export const selectSource = (state: CropDraftState) => state.source;
export const selectStartMs = (state: CropDraftState) => state.startMs;
export const selectEndMs = (state: CropDraftState) => state.startMs + CLIP_DURATION_MS;
