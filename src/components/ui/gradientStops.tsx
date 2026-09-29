import { Stop } from 'react-native-svg';

export function gradientStops(colors: readonly string[]) {
  return colors.map((color, index) => (
    <Stop
      key={`${color}-${index}`}
      offset={colors.length > 1 ? index / (colors.length - 1) : 0}
      stopColor={color}
    />
  ));
}
