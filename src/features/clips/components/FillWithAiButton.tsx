import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutRectangle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect } from 'react-native-svg';

import { GradientText, gradientStops, Touchable, TwinklingSparkles } from '@/components/ui';
import { aiGradient, palette } from '@/theme/tokens';

const BORDER_WIDTH = 2;
const ICON_SIZE = 20;
const BORDER_GRADIENT_ID = 'aiBorderGradient';

type FillWithAiButtonProps = {
  onPress: () => void;
  busy?: boolean;
  disabled?: boolean;
};

export function FillWithAiButton({
  onPress,
  busy = false,
  disabled = false,
}: FillWithAiButtonProps) {
  const [box, setBox] = useState<LayoutRectangle | null>(null);

  return (
    <Touchable
      accessibilityRole="button"
      accessibilityLabel="Fill the name and description with AI"
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      onLayout={(event) => setBox(event.nativeEvent.layout)}
      className={['active:opacity-80', disabled ? 'opacity-40' : ''].join(' ')}
    >
      {box ? (
        <Svg style={StyleSheet.absoluteFill} width={box.width} height={box.height}>
          <Defs>
            <LinearGradient id={BORDER_GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
              {gradientStops(aiGradient)}
            </LinearGradient>
          </Defs>

          <Rect
            x={BORDER_WIDTH / 2}
            y={BORDER_WIDTH / 2}
            width={box.width - BORDER_WIDTH}
            height={box.height - BORDER_WIDTH}
            rx={(box.height - BORDER_WIDTH) / 2}
            fill={palette.chalk}
            stroke={`url(#${BORDER_GRADIENT_ID})`}
            strokeWidth={BORDER_WIDTH}
          />
        </Svg>
      ) : null}

      <View className="flex-row items-center justify-center gap-2.5 px-5 py-3.5">
        <TwinklingSparkles size={ICON_SIZE} gradient={aiGradient} />
        <GradientText colors={aiGradient}>
          {busy ? 'Watching your clip…' : 'Fill with AI'}
        </GradientText>
      </View>
    </Touchable>
  );
}
