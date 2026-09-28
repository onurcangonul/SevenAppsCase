import { ActivityIndicator, View } from 'react-native';

import { Text } from '@/components/ui';
import { palette } from '@/theme/tokens';

type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center gap-3 py-16">
      <ActivityIndicator color={palette.faint} />
      {label ? (
        <Text variant="caption" tone="faint" mono className="uppercase">
          {label}
        </Text>
      ) : null}
    </View>
  );
}
