import * as VideoThumbnails from 'expo-video-thumbnails';

type ThumbnailOptions = {
  timeMs?: number;
  quality?: number;
};

export async function generateThumbnail(
  sourceUri: string,
  { timeMs = 0, quality = 0.6 }: ThumbnailOptions = {},
): Promise<string | null> {
  try {
    const result = await VideoThumbnails.getThumbnailAsync(sourceUri, {
      time: Math.max(0, Math.round(timeMs)),
      quality,
    });

    return result.uri;
  } catch {
    return null;
  }
}

export async function generateFilmstrip(
  sourceUri: string,
  durationMs: number,
  frameCount: number,
): Promise<string[]> {
  if (durationMs <= 0 || frameCount <= 0) {
    return [];
  }

  const step = durationMs / frameCount;
  const offsets = Array.from({ length: frameCount }, (_, index) => index * step + step / 2);

  const frames = await Promise.all(
    offsets.map((offset) => generateThumbnail(sourceUri, { timeMs: offset, quality: 0.35 })),
  );

  return frames.filter((frame): frame is string => frame !== null);
}
