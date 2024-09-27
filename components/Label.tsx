import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "./Text";
import hexToRgba from "hex-to-rgba";
import { normalize } from "@/utils/normalizeSize";
import colors from "@/constants/colors";

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(8),
    borderRadius: normalize(4),
  },
  text: {},
});

interface LabelProps {
  color?: TColorSchema;
  text: string;
}

export default function Label({ color = "inherit", text }: LabelProps) {
  const colorVarient = color !== "inherit" ? colors[color] : null;
  const backgroundColor = colorVarient
    ? hexToRgba(colorVarient.main, 0.08)
    : hexToRgba(colors.grey["200"], 0);

  const textColor = colorVarient ? colorVarient.dark : colors.text.primary;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text varient="overline" style={[styles.text, { color: textColor }]}>
        {text}
      </Text>
    </View>
  );
}
