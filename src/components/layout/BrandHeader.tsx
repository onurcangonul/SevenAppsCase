import type { ReactNode } from 'react';
import { View } from 'react-native';

import { BrandMark, Text } from '@/components/ui';

type BrandHeaderProps = {
  action?: ReactNode;
};

export function BrandHeader({ action }: BrandHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-gutter pb-1 pt-3">
      <View className="flex-row items-center gap-2.5">
        <BrandMark size={26} />
        <Text variant="label" className="tracking-[2.5px]">
          FIVESEC
        </Text>
      </View>

      {action}
    </View>
  );
}
