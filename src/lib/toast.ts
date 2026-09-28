import { create } from 'zustand';

export type Toast = {
  id: number;
  title: string;
  detail?: string;
  clipId?: string;
};

type ToastState = {
  current: Toast | null;
  show: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: number) => void;
};

let sequence = 0;

export const useToastStore = create<ToastState>()((set) => ({
  current: null,
  show: (toast) => {
    sequence += 1;
    set({ current: { ...toast, id: sequence } });
  },
  dismiss: (id) => set((state) => (state.current?.id === id ? { current: null } : state)),
}));

export function showToast(toast: Omit<Toast, 'id'>): void {
  useToastStore.getState().show(toast);
}

export const selectToastClipId = (state: ToastState) => state.current?.clipId ?? null;
