import { VideoView, useVideoPlayer } from 'expo-video';
import { View } from 'react-native';

type VideoPlayerProps = {
  uri: string;
  loop?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  nativeControls?: boolean;
  className?: string;
};

export function VideoPlayer({
  uri,
  loop = true,
  autoPlay = false,
  muted = false,
  nativeControls = true,
  className,
}: VideoPlayerProps) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = loop;
    instance.muted = muted;

    if (autoPlay) {
      instance.play();
    }
  });

  return (
    <View
      className={['overflow-hidden rounded-card bg-surface', className].filter(Boolean).join(' ')}
    >
      <VideoView
        player={player}
        nativeControls={nativeControls}
        contentFit="contain"
        fullscreenOptions={{ enable: true }}
        className="h-full w-full"
      />
    </View>
  );
}
