import { Text as RNText } from 'react-native';
import type { TextProps as RNTextProps } from 'react-native';

import { monoFamily } from '@/theme/typography';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'label' | 'caption';
type Tone = 'primary' | 'muted' | 'faint' | 'accent' | 'danger' | 'ink';

type TextProps = RNTextProps & {
  variant?: Variant;
  tone?: Tone;
  mono?: boolean;
};

const variantStyles: Record<Variant, string> = {
  display: 'text-[30px] leading-[36px] font-semibold tracking-tight',
  title: 'text-[22px] leading-[28px] font-semibold tracking-tight',
  heading: 'text-[16px] leading-[22px] font-semibold',
  body: 'text-[15px] leading-[22px]',
  label: 'text-[13px] leading-[18px] font-medium',
  caption: 'text-[12px] leading-[16px]',
};

const toneStyles: Record<Tone, string> = {
  primary: 'text-chalk',
  muted: 'text-muted',
  faint: 'text-faint',
  accent: 'text-accent',
  danger: 'text-danger',
  ink: 'text-ink',
};

export function Text({
  variant = 'body',
  tone = 'primary',
  mono = false,
  className,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      className={[variantStyles[variant], toneStyles[tone], className].filter(Boolean).join(' ')}
      style={[mono ? { fontFamily: monoFamily } : null, style]}
      {...rest}
    />
  );
}
