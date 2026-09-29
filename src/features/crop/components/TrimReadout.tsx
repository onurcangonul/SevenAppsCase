import { View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

import { Text, Timecode } from '@/components/ui';
import { CLIP_DURATION_MS } from '@/constants/clip';

import { selectStartMs, useCropDraftStore } from '../cropDraftStore';
import { PlayheadTimecode } from './PlayheadTimecode';

type TrimReadoutProps = {
  playheadMs: SharedValue<number>;
};

export function TrimReadout({ playheadMs }: TrimReadoutProps) {
  const startMs = useCropDraftStore(selectStartMs);

  return (
    <View className="flex-row items-center justify-between rounded-control border border-hairline bg-surface px-4 py-3">
      <View className="gap-1">
        <Text variant="caption" tone="faint" mono caps>
          In
        </Text>
        <Timecode milliseconds={startMs} tone="primary" />
      </View>

      <View className="items-center gap-1">
        <View className="flex-row items-center gap-1.5">
          <View className="h-2.5 w-[2px] rounded-full bg-playhead" />
          <Text variant="caption" tone="faint" mono caps>
            Playhead
          </Text>
        </View>
        <PlayheadTimecode positionMs={playheadMs} />
      </View>

      <View className="items-end gap-1">
        <Text variant="caption" tone="faint" mono caps>
          Out
        </Text>
        <Timecode milliseconds={startMs + CLIP_DURATION_MS} tone="primary" />
      </View>
    </View>
  );
}
