import { useRouter } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { ErrorNotice, ProgressOverlay } from '@/components/feedback';
import { BottomBar, Screen, StepIndicator } from '@/components/layout';
import { Button, Text, Timecode, Touchable } from '@/components/ui';
import { ClipMetadataFields } from '@/features/clips/components';
import { useClipMetadataForm } from '@/features/clips/hooks/useClipMetadataForm';
import { useCreateClip } from '@/features/clips/hooks/useCreateClip';
import { selectSource, selectStartMs, useCropDraftStore } from '@/features/crop/cropDraftStore';
import { useTrimClip } from '@/features/crop/hooks/useTrimClip';
import { CLIP_DURATION_MS } from '@/constants/clip';

export default function CropDetailsScreen() {
  const router = useRouter();

  const source = useCropDraftStore(selectSource);
  const startMs = useCropDraftStore(selectStartMs);
  const reset = useCropDraftStore((state) => state.reset);

  const { control, handleSubmit, formState } = useClipMetadataForm();

  const trimClip = useTrimClip();
  const createClip = useCreateClip();

  const isExporting = trimClip.isPending || createClip.isPending;

  useEffect(() => {
    if (!source) {
      router.replace('/crop');
    }
  }, [source, router]);

  const submit = handleSubmit(async (values) => {
    if (!source) {
      return;
    }

    const draft = await trimClip.mutateAsync({
      sourceUri: source.uri,
      startMs,
      metadata: values,
    });

    const clip = await createClip.mutateAsync(draft);

    reset();
    router.dismissAll();
    router.push(`/clip/${clip.id}`);
  });

  const handleSubmitPress = useCallback(() => {
    submit().catch(() => undefined);
  }, [submit]);

  if (!source) {
    return null;
  }

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-between px-gutter py-3">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Back to the trim window"
          onPress={() => router.back()}
          disabled={isExporting}
          className="h-9 flex-row items-center pr-4"
        >
          <Text variant="label" tone="muted">
            Back
          </Text>
        </Touchable>

        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={() => router.dismissAll()}
          disabled={isExporting}
          className="h-9 flex-row items-center pl-4"
        >
          <Text variant="label" tone="muted">
            Close
          </Text>
        </Touchable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8 px-gutter pt-2">
            <StepIndicator current={3} total={3} label="Details" />

            <View className="gap-2">
              <Text variant="title">Name the clip</Text>
              <Text variant="body" tone="muted">
                These details show up in your library and on the clip page.
              </Text>
            </View>

            <View className="flex-row items-center justify-between rounded-control border border-hairline bg-surface px-4 py-3">
              <Text variant="caption" tone="faint" mono className="uppercase">
                Selection
              </Text>

              <View className="flex-row items-center gap-2">
                <Timecode milliseconds={startMs} tone="primary" />
                <Text variant="caption" tone="faint" mono>
                  to
                </Text>
                <Timecode milliseconds={startMs + CLIP_DURATION_MS} tone="primary" />
              </View>
            </View>

            <ClipMetadataFields control={control} onSubmitEditing={handleSubmitPress} />

            {trimClip.isError ? <ErrorNotice error={trimClip.error} title="Export failed" /> : null}

            {createClip.isError ? (
              <ErrorNotice error={createClip.error} title="Could not save the clip" />
            ) : null}
          </View>
        </ScrollView>

        <BottomBar>
          <Button
            label="Crop and save"
            disabled={!formState.isValid}
            loading={isExporting}
            onPress={handleSubmitPress}
          />
        </BottomBar>
      </KeyboardAvoidingView>

      <ProgressOverlay
        visible={isExporting}
        title="Cutting your clip"
        description="Trimming five seconds and writing it to storage."
      />
    </Screen>
  );
}
