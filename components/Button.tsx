import React, { ReactNode, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacityProps,
  Pressable,
  Animated,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Text from "./Text";
import colors from "@constants/colors";
import hexToRgba from "hex-to-rgba";
import { ActivityIndicator } from "react-native-paper";
import { normalize } from "@/utils/normalizeSize";
import Reanimated, {
  Easing,
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

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
  buttonRipple: {
    width: normalize(200),
    height: normalize(56),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalize(25),
    backgroundColor: colors.background.default,
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
  ripple?: boolean;
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
  ripple,
  onLongPress,
  delayLongPress,
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
  const backgroundDefult = colorVarient
    ? ["outlined", "text"].includes(varient)
      ? hexToRgba(colorVarient.main, 0)
      : varient === "soft"
        ? hexToRgba(colorVarient.main, 0.16)
        : colorVarient.main
    : varient === "soft"
      ? hexToRgba(colors.grey["300"], 0.32)
      : hexToRgba(colors.grey["300"], 0);
  const backgroundColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      backgroundDefult,
      colorVarient
        ? ["outlined", "text"].includes(varient)
          ? hexToRgba(colorVarient.main, 0.08)
          : varient === "soft"
            ? hexToRgba(colorVarient.main, 0.32)
            : colorVarient.dark
        : colors.grey["400"],
    ],
  });

  const textColor = disabled
    ? colors.text.secondary
    : colorVarient
      ? ["outlined", "text"].includes(varient)
        ? colorVarient.main
        : varient === "soft"
          ? colorVarient.dark
          : colorVarient.contrastText
      : colors.text.primary;

  const outlineStyle =
    varient === "outlined"
      ? { borderColor: colorVarient ? textColor : colors.divider }
      : {};
  const buttonStyle = {
    ...baseButtonVarient,
    backgroundColor,
    ...outlineStyle,
  };

  if (ripple) {
    return (
      <RippleButton
        text={title}
        color={colorVarient}
        duration={delayLongPress}
        onPress={onLongPress as any}
        style={[fullWidth ? { width: "100%" } : styles.fitcontent]}
        loading={loading}
        containerStyle={[
          styles.button,
          baseButtonVarient,
          buttonSize,
          { backgroundColor: backgroundDefult },
          outlineStyle,
          fullWidth ? { width: "100%" } : styles.fitcontent,
          (disabled || loading) && styles.disabled,
          style,
        ]}
        textStyle={[{ color: textColor }]}
        StartIcon={StartIcon}
        EndIcon={EndIcon}
      />
    );
  }

  return (
    <Pressable
      onPressIn={disabled ? undefined : handlePressIn}
      onPressOut={disabled ? undefined : handlePressOut}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled || loading}
      style={[fullWidth ? styles.fullwidth : styles.fitcontent]}
      onLongPress={onLongPress}
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

interface RippleButtonProps {
  text: string;
  color?: {
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
    contrastText: string;
  } | null;
  textSize?: TFontVarient;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  onPress?: VoidFunction;
  children?: ReactNode;
  loading?: boolean;
  StartIcon?: ReactNode;
  EndIcon?: ReactNode;
}

function RippleButton({
  text,
  textSize,
  style,
  onPress,
  loading = false,
  color,
  duration = 1000,
  textColor,
  textStyle = {},
  containerStyle = {},
  StartIcon,
  EndIcon,
}: RippleButtonProps) {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const scale = useSharedValue(0);
  const containerScale = useSharedValue(1);

  const aRef = useAnimatedRef<View>();
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  const rippleOpacity = useSharedValue(1);

  const textVarient: TFontVarient = textSize || "buttonM";

  const longPressGesture = Gesture.LongPress()
    .minDuration(duration)
    .onBegin((event) => {
      console.log("onBegin: ->");
      const layout = measure(aRef);
      width.value = layout?.width ?? 0;
      height.value = layout?.height ?? 0;
      centerX.value = event.x;
      centerY.value = event.y;

      rippleOpacity.value = 1;
      scale.value = 0;
      scale.value = withTiming(1, {
        duration: duration,
        easing: Easing.bezier(0.24, 0.56, 0.8, 0),
      });
    })
    .onStart(() => {
      console.log("onStart: ->");
      rippleOpacity.value = withTiming(0);
      containerScale.value = withSequence(withSpring(1.02), withSpring(1));
      if (typeof onPress === "function") runOnJS(onPress)();
    })
    .onFinalize(() => {
      rippleOpacity.value = withTiming(0);
    });

  const cStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      transform: [{ scale: containerScale.value }],
    };
  });

  const painRBackground = color?.darker ?? colors.text.primary;
  const rippleBackground = hexToRgba(painRBackground, 0.3);
  const rStyle = useAnimatedStyle(() => {
    const circleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - circleRadius;
    const translateY = centerY.value - circleRadius;

    return {
      width: circleRadius * 2,
      height: circleRadius * 2,
      borderRadius: circleRadius,
      opacity: rippleOpacity.value,
      backgroundColor: rippleBackground,
      position: "absolute",
      top: 0,
      left: 0,
      transform: [{ translateX }, { translateY }, { scale: scale.value }],
    };
  });

  return (
    <Reanimated.View ref={aRef} style={[style, cStyle]}>
      <GestureDetector gesture={longPressGesture}>
        <Reanimated.View
          style={[style, containerStyle, { overflow: "hidden" }]}
        >
          <View style={styles.rowDirection}>
            {loading ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              <>
                {StartIcon && StartIcon}
                <Text style={textStyle} varient={textVarient}>
                  {text}
                </Text>
                {EndIcon && EndIcon}
              </>
            )}
          </View>
          <Reanimated.View style={rStyle} />
        </Reanimated.View>
      </GestureDetector>
    </Reanimated.View>
  );
}
