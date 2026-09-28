import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteClipById } from '@/db/clipsRepository';
import { removeClipFile } from '@/lib/media/clipStorage';
import { queryKeys } from '@/lib/query/keys';

export function useDeleteClip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const clip = await deleteClipById(id);

      if (clip) {
        removeClipFile(clip.uri);

        if (clip.thumbnailUri) {
          removeClipFile(clip.thumbnailUri);
        }
      }

      return clip;
    },
    onSuccess: (clip) => {
      if (clip) {
        queryClient.removeQueries({ queryKey: queryKeys.clips.detail(clip.id) });
      }

      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.clips.list() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.clips.count() }),
      ]);
    },
  });
}
