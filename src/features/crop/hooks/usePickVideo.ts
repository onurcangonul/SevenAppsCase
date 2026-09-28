import * as ImagePicker from 'expo-image-picker';
import { useCallback, useState } from 'react';

import { MIN_SOURCE_DURATION_MS } from '@/constants/clip';
import { AppError, toAppError } from '@/lib/errors';

import type { CropSource } from '../cropDraftStore';

type PickState = {
  isPicking: boolean;
  error: AppError | null;
};

export function usePickVideo() {
  const [state, setState] = useState<PickState>({ isPicking: false, error: null });

  const pick = useCallback(async (): Promise<CropSource | null> => {
    setState({ isPicking: true, error: null });

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        throw new AppError('PERMISSION_DENIED', 'Media library permission was not granted.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (result.canceled) {
        setState({ isPicking: false, error: null });
        return null;
      }

      const asset = result.assets[0];

      if (!asset) {
        setState({ isPicking: false, error: null });
        return null;
      }

      const durationMs = asset.duration ?? 0;

      if (durationMs < MIN_SOURCE_DURATION_MS) {
        throw new AppError('SOURCE_TOO_SHORT', 'The selected video is shorter than five seconds.');
      }

      setState({ isPicking: false, error: null });

      return {
        uri: asset.uri,
        durationMs,
        width: asset.width,
        height: asset.height,
        fileName: asset.fileName ?? null,
      };
    } catch (error) {
      const appError = toAppError(error);
      setState({ isPicking: false, error: appError });

      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({ ...current, error: null }));
  }, []);

  return { pick, clearError, isPicking: state.isPicking, error: state.error };
}
