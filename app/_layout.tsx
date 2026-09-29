import '../global.css';
import '@/theme/interop';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { ToastHost } from '@/components/feedback';
import {
  selectIsOnboardingComplete,
  useOnboardingStore,
} from '@/features/onboarding/onboardingStore';
import { AppProviders } from '@/providers/AppProviders';
import { navigationTheme } from '@/theme/navigation';
import { palette } from '@/theme/tokens';

export default function RootLayout() {
  const isOnboardingComplete = useOnboardingStore(selectIsOnboardingComplete);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palette.canvas).catch(() => undefined);
  }, []);

  return (
    <AppProviders>
      <ThemeProvider value={navigationTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: palette.canvas },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Protected guard={!isOnboardingComplete}>
            <Stack.Screen name="onboarding" />
          </Stack.Protected>

          <Stack.Protected guard={isOnboardingComplete}>
            <Stack.Screen name="index" />
            <Stack.Screen name="clip/[id]/index" />
            <Stack.Screen name="clip/[id]/edit" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="crop" options={{ presentation: 'fullScreenModal' }} />
          </Stack.Protected>
        </Stack>
        <ToastHost />
      </ThemeProvider>
    </AppProviders>
  );
}
