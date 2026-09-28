import { View } from 'react-native';

import { PlaybackIcon, Text, Touchable } from '@/components/ui';
import { CLIP_DURATION_SECONDS } from '@/constants/clip';
import { palette } from '@/theme/tokens';

type PreviewControlProps = {
  isPlaying: boolean;
  onToggle: () => void;
};

export function PreviewControl({ isPlaying, onToggle }: PreviewControlProps) {
  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={isPlaying ? 'Pause preview' : 'Play the five second preview'}
      onPress={onToggle}
      className="h-12 flex-row items-center justify-center gap-3 rounded-control bg-chalk active:bg-chalk/85"
    >
      <PlaybackIcon playing={isPlaying} size={15} color={palette.ink} />

      <View>
        <Text variant="heading" tone="ink">
          {isPlaying ? 'Pause' : `Play ${CLIP_DURATION_SECONDS} seconds`}
        </Text>
      </View>
    </Touchable>
  );
}
