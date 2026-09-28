import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { EmptyState, ErrorNotice, LoadingState } from '@/components/feedback';
import { BottomBar, Screen, ScreenHeader } from '@/components/layout';
import { Button, Text } from '@/components/ui';
import { ClipList } from '@/features/clips/components';
import { useClipCount } from '@/features/clips/hooks/useClipCount';
import { useClipList } from '@/features/clips/hooks/useClipList';
import { useCropDraftStore } from '@/features/crop/cropDraftStore';
import type { Clip } from '@/types/clip';

export default function LibraryScreen() {
  const router = useRouter();
  const reset = useCropDraftStore((state) => state.reset);

  const {
    clips,
    isPending,
    isError,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClipList();

  const { data: total } = useClipCount();

  const openClip = useCallback(
    (clip: Clip) => {
      router.push(`/clip/${clip.id}`);
    },
    [router],
  );

  const startCrop = useCallback(() => {
    reset();
    router.push('/crop');
  }, [reset, router]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const subtitle =
    total && total > 0 ? `${total} ${total === 1 ? 'clip' : 'clips'} in your diary` : undefined;

  return (
    <Screen edges={['top']}>
      <View className="flex-1">
        {isPending ? (
          <>
            <ScreenHeader eyebrow="FiveSec" title="Library" />
            <LoadingState label="Reading library" />
          </>
        ) : isError ? (
          <>
            <ScreenHeader eyebrow="FiveSec" title="Library" />
            <View className="px-gutter">
              <ErrorNotice error={error} onRetry={refetch} title="Library unavailable" />
            </View>
          </>
        ) : (
          <ClipList
            clips={clips}
            onSelect={openClip}
            onEndReached={loadMore}
            isFetchingNextPage={isFetchingNextPage}
            refreshing={isRefetching}
            onRefresh={refetch}
            ListHeaderComponent={
              <ScreenHeader
                eyebrow="FiveSec"
                title="Library"
                subtitle={subtitle}
                action={
                  clips.length > 0 ? (
                    <Text variant="caption" tone="faint" mono>
                      5s each
                    </Text>
                  ) : null
                }
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="No clips yet"
                description="Import a video, pick the five seconds worth keeping, and it lands here."
              />
            }
          />
        )}
      </View>

      <BottomBar>
        <Button label="New clip" onPress={startCrop} />
      </BottomBar>
    </Screen>
  );
}
