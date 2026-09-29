import { useMemo } from 'react';
import { View } from 'react-native';

import { ErrorNotice } from '@/components/feedback';
import { KeyboardAwareForm, ScreenHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Clip } from '@/types/clip';

import { useClipMetadataForm } from '../hooks/useClipMetadataForm';
import { useUpdateClip } from '../hooks/useUpdateClip';
import { ClipMetadataFields } from './ClipMetadataFields';
import { SuggestMetadataButton } from './SuggestMetadataButton';

type ClipEditFormProps = {
  clip: Clip;
  onSaved: (clip: Clip) => void;
};

export function ClipEditForm({ clip, onSaved }: ClipEditFormProps) {
  const updateClip = useUpdateClip();

  const { control, handleSubmit, formState, fill } = useClipMetadataForm({
    defaultValues: { name: clip.name, description: clip.description },
  });

  const suggestionSource = useMemo(() => ({ uri: clip.uri, startMs: 0 }), [clip.uri]);

  const submit = handleSubmit((values) => {
    updateClip.mutate({ id: clip.id, metadata: values }, { onSuccess: onSaved });
  });

  return (
    <KeyboardAwareForm
      contentContainerClassName="pb-8"
      footer={
        <Button
          label="Save changes"
          disabled={!formState.isValid || !formState.isDirty}
          loading={updateClip.isPending}
          onPress={submit}
        />
      }
    >
      <ScreenHeader
        eyebrow="Edit"
        title="Clip details"
        subtitle="Rename the clip or rewrite what it captures."
      />

      <View className="gap-5 px-gutter">
        <ClipMetadataFields control={control} />

        <SuggestMetadataButton
          source={suggestionSource}
          onSuggested={fill}
          disabled={updateClip.isPending}
        />

        {updateClip.isError ? (
          <ErrorNotice error={updateClip.error} title="Could not save" />
        ) : null}
      </View>
    </KeyboardAwareForm>
  );
}
