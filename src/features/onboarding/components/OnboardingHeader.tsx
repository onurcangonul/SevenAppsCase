import { View } from 'react-native';

import { Text, Touchable } from '@/components/ui';

import { OnboardingProgress } from './OnboardingProgress';

type OnboardingHeaderProps = {
  current: number;
  total: number;
  onSkip: () => void;
};

export function OnboardingHeader({ current, total, onSkip }: OnboardingHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-gutter py-3">
      <OnboardingProgress current={current} total={total} />

      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Skip the introduction"
        onPress={onSkip}
        className="h-9 flex-row items-center pl-4"
      >
        <Text variant="label" tone="muted">
          Skip
        </Text>
      </Touchable>
    </View>
  );
}
