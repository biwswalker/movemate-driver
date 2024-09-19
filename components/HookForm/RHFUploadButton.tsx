import React from "react";
import UploadButton, { UploadButtonProps } from "@components/UploadButton";
import { useFormContext, Controller } from "react-hook-form";

interface Props extends UploadButtonProps {
  name: string;
}

export default function RHFUploadButton({ name, ...other }: Props) {
  const { control, setValue, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <UploadButton
          {...field}
          onFileChange={field.onChange}
          file={field.value}
          error={!!error}
          helperText={error?.message}
          onRemove={() => {
            setValue(name, undefined);
            clearErrors(name);
          }}
          {...other}
        />
      )}
    />
  );
}
