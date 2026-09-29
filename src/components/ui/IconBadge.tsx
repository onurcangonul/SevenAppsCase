import type { ComponentType } from 'react';
import { View } from 'react-native';

import { palette } from '@/theme/tokens';

import type { IconProps } from './icons';

type IconBadgeProps = {
  icon: ComponentType<IconProps>;
};

export function IconBadge({ icon: Icon }: IconBadgeProps) {
  return (
    <View className="h-9 w-9 items-center justify-center rounded-lg bg-accent">
      <Icon size={18} color={palette.chalk} />
    </View>
  );
}
