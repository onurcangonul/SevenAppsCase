import { useEffect, useState } from 'react';

type TypedTextOptions = {
  enabled?: boolean;
  startDelayMs?: number;
  charDelayMs?: number;
};

export function useTypedText(
  text: string,
  { enabled = true, startDelayMs = 0, charDelayMs = 45 }: TypedTextOptions = {},
) {
  const [length, setLength] = useState(0);
  const done = length >= text.length;

  useEffect(() => {
    if (!enabled || done) {
      return;
    }

    const timer = setTimeout(
      () => setLength((current) => current + 1),
      length === 0 ? startDelayMs : charDelayMs,
    );

    return () => clearTimeout(timer);
  }, [enabled, done, length, startDelayMs, charDelayMs]);

  return { value: text.slice(0, length), done, typing: enabled && length > 0 && !done };
}
