import { create } from 'zustand';

import { readFlag, writeFlag } from '@/lib/preferences';

const COMPLETED_KEY = 'onboarding.completed';

type OnboardingState = {
  isComplete: boolean;
  complete: () => void;
};

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  isComplete: readFlag(COMPLETED_KEY),

  complete: () => {
    writeFlag(COMPLETED_KEY, true);
    set({ isComplete: true });
  },
}));

export const selectIsOnboardingComplete = (state: OnboardingState) => state.isComplete;
export const selectCompleteOnboarding = (state: OnboardingState) => state.complete;
