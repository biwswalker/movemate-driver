import TextInput, { TextInputProps } from "@/components/TextInput";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";

interface Props extends TextInputProps {
  name: string;
}

export default function RHFTextInput({ name, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, ...field }, fieldState: { error } }) => (
        <TextInput
          {...field}
          ref={ref}
          onChangeText={field.onChange}
          value={
            typeof field.value === "number" && field.value === 0
              ? ""
              : field.value
          }
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
