import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import Text from "./Text";
import { normalize, normBaseW } from "@utils/normalizeSize";
import colors from "@constants/colors";

interface OTPInputProps {
  code: string;
  style?: StyleProp<ViewStyle>;
  maxLength?: number;
  setPinReady?: (state: boolean) => void;
  onChangeText: (code: string, ready?: boolean) => void;
}

const DEFAULT_CODE_LENGTH = 4;
export default function OTPInput({
  setPinReady = () => {},
  code,
  style = {},
  onChangeText,
  maxLength = DEFAULT_CODE_LENGTH,
}: OTPInputProps) {
  const [inputContainerIsFocused, setInputContainerFocused] = useState(false);
  const codeDigitsArray = new Array(maxLength).fill(0);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code, maxLength, setPinReady]);

  useEffect(() => {
    if (code.length === maxLength) {
      Keyboard.dismiss();
    }
  }, [code, maxLength]);

  function handleOnPresses() {
    setInputContainerFocused(true);
    if (textInputRef?.current) {
      textInputRef.current.focus();
    }
  }

  function handleOnBlur() {
    setInputContainerFocused(false);
  }

  function toCodeDigitInput(_value: string, index: number) {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;

    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <View
        style={[
          styles.otpInput,
          inputContainerIsFocused && isDigitFocused && styles.otpInputFocus,
        ]}
        key={index}
      >
        <Text varient="h5">{digit}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.section, style]}>
      <Pressable style={styles.pressesable} onPress={handleOnPresses}>
        {codeDigitsArray.map(toCodeDigitInput)}
      </Pressable>
      <TextInput
        ref={textInputRef}
        style={styles.hiddenTextInput}
        value={code}
        onChangeText={(text) => {
          const isReady = text.length === maxLength;
          onChangeText(text, isReady);
        }}
        onBlur={handleOnBlur}
        maxLength={maxLength}
        keyboardType="number-pad"
        returnKeyType="done"
        textContentType="oneTimeCode"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenTextInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  pressesable: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: normalize(8),
  },
  otpInput: {
    borderRadius: 4,
    minWidth: normalize(40),
    height: normalize(56),
    backgroundColor: colors.background.neutral,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  otpInputFocus: {
    backgroundColor: colors.grey[300],
  },
});
