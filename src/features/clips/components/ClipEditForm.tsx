import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { ErrorNotice } from '@/components/feedback';
import { BottomBar, ScreenHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import type { Clip } from '@/types/clip';

import { useClipMetadataForm } from '../hooks/useClipMetadataForm';
import { useUpdateClip } from '../hooks/useUpdateClip';
import { ClipMetadataFields } from './ClipMetadataFields';

type ClipEditFormProps = {
  clip: Clip;
  onSaved: () => void;
};

export function ClipEditForm({ clip, onSaved }: ClipEditFormProps) {
  const updateClip = useUpdateClip();

  const { control, handleSubmit, formState } = useClipMetadataForm({
    defaultValues: { name: clip.name, description: clip.description },
  });

  const submit = handleSubmit((values) => {
    updateClip.mutate({ id: clip.id, metadata: values }, { onSuccess: onSaved });
  });

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          eyebrow="Edit"
          title="Clip details"
          subtitle="Rename the clip or rewrite what it captures."
        />

        <View className="gap-5 px-gutter">
          <ClipMetadataFields control={control} />

          {updateClip.isError ? (
            <ErrorNotice error={updateClip.error} title="Could not save" />
          ) : null}
        </View>
      </ScrollView>

      <BottomBar>
        <Button
          label="Save changes"
          disabled={!formState.isValid || !formState.isDirty}
          loading={updateClip.isPending}
          onPress={submit}
        />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}
