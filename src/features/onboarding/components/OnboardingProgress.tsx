import { View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { palette } from '@/theme/tokens';

const DOT_SIZE = 6;
const ACTIVE_WIDTH = 22;
const TRANSITION_MS = 320;

type PillState = 'done' | 'active' | 'upcoming';

const pillColors: Record<PillState, string> = {
  done: palette.faint,
  active: palette.accent,
  upcoming: palette.hairline,
};

function pillState(index: number, current: number): PillState {
  if (index < current) {
    return 'done';
  }

  return index === current ? 'active' : 'upcoming';
}

function ProgressPill({ state }: { state: PillState }) {
  const pillStyle = useAnimatedStyle(() => ({
    width: withTiming(state === 'active' ? ACTIVE_WIDTH : DOT_SIZE, { duration: TRANSITION_MS }),
    backgroundColor: withTiming(pillColors[state], { duration: TRANSITION_MS }),
  }));

  return <Animated.View style={[{ height: DOT_SIZE, borderRadius: DOT_SIZE / 2 }, pillStyle]} />;
}

type OnboardingProgressProps = {
  current: number;
  total: number;
};

export function OnboardingProgress({ current, total }: OnboardingProgressProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${current + 1} of ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current + 1 }}
      className="flex-row items-center gap-1.5"
    >
      {Array.from({ length: total }, (_, index) => (
        <ProgressPill key={index} state={pillState(index, current)} />
      ))}
    </View>
  );
}
