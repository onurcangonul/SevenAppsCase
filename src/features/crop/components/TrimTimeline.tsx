import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { clamp } from '@/lib/number';

const TRACK_HEIGHT = 68;
const MIN_WINDOW_WIDTH = 56;
const HANDLE_WIDTH = 14;
const SCRUB_THROTTLE_MS = 55;

type TrimTimelineProps = {
  durationMs: number;
  startMs: number;
  frames: string[];
  onScrub: (startMs: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: (startMs: number) => void;
};

export function TrimTimeline({
  durationMs,
  startMs,
  frames,
  onScrub,
  onScrubStart,
  onScrubEnd,
}: TrimTimelineProps) {
  const [trackWidth, setTrackWidth] = useState(0);

  const offset = useSharedValue(0);
  const dragOrigin = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const lastEmit = useSharedValue(0);

  const windowWidth = useMemo(() => {
    if (trackWidth <= 0 || durationMs <= 0) {
      return 0;
    }

    const ratio = Math.min(1, CLIP_DURATION_MS / durationMs);

    return clamp(ratio * trackWidth, MIN_WINDOW_WIDTH, trackWidth);
  }, [trackWidth, durationMs]);

  const maxOffset = Math.max(0, trackWidth - windowWidth);
  const maxStartMs = Math.max(0, durationMs - CLIP_DURATION_MS);

  useEffect(() => {
    if (isDragging.value || maxOffset <= 0) {
      return;
    }

    offset.value = maxStartMs > 0 ? (startMs / maxStartMs) * maxOffset : 0;
  }, [startMs, maxStartMs, maxOffset, isDragging, offset]);

  const handleScrubStart = useCallback(() => {
    Haptics.selectionAsync().catch(() => undefined);
    onScrubStart?.();
  }, [onScrubStart]);

  const handleScrubEnd = useCallback(
    (value: number) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      onScrubEnd?.(value);
    },
    [onScrubEnd],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(maxOffset > 0)
        .activeOffsetX([-8, 8])
        .failOffsetY([-24, 24])
        .onStart(() => {
          isDragging.value = true;
          dragOrigin.value = offset.value;
          runOnJS(handleScrubStart)();
        })
        .onUpdate((event) => {
          offset.value = clamp(dragOrigin.value + event.translationX, 0, maxOffset);

          const now = Date.now();

          if (now - lastEmit.value >= SCRUB_THROTTLE_MS) {
            lastEmit.value = now;
            runOnJS(onScrub)((offset.value / maxOffset) * maxStartMs);
          }
        })
        .onFinalize(() => {
          isDragging.value = false;
          runOnJS(handleScrubEnd)((offset.value / maxOffset) * maxStartMs);
        }),
    [
      maxOffset,
      maxStartMs,
      offset,
      dragOrigin,
      isDragging,
      lastEmit,
      onScrub,
      handleScrubStart,
      handleScrubEnd,
    ],
  );

  const tapGesture = useMemo(
    () =>
      Gesture.Tap()
        .enabled(maxOffset > 0)
        .onEnd((event) => {
          const target = clamp(event.x - windowWidth / 2, 0, maxOffset);

          offset.value = withTiming(target, { duration: 180 });
          runOnJS(handleScrubEnd)((target / maxOffset) * maxStartMs);
        }),
    [maxOffset, maxStartMs, windowWidth, offset, handleScrubEnd],
  );

  const composedGesture = useMemo(
    () => Gesture.Exclusive(panGesture, tapGesture),
    [panGesture, tapGesture],
  );

  const windowStyle = useAnimatedStyle(() => ({
    width: windowWidth,
    transform: [{ translateX: offset.value }],
  }));

  const leftMaskStyle = useAnimatedStyle(() => ({
    width: offset.value,
  }));

  const rightMaskStyle = useAnimatedStyle(() => ({
    width: Math.max(0, trackWidth - offset.value - windowWidth),
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={{ height: TRACK_HEIGHT }}
        className="overflow-hidden rounded-lg border border-hairline bg-elevated"
      >
        <View className="absolute inset-0 flex-row">
          {frames.map((frame, index) => (
            <Image
              key={`${frame}-${index}`}
              source={{ uri: frame }}
              contentFit="cover"
              cachePolicy="memory-disk"
              style={{ flex: 1, height: '100%' }}
            />
          ))}
        </View>

        <Animated.View
          style={leftMaskStyle}
          className="absolute bottom-0 left-0 top-0 bg-canvas/70"
        />
        <Animated.View
          style={rightMaskStyle}
          className="absolute bottom-0 right-0 top-0 bg-canvas/70"
        />

        <Animated.View style={windowStyle} className="absolute bottom-0 left-0 top-0">
          <View className="h-full w-full flex-row items-center justify-between rounded-lg border-2 border-accent bg-accent/5">
            <View
              style={{ width: HANDLE_WIDTH }}
              className="h-full items-center justify-center rounded-l-md bg-accent"
            >
              <View className="h-5 w-[2px] rounded-full bg-ink/60" />
            </View>

            <View
              style={{ width: HANDLE_WIDTH }}
              className="h-full items-center justify-center rounded-r-md bg-accent"
            >
              <View className="h-5 w-[2px] rounded-full bg-ink/60" />
            </View>
          </View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}
