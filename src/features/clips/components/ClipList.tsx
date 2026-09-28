import type { ReactElement } from 'react';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { palette } from '@/theme/tokens';
import type { Clip } from '@/types/clip';

import { CLIP_CARD_HEIGHT, ClipListItem } from './ClipListItem';

type ClipListProps = {
  clips: Clip[];
  highlightedId: string | null;
  onSelect: (clip: Clip) => void;
  onEndReached: () => void;
  isFetchingNextPage: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  ListHeaderComponent?: ReactElement | null;
  ListEmptyComponent?: ReactElement | null;
};

const CARD_GAP = 12;
const ROW_STRIDE = CLIP_CARD_HEIGHT + CARD_GAP;

function CardGap() {
  return <View style={{ height: CARD_GAP }} />;
}

export function ClipList({
  clips,
  highlightedId,
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
      <ClipListItem
        clip={item}
        index={index}
        highlighted={item.id === highlightedId}
        onPress={onSelect}
      />
    ),
    [onSelect, highlightedId],
  );

  const keyExtractor = useCallback((item: Clip) => item.id, []);

  return (
    <FlatList
      data={clips}
      extraData={highlightedId}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={(_, index) => ({
        length: CLIP_CARD_HEIGHT,
        offset: ROW_STRIDE * index,
        index,
      })}
      ItemSeparatorComponent={CardGap}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-6">
            <ActivityIndicator color={palette.faint} />
          </View>
        ) : (
          <View className="h-6" />
        )
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={9}
      removeClippedSubviews
      contentContainerClassName="grow"
      showsVerticalScrollIndicator={false}
    />
  );
}
