const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function formatTimecode(milliseconds: number): string {
  const safe = Math.max(0, Math.round(milliseconds));
  const minutes = Math.floor(safe / MINUTE);
  const seconds = Math.floor((safe % MINUTE) / SECOND);
  const centiseconds = Math.floor((safe % SECOND) / 10);

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

export function formatDuration(milliseconds: number): string {
  const safe = Math.max(0, Math.round(milliseconds));
  const minutes = Math.floor(safe / MINUTE);
  const seconds = Math.floor((safe % MINUTE) / SECOND);

  return `${minutes}:${pad(seconds)}`;
}

export function formatRelativeDate(timestamp: number, now: number = Date.now()): string {
  const elapsed = now - timestamp;

  if (elapsed < MINUTE) {
    return 'Just now';
  }

  if (elapsed < HOUR) {
    const minutes = Math.floor(elapsed / MINUTE);
    return `${minutes}m ago`;
  }

  if (elapsed < DAY) {
    const hours = Math.floor(elapsed / HOUR);
    return `${hours}h ago`;
  }

  if (elapsed < 7 * DAY) {
    const days = Math.floor(elapsed / DAY);
    return `${days}d ago`;
  }

  return new Date(timestamp).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function secondsFromMs(milliseconds: number): number {
  return milliseconds / SECOND;
}

export function msFromSeconds(seconds: number): number {
  return seconds * SECOND;
}
