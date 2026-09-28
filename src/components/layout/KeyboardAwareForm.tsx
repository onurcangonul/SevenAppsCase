import type { PropsWithChildren, ReactNode } from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView, KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_BAR_MIN_PADDING, BottomBar } from './BottomBar';

const FIELD_CLEARANCE = 16;
const FOOTER_PADDING_ABOVE_KEYBOARD = 12;

type KeyboardAwareFormProps = PropsWithChildren<{
  footer: ReactNode;
  contentContainerClassName?: string;
}>;

export function KeyboardAwareForm({
  children,
  footer,
  contentContainerClassName,
}: KeyboardAwareFormProps) {
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);

  const restingPadding = Math.max(insets.bottom, BOTTOM_BAR_MIN_PADDING);
  const footerDrop = restingPadding - FOOTER_PADDING_ABOVE_KEYBOARD;
  const visibleFooterHeight = footerHeight - footerDrop;

  return (
    <View className="flex-1">
      <KeyboardAwareScrollView
        bottomOffset={visibleFooterHeight + FIELD_CLEARANCE}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName={contentContainerClassName}
      >
        {children}
      </KeyboardAwareScrollView>

      <KeyboardStickyView offset={{ opened: footerDrop }}>
        <View onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}>
          <BottomBar>{footer}</BottomBar>
        </View>
      </KeyboardStickyView>
    </View>
  );
}
