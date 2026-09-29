import { useMutation } from '@tanstack/react-query';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { secondsFromMs } from '@/lib/format';
import { createId } from '@/lib/id';
import { persistClipFile, persistThumbnailFile, removeClipFile } from '@/lib/media/clipStorage';
import { generateThumbnail } from '@/lib/media/thumbnails';
import { trimVideo } from '@/lib/media/trimmer';
import type { ClipMetadata, NewClip } from '@/types/clip';

type TrimClipVariables = {
  sourceUri: string;
  startMs: number;
  metadata: ClipMetadata;
};

async function exportClip({ sourceUri, startMs, metadata }: TrimClipVariables): Promise<NewClip> {
  const endMs = startMs + CLIP_DURATION_MS;

  const trimmed = await trimVideo({
    uri: sourceUri,
    start: secondsFromMs(startMs),
    end: secondsFromMs(endMs),
  });

  const id = createId();

  let persistedUri: string;

  try {
    persistedUri = await persistClipFile(trimmed.uri, id);
  } catch (error) {
    removeClipFile(trimmed.uri);
    throw error;
  }

  const cachedThumbnail = await generateThumbnail(persistedUri, { timeMs: 0 });
  const thumbnailUri = cachedThumbnail ? await persistThumbnailFile(cachedThumbnail, id) : null;

  return {
    id,
    name: metadata.name,
    description: metadata.description,
    uri: persistedUri,
    thumbnailUri,
    durationMs: CLIP_DURATION_MS,
    sourceStartMs: startMs,
  };
}

export function useTrimClip() {
  return useMutation<NewClip, unknown, TrimClipVariables>({
    mutationFn: exportClip,
  });
}
