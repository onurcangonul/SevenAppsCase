import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';

type FrameOptions = {
  startMs: number;
  durationMs: number;
  count: number;
  maxSize: number;
};

async function captureFrame(uri: string, timeMs: number, maxSize: number): Promise<string> {
  const thumbnail = await VideoThumbnails.getThumbnailAsync(uri, {
    time: Math.max(0, Math.round(timeMs)),
    quality: 0.9,
  });

  const size =
    thumbnail.width >= thumbnail.height
      ? { width: Math.min(maxSize, thumbnail.width) }
      : { height: Math.min(maxSize, thumbnail.height) };

  const image = await ImageManipulator.manipulate(thumbnail.uri).resize(size).renderAsync();
  const result = await image.saveAsync({ base64: true, compress: 0.7, format: SaveFormat.JPEG });

  if (!result.base64) {
    throw new Error('The frame could not be encoded.');
  }

  return result.base64;
}

export function captureFrames(
  uri: string,
  { startMs, durationMs, count, maxSize }: FrameOptions,
): Promise<string[]> {
  const step = durationMs / count;

  return Promise.all(
    Array.from({ length: count }, (_, index) =>
      captureFrame(uri, startMs + step * index + step / 2, maxSize),
    ),
  );
}
