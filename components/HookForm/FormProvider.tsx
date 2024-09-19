import React, { FormEventHandler } from "react";
import { FormProvider as RHForm, UseFormReturn } from "react-hook-form";
import { StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: FormEventHandler;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function FormProvider({
  children,
  methods,
  containerStyle,
}: Props) {
  return (
    <KeyboardAwareScrollView style={containerStyle}>
      <RHForm {...methods}>{children}</RHForm>
    </KeyboardAwareScrollView>
  );
}
