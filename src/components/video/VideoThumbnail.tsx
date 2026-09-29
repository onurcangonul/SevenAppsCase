import { Image } from 'expo-image';
import { useState } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';

type VideoThumbnailProps = {
  uri: string | null;
  className?: string;
  contentFit?: 'cover' | 'contain';
};

export function VideoThumbnail({ uri, className, contentFit = 'cover' }: VideoThumbnailProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showImage = uri !== null && uri !== failedUri;

  return (
    <View
      className={['overflow-hidden rounded-lg bg-elevated', className].filter(Boolean).join(' ')}
    >
      {showImage ? (
        <Image
          source={{ uri }}
          onError={() => setFailedUri(uri)}
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
