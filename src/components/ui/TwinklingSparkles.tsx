import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { SparklesIcon } from './icons';

const TWINKLE_MS = 1400;

type TwinklingSparklesProps = {
  size: number;
  gradient: readonly string[];
};

export function TwinklingSparkles({ size, gradient }: TwinklingSparklesProps) {
  const twinkle = useSharedValue(0);

  useEffect(() => {
    twinkle.value = withRepeat(
      withSequence(
        withTiming(1, { duration: TWINKLE_MS, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: TWINKLE_MS, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [twinkle]);

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: 0.65 + twinkle.value * 0.35,
    transform: [{ scale: 0.88 + twinkle.value * 0.24 }, { rotate: `${twinkle.value * 16}deg` }],
  }));

  return (
    <Animated.View style={sparkleStyle}>
      <SparklesIcon size={size} gradient={gradient} />
    </Animated.View>
  );
}
