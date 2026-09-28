import { Pressable as RNPressable } from 'react-native';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

type TouchableProps = Omit<PressableProps, 'style'> & {
  className?: string;
  style?: StyleProp<ViewStyle>;
};

export function Touchable({ className, style, ...rest }: TouchableProps) {
  return <RNPressable className={className} style={style} {...rest} />;
}
