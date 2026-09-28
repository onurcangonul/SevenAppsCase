import { formatTimecode } from '@/lib/format';

import { Text } from './Text';

type TimecodeProps = {
  milliseconds: number;
  tone?: 'primary' | 'muted' | 'faint' | 'accent';
  className?: string;
};

export function Timecode({ milliseconds, tone = 'muted', className }: TimecodeProps) {
  return (
    <Text variant="caption" tone={tone} mono className={className}>
      {formatTimecode(milliseconds)}
    </Text>
  );
}
