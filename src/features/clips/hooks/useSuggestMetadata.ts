import { useMutation } from '@tanstack/react-query';

import type { ClipMetadata } from '@/types/clip';

import { suggestClipMetadata } from '../suggestClipMetadata';
import type { SuggestionSource } from '../suggestClipMetadata';

export function useSuggestMetadata() {
  return useMutation<ClipMetadata, unknown, SuggestionSource>({
    mutationFn: suggestClipMetadata,
  });
}
