import { View } from 'react-native';

import { Text } from './Text';

type BadgeProps = {
  label: string;
  tone?: 'neutral' | 'accent';
  className?: string;
};

export function Badge({ label, tone = 'neutral', className }: BadgeProps) {
  return (
    <View
      className={[
        'self-start rounded-md px-2 py-[3px]',
        tone === 'accent' ? 'bg-accent/15' : 'bg-ink/70',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Text variant="caption" tone={tone === 'accent' ? 'accent' : 'primary'} mono>
        {label}
      </Text>
    </View>
  );
}
