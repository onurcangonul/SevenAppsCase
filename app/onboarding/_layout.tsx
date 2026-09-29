import { Stack, usePathname } from 'expo-router';

import { Screen } from '@/components/layout';
import { OnboardingHeader } from '@/features/onboarding/components';
import {
  selectCompleteOnboarding,
  useOnboardingStore,
} from '@/features/onboarding/onboardingStore';
import { ONBOARDING_ROUTES, onboardingStepIndex } from '@/features/onboarding/steps';
import { palette } from '@/theme/tokens';

export default function OnboardingLayout() {
  const pathname = usePathname();
  const completeOnboarding = useOnboardingStore(selectCompleteOnboarding);

  return (
    <Screen edges={['top']}>
      <OnboardingHeader
        current={onboardingStepIndex(pathname)}
        total={ONBOARDING_ROUTES.length}
        onSkip={completeOnboarding}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: palette.canvas },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="record" />
        <Stack.Screen name="describe" />
        <Stack.Screen name="ai" />
        <Stack.Screen name="library" />
      </Stack>
    </Screen>
  );
}
