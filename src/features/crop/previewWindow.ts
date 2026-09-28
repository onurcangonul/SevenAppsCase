import { CLIP_DURATION_MS } from '@/constants/clip';

export const WINDOW_END_TOLERANCE_MS = 60;

export function isInsideWindow(positionMs: number, windowStartMs: number): boolean {
  return (
    positionMs > windowStartMs &&
    positionMs < windowStartMs + CLIP_DURATION_MS - WINDOW_END_TOLERANCE_MS
  );
}

export function resumePosition(positionMs: number, windowStartMs: number): number {
  return isInsideWindow(positionMs, windowStartMs) ? positionMs : windowStartMs;
}
