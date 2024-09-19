import SelectDropdown, { DropdownInputProps } from '@components/SelectDropdown';
import { get } from 'lodash';
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

interface Props<T = any> extends DropdownInputProps<T> {
  name: string;
}

export default function RHFSelectDropdown<T = any>({ name, onChanged, ...other }: Props<T>) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <SelectDropdown
          {...field}
          onChanged={
            typeof onChanged === 'function'
              ? onChanged
              : data => field.onChange(get(data, other.valueField, ''))
          }
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
