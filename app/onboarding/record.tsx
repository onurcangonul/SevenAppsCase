import { CameraIcon, IconBadge } from '@/components/ui';
import { ContinueButton, OnboardingStep, TrimPreview } from '@/features/onboarding/components';

export default function OnboardingRecordScreen() {
  return (
    <OnboardingStep
      hero={<IconBadge icon={CameraIcon} />}
      title="Capture five seconds"
      description="Record as long as you like, then pick the best five seconds on the trim screen."
      visual={<TrimPreview />}
      action={<ContinueButton href="/onboarding/describe" />}
    />
  );
}
