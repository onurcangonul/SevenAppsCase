import { memo } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Badge, PlaybackIcon, Text, Touchable } from '@/components/ui';
import { VideoThumbnail } from '@/components/video';
import { formatDuration, formatRelativeDate } from '@/lib/format';
import { palette } from '@/theme/tokens';
import type { Clip } from '@/types/clip';

export const CLIP_CARD_HEIGHT = 110;

type ClipListItemProps = {
  clip: Clip;
  index: number;
  highlighted: boolean;
  onPress: (clip: Clip) => void;
};

function ClipListItemBase({ clip, index, highlighted, onPress }: ClipListItemProps) {
  return (
    <Animated.View entering={FadeIn.delay(Math.min(index, 8) * 35).duration(220)}>
      <Touchable
        accessibilityRole="button"
        accessibilityLabel={`Open ${clip.name}`}
        onPress={() => onPress(clip)}
        style={{ height: CLIP_CARD_HEIGHT }}
        className={[
          'mx-gutter flex-row gap-3.5 rounded-card border p-3',
          highlighted
            ? 'border-accent bg-accent/5 active:bg-accent/10'
            : 'border-hairline bg-surface active:bg-elevated',
        ].join(' ')}
      >
        <View className="relative">
          <VideoThumbnail uri={clip.thumbnailUri} className="h-[84px] w-[112px]" />

          <View className="absolute inset-0 items-center justify-center">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-canvas/60">
              <PlaybackIcon playing={false} size={9} color={palette.chalk} />
            </View>
          </View>

          <View className="absolute bottom-1.5 right-1.5">
            <Badge label={formatDuration(clip.durationMs)} />
          </View>
        </View>

        <View className="flex-1 justify-between py-0.5">
          <View className="gap-1">
            <Text variant="heading" numberOfLines={1}>
              {clip.name}
            </Text>

            <Text variant="caption" tone={clip.description ? 'muted' : 'faint'} numberOfLines={2}>
              {clip.description || 'No description'}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Text variant="caption" tone={highlighted ? 'accent' : 'faint'} mono numberOfLines={1}>
              {highlighted ? 'Just added' : formatRelativeDate(clip.createdAt)}
            </Text>
            <View className="h-[3px] w-[3px] rounded-full bg-faint" />
            <Text variant="caption" tone="faint" mono numberOfLines={1}>
              from {formatDuration(clip.sourceStartMs)}
            </Text>
          </View>
        </View>
      </Touchable>
    </Animated.View>
  );
}

export const ClipListItem = memo(ClipListItemBase);
