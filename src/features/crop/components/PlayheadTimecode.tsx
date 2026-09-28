import { useState } from 'react';
import { useAnimatedReaction } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { Timecode } from '@/components/ui';

const STEP_MS = 50;

type PlayheadTimecodeProps = {
  positionMs: SharedValue<number>;
};

export function PlayheadTimecode({ positionMs }: PlayheadTimecodeProps) {
  const [displayMs, setDisplayMs] = useState(0);

  useAnimatedReaction(
    () => Math.floor(positionMs.value / STEP_MS),
    (step, previous) => {
      if (step !== previous) {
        runOnJS(setDisplayMs)(step * STEP_MS);
      }
    },
  );

  return <Timecode milliseconds={displayMs} tone="playhead" />;
}
