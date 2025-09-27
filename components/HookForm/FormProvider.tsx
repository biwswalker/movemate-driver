import React, { FormEventHandler } from "react";
import { FormProvider as RHForm, UseFormReturn } from "react-hook-form";
import { StyleProp, ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: FormEventHandler;
  containerStyle?: StyleProp<ViewStyle>;
  extraScrollHeight?: number
};

export default function FormProvider({
  children,
  methods,
  containerStyle,
  extraScrollHeight = 0
}: Props) {
  return (
    <KeyboardAwareScrollView
      style={containerStyle}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      enableAutomaticScroll
      // extraHeight={extraScrollHeight}
      extraScrollHeight={extraScrollHeight}
    >
      <RHForm {...methods}>{children}</RHForm>
    </KeyboardAwareScrollView>
  );
}
