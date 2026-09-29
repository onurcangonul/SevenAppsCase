import { BrandMark } from '@/components/ui';
import {
  ContinueButton,
  OnboardingStep,
  SourceOptionsPreview,
} from '@/features/onboarding/components';

export default function OnboardingWelcomeScreen() {
  return (
    <OnboardingStep
      hero={<BrandMark size={96} />}
      title="Your day, in 5 seconds"
      description="Every moment you capture turns into a short video diary."
      visual={<SourceOptionsPreview />}
      action={<ContinueButton href="/onboarding/record" />}
    />
  );
}
