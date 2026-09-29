import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutRectangle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { SparklesIcon, Text, Touchable } from '@/components/ui';
import { resolveErrorMessage } from '@/lib/errors';
import { aiGradient, palette } from '@/theme/tokens';
import type { ClipMetadata } from '@/types/clip';

import { useSuggestMetadata } from '../hooks/useSuggestMetadata';
import type { SuggestionSource } from '../suggestClipMetadata';

const BORDER_WIDTH = 2;
const LABEL_SIZE = 16;
const ICON_SIZE = 20;
const TWINKLE_MS = 1400;

const BORDER_GRADIENT_ID = 'aiBorderGradient';
const LABEL_GRADIENT_ID = 'aiLabelGradient';

type SuggestMetadataButtonProps = {
  source: SuggestionSource;
  onSuggested: (metadata: ClipMetadata) => void;
  disabled?: boolean;
};

function gradientStops() {
  return aiGradient.map((stop, index) => (
    <Stop key={stop} offset={index / (aiGradient.length - 1)} stopColor={stop} />
  ));
}

function GradientLabel({ label }: { label: string }) {
  const [box, setBox] = useState<LayoutRectangle | null>(null);

  return (
    <View>
      <Text
        variant="heading"
        importantForAccessibility="no"
        style={{ opacity: 0 }}
        onLayout={(event) => setBox(event.nativeEvent.layout)}
      >
        {label}
      </Text>

      {box ? (
        <Svg style={StyleSheet.absoluteFill} width={box.width} height={box.height}>
          <Defs>
            <LinearGradient id={LABEL_GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
              {gradientStops()}
            </LinearGradient>
          </Defs>

          <SvgText
            x={0}
            y={box.height / 2}
            dy={LABEL_SIZE * 0.36}
            fontSize={LABEL_SIZE}
            fontWeight="600"
            fill={`url(#${LABEL_GRADIENT_ID})`}
          >
            {label}
          </SvgText>
        </Svg>
      ) : null}
    </View>
  );
}

export function SuggestMetadataButton({
  source,
  onSuggested,
  disabled = false,
}: SuggestMetadataButtonProps) {
  const suggestion = useSuggestMetadata();
  const isBusy = suggestion.isPending;

  const [box, setBox] = useState<LayoutRectangle | null>(null);
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

  const suggest = useCallback(() => {
    suggestion.mutate(source, {
      onSuccess: (metadata) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        onSuggested(metadata);
      },
    });
  }, [suggestion, source, onSuggested]);

  const label = isBusy ? 'Watching your clip…' : 'Fill with AI';

  return (
    <View className="gap-2">
      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Fill the name and description with AI"
        accessibilityState={{ disabled: disabled || isBusy, busy: isBusy }}
        disabled={disabled || isBusy}
        onPress={suggest}
        onLayout={(event) => setBox(event.nativeEvent.layout)}
        className={['active:opacity-80', disabled ? 'opacity-40' : ''].join(' ')}
      >
        {box ? (
          <Svg style={StyleSheet.absoluteFill} width={box.width} height={box.height}>
            <Defs>
              <LinearGradient id={BORDER_GRADIENT_ID} x1="0" y1="0" x2="1" y2="1">
                {gradientStops()}
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
          <Animated.View style={sparkleStyle}>
            <SparklesIcon size={ICON_SIZE} gradient={aiGradient} />
          </Animated.View>

          <GradientLabel label={label} />
        </View>
      </Touchable>

      {suggestion.isError ? (
        <Text variant="caption" tone="danger">
          {resolveErrorMessage(suggestion.error)}
        </Text>
      ) : null}
    </View>
  );
}
