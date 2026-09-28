import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/feedback';
import { Screen } from '@/components/layout';
import { Button } from '@/components/ui';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <Screen>
      <EmptyState
        title="Nothing here"
        description="That screen does not exist in FiveSec."
        action={<Button label="Back to library" onPress={() => router.replace('/')} />}
      />
    </Screen>
  );
}
