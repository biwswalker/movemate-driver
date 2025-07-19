import hexToRgba from "hex-to-rgba";
import React, { forwardRef, Fragment, ReactNode, Ref } from "react";
import { Pressable, StyleSheet } from "react-native";
import {
  TextInput as RNPTextInput,
  TextInputProps as RNPTextInputProps,
} from "react-native-paper";
import Text, { getFontVarient } from "./Text";
import Colors from "@constants/colors";

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flex: 1,
  },
  input: {
    backgroundColor: hexToRgba(Colors.grey[500], 0.08),
    borderRadius: 5,
    ...getFontVarient(),
  },
  inputInderline: {
    display: "none",
  },
  content: {
    color: Colors.text.primary,
  },
  helperText: {
    color: Colors.text.secondary,
    marginTop: 8,
    paddingLeft: 12,
  },
  helperTextError: {
    color: Colors.error.main,
  },
});

export interface TextInputProps extends RNPTextInputProps {
  helperText?: string | ((error: boolean) => ReactNode) | undefined;
}

export default forwardRef(function TextInput(
  { helperText, ...props }: TextInputProps,
  ref: Ref<any>
) {

  return (
    <Pressable
      onPress={props.disabled ? props.onPress : undefined}
      style={styles.container}
    >
      <RNPTextInput
        ref={ref}
        placeholderTextColor={Colors.text.disabled}
        activeUnderlineColor={Colors.text.disabled}
        style={[styles.input]}
        underlineStyle={styles.inputInderline}
        contentStyle={styles.content}
        theme={{
          colors: {
            onSurfaceDisabled: Colors.text.disabled,
            onSurfaceVariant: Colors.text.disabled,
            error: Colors.error.main,
          },
        }}
        {...props}
      />
      {typeof helperText === "string" ? (
        <Text
          varient="caption"
          style={[styles.helperText, props.error && styles.helperTextError]}
        >
          {helperText}
        </Text>
      ) : typeof helperText === "function" ? (
        helperText(props.error || false)
      ) : (
        <Fragment />
      )}
    </Pressable>
  );
});
