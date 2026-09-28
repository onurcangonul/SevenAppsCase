import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { brandMark } from '@/theme/brand';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-gutter py-16">
      <View className="mb-3 h-16 w-16 items-center justify-center rounded-card bg-accent">
        <Image
          source={brandMark}
          contentFit="contain"
          style={{ width: 30, height: 37 }}
          accessibilityIgnoresInvertColors
        />
      </View>

      <Text variant="heading">{title}</Text>

      <Text variant="body" tone="muted" className="max-w-[280px] text-center">
        {description}
      </Text>

      {action ? <View className="mt-3">{action}</View> : null}
    </View>
  );
}
