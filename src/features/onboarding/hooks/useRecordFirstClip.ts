import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { useCropDraftStore } from '@/features/crop/cropDraftStore';
import { useVideoSource } from '@/features/crop/hooks/useVideoSource';

import { selectCompleteOnboarding, useOnboardingStore } from '../onboardingStore';

export function useRecordFirstClip() {
  const router = useRouter();
  const setSource = useCropDraftStore((state) => state.setSource);
  const completeOnboarding = useOnboardingStore(selectCompleteOnboarding);
  const { recordWithCamera, pending, error } = useVideoSource();

  const recordFirstClip = useCallback(async () => {
    const source = await recordWithCamera();

    if (!source) {
      return;
    }

    setSource(source);
    completeOnboarding();
    // Router actions flush after the next render, once the guard has exposed the crop routes.
    router.push('/crop/trim', { withAnchor: true });
  }, [recordWithCamera, setSource, completeOnboarding, router]);

  return { recordFirstClip, isRecording: pending === 'camera', error };
}
