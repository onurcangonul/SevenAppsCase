import { ActivityIndicator, Modal, View } from 'react-native';

import { Text } from '@/components/ui';
import { palette } from '@/theme/tokens';

type ProgressOverlayProps = {
  visible: boolean;
  title: string;
  description?: string;
};

export function ProgressOverlay({ visible, title, description }: ProgressOverlayProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 items-center justify-center bg-canvas/85 px-gutter">
        <View className="w-full max-w-[300px] items-center gap-4 rounded-card border border-hairline bg-surface px-6 py-8">
          <ActivityIndicator color={palette.accent} />

          <Text variant="heading" className="text-center">
            {title}
          </Text>

          {description ? (
            <Text variant="caption" tone="muted" className="text-center">
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}
