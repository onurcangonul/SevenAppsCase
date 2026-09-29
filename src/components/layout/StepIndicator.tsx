import { View } from 'react-native';

import { Text } from '@/components/ui';

type StepIndicatorProps = {
  current: number;
  total: number;
  label: string;
};

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function StepIndicator({ current, total, label }: StepIndicatorProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <Text variant="caption" tone="accent" mono>
          {pad(current)}
        </Text>
        <Text variant="caption" tone="faint" mono>
          / {pad(total)}
        </Text>
        <Text variant="caption" tone="faint" mono caps>
          {label}
        </Text>
      </View>

      <View className="flex-row gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <View
            key={index}
            className={[
              'h-[3px] flex-1 rounded-full',
              index < current ? 'bg-accent' : 'bg-hairline',
            ].join(' ')}
          />
        ))}
      </View>
    </View>
  );
}
