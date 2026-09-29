import type { ReactNode } from 'react';
import { View } from 'react-native';

import { Wordmark } from '@/components/ui';

type BrandHeaderProps = {
  action?: ReactNode;
};

export function BrandHeader({ action }: BrandHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-gutter pb-1 pt-3">
      <Wordmark />

      {action}
    </View>
  );
}
