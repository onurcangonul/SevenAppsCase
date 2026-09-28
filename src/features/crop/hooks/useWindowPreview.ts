import type { VideoPlayer } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { secondsFromMs } from '@/lib/format';

type UseWindowPreviewOptions = {
  player: VideoPlayer | null;
  startMs: number;
};

export function useWindowPreview({ player, startMs }: UseWindowPreviewOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const startRef = useRef(startMs);

  useEffect(() => {
    startRef.current = startMs;
  }, [startMs]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const instance = player;

    const subscription = instance.addListener('timeUpdate', ({ currentTime }) => {
      const endSeconds = secondsFromMs(startRef.current + CLIP_DURATION_MS);

      if (currentTime >= endSeconds) {
        instance.pause();
        instance.currentTime = secondsFromMs(startRef.current);
      }
    });

    return () => subscription.remove();
  }, [player]);

  useEffect(() => {
    if (!player) {
      return;
    }

    const subscription = player.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing);
    });

    return () => subscription.remove();
  }, [player]);

  const seekTo = useCallback(
    (ms: number) => {
      if (!player) {
        return;
      }

      const instance = player;
      instance.currentTime = secondsFromMs(ms);
    },
    [player],
  );

  const toggle = useCallback(() => {
    if (!player) {
      return;
    }

    const instance = player;

    if (instance.playing) {
      instance.pause();
      return;
    }

    instance.currentTime = secondsFromMs(startMs);
    instance.play();
  }, [player, startMs]);

  const pause = useCallback(() => {
    player?.pause();
  }, [player]);

  return { isPlaying, toggle, pause, seekTo };
}
