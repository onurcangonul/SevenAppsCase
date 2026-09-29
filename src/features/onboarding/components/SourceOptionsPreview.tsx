import type { ComponentType } from 'react';
import { View } from 'react-native';

import { CameraIcon, ImportIcon, Text } from '@/components/ui';
import type { IconProps } from '@/components/ui';
import { palette } from '@/theme/tokens';

type SourceOption = {
  icon: ComponentType<IconProps>;
  title: string;
  caption: string;
};

const SOURCE_OPTIONS: SourceOption[] = [
  { icon: ImportIcon, title: 'Import', caption: 'Any video from your library' },
  { icon: CameraIcon, title: 'Record', caption: 'Straight from the camera' },
];

export function SourceOptionsPreview() {
  return (
    <View
      accessible
      accessibilityLabel="Import a video from your library or record a new one"
      className="flex-row gap-3"
    >
      {SOURCE_OPTIONS.map(({ icon: Icon, title, caption }) => (
        <View
          key={title}
          className="flex-1 gap-4 rounded-card border border-hairline bg-surface p-4"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-elevated">
            <Icon size={18} color={palette.accent} />
          </View>

          <View className="gap-1">
            <Text variant="heading">{title}</Text>
            <Text variant="caption" tone="muted">
              {caption}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
