import { useQuery } from '@tanstack/react-query';

import { TIMELINE_FRAME_COUNT } from '@/constants/clip';
import { generateFilmstrip } from '@/lib/media/thumbnails';
import { queryKeys } from '@/lib/query/keys';

export function useFilmstrip(uri: string | undefined, durationMs: number) {
  return useQuery({
    queryKey: queryKeys.filmstrip(uri ?? 'none', TIMELINE_FRAME_COUNT),
    enabled: Boolean(uri) && durationMs > 0,
    staleTime: Infinity,
    gcTime: 10 * 60_000,
    queryFn: () => generateFilmstrip(uri as string, durationMs, TIMELINE_FRAME_COUNT),
  });
}
