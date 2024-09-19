import colors from "@constants/colors";
import { normalize } from "@/utils/normalizeSize";
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";

export const FONT_NAME = {
  PROMPT_BLACK: "Prompt-Black",
  PROMPT_BLACK_ITALIC: "Prompt-BlackItalic",
  PROMPT_BOLD: "Prompt-Bold",
  PROMPT_BOLD_ITALIC: "Prompt-BoldItalic",
  PROMPT_EXTRA_BOLD: "Prompt-ExtraBold",
  PROMPT_EXTRA_BOLD_ITALIC: "Prompt-ExtraBoldItalic",
  PROMPT_EXTRA_LIGHT: "Prompt-ExtraLight",
  PROMPT_EXTRA_LIGHT_ITALIC: "Prompt-ExtraLightItalic",
  PROMPT_ITALIC: "Prompt-Italic",
  PROMPT_LIGHT: "Prompt-Light",
  PROMPT_LIGHT_ITALIC: "Prompt-LightItalic",
  PROMPT_MEDIUM: "Prompt-Medium",
  PROMPT_MEDIUM_ITALIC: "Prompt-MediumItalic",
  PROMPT_REGULAR: "Prompt-Regular",
  PROMPT_SEMI_BOLD: "Prompt-SemiBold",
  PROMPT_SEMI_BOLD_ITALIC: "Prompt-SemiBoldItalic",
  PROMPT_SEMI_THIN: "Prompt-Thin",
  PROMPT_SEMI_THIN_ITALIC: "Prompt-ThinItalic",
};

interface TextComponentProps extends TextProps {
  varient?: TFontVarient;
  color?: TTextColor;
}

export function remToPx(value: number) {
  return Math.round(value * 16);
}

export function pxToRem(value: number) {
  return value / 16;
}

export function getFontVarient(varient: TFontVarient = "body1"): TextStyle {
  switch (varient) {
    case "h1":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(50),
        fontSize: normalize(40),
      };
    case "h2":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(42),
        fontSize: normalize(32),
      };
    case "h3":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(36),
        fontSize: normalize(24),
      };
    case "h4":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(30),
        fontSize: normalize(20),
      };
    case "h5":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(27),
        fontSize: normalize(18),
      };
    case "h6":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(26),
        fontSize: normalize(17),
      };
    case "subtitle1":
      return {
        fontFamily: FONT_NAME.PROMPT_SEMI_BOLD,
        lineHeight: normalize(24),
        fontSize: normalize(16),
      };
    case "subtitle2":
      return {
        fontFamily: FONT_NAME.PROMPT_SEMI_BOLD,
        lineHeight: normalize(22),
        fontSize: normalize(14),
      };
    case "body1":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        lineHeight: normalize(24),
        fontSize: normalize(16),
      };
    case "body2":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        lineHeight: normalize(22),
        fontSize: normalize(14),
      };
    case "caption":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        lineHeight: normalize(18),
        fontSize: normalize(12),
      };
    case "overline":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(18),
        fontSize: normalize(12),
      };
    case "buttonS":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(22),
        fontSize: normalize(13),
      };
    case "buttonM":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(24),
        fontSize: normalize(14),
      };
    case "buttonL":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        lineHeight: normalize(26),
        fontSize: normalize(15),
      };
    default:
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        lineHeight: normalize(24),
        fontSize: normalize(16),
      };
  }
}

export default function Text({
  children,
  style,
  color = "primary",
  varient = "body1",
  ...props
}: TextComponentProps) {
  const fontVarient = getFontVarient(varient);
  const fontColor = colors.text[color];
  return (
    <RNText
      {...props}
      style={[fontVarient, { color: fontColor, flexShrink: 1 }, style]}
    >
      {children}
    </RNText>
  );
}
