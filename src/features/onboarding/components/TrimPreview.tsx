import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Badge, Text, Timecode } from '@/components/ui';
import { CLIP_DURATION_MS, CLIP_DURATION_SECONDS } from '@/constants/clip';
import { clamp } from '@/lib/number';
import { palette } from '@/theme/tokens';

const SOURCE_LENGTH_MS = 18_000;
const WINDOW_RATIO = CLIP_DURATION_MS / SOURCE_LENGTH_MS;

const TRACK_HEIGHT = 56;
const TRACK_RADIUS = 10;
const TRACK_BORDER = 1;
const INNER_RADIUS = TRACK_RADIUS - TRACK_BORDER;

const WINDOW_BORDER = 2;
const HANDLE_WIDTH = 12;
const HANDLE_RADIUS = INNER_RADIUS - WINDOW_BORDER;

const PLAYHEAD_WIDTH = 2;
const PLAYHEAD_KNOB = 8;
const PLAYHEAD_INSET = WINDOW_BORDER + HANDLE_WIDTH + PLAYHEAD_KNOB / 2;

const MASK_COLOR = 'rgba(9, 9, 11, 0.72)';

const FRAMES = [
  ['#4A3036', '#17141A'],
  ['#34405A', '#141720'],
  ['#3C434B', '#18191D'],
  ['#5A3F24', '#1B1612'],
  ['#2A4D45', '#111A18'],
  ['#45355A', '#16121C'],
  ['#3A3A46', '#141418'],
  ['#553A30', '#1A1412'],
] as const;

const GLIDE_MS = 1800;
const PLAYHEAD_MS = 2400;
const REST_START = 0.12;
const REST_END = 0.8;
const PLAYHEAD_FADE = 0.08;

function Filmstrip() {
  const frameWidth = 100 / FRAMES.length;

  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
      <Defs>
        {FRAMES.map(([top, bottom], index) => (
          <LinearGradient key={index} id={`trimPreviewFrame${index}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={top} />
            <Stop offset="1" stopColor={bottom} />
          </LinearGradient>
        ))}
      </Defs>

      {FRAMES.map((_, index) => (
        <Rect
          key={index}
          x={`${index * frameWidth}%`}
          y={0}
          width={`${frameWidth}%`}
          height="100%"
          fill={`url(#trimPreviewFrame${index})`}
        />
      ))}
    </Svg>
  );
}

function WindowHandle({ side }: { side: 'left' | 'right' }) {
  const corners =
    side === 'left'
      ? { borderTopLeftRadius: HANDLE_RADIUS, borderBottomLeftRadius: HANDLE_RADIUS }
      : { borderTopRightRadius: HANDLE_RADIUS, borderBottomRightRadius: HANDLE_RADIUS };

  return (
    <View
      className="items-center justify-center bg-accent"
      style={{ width: HANDLE_WIDTH, ...corners }}
    >
      <View className="h-4 w-[2px] rounded-full bg-ink/60" />
    </View>
  );
}

export function TrimPreview() {
  const [trackWidth, setTrackWidth] = useState(0);
  const offset = useSharedValue(0);
  const playheadProgress = useSharedValue(0);

  const windowWidth = trackWidth * WINDOW_RATIO;
  const travel = Math.max(0, trackWidth - windowWidth);
  const playheadTravel = Math.max(0, windowWidth - PLAYHEAD_INSET * 2);

  useEffect(() => {
    if (travel <= 0) {
      return;
    }

    offset.value = REST_START * travel;
    offset.value = withRepeat(
      withTiming(REST_END * travel, {
        duration: GLIDE_MS,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true,
    );

    playheadProgress.value = withRepeat(
      withTiming(1, { duration: PLAYHEAD_MS, easing: Easing.linear }),
      -1,
      false,
    );
  }, [travel, offset, playheadProgress]);

  const windowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const leftMaskStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value + INNER_RADIUS - trackWidth }],
  }));

  const rightMaskStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value + windowWidth - INNER_RADIUS }],
  }));

  const playheadStyle = useAnimatedStyle(() => {
    const fadeIn = clamp(playheadProgress.value / PLAYHEAD_FADE, 0, 1);
    const fadeOut = clamp((1 - playheadProgress.value) / PLAYHEAD_FADE, 0, 1);

    return {
      opacity: Math.min(fadeIn, fadeOut),
      transform: [
        {
          translateX:
            offset.value +
            PLAYHEAD_INSET +
            playheadProgress.value * playheadTravel -
            PLAYHEAD_WIDTH / 2,
        },
      ],
    };
  });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-3 rounded-card border border-hairline bg-surface p-4"
    >
      <View className="flex-row items-center justify-between">
        <Text variant="caption" tone="faint" mono caps>
          Source length
        </Text>
        <Timecode milliseconds={SOURCE_LENGTH_MS} tone="faint" />
      </View>

      <View className="gap-2" onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
        {trackWidth > 0 ? (
          <>
            <Animated.View
              style={[
                { width: windowWidth, flexDirection: 'row', justifyContent: 'center' },
                windowStyle,
              ]}
            >
              <Badge label={`${CLIP_DURATION_SECONDS}s`} tone="solid" />
            </Animated.View>

            <View
              className="overflow-hidden border-hairline bg-elevated"
              style={{
                height: TRACK_HEIGHT,
                borderRadius: TRACK_RADIUS,
                borderWidth: TRACK_BORDER,
              }}
            >
              <Filmstrip />

              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: trackWidth,
                    backgroundColor: MASK_COLOR,
                  },
                  leftMaskStyle,
                ]}
              />
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: trackWidth,
                    backgroundColor: MASK_COLOR,
                  },
                  rightMaskStyle,
                ]}
              />

              <Animated.View
                style={[
                  { position: 'absolute', top: 0, bottom: 0, left: 0, width: windowWidth },
                  windowStyle,
                ]}
              >
                <View
                  className="flex-1 flex-row justify-between border-accent bg-accent/5"
                  style={{ borderWidth: WINDOW_BORDER, borderRadius: INNER_RADIUS }}
                >
                  <WindowHandle side="left" />
                  <WindowHandle side="right" />
                </View>
              </Animated.View>

              <Animated.View
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
                  playheadStyle,
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
          </>
        ) : null}
      </View>
    </View>
  );
}
