import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { BottomBar, Screen, StepIndicator } from '@/components/layout';
import { Button, PlaybackIcon, Text, Timecode, Touchable } from '@/components/ui';
import { VIDEO_ASPECT_RATIO } from '@/constants/clip';
import { PreviewControl, TrimReadout, TrimTimeline } from '@/features/crop/components';
import { selectSource, selectStartMs, useCropDraftStore } from '@/features/crop/cropDraftStore';
import { useFilmstrip } from '@/features/crop/hooks/useFilmstrip';
import { useWindowPreview } from '@/features/crop/hooks/useWindowPreview';
import { palette } from '@/theme/tokens';

export default function CropTrimScreen() {
  const router = useRouter();

  const source = useCropDraftStore(selectSource);
  const startMs = useCropDraftStore(selectStartMs);
  const setStartMs = useCropDraftStore((state) => state.setStartMs);

  const player = useVideoPlayer(source?.uri ?? null, (instance) => {
    instance.muted = false;
  });

  const { isPlaying, isResumable, positionMs, toggle, pause, seekTo } = useWindowPreview({
    player,
    startMs,
  });

  const { data: frames, isPending: framesPending } = useFilmstrip(
    source?.uri,
    source?.durationMs ?? 0,
  );

  useEffect(() => {
    if (!source) {
      router.replace('/crop');
    }
  }, [source, router]);

  const handleScrubStart = useCallback(() => {
    pause();
  }, [pause]);

  const handleScrubEnd = useCallback(
    (value: number) => {
      setStartMs(value);
      seekTo(value);
    },
    [setStartMs, seekTo],
  );

  if (!source) {
    return null;
  }

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-gutter py-3">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Back to source selection"
          onPress={() => router.back()}
          className="h-9 flex-row items-center pr-4"
        >
          <Text variant="label" tone="muted">
            Back
          </Text>
        </Touchable>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.dismissTo('/')}
          className="h-9 flex-row items-center pl-4"
        >
          <Text variant="label" tone="muted">
            Close
          </Text>
        </Touchable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-gutter pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <StepIndicator current={2} total={3} label="Window" />

        <View className="gap-2">
          <Text variant="title">Mark five seconds</Text>
          <Text variant="body" tone="muted">
            Drag the window along the strip, or tap where you want it to land.
          </Text>
        </View>

        <View className="gap-3">
          <Touchable
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause preview' : 'Play the preview'}
            onPress={toggle}
            className="w-full overflow-hidden rounded-card bg-black"
            style={{ aspectRatio: VIDEO_ASPECT_RATIO }}
          >
            <VideoView
              player={player}
              nativeControls={false}
              contentFit="contain"
              style={{ width: '100%', height: '100%' }}
            />

            {!isPlaying ? (
              <View className="absolute inset-0 items-center justify-center">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-canvas/65">
                  <PlaybackIcon playing={false} size={22} color={palette.chalk} />
                </View>
              </View>
            ) : null}
          </Touchable>

          <PreviewControl isPlaying={isPlaying} isResumable={isResumable} onToggle={toggle} />
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" tone="faint" mono caps>
              Source length
            </Text>
            <Timecode milliseconds={source.durationMs} tone="faint" />
          </View>

          {framesPending ? (
            <View className="h-[68px] items-center justify-center rounded-lg border border-hairline bg-elevated">
              <ActivityIndicator color={palette.faint} />
            </View>
          ) : (
            <TrimTimeline
              durationMs={source.durationMs}
              startMs={startMs}
              frames={frames ?? []}
              playheadMs={positionMs}
              showPlayhead={isPlaying || isResumable}
              onScrub={setStartMs}
              onScrubStart={handleScrubStart}
              onScrubEnd={handleScrubEnd}
            />
          )}

          <TrimReadout playheadMs={positionMs} />
        </View>
      </ScrollView>

      <BottomBar>
        <Button
          label="Add details"
          onPress={() => {
            pause();
            router.push('/crop/details');
          }}
        />
      </BottomBar>
    </Screen>
  );
}
