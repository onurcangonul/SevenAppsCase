import { View } from 'react-native';

import { BrandMark } from './BrandMark';
import { Text } from './Text';

type WordmarkProps = {
  markSize?: number;
};

export function Wordmark({ markSize = 26 }: WordmarkProps) {
  return (
    <View accessible accessibilityLabel="FiveSec" className="flex-row items-center gap-2.5">
      <BrandMark size={markSize} />
      <Text variant="label" className="tracking-[2.5px]">
        FIVESEC
      </Text>
    </View>
  );
}
