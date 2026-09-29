import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BOTTOM_BAR_MIN_PADDING = 16;

type BottomBarProps = PropsWithChildren<{
  bordered?: boolean;
}>;

export function BottomBar({ children, bordered = true }: BottomBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={['bg-canvas px-gutter pt-4', bordered ? 'border-t border-hairline' : ''].join(' ')}
      style={{ paddingBottom: Math.max(insets.bottom, BOTTOM_BAR_MIN_PADDING) }}
    >
      {children}
    </View>
  );
}
