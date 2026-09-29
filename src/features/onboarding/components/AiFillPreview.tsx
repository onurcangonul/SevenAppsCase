import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { FillWithAiButton } from '@/features/clips/components';
import { aiGradient } from '@/theme/tokens';

const DEMO_MS = 1800;
const GLOW_ID = 'aiFillPreviewGlow';

export function AiFillPreview() {
  const [isWatching, setIsWatching] = useState(false);

  useEffect(() => {
    if (!isWatching) {
      return;
    }

    const timer = setTimeout(() => {
      setIsWatching(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }, DEMO_MS);

    return () => clearTimeout(timer);
  }, [isWatching]);

  return (
    <View className="h-44 items-center justify-center">
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id={GLOW_ID} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0" stopColor={aiGradient[1]} stopOpacity={0.28} />
            <Stop offset="0.55" stopColor={aiGradient[2]} stopOpacity={0.08} />
            <Stop offset="1" stopColor={aiGradient[2]} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="50%" cy="50%" rx="50%" ry="50%" fill={`url(#${GLOW_ID})`} />
      </Svg>

      <FillWithAiButton busy={isWatching} onPress={() => setIsWatching(true)} />
    </View>
  );
}
