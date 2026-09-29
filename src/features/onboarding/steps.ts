export const ONBOARDING_ROUTES = [
  '/onboarding',
  '/onboarding/record',
  '/onboarding/describe',
  '/onboarding/ai',
  '/onboarding/library',
] as const;

export function onboardingStepIndex(pathname: string): number {
  return Math.max(
    0,
    ONBOARDING_ROUTES.findIndex((route) => route === pathname),
  );
}
