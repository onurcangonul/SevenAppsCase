import Svg, { Path, Rect } from 'react-native-svg';

import type { IconProps } from './types';

export function CameraIcon({ size = 18, color = '#FAFAFA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" accessibilityElementsHidden>
      <Rect x={2.75} y={6.25} width={12.5} height={11.5} rx={3} stroke={color} strokeWidth={2} />
      <Path
        d="M15.25 10.4 20 7.66c.5-.29 1.25.07 1.25.65v7.38c0 .58-.75.94-1.25.65l-4.75-2.74"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
