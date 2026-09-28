import { z } from 'zod';

import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@/constants/clip';

export const clipMetadataSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Give the clip a name of at least 2 characters.')
    .max(NAME_MAX_LENGTH, `Keep the name under ${NAME_MAX_LENGTH} characters.`),
  description: z
    .string()
    .trim()
    .max(
      DESCRIPTION_MAX_LENGTH,
      `Keep the description under ${DESCRIPTION_MAX_LENGTH} characters.`,
    ),
});

export type ClipMetadataInput = z.infer<typeof clipMetadataSchema>;

export const clipMetadataDefaults: ClipMetadataInput = {
  name: '',
  description: '',
};
