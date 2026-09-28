import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenProps = PropsWithChildren<{
  edges?: ('top' | 'bottom')[];
  className?: string;
}>;

export function Screen({ children, edges = ['top', 'bottom'], className }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={['flex-1 bg-canvas', className].filter(Boolean).join(' ')}
      style={{
        paddingTop: edges.includes('top') ? insets.top : 0,
        paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
      }}
    >
      {children}
    </View>
  );
}
