import { View } from 'react-native';

type PlaybackIconProps = {
  playing: boolean;
  size?: number;
  color?: string;
};

export function PlaybackIcon({ playing, size = 18, color = '#09090B' }: PlaybackIconProps) {
  if (playing) {
    const barWidth = Math.max(2, Math.round(size * 0.22));

    return (
      <View className="flex-row items-center" style={{ gap: Math.round(size * 0.22) }}>
        <View style={{ width: barWidth, height: size, borderRadius: 1, backgroundColor: color }} />
        <View style={{ width: barWidth, height: size, borderRadius: 1, backgroundColor: color }} />
      </View>
    );
  }

  return (
    <View
      style={{
        width: 0,
        height: 0,
        marginLeft: Math.round(size * 0.12),
        borderTopWidth: size / 2,
        borderBottomWidth: size / 2,
        borderLeftWidth: size * 0.85,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: color,
      }}
    />
  );
}
