import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BOTTOM_BAR_MIN_PADDING = 16;

export function BottomBar({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-hairline bg-canvas px-gutter pt-4"
      style={{ paddingBottom: Math.max(insets.bottom, BOTTOM_BAR_MIN_PADDING) }}
    >
      {children}
    </View>
  );
}
