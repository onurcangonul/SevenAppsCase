import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateClipMetadata } from '@/db/clipsRepository';
import { queryKeys } from '@/lib/query/keys';
import type { ClipMetadata } from '@/types/clip';

type UpdateClipVariables = {
  id: string;
  metadata: ClipMetadata;
};

export function useUpdateClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, metadata }: UpdateClipVariables) => updateClipMetadata(id, metadata),
    onSuccess: (clip) => {
      queryClient.setQueryData(queryKeys.clips.detail(clip.id), clip);

      return queryClient.invalidateQueries({ queryKey: queryKeys.clips.list() });
    },
  });
}
