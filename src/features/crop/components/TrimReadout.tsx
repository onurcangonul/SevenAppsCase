import { View } from 'react-native';

import { Text, Timecode } from '@/components/ui';
import { CLIP_DURATION_MS, CLIP_DURATION_SECONDS } from '@/constants/clip';

import { selectStartMs, useCropDraftStore } from '../cropDraftStore';

export function TrimReadout() {
  const startMs = useCropDraftStore(selectStartMs);

  return (
    <View className="flex-row items-center justify-between rounded-control border border-hairline bg-surface px-4 py-3">
      <View className="gap-1">
        <Text variant="caption" tone="faint" mono className="uppercase">
          In
        </Text>
        <Timecode milliseconds={startMs} tone="primary" />
      </View>

      <View className="items-center gap-1">
        <Text variant="caption" tone="faint" mono className="uppercase">
          Length
        </Text>
        <Text variant="caption" tone="accent" mono>
          {CLIP_DURATION_SECONDS}.00s
        </Text>
      </View>

      <View className="items-end gap-1">
        <Text variant="caption" tone="faint" mono className="uppercase">
          Out
        </Text>
        <Timecode milliseconds={startMs + CLIP_DURATION_MS} tone="primary" />
      </View>
    </View>
  );
}
