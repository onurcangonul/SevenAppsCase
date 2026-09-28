import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Badge, Text, Touchable } from '@/components/ui';
import { VideoThumbnail } from '@/components/video';
import { formatDuration, formatRelativeDate } from '@/lib/format';
import type { Clip } from '@/types/clip';

export const CLIP_ROW_HEIGHT = 88;

type ClipListItemProps = {
  clip: Clip;
  index: number;
  onPress: (clip: Clip) => void;
};

export function ClipListItem({ clip, index, onPress }: ClipListItemProps) {
  return (
    <Animated.View entering={FadeIn.delay(Math.min(index, 8) * 35).duration(220)}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Open ${clip.name}`}
        onPress={() => onPress(clip)}
        className="h-[88px] flex-row items-center gap-4 px-gutter active:bg-surface"
      >
        <View className="relative">
          <VideoThumbnail uri={clip.thumbnailUri} className="h-16 w-28" />
          <View className="absolute bottom-1 right-1">
            <Badge label={formatDuration(clip.durationMs)} />
          </View>
        </View>

        <View className="flex-1 justify-center gap-1">
          <Text variant="heading" numberOfLines={1}>
            {clip.name}
          </Text>

          {clip.description ? (
            <Text variant="caption" tone="muted" numberOfLines={1}>
              {clip.description}
            </Text>
          ) : (
            <Text variant="caption" tone="faint" numberOfLines={1}>
              No description
            </Text>
          )}

          <Text variant="caption" tone="faint" mono numberOfLines={1}>
            {formatRelativeDate(clip.createdAt)}
          </Text>
        </View>
      </Touchable>
    </Animated.View>
  );
}
