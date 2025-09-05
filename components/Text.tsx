import colors from "@constants/colors";
import { normalize } from "@/utils/normalizeSize";
import React from "react";
import { Text as RNText, TextProps, TextStyle } from "react-native";
import Animated, { AnimatedProps, AnimateProps } from "react-native-reanimated";

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
  // สร้างตัวแปรสำหรับสัดส่วนการปรับขนาด
  const scale = 0.8; // สามารถปรับค่านี้เพื่อเพิ่มหรือลดขนาดฟอนต์ทั้งหมดได้

  switch (varient) {
    case "h1":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 32 * scale,
        lineHeight: 40 * scale,
      };
    case "h2":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 28 * scale,
        lineHeight: 36 * scale,
      };
    case "h3":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 24 * scale,
        lineHeight: 32 * scale,
      };
    case "h4":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 20 * scale,
        lineHeight: 28 * scale,
      };
    case "h5":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 18 * scale,
        lineHeight: 26 * scale,
      };
    case "h6":
      return {
        fontFamily: FONT_NAME.PROMPT_SEMI_BOLD, // ปรับเป็น Semi-Bold เพื่อความสวยงาม
        fontSize: 16 * scale,
        lineHeight: 24 * scale,
      };
    case "subtitle1":
      return {
        fontFamily: FONT_NAME.PROMPT_SEMI_BOLD,
        fontSize: 16 * scale,
        lineHeight: 24 * scale,
      };
    case "subtitle2":
      return {
        fontFamily: FONT_NAME.PROMPT_SEMI_BOLD,
        fontSize: 14 * scale,
        lineHeight: 22 * scale,
      };
    case "body1":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        fontSize: 16 * scale,
        lineHeight: 24 * scale,
      };
    case "body2":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        fontSize: 14 * scale,
        lineHeight: 22 * scale,
      };
    case "caption":
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        fontSize: 12 * scale,
        lineHeight: 20 * scale, // เพิ่ม lineHeight เพื่อให้อ่านง่ายขึ้น
      };
    case "overline":
      return {
        fontFamily: FONT_NAME.PROMPT_BOLD,
        fontSize: 12 * scale,
        lineHeight: 20 * scale,
        textTransform: "uppercase", // เพิ่มให้เป็นตัวพิมพ์ใหญ่ตามหลักการ
      };
    case "buttonS":
    case "buttonM":
    case "buttonL":
      return {
        fontFamily: FONT_NAME.PROMPT_MEDIUM,
        fontSize: 14 * scale, // รวมขนาดปุ่มให้เป็นมาตรฐาน
        lineHeight: 22 * scale,
      };
    default:
      return {
        fontFamily: FONT_NAME.PROMPT_REGULAR,
        fontSize: 16 * scale,
        lineHeight: 24 * scale,
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

interface AnimatedTextComponentProps extends AnimatedProps<TextProps> {
  varient?: TFontVarient;
  color?: TTextColor;
}

export function AnimatedText({
  children,
  style,
  color = "primary",
  varient = "body1",
  ...props
}: AnimatedTextComponentProps) {
  const fontVarient = getFontVarient(varient);
  const fontColor = colors.text[color];

  return (
    <Animated.Text
      {...props}
      style={[fontVarient, { color: fontColor, flexShrink: 1 }, style]}
    >
      {children}
    </Animated.Text>
  );
}
