import { forwardRef, useState } from 'react';
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

function borderClass(focused: boolean, hasError: boolean): string {
  if (hasError) {
    return 'border-danger/60';
  }

  return focused ? 'border-muted' : 'border-hairline';
}

export const TextField = forwardRef<TextInputType, TextFieldProps>(function TextField(
  { label, error, hint, multiline = false, onFocus, onBlur, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="gap-2">
      <View className="flex-row items-baseline justify-between">
        <Text variant="label" tone={focused ? 'primary' : 'muted'}>
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
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={[
          'rounded-control border px-4 text-[15px] text-chalk',
          borderClass(focused, Boolean(error)),
          focused ? 'bg-elevated' : 'bg-surface',
          multiline ? 'h-28 py-3 leading-[22px]' : 'h-12',
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
