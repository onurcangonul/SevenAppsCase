import type { VideoPlayer } from 'expo-video';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { CLIP_DURATION_MS } from '@/constants/clip';
import { msFromSeconds, secondsFromMs } from '@/lib/format';

import { isInsideWindow, resumePosition } from '../previewWindow';

const TIME_UPDATE_INTERVAL_S = 0.1;
const TICK_MS = msFromSeconds(TIME_UPDATE_INTERVAL_S);

type UseWindowPreviewOptions = {
  player: VideoPlayer | null;
  startMs: number;
};

export function useWindowPreview({ player, startMs }: UseWindowPreviewOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isResumable, setIsResumable] = useState(false);
  const positionMs = useSharedValue(0);
  const startRef = useRef(startMs);
  const lastPositionRef = useRef(0);

  useEffect(() => {
    startRef.current = startMs;
  }, [startMs]);

  const place = useCallback(
    (ms: number) => {
      lastPositionRef.current = ms;
      positionMs.value = ms;
    },
    [positionMs],
  );

  useEffect(() => {
    if (!player) {
      return;
    }

    const instance = player;
    instance.timeUpdateEventInterval = TIME_UPDATE_INTERVAL_S;

    const timeSubscription = instance.addListener('timeUpdate', ({ currentTime }) => {
      const windowStart = startRef.current;
      const current = msFromSeconds(currentTime);

      if (current >= windowStart + CLIP_DURATION_MS) {
        instance.pause();
        instance.currentTime = secondsFromMs(windowStart);
        place(windowStart);
        setIsResumable(false);
        return;
      }

      if (!instance.playing || current <= lastPositionRef.current) {
        return;
      }

      lastPositionRef.current = current;
      positionMs.value = withTiming(current, { duration: TICK_MS, easing: Easing.linear });
    });

    const playingSubscription = instance.addListener('playingChange', ({ isPlaying: playing }) => {
      setIsPlaying(playing);

      if (playing) {
        setIsResumable(false);
      }
    });

    return () => {
      timeSubscription.remove();
      playingSubscription.remove();
    };
  }, [player, positionMs, place]);

  const seekTo = useCallback(
    (ms: number) => {
      if (!player) {
        return;
      }

      const instance = player;
      instance.currentTime = secondsFromMs(ms);
      place(ms);
      setIsResumable(false);
    },
    [player, place],
  );

  const pause = useCallback(() => {
    if (!player?.playing) {
      return;
    }

    const instance = player;
    instance.pause();

    const current = msFromSeconds(instance.currentTime);
    place(current);
    setIsResumable(isInsideWindow(current, startRef.current));
  }, [player, place]);

  const toggle = useCallback(() => {
    if (!player) {
      return;
    }

    if (player.playing) {
      pause();
      return;
    }

    const instance = player;
    const current = msFromSeconds(instance.currentTime);
    const from = resumePosition(current, startMs);

    if (from !== current) {
      instance.currentTime = secondsFromMs(from);
      place(from);
    }

    instance.play();
  }, [player, startMs, pause, place]);

  return { isPlaying, isResumable, positionMs, toggle, pause, seekTo };
}
