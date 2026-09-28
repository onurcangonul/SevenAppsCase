import { requireOptionalNativeModule } from 'expo';
import type { TrimVideoOptions, TrimVideoResult } from 'expo-trim-video';

import { AppError } from '../errors';

type TrimVideoNativeModule = {
  trimVideo: (options: TrimVideoOptions) => Promise<TrimVideoResult>;
};

const nativeTrimmer = requireOptionalNativeModule<TrimVideoNativeModule>('ExpoTrimVideo');

export const isTrimmerAvailable = nativeTrimmer !== null;

export async function trimVideo(options: TrimVideoOptions): Promise<TrimVideoResult> {
  if (!nativeTrimmer) {
    throw new AppError('TRIMMER_UNAVAILABLE', 'The native video trimmer is not linked.');
  }

  try {
    return await nativeTrimmer.trimVideo(options);
  } catch (error) {
    throw new AppError(
      'TRIM_FAILED',
      error instanceof Error ? error.message : 'Video trimming failed.',
      error,
    );
  }
}
