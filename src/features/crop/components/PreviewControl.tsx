import { View } from 'react-native';

import { Text, Touchable } from '@/components/ui';

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
      className="h-11 flex-row items-center justify-center gap-2 rounded-control border border-hairline bg-surface active:bg-elevated"
    >
      <View className={['h-2 w-2 rounded-full', isPlaying ? 'bg-accent' : 'bg-faint'].join(' ')} />
      <Text variant="label" tone="muted">
        {isPlaying ? 'Pause preview' : 'Preview selection'}
      </Text>
    </Touchable>
  );
}
