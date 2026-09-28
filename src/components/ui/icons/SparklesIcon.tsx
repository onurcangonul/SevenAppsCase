import Svg, { Path } from 'react-native-svg';

import type { IconProps } from './types';

const LARGE_STAR =
  'M10.5 6 Q11.85 12.15 18 13.5 Q11.85 14.85 10.5 21 Q9.15 14.85 3 13.5 Q9.15 12.15 10.5 6 Z';
const SMALL_STAR =
  'M18.5 2 Q19.13 4.87 22 5.5 Q19.13 6.13 18.5 9 Q17.87 6.13 15 5.5 Q17.87 4.87 18.5 2 Z';

export function SparklesIcon({ size = 18, color = '#FAFAFA' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      <Path d={LARGE_STAR} fill={color} />
      <Path d={SMALL_STAR} fill={color} opacity={0.85} />
    </Svg>
  );
}
