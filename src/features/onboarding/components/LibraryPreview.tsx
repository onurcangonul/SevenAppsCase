import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Badge, PlaybackIcon, Text } from '@/components/ui';
import { CLIP_DURATION_MS } from '@/constants/clip';
import { formatDuration } from '@/lib/format';
import { aiGradient, palette } from '@/theme/tokens';

type PreviewClip = {
  name: string;
  description: string;
  meta: string;
  tint: string;
};

const PREVIEW_CLIPS: PreviewClip[] = [
  {
    name: 'Sunset at the pier',
    description: 'Golden light on the water and the last ferry heading out.',
    meta: 'Just added',
    tint: palette.accent,
  },
  {
    name: 'Coffee by the window',
    description: 'First warm morning of spring.',
    meta: '2d ago',
    tint: aiGradient[1],
  },
  {
    name: 'Fog on the bridge',
    description: 'Morning run, legs finally warmed up.',
    meta: '5d ago',
    tint: aiGradient[0],
  },
];

const CARD_OPACITIES = [1, 0.55, 0.25];

function ThumbnailArt({ index, tint }: { index: number; tint: string }) {
  const gradientId = `libraryPreviewThumb${index}`;

  return (
    <Svg width="100%" height="100%">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={tint} stopOpacity={0.75} />
          <Stop offset="1" stopColor={palette.canvas} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${gradientId})`} />
      <Circle cx="72%" cy="34%" r={9} fill={palette.chalk} opacity={0.14} />
    </Svg>
  );
}

function PreviewCard({ clip, index }: { clip: PreviewClip; index: number }) {
  const highlighted = index === 0;

  return (
    <View
      className={[
        'flex-row gap-3 rounded-card border p-2.5',
        highlighted ? 'border-accent bg-accent/5' : 'border-hairline bg-surface',
      ].join(' ')}
      style={{ opacity: CARD_OPACITIES[index] ?? 1 }}
    >
      <View className="h-[66px] w-[88px] overflow-hidden rounded-lg bg-elevated">
        <ThumbnailArt index={index} tint={clip.tint} />

        <View className="absolute inset-0 items-center justify-center">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-canvas/60">
            <PlaybackIcon playing={false} size={8} color={palette.chalk} />
          </View>
        </View>

        <View className="absolute bottom-1 right-1">
          <Badge label={formatDuration(CLIP_DURATION_MS)} />
        </View>
      </View>

      <View className="flex-1 justify-between py-0.5">
        <View className="gap-0.5">
          <Text variant="heading" numberOfLines={1}>
            {clip.name}
          </Text>
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {clip.description}
          </Text>
        </View>

        <Text variant="caption" tone={highlighted ? 'accent' : 'faint'} mono numberOfLines={1}>
          {clip.meta}
        </Text>
      </View>
    </View>
  );
}

export function LibraryPreview() {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-2.5"
    >
      {PREVIEW_CLIPS.map((clip, index) => (
        <PreviewCard key={clip.name} clip={clip} index={index} />
      ))}
    </View>
  );
}
