import Svg, { Defs, LinearGradient, Path } from 'react-native-svg';

import { gradientStops } from '../gradientStops';
import type { IconProps } from './types';

const LARGE_STAR =
  'M10.5 6 Q11.85 12.15 18 13.5 Q11.85 14.85 10.5 21 Q9.15 14.85 3 13.5 Q9.15 12.15 10.5 6 Z';
const SMALL_STAR =
  'M18.5 2 Q19.13 4.87 22 5.5 Q19.13 6.13 18.5 9 Q17.87 6.13 15 5.5 Q17.87 4.87 18.5 2 Z';

const GRADIENT_ID = 'sparklesGradient';

type SparklesIconProps = IconProps & {
  gradient?: readonly string[];
};

export function SparklesIcon({ size = 18, color = '#FAFAFA', gradient }: SparklesIconProps) {
  const fill = gradient ? `url(#${GRADIENT_ID})` : color;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden>
      {gradient ? (
        <Defs>
          <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
            {gradientStops(gradient)}
          </LinearGradient>
        </Defs>
      ) : null}

      <Path d={LARGE_STAR} fill={fill} />
      <Path d={SMALL_STAR} fill={fill} opacity={0.85} />
    </Svg>
  );
}
