import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { BottomBar } from '@/components/layout';
import { GradientText, Text } from '@/components/ui';

const ENTER_MS = 420;
const STAGGER_MS = 90;

function enterAt(order: number) {
  return FadeInUp.duration(ENTER_MS).delay(order * STAGGER_MS);
}

type OnboardingStepProps = {
  hero: ReactNode;
  title: string;
  titleGradient?: readonly string[];
  description: string;
  visual: ReactNode;
  action: ReactNode;
};

export function OnboardingStep({
  hero,
  title,
  titleGradient,
  description,
  visual,
  action,
}: OnboardingStepProps) {
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-gutter pb-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={enterAt(0)} style={{ alignItems: 'center' }}>
          {hero}
        </Animated.View>

        <Animated.View entering={enterAt(1)}>
          <View className="mt-6 items-center gap-3">
            {titleGradient ? (
              <GradientText variant="display" colors={titleGradient} accessibilityRole="header">
                {title}
              </GradientText>
            ) : (
              <Text variant="display" accessibilityRole="header" className="text-center">
                {title}
              </Text>
            )}

            <Text variant="body" tone="muted" className="max-w-[320px] text-center">
              {description}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={enterAt(2)} style={{ flex: 1, justifyContent: 'center' }}>
          <View className="py-8">{visual}</View>
        </Animated.View>
      </ScrollView>

      <BottomBar bordered={false}>{action}</BottomBar>
    </View>
  );
}
