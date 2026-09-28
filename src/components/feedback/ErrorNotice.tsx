import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { resolveErrorMessage } from '@/lib/errors';

type ErrorNoticeProps = {
  error: unknown;
  onRetry?: () => void;
  title?: string;
};

export function ErrorNotice({ error, onRetry, title = 'Something broke' }: ErrorNoticeProps) {
  return (
    <View className="gap-3 rounded-card border border-danger/30 bg-danger/5 p-4">
      <Text variant="label" tone="danger">
        {title}
      </Text>

      <Text variant="body" tone="muted">
        {resolveErrorMessage(error)}
      </Text>

      {onRetry ? (
        <Button label="Try again" variant="secondary" size="md" onPress={onRetry} />
      ) : null}
    </View>
  );
}
