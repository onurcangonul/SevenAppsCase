import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createQueryClient } from '@/lib/query/client';
import { palette } from '@/theme/tokens';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(createQueryClient);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.canvas }}>
      <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
