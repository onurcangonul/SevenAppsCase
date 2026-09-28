import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export function PlusIcon({ size = 18, color = '#FAFAFA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}
