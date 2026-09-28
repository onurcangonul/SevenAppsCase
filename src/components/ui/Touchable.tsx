import { Pressable as RNPressable } from 'react-native';
import type { PressableProps } from 'react-native';

type TouchableProps = Omit<PressableProps, 'style'> & {
  className?: string;
};

export function Touchable({ className, ...rest }: TouchableProps) {
  return <RNPressable className={className} {...rest} />;
}
