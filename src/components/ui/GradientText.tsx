import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { AccessibilityRole, LayoutRectangle } from 'react-native';
import Svg, { Defs, LinearGradient, Text as SvgText } from 'react-native-svg';

import { gradientStops } from './gradientStops';
import { Text } from './Text';

type Variant = 'display' | 'heading';

const fontSizes: Record<Variant, number> = {
  display: 30,
  heading: 16,
};

const letterSpacings: Record<Variant, number> = {
  display: -0.75,
  heading: 0,
};

const BASELINE_RATIO = 0.36;
const GRADIENT_ID = 'gradientText';

type GradientTextProps = {
  children: string;
  colors: readonly string[];
  variant?: Variant;
  accessibilityRole?: AccessibilityRole;
};

export function GradientText({
  children,
  colors,
  variant = 'heading',
  accessibilityRole,
}: GradientTextProps) {
  const [box, setBox] = useState<LayoutRectangle | null>(null);
  const fontSize = fontSizes[variant];

  return (
    <View accessible accessibilityRole={accessibilityRole} accessibilityLabel={children}>
      <Text
        variant={variant}
        importantForAccessibility="no"
        style={{ opacity: 0 }}
        onLayout={(event) => setBox(event.nativeEvent.layout)}
      >
        {children}
      </Text>

      {box ? (
        <Svg style={StyleSheet.absoluteFill} width={box.width} height={box.height}>
          <Defs>
            <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
              {gradientStops(colors)}
            </LinearGradient>
          </Defs>

          <SvgText
            x={box.width / 2}
            y={box.height / 2}
            dy={fontSize * BASELINE_RATIO}
            textAnchor="middle"
            fontSize={fontSize}
            fontWeight="600"
            letterSpacing={letterSpacings[variant]}
            fill={`url(#${GRADIENT_ID})`}
          >
            {children}
          </SvgText>
        </Svg>
      ) : null}
    </View>
  );
}
