import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';

import { Button } from '@/components/ui';

type ContinueButtonProps = {
  href: Href;
};

export function ContinueButton({ href }: ContinueButtonProps) {
  const router = useRouter();

  return <Button label="Continue" variant="primaryAccent" onPress={() => router.push(href)} />;
}
