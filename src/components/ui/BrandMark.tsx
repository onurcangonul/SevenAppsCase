import { Image } from 'expo-image';
import { View } from 'react-native';

import { brandMark } from '@/theme/brand';

const MARK_ASPECT = 598 / 739;

type BrandMarkProps = {
  size?: number;
};

export function BrandMark({ size = 28 }: BrandMarkProps) {
  const markWidth = size * 0.5;

  return (
    <View
      className="items-center justify-center bg-accent"
      style={{ width: size, height: size, borderRadius: size * 0.28 }}
    >
      <Image
        source={brandMark}
        contentFit="contain"
        accessibilityIgnoresInvertColors
        style={{ width: markWidth, height: markWidth / MARK_ASPECT }}
      />
    </View>
  );
}
