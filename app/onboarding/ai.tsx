import { TwinklingSparkles } from '@/components/ui';
import { AiFillPreview, ContinueButton, OnboardingStep } from '@/features/onboarding/components';
import { aiGradient } from '@/theme/tokens';

export default function OnboardingAiScreen() {
  return (
    <OnboardingStep
      hero={<TwinklingSparkles size={48} gradient={aiGradient} />}
      title="Let AI fill it in"
      titleGradient={aiGradient}
      description="Stuck for words? AI looks at your frames and suggests a name and a description for you."
      visual={<AiFillPreview />}
      action={<ContinueButton href="/onboarding/library" />}
    />
  );
}
