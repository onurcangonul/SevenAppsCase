import { ActivityIndicator, Pressable, View } from 'react-native';
import type { PressableProps } from 'react-native';

import { palette } from '@/theme/tokens';

import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
};

const containerStyles: Record<Variant, string> = {
  primary: 'bg-chalk active:bg-chalk/85',
  secondary: 'bg-elevated border border-hairline active:bg-hairline',
  ghost: 'bg-transparent active:bg-elevated',
  danger: 'bg-transparent border border-danger/40 active:bg-danger/10',
};

const labelTones = {
  primary: 'ink',
  secondary: 'primary',
  ghost: 'muted',
  danger: 'danger',
} as const;

const sizeStyles: Record<Size, string> = {
  md: 'h-11 px-4',
  lg: 'h-14 px-5',
};

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      className={[
        'flex-row items-center justify-center rounded-control',
        containerStyles[variant],
        sizeStyles[size],
        isDisabled ? 'opacity-40' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <View className="mr-2">
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? palette.ink : palette.chalk}
          />
        </View>
      ) : null}
      <Text variant="heading" tone={labelTones[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
