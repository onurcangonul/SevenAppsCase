import { useRef } from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { View } from 'react-native';
import type { TextInput } from 'react-native';

import { TextField } from '@/components/ui';
import { DESCRIPTION_MAX_LENGTH, NAME_MAX_LENGTH } from '@/constants/clip';

import type { ClipMetadataInput } from '../clipSchema';

type ClipMetadataFieldsProps = {
  control: Control<ClipMetadataInput>;
  onSubmitEditing?: () => void;
};

export function ClipMetadataFields({ control, onSubmitEditing }: ClipMetadataFieldsProps) {
  const descriptionRef = useRef<TextInput | null>(null);

  return (
    <View className="gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            ref={field.ref}
            label="Name"
            placeholder="Morning run, take two"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint={`${field.value.length}/${NAME_MAX_LENGTH}`}
            maxLength={NAME_MAX_LENGTH}
            autoCapitalize="sentences"
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => descriptionRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field, fieldState }) => (
          <TextField
            ref={(node) => {
              field.ref(node);
              descriptionRef.current = node;
            }}
            label="Description"
            placeholder="What is worth remembering about these five seconds?"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
            hint={`${field.value.length}/${DESCRIPTION_MAX_LENGTH}`}
            maxLength={DESCRIPTION_MAX_LENGTH}
            autoCapitalize="sentences"
            onSubmitEditing={onSubmitEditing}
            multiline
          />
        )}
      />
    </View>
  );
}
