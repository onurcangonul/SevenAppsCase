import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BrandMark, Text } from '@/components/ui';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 px-gutter py-16">
      <View className="mb-3">
        <BrandMark size={64} />
      </View>

      <Text variant="heading">{title}</Text>

      <Text variant="body" tone="muted" className="max-w-[280px] text-center">
        {description}
      </Text>

      {action ? <View className="mt-3">{action}</View> : null}
    </View>
  );
}
