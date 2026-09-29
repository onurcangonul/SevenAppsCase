import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

export function PencilIcon({ size = 18, color = '#FAFAFA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityElementsHidden>
      <Path
        d="M4 20h4.2L18.9 9.3a2.1 2.1 0 0 0 0-3L17.7 5.1a2.1 2.1 0 0 0-3 0L4 15.8V20Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="m13.4 6.6 4 4" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
