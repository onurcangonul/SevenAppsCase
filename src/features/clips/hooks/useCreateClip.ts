import { useMutation, useQueryClient } from '@tanstack/react-query';

import { insertClip } from '@/db/clipsRepository';
import { queryKeys } from '@/lib/query/keys';
import type { NewClip } from '@/types/clip';

export function useCreateClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clip: NewClip) => insertClip(clip),
    onSuccess: (clip) => {
      queryClient.setQueryData(queryKeys.clips.detail(clip.id), clip);

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.clips.list() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.clips.count() }),
      ]);
    },
  });
}
