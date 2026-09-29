import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { MIN_SOURCE_DURATION_MS } from '@/constants/clip';
import { AppError, toAppError } from '@/lib/errors';

import type { CropSource } from '../cropDraftStore';

export type SourceOrigin = 'library' | 'camera';

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['videos'],
  allowsMultipleSelection: false,
  quality: 1,
};

function toCropSource(asset: ImagePicker.ImagePickerAsset): CropSource {
  return {
    uri: asset.uri,
    durationMs: asset.duration ?? 0,
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName ?? null,
  };
}

async function launchPicker(origin: SourceOrigin): Promise<ImagePicker.ImagePickerResult> {
  if (origin === 'library') {
    return ImagePicker.launchImageLibraryAsync(pickerOptions);
  }

  try {
    return await ImagePicker.launchCameraAsync({ ...pickerOptions, videoMaxDuration: 60 });
  } catch (error) {
    throw new AppError('CAMERA_UNAVAILABLE', 'The camera could not be opened.', error);
  }
}

export function useVideoSource() {
  const [pending, setPending] = useState<SourceOrigin | null>(null);
  const [error, setError] = useState<AppError | null>(null);

  const run = useCallback(async (origin: SourceOrigin): Promise<CropSource | null> => {
    setPending(origin);
    setError(null);

    try {
      const permission =
        origin === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        throw new AppError(
          'PERMISSION_DENIED',
          origin === 'camera'
            ? 'FiveSec needs camera access to record a video.'
            : 'FiveSec needs library access to pick a video.',
        );
      }

      const result = await launchPicker(origin);

      if (result.canceled) {
        return null;
      }

      const asset = result.assets[0];

      if (!asset) {
        return null;
      }

      const source = toCropSource(asset);

      if (source.durationMs < MIN_SOURCE_DURATION_MS) {
        throw new AppError(
          'SOURCE_TOO_SHORT',
          origin === 'camera'
            ? 'That recording is shorter than five seconds.'
            : 'The selected video is shorter than five seconds.',
        );
      }

      return source;
    } catch (caught) {
      setError(toAppError(caught));
      return null;
    } finally {
      setPending(null);
    }
  }, []);

  const pickFromLibrary = useCallback(() => run('library'), [run]);
  const recordWithCamera = useCallback(() => run('camera'), [run]);
  const clearError = useCallback(() => setError(null), []);

  return { pickFromLibrary, recordWithCamera, clearError, pending, error };
}
