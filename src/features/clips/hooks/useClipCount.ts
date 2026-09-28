import { useQuery } from '@tanstack/react-query';

import { countClips } from '@/db/clipsRepository';
import { queryKeys } from '@/lib/query/keys';

export function useClipCount() {
  return useQuery({
    queryKey: queryKeys.clips.count(),
    queryFn: countClips,
  });
}
