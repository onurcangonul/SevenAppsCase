import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { SparklesIcon, Text, Touchable } from '@/components/ui';
import { resolveErrorMessage } from '@/lib/errors';
import { palette } from '@/theme/tokens';
import type { ClipMetadata } from '@/types/clip';

import { useSuggestMetadata } from '../hooks/useSuggestMetadata';
import type { SuggestionSource } from '../suggestClipMetadata';

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
  const isBusy = suggestion.isPending;

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
      <Touchable
        accessibilityRole="button"
        accessibilityLabel="Fill the name and description with AI"
        accessibilityState={{ disabled: disabled || isBusy, busy: isBusy }}
        disabled={disabled || isBusy}
        onPress={suggest}
        className={[
          'flex-row items-center gap-3 rounded-control border border-accent/30 bg-accent/5 px-4 py-3 active:bg-accent/10',
          disabled ? 'opacity-40' : '',
        ].join(' ')}
      >
        <View className="h-9 w-9 items-center justify-center rounded-lg bg-accent">
          {isBusy ? (
            <ActivityIndicator size="small" color={palette.chalk} />
          ) : (
            <SparklesIcon size={19} color={palette.chalk} />
          )}
        </View>

        <View className="flex-1 gap-0.5">
          <Text variant="label">{isBusy ? 'Watching your clip…' : 'Fill with AI'}</Text>
          <Text variant="caption" tone="muted" numberOfLines={2}>
            {isBusy
              ? 'Reading frames from the selected five seconds.'
              : 'Suggests a name and description from what is in the frame.'}
          </Text>
        </View>
      </Touchable>

      {suggestion.isError ? (
        <Text variant="caption" tone="danger">
          {resolveErrorMessage(suggestion.error)}
        </Text>
      ) : null}
    </View>
  );
}
