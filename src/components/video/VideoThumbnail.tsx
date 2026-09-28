import { Image } from 'expo-image';
import { View } from 'react-native';

import { Text } from '@/components/ui';

type VideoThumbnailProps = {
  uri: string | null;
  className?: string;
  contentFit?: 'cover' | 'contain';
};

export function VideoThumbnail({ uri, className, contentFit = 'cover' }: VideoThumbnailProps) {
  return (
    <View
      className={['overflow-hidden rounded-lg bg-elevated', className].filter(Boolean).join(' ')}
    >
      {uri ? (
        <Image
          source={{ uri }}
          contentFit={contentFit}
          transition={160}
          cachePolicy="memory-disk"
          style={{ width: '100%', height: '100%' }}
        />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <Text variant="caption" tone="faint" mono>
            5s
          </Text>
        </View>
      )}
    </View>
  );
}
