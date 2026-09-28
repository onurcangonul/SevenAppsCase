import { useQuery } from '@tanstack/react-query';

import { findClipById } from '@/db/clipsRepository';
import { AppError } from '@/lib/errors';
import { queryKeys } from '@/lib/query/keys';

export function useClip(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.clips.detail(id ?? 'unknown'),
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new AppError('CLIP_NOT_FOUND', 'No clip id was provided.');
      }

      const clip = await findClipById(id);

      if (!clip) {
        throw new AppError('CLIP_NOT_FOUND', 'The clip no longer exists.');
      }

      return clip;
    },
  });
}
