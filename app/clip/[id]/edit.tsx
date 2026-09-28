import { useLocalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';

import { ErrorNotice, LoadingState } from '@/components/feedback';
import { Screen } from '@/components/layout';
import { Text, Touchable } from '@/components/ui';
import { ClipEditForm } from '@/features/clips/components';
import { useClip } from '@/features/clips/hooks/useClip';

export default function ClipEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: clip, isPending, isError, error, refetch } = useClip(id);

  return (
    <Screen edges={['top']}>
      <View className="flex-row items-center justify-end px-gutter py-3">
        <Touchable
          accessibilityRole="button"
          accessibilityLabel="Discard changes"
          onPress={() => router.back()}
          className="h-9 flex-row items-center pl-4"
        >
          <Text variant="label" tone="muted">
            Cancel
          </Text>
        </Touchable>
      </View>

      {isPending ? (
        <LoadingState label="Loading clip" />
      ) : isError ? (
        <View className="px-gutter">
          <ErrorNotice error={error} onRetry={refetch} title="Clip unavailable" />
        </View>
      ) : (
        <ClipEditForm clip={clip} onSaved={() => router.back()} />
      )}
    </Screen>
  );
}
