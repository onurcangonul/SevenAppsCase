import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { LIBRARY_PAGE_SIZE } from '@/constants/clip';
import { findClipPage } from '@/db/clipsRepository';
import { queryKeys } from '@/lib/query/keys';
import type { Clip, ClipCursor } from '@/types/clip';

export function useClipList() {
  const query = useInfiniteQuery({
    queryKey: queryKeys.clips.list(),
    queryFn: ({ pageParam }) => findClipPage(pageParam, LIBRARY_PAGE_SIZE),
    initialPageParam: null as ClipCursor | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const clips = useMemo<Clip[]>(
    () => query.data?.pages.flatMap((page) => page.items) ?? [],
    [query.data],
  );

  return { ...query, clips };
}
