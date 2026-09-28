import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { ErrorNotice } from '@/components/feedback';
import { BottomBar, Screen, StepIndicator } from '@/components/layout';
import { Button, Text, Touchable } from '@/components/ui';
import { useCropDraftStore } from '@/features/crop/cropDraftStore';
import { useVideoSource } from '@/features/crop/hooks/useVideoSource';
import { isTrimmerAvailable } from '@/lib/media/trimmer';
import type { CropSource } from '@/features/crop/cropDraftStore';

export default function CropSourceScreen() {
  const router = useRouter();
  const setSource = useCropDraftStore((state) => state.setSource);
  const { pickFromLibrary, recordWithCamera, clearError, pending, error } = useVideoSource();

  const accept = useCallback(
    (source: CropSource | null) => {
      if (source) {
        setSource(source);
        router.push('/crop/trim');
      }
    },
    [setSource, router],
  );

  const chooseFromLibrary = useCallback(async () => {
    clearError();
    accept(await pickFromLibrary());
  }, [clearError, pickFromLibrary, accept]);

  const record = useCallback(async () => {
    clearError();
    accept(await recordWithCamera());
  }, [clearError, recordWithCamera, accept]);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-end px-gutter py-3">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.back()}
          className="h-9 flex-row items-center pl-4"
        >
          <Text variant="label" tone="muted">
            Close
          </Text>
        </Touchable>
      </View>

      <View className="flex-1 gap-8 px-gutter pt-2">
        <StepIndicator current={1} total={3} label="Source" />

        <View className="gap-3">
          <Text variant="display">Pick a video</Text>
          <Text variant="body" tone="muted">
            Choose something from your library or record a new one. It needs to run at least five
            seconds; you will mark the exact window on the next step.
          </Text>
        </View>

        {error ? <ErrorNotice error={error} title="Cannot use that video" /> : null}

        {!isTrimmerAvailable ? (
          <View className="gap-2 rounded-card border border-hairline bg-surface p-4">
            <Text variant="label" tone="accent">
              Running in Expo Go
            </Text>
            <Text variant="caption" tone="muted">
              Browsing and previewing work here. Exporting a clip needs the native trimmer, so run a
              development build when you want to save one.
            </Text>
          </View>
        ) : null}
      </View>

      <BottomBar>
        <View className="gap-3">
          <Button
            label="Choose from library"
            loading={pending === 'library'}
            disabled={pending !== null}
            onPress={chooseFromLibrary}
          />
          <Button
            label="Record a video"
            variant="secondary"
            loading={pending === 'camera'}
            disabled={pending !== null}
            onPress={record}
          />
        </View>
      </BottomBar>
    </Screen>
  );
}
