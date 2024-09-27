import React, { ReactNode, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacityProps,
  Pressable,
  Animated,
  View,
} from "react-native";
import Text from "./Text";
import colors from "@constants/colors";
import hexToRgba from "hex-to-rgba";
import { ActivityIndicator } from "react-native-paper";
import { normalize } from "@/utils/normalizeSize";

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: normalize(16),
    borderRadius: normalize(8),
    alignItems: "center",
    justifyContent: "center",
  },
  containedStyled: {
    backgroundColor: colors.primary.main,
  },
  outlinedStyle: {
    borderWidth: 1,
    borderColor: hexToRgba(colors.primary.main, 0.48),
    backgroundColor: "transparent",
  },
  textStyle: {
    backgroundColor: "transparent",
  },
  softStyle: {
    backgroundColor: hexToRgba(colors.primary.main, 0.16),
  },
  buttonSM: {
    height: normalize(30),
  },
  buttonMD: {
    height: normalize(36),
  },
  buttonLG: {
    height: normalize(48),
  },
  fullwidth: {
    width: "100%",
    flexShrink: 1,
  },
  fitcontent: {
    alignItems: "baseline",
  },
  disabled: {
    backgroundColor: colors.action.disabledBackground,
  },
  rowDirection: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
});

export interface ButtonComponentProps extends TouchableOpacityProps {
  varient?: TButtonVarient;
  color?: TColorSchema;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: TButtonSize;
  title: string;
  loading?: boolean;
  StartIcon?: ReactNode;
  EndIcon?: ReactNode;
}

export default function Button({
  varient = "contained",
  color = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
  onPress,
  style,
  title,
  loading,
  StartIcon,
  EndIcon,
  ...props
}: ButtonComponentProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start();
    Animated.timing(colorAnim, {
      toValue: 1,
      duration: 128,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    Animated.timing(colorAnim, {
      toValue: 0,
      duration: 128,
      useNativeDriver: true,
    }).start();
  }

  const textVarient: TFontVarient =
    size === "small" ? "buttonS" : size === "large" ? "buttonL" : "buttonM";

  const buttonSize =
    size === "small"
      ? styles.buttonSM
      : size === "large"
        ? styles.buttonLG
        : styles.buttonMD;

  const baseButtonVarient =
    varient === "outlined"
      ? styles.outlinedStyle
      : varient === "soft"
        ? styles.softStyle
        : varient === "text"
          ? styles.textStyle
          : styles.containedStyled;

  const colorVarient = color !== "inherit" ? colors[color] : null;
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorVarient
        ? ["outlined", "text"].includes(varient)
          ? hexToRgba(colorVarient.main, 0)
          : varient === "soft"
            ? hexToRgba(colorVarient.main, 0.16)
            : colorVarient.main
        : varient === "soft"
          ? hexToRgba(colors.grey["300"], 0.32)
          : hexToRgba(colors.grey["300"], 0),
      colorVarient
        ? ["outlined", "text"].includes(varient)
          ? hexToRgba(colorVarient.main, 0.08)
          : varient === "soft"
            ? hexToRgba(colorVarient.main, 0.32)
            : colorVarient.dark
        : colors.grey["400"],
    ],
  });

  const textColor = colorVarient
    ? ["outlined", "text"].includes(varient)
      ? colorVarient.main
      : varient === "soft"
        ? colorVarient.dark
        : colorVarient.contrastText
    : colors.text.primary;

  const buttonStyle = {
    ...baseButtonVarient,
    backgroundColor,
    ...(varient === "outlined" && {
      borderColor: colorVarient ? textColor : colors.divider,
    }),
  };

  return (
    <Pressable
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled || loading}
      style={[fullWidth ? styles.fullwidth : styles.fitcontent]}
      {...props}
    >
      <Animated.View
        style={[
          styles.button,
          buttonSize,
          buttonStyle,
          fullWidth ? styles.fullwidth : styles.fitcontent,
          { transform: [{ scale }] },
          (disabled || loading) && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="small" color={textColor} />
        ) : (
          <View style={styles.rowDirection}>
            {StartIcon && StartIcon}
            <Text varient={textVarient} style={[{ color: textColor }]}>
              {title}
            </Text>
            {EndIcon && EndIcon}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}
