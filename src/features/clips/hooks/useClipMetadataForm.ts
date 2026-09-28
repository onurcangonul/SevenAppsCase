import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { clipMetadataDefaults, clipMetadataSchema } from '../clipSchema';
import type { ClipMetadataInput } from '../clipSchema';

type UseClipMetadataFormOptions = {
  defaultValues?: ClipMetadataInput;
};

export function useClipMetadataForm({
  defaultValues = clipMetadataDefaults,
}: UseClipMetadataFormOptions = {}) {
  return useForm<ClipMetadataInput>({
    resolver: zodResolver(clipMetadataSchema),
    defaultValues,
    mode: 'onChange',
  });
}
