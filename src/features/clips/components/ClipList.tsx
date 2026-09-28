import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { Divider } from '@/components/ui';
import { palette } from '@/theme/tokens';
import type { Clip } from '@/types/clip';

import { CLIP_ROW_HEIGHT, ClipListItem } from './ClipListItem';

type ClipListProps = {
  clips: Clip[];
  onSelect: (clip: Clip) => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: ReactElement | null;
  ListEmptyComponent?: ReactElement | null;
};

const SEPARATOR_HEIGHT = 1;
const ROW_STRIDE = CLIP_ROW_HEIGHT + SEPARATOR_HEIGHT;

export function ClipList({
  clips,
  onSelect,
  onEndReached,
  isFetchingNextPage,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  ListEmptyComponent,
}: ClipListProps) {
  const renderItem = useCallback(
    ({ item, index }: { item: Clip; index: number }) => (
      <ClipListItem clip={item} index={index} onPress={onSelect} />
    ),
    [onSelect],
  );

  const keyExtractor = useCallback((item: Clip) => item.id, []);

  return (
    <FlatList
      data={clips}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={(_, index) => ({
        length: CLIP_ROW_HEIGHT,
        offset: ROW_STRIDE * index,
        index,
      })}
      ItemSeparatorComponent={() => <Divider className="ml-[148px]" />}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-6">
            <ActivityIndicator color={palette.faint} />
          </View>
        ) : (
          <View className="h-4" />
        )
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      windowSize={9}
      removeClippedSubviews
      contentContainerClassName="grow"
      showsVerticalScrollIndicator={false}
    />
  );
}
