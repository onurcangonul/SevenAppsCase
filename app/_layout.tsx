import '../global.css';
import '@/theme/interop';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '@/providers/AppProviders';
import { palette } from '@/theme/tokens';

export default function RootLayout() {
  return (
    <AppProviders>
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
    </AppProviders>
  );
}
