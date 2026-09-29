import { View } from 'react-native';

import { Text } from './Text';

type Tone = 'neutral' | 'accent' | 'solid';

type BadgeProps = {
  label: string;
  tone?: Tone;
  className?: string;
};

const containerTones: Record<Tone, string> = {
  neutral: 'bg-ink/70',
  accent: 'bg-accent/15',
  solid: 'bg-accent',
};

const labelTones = {
  neutral: 'primary',
  accent: 'accent',
  solid: 'primary',
} as const;

export function Badge({ label, tone = 'neutral', className }: BadgeProps) {
  return (
    <View
      className={['self-start rounded-md px-2 py-[3px]', containerTones[tone], className]
        .filter(Boolean)
        .join(' ')}
    >
      <Text variant="caption" tone={labelTones[tone]} mono>
        {label}
      </Text>
    </View>
  );
}
