import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { useToastStore } from '@/lib/toast';

const VISIBLE_MS = 2600;

export function ToastHost() {
  const insets = useSafeAreaInsets();
  const current = useToastStore((state) => state.current);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    if (!current) {
      return;
    }

    const timer = setTimeout(() => dismiss(current.id), VISIBLE_MS);

    return () => clearTimeout(timer);
  }, [current, dismiss]);

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', top: insets.top + 8, left: 0, right: 0 }}
    >
      {current ? (
        <Animated.View
          key={current.id}
          entering={FadeInUp.duration(220)}
          exiting={FadeOutUp.duration(180)}
          style={{ alignItems: 'center', paddingHorizontal: 20 }}
        >
          <View
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            className="max-w-full flex-row items-center gap-3 rounded-full border border-hairline bg-elevated py-2.5 pl-3 pr-5"
          >
            <View className="h-6 w-6 items-center justify-center rounded-full bg-accent">
              <View className="h-2 w-2 rounded-full bg-chalk" />
            </View>

            <View className="shrink">
              <Text variant="label" numberOfLines={1}>
                {current.title}
              </Text>
              {current.detail ? (
                <Text variant="caption" tone="muted" numberOfLines={1}>
                  {current.detail}
                </Text>
              ) : null}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}
