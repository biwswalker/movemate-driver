import React, { ReactNode, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacityProps,
  Pressable,
  Animated,
} from "react-native";
import hexToRgba from "hex-to-rgba";
import Colors from "@constants/colors";

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  containedStyled: {
    backgroundColor: Colors.primary.main,
  },
  outlinedStyle: {
    borderWidth: 1,
    borderColor: hexToRgba(Colors.primary.main, 0.48),
    backgroundColor: "transparent",
  },
  textStyle: {
    backgroundColor: "transparent",
  },
  softStyle: {
    backgroundColor: hexToRgba(Colors.primary.main, 0.16),
  },
  buttonSM: {
    padding: 4,
  },
  buttonMD: {
    padding: 8,
  },
  buttonLG: {
    padding: 16,
  },
  buttonCircle: {
    borderRadius: 30,
  },
  fullwidth: {
    width: "100%",
  },
  fitcontent: {
    alignSelf: "center",
  },
  disabled: {
    backgroundColor: Colors.action.disabledBackground,
  },
});

type ReactNodeWithProps = (
  props: ButtonIconChildrenComponentProps
) => ReactNode;

interface ButtonIconChildrenComponentProps {
  textVarient: TFontVarient;
  color: string;
}

interface ButtonIconComponentProps
  extends Omit<TouchableOpacityProps, "children"> {
  varient?: TButtonVarient;
  color?: TColorSchema;
  disabled?: boolean;
  fullWidth?: boolean;
  circle?: boolean;
  size?: TButtonSize;
  children: ReactNode | ReactNodeWithProps;
}

export default function ButtonIcon({
  varient = "contained",
  color = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
  circle = false,
  onPress,
  style,
  children,
  ...props
}: ButtonIconComponentProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  function handlePressIn() {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
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

  const colorVarient = color !== "inherit" ? Colors[color] : null;
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      colorVarient
        ? ["outlined", "text"].includes(varient)
          ? hexToRgba(colorVarient.main, 0)
          : varient === "soft"
            ? hexToRgba(colorVarient.main, 0.08)
            : colorVarient.main
        : hexToRgba(Colors.grey["200"], 0),
      colorVarient
        ? ["outlined", "text"].includes(varient)
          ? hexToRgba(colorVarient.main, 0.08)
          : varient === "soft"
            ? hexToRgba(colorVarient.main, 0.32)
            : colorVarient.dark
        : Colors.grey["300"],
    ],
  });

  const textColor = colorVarient
    ? ["outlined", "text"].includes(varient)
      ? colorVarient.main
      : varient === "soft"
        ? colorVarient.dark
        : colorVarient.contrastText
    : Colors.text.primary;

  const buttonStyle = {
    ...baseButtonVarient,
    backgroundColor,
    ...(circle ? styles.buttonCircle : {}),
    ...(varient === "outlined" && {
      borderColor: colorVarient ? textColor : Colors.divider,
    }),
  };

  const childrenWithProps =
    typeof children === "function"
      ? children({ color: textColor, textVarient })
      : children;

  return (
    <Pressable
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}
    >
      <Animated.View
        style={[
          styles.button,
          buttonSize,
          fullWidth ? styles.fullwidth : styles.fitcontent,
          buttonStyle,
          { transform: [{ scale }] },
          disabled && styles.disabled,
          style,
        ]}
      >
        {childrenWithProps}
      </Animated.View>
    </Pressable>
  );
}
