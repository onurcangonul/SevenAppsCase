import { Stack } from 'expo-router';

import { palette } from '@/theme/tokens';

export default function CropLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.canvas },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="trim" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
