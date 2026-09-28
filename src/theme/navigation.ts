import { DarkTheme } from 'expo-router';
import type { Theme } from 'expo-router';

import { palette } from './tokens';

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: palette.accent,
    background: palette.canvas,
    card: palette.canvas,
    text: palette.chalk,
    border: palette.hairline,
    notification: palette.accent,
  },
};
