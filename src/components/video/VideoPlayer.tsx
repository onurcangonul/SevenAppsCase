import { VideoView, useVideoPlayer } from 'expo-video';
import { View } from 'react-native';

import { VIDEO_ASPECT_RATIO } from '@/constants/clip';

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
      className={['w-full overflow-hidden rounded-card bg-black', className]
        .filter(Boolean)
        .join(' ')}
      style={{ aspectRatio: VIDEO_ASPECT_RATIO }}
    >
      <VideoView
        player={player}
        nativeControls={nativeControls}
        contentFit="contain"
        fullscreenOptions={{ enable: true }}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
