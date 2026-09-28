import { forwardRef } from 'react';
import { TextInput, View } from 'react-native';
import type { TextInput as TextInputType, TextInputProps } from 'react-native';

import { palette } from '@/theme/tokens';

import { Text } from './Text';

type TextFieldProps = Omit<TextInputProps, 'className' | 'placeholderTextColor'> & {
  label: string;
  error?: string;
  hint?: string;
  multiline?: boolean;
};

export const TextField = forwardRef<TextInputType, TextFieldProps>(function TextField(
  { label, error, hint, multiline = false, ...rest },
  ref,
) {
  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between">
        <Text variant="label" tone="muted">
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" tone="faint" mono>
            {hint}
          </Text>
        ) : null}
      </View>

      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor={palette.faint}
        selectionColor={palette.accent}
        textAlignVertical={multiline ? 'top' : 'center'}
        className={[
          'rounded-control border bg-surface px-4 text-[15px] leading-[22px] text-chalk',
          error ? 'border-danger/60' : 'border-hairline',
          multiline ? 'h-28 py-3' : 'h-12',
        ].join(' ')}
        {...rest}
      />

      {error ? (
        <Text variant="caption" tone="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
});
