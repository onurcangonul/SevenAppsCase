export function clamp(value: number, min: number, max: number): number {
  'worklet';

  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function toFixedNumber(value: number, digits: number): number {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
}
