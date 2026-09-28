import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { ErrorNotice, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/layout';
import { Button, Divider, Text, Timecode, Touchable } from '@/components/ui';
import { VideoPlayer } from '@/components/video';
import { useClip } from '@/features/clips/hooks/useClip';
import { useDeleteClip } from '@/features/clips/hooks/useDeleteClip';
import { formatDuration, formatRelativeDate } from '@/lib/format';

export default function ClipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: clip, isPending, isError, error, refetch } = useClip(id);
  const deleteClip = useDeleteClip();

  const confirmDelete = useCallback(() => {
    if (!clip) {
      return;
    }

    Alert.alert('Delete clip', `"${clip.name}" will be removed from your diary.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteClip.mutate(clip.id, {
            onSuccess: () => router.replace('/'),
          });
        },
      },
    ]);
  }, [clip, deleteClip, router]);

  return (
    <Screen edges={['top', 'bottom']}>
      <View className="flex-row items-center justify-between px-gutter py-3">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Back to library"
          onPress={() => router.back()}
          className="h-9 flex-row items-center pr-4"
        >
          <Text variant="label" tone="muted">
            Back
          </Text>
        </Touchable>

        {clip ? (
          <Touchable
            accessibilityRole="button"
            accessibilityLabel="Edit clip details"
            onPress={() => router.push(`/clip/${clip.id}/edit`)}
            className="h-9 flex-row items-center pl-4"
          >
            <Text variant="label" tone="accent">
              Edit
            </Text>
          </Touchable>
        ) : null}
      </View>

      {isPending ? (
        <LoadingState label="Opening clip" />
      ) : isError ? (
        <View className="px-gutter">
          <ErrorNotice error={error} onRetry={refetch} title="Clip unavailable" />
        </View>
      ) : (
        <ScrollView
          contentContainerClassName="pb-10"
          showsVerticalScrollIndicator={false}
          className="flex-1"
        >
          <View className="px-gutter">
            <VideoPlayer uri={clip.uri} className="aspect-video w-full" autoPlay loop />
          </View>

          <View className="gap-5 px-gutter pt-6">
            <View className="gap-2">
              <Text variant="title">{clip.name}</Text>

              <View className="flex-row items-center gap-3">
                <Text variant="caption" tone="accent" mono>
                  {formatDuration(clip.durationMs)}
                </Text>
                <View className="h-1 w-1 rounded-full bg-faint" />
                <Text variant="caption" tone="faint" mono>
                  {formatRelativeDate(clip.createdAt)}
                </Text>
              </View>
            </View>

            <Divider />

            <View className="gap-2">
              <Text variant="caption" tone="faint" mono className="uppercase">
                Description
              </Text>

              {clip.description ? (
                <Text variant="body" tone="muted">
                  {clip.description}
                </Text>
              ) : (
                <Text variant="body" tone="faint">
                  No description was added.
                </Text>
              )}
            </View>

            <Divider />

            <View className="flex-row items-center justify-between">
              <Text variant="caption" tone="faint" mono className="uppercase">
                Source in-point
              </Text>
              <Timecode milliseconds={clip.sourceStartMs} />
            </View>

            <View className="pt-2">
              <Button
                label="Delete clip"
                variant="danger"
                size="md"
                loading={deleteClip.isPending}
                onPress={confirmDelete}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}
