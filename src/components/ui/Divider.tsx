import { View } from 'react-native';

type DividerProps = {
  className?: string;
};

export function Divider({ className }: DividerProps) {
  return <View className={['h-px w-full bg-hairline', className].filter(Boolean).join(' ')} />;
}
