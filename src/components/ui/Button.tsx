import type { ComponentType } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import type { PressableProps } from 'react-native';

import { palette } from '@/theme/tokens';

import type { IconProps } from './icons';
import { Text } from './Text';

type Variant = 'primary' | 'primaryAccent' | 'accent' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ComponentType<IconProps>;
  className?: string;
};

const containerStyles: Record<Variant, string> = {
  primary: 'bg-chalk active:bg-chalk/85',
  primaryAccent: 'bg-chalk active:bg-chalk/85',
  accent: 'bg-accent active:bg-accent/85',
  secondary: 'bg-elevated border border-hairline active:bg-hairline',
  ghost: 'bg-transparent active:bg-elevated',
  danger: 'bg-transparent border border-danger/40 active:bg-danger/10',
};

const labelTones = {
  primary: 'ink',
  primaryAccent: 'accent',
  accent: 'primary',
  secondary: 'primary',
  ghost: 'muted',
  danger: 'danger',
} as const;

const contentColors: Record<Variant, string> = {
  primary: palette.ink,
  primaryAccent: palette.accent,
  accent: palette.chalk,
  secondary: palette.chalk,
  ghost: palette.muted,
  danger: palette.danger,
};

const sizeStyles: Record<Size, string> = {
  md: 'h-11 px-4',
  lg: 'h-14 px-5',
};

const iconSizes: Record<Size, number> = {
  md: 16,
  lg: 18,
};

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  icon: Icon,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const contentColor = contentColors[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: loading }}
      disabled={isDisabled}
      className={[
        'flex-row items-center justify-center gap-2.5 rounded-control',
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
        <ActivityIndicator size="small" color={contentColor} />
      ) : Icon ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Icon size={iconSizes[size]} color={contentColor} />
        </View>
      ) : null}
      <Text variant="heading" tone={labelTones[variant]}>
        {label}
      </Text>
    </Pressable>
  );
}
