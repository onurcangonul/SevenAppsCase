import '../global.css';
import '@/theme/interop';

import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

import { ToastHost } from '@/components/feedback';
import { AppProviders } from '@/providers/AppProviders';
import { navigationTheme } from '@/theme/navigation';
import { palette } from '@/theme/tokens';

export default function RootLayout() {
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
          <Stack.Screen name="index" />
          <Stack.Screen name="clip/[id]/index" />
          <Stack.Screen name="clip/[id]/edit" options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="crop" options={{ presentation: 'fullScreenModal' }} />
        </Stack>
        <ToastHost />
      </ThemeProvider>
    </AppProviders>
  );
}
