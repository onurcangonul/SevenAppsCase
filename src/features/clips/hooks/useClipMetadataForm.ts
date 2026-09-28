import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { clipMetadataDefaults, clipMetadataSchema } from '../clipSchema';
import type { ClipMetadataInput } from '../clipSchema';

type UseClipMetadataFormOptions = {
  defaultValues?: ClipMetadataInput;
};

const fillOptions = { shouldDirty: true, shouldTouch: true, shouldValidate: true } as const;

export function useClipMetadataForm({
  defaultValues = clipMetadataDefaults,
}: UseClipMetadataFormOptions = {}) {
  const form = useForm<ClipMetadataInput>({
    resolver: zodResolver(clipMetadataSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { setValue } = form;

  const fill = useCallback(
    (values: ClipMetadataInput) => {
      setValue('name', values.name, fillOptions);
      setValue('description', values.description, fillOptions);
    },
    [setValue],
  );

  return { ...form, fill };
}
