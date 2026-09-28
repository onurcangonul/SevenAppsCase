import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function ScreenHeader({ title, subtitle, eyebrow, action }: ScreenHeaderProps) {
  return (
    <View className="flex-row items-start justify-between gap-4 px-gutter pb-5 pt-2">
      <View className="flex-1 gap-1">
        {eyebrow ? (
          <Text variant="caption" tone="faint" mono className="uppercase">
            {eyebrow}
          </Text>
        ) : null}

        <Text variant="display">{title}</Text>

        {subtitle ? (
          <Text variant="body" tone="muted">
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action ? <View className="pt-1">{action}</View> : null}
    </View>
  );
}
