import { View } from 'react-native';

import { Text } from '@/components/ui';
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@/constants/clip';

import { useBlink } from '../hooks/useBlink';
import { useTypedText } from '../hooks/useTypedText';

const SAMPLE_NAME = 'Sunset at the pier';
const SAMPLE_DESCRIPTION = 'Golden light on the water and the last ferry heading out.';
const NAME_START_MS = 700;
const DESCRIPTION_START_MS = 420;

type FieldPreviewProps = {
  label: string;
  value: string;
  maxLength: number;
  focused: boolean;
  caretVisible: boolean;
  multiline?: boolean;
};

function FieldPreview({
  label,
  value,
  maxLength,
  focused,
  caretVisible,
  multiline = false,
}: FieldPreviewProps) {
  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between">
        <Text variant="label" tone={focused ? 'primary' : 'muted'}>
          {label}
        </Text>
        <Text variant="caption" tone="faint" mono>
          {`${value.length}/${maxLength}`}
        </Text>
      </View>

      <View
        className={[
          'rounded-control border bg-surface px-4',
          focused ? 'border-muted' : 'border-hairline',
          multiline ? 'h-24 py-3' : 'h-12 justify-center',
        ].join(' ')}
      >
        <Text variant="body" numberOfLines={multiline ? 3 : 1}>
          {value}
          <Text className={focused && caretVisible ? 'text-accent' : 'text-transparent'}>|</Text>
        </Text>
      </View>
    </View>
  );
}

export function DetailsPreview() {
  const blinkOn = useBlink();
  const name = useTypedText(SAMPLE_NAME, { startDelayMs: NAME_START_MS });
  const description = useTypedText(SAMPLE_DESCRIPTION, {
    enabled: name.done,
    startDelayMs: DESCRIPTION_START_MS,
  });

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="gap-5"
    >
      <FieldPreview
        label="Name"
        value={name.value}
        maxLength={NAME_MAX_LENGTH}
        focused={!name.done}
        caretVisible={name.typing || blinkOn}
      />

      <FieldPreview
        label="Description"
        value={description.value}
        maxLength={DESCRIPTION_MAX_LENGTH}
        focused={name.done}
        caretVisible={description.typing || blinkOn}
        multiline
      />
    </View>
  );
}
