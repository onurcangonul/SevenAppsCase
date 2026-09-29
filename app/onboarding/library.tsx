import { View } from 'react-native';

import { ErrorNotice } from '@/components/feedback';
import { Button, CameraIcon, Wordmark } from '@/components/ui';
import { LibraryPreview, OnboardingStep } from '@/features/onboarding/components';
import { useRecordFirstClip } from '@/features/onboarding/hooks/useRecordFirstClip';

export default function OnboardingLibraryScreen() {
  const { recordFirstClip, isRecording, error } = useRecordFirstClip();

  return (
    <OnboardingStep
      hero={<Wordmark />}
      title="Everything in one place"
      description="All your clips live in your library, in order, like the pages of a diary."
      visual={
        <View className="gap-5">
          <LibraryPreview />
          {error ? <ErrorNotice error={error} title="Cannot record yet" /> : null}
        </View>
      }
      action={
        <Button
          label="Record your first clip"
          variant="accent"
          icon={CameraIcon}
          loading={isRecording}
          onPress={recordFirstClip}
        />
      }
    />
  );
}
