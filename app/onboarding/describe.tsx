import { IconBadge, PencilIcon } from '@/components/ui';
import { ContinueButton, DetailsPreview, OnboardingStep } from '@/features/onboarding/components';

export default function OnboardingDescribeScreen() {
  return (
    <OnboardingStep
      hero={<IconBadge icon={PencilIcon} />}
      title="Name it, describe it"
      description="Give every clip a name and a description, so you always remember what it was."
      visual={<DetailsPreview />}
      action={<ContinueButton href="/onboarding/ai" />}
    />
  );
}
