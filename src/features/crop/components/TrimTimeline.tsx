import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { runOnJS } from 'react-native-worklets';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { clamp } from '@/lib/number';
import { palette } from '@/theme/tokens';

const TRACK_HEIGHT = 68;
const TRACK_BORDER = 1;
const TRACK_RADIUS = 10;
const INNER_RADIUS = TRACK_RADIUS - TRACK_BORDER;

const WINDOW_BORDER = 2;
const HANDLE_WIDTH = 14;
const HANDLE_RADIUS = INNER_RADIUS - WINDOW_BORDER;
const HANDLE_EDGE = WINDOW_BORDER + HANDLE_WIDTH;
const MIN_WINDOW_WIDTH = HANDLE_EDGE * 2 + 24;

const PLAYHEAD_WIDTH = 2;
const PLAYHEAD_KNOB = 8;
const PLAYHEAD_INSET = HANDLE_EDGE + PLAYHEAD_KNOB / 2;
const PLAYHEAD_FADE_OUT_MS = 90;
const PLAYHEAD_FADE_IN_MS = 200;
const PLAYHEAD_SETTLE_MS = 80;

const SCRUB_THROTTLE_MS = 55;
const TAP_MOVE_MS = 180;
const MASK_COLOR = 'rgba(9, 9, 11, 0.72)';

type TrimTimelineProps = {
  durationMs: number;
  startMs: number;
  frames: string[];
  playheadMs: SharedValue<number>;
  showPlayhead: boolean;
  onScrub: (startMs: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: (startMs: number) => void;
};

export function TrimTimeline({
  durationMs,
  startMs,
  frames,
  playheadMs,
  showPlayhead,
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
  const playheadTravel = Math.max(0, windowWidth - PLAYHEAD_INSET * 2);

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
          if (!isDragging.value) {
            return;
          }

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

          offset.value = withTiming(target, { duration: TAP_MOVE_MS });
          runOnJS(handleScrubEnd)((target / maxOffset) * maxStartMs);
        }),
    [maxOffset, maxStartMs, windowWidth, offset, handleScrubEnd],
  );

  const composedGesture = useMemo(
    () => Gesture.Exclusive(panGesture, tapGesture),
    [panGesture, tapGesture],
  );

  const windowStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: windowWidth,
    transform: [{ translateX: offset.value }],
  }));

  const leftMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: MASK_COLOR,
    width: offset.value + INNER_RADIUS,
  }));

  const rightMaskStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: MASK_COLOR,
    width: Math.max(0, trackWidth - offset.value - windowWidth + INNER_RADIUS),
  }));

  const playheadPositionStyle = useAnimatedStyle(() => {
    const progress = clamp((playheadMs.value - startMs) / CLIP_DURATION_MS, 0, 1);
    const x = offset.value + PLAYHEAD_INSET + progress * playheadTravel - PLAYHEAD_WIDTH / 2;

    return { transform: [{ translateX: x }] };
  });

  const playheadVisibilityStyle = useAnimatedStyle(() => {
    const visible = showPlayhead && !isDragging.value && playheadTravel > 0;

    return {
      opacity: visible
        ? withDelay(PLAYHEAD_SETTLE_MS, withTiming(1, { duration: PLAYHEAD_FADE_IN_MS }))
        : withTiming(0, { duration: PLAYHEAD_FADE_OUT_MS }),
    };
  });

  return (
    <View
      className="overflow-hidden border-hairline bg-elevated"
      style={{ height: TRACK_HEIGHT, borderRadius: TRACK_RADIUS, borderWidth: TRACK_BORDER }}
    >
      <GestureDetector gesture={composedGesture}>
        <View
          className="flex-1"
          onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
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

          <Animated.View style={leftMaskStyle} />
          <Animated.View style={rightMaskStyle} />

          <Animated.View style={windowStyle}>
            <View
              className="flex-1 flex-row justify-between border-accent bg-accent/5"
              style={{ borderWidth: WINDOW_BORDER, borderRadius: INNER_RADIUS }}
            >
              <View
                className="items-center justify-center bg-accent"
                style={{
                  width: HANDLE_WIDTH,
                  borderTopLeftRadius: HANDLE_RADIUS,
                  borderBottomLeftRadius: HANDLE_RADIUS,
                }}
              >
                <View className="h-5 w-[2px] rounded-full bg-ink/60" />
              </View>

              <View
                className="items-center justify-center bg-accent"
                style={{
                  width: HANDLE_WIDTH,
                  borderTopRightRadius: HANDLE_RADIUS,
                  borderBottomRightRadius: HANDLE_RADIUS,
                }}
              >
                <View className="h-5 w-[2px] rounded-full bg-ink/60" />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: WINDOW_BORDER,
                bottom: WINDOW_BORDER,
                left: 0,
                width: PLAYHEAD_WIDTH,
                alignItems: 'center',
                borderRadius: PLAYHEAD_WIDTH / 2,
                backgroundColor: palette.playhead,
              },
              playheadPositionStyle,
              playheadVisibilityStyle,
            ]}
          >
            <View
              style={{
                width: PLAYHEAD_KNOB,
                height: PLAYHEAD_KNOB,
                borderRadius: PLAYHEAD_KNOB / 2,
                backgroundColor: palette.playhead,
              }}
            />
          </Animated.View>
        </View>
      </GestureDetector>
    </View>
  );
}
