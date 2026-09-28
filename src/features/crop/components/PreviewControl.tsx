import { PlaybackIcon, Text, Touchable } from '@/components/ui';
import { CLIP_DURATION_SECONDS } from '@/constants/clip';
import { palette } from '@/theme/tokens';

type PreviewControlProps = {
  isPlaying: boolean;
  isResumable: boolean;
  onToggle: () => void;
};

function labelFor(isPlaying: boolean, isResumable: boolean): string {
  if (isPlaying) {
    return 'Pause';
  }

  return isResumable ? 'Resume' : `Play ${CLIP_DURATION_SECONDS} seconds`;
}

export function PreviewControl({ isPlaying, isResumable, onToggle }: PreviewControlProps) {
  const label = labelFor(isPlaying, isResumable);

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onToggle}
      className="h-12 flex-row items-center justify-center gap-3 rounded-control bg-chalk active:bg-chalk/85"
    >
      <PlaybackIcon playing={isPlaying} size={15} color={palette.ink} />
      <Text variant="heading" tone="ink">
        {label}
      </Text>
    </Touchable>
  );
}
