import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { resolveErrorMessage } from '@/lib/errors';
import type { ClipMetadata } from '@/types/clip';

import { useSuggestMetadata } from '../hooks/useSuggestMetadata';
import type { SuggestionSource } from '../suggestClipMetadata';
import { FillWithAiButton } from './FillWithAiButton';

type SuggestMetadataButtonProps = {
  source: SuggestionSource;
  onSuggested: (metadata: ClipMetadata) => void;
  disabled?: boolean;
};

export function SuggestMetadataButton({
  source,
  onSuggested,
  disabled = false,
}: SuggestMetadataButtonProps) {
  const suggestion = useSuggestMetadata();

  const suggest = useCallback(() => {
    suggestion.mutate(source, {
      onSuccess: (metadata) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        onSuggested(metadata);
      },
    });
  }, [suggestion, source, onSuggested]);

  return (
    <View className="gap-2">
      <FillWithAiButton onPress={suggest} busy={suggestion.isPending} disabled={disabled} />

      {suggestion.isError ? (
        <Text variant="caption" tone="danger">
          {resolveErrorMessage(suggestion.error)}
        </Text>
      ) : null}
    </View>
  );
}
