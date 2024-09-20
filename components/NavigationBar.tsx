import colors from "@constants/colors";
import { normalize } from "@/utils/normalizeSize";
import React, { ReactNode } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import ButtonIcon from "./ButtonIcon";
import Iconify from "./Iconify";
import Text from "./Text";
import { router } from "expo-router";

const styles = StyleSheet.create({
  container: {
    paddingVertical: normalize(32),
    paddingHorizontal: normalize(32),
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: normalize(16),
  },
  wrapper: {
    flex: 1,
  },
  actionWrapperLeft: {
    position: "absolute",
    left: normalize(32),
    pointerEvents: "auto",
    zIndex: 1,
  },
  actionWrapperRight: {
    position: "absolute",
    right: normalize(32),
    pointerEvents: "auto",
  },
  buttonWrapper: {
    padding: normalize(8),
    borderWidth: 1,
    borderRadius: normalize(8),
    borderColor: colors.divider,
  },
});

interface NavigationBarProps {
  title?: string;
  onBack?: ((event: GestureResponderEvent) => void) | undefined;
  TitleComponent?: ReactNode;
  containerStyle?: ViewStyle;
}

export default function NavigationBar({
  title,
  onBack,
  TitleComponent,
  containerStyle = {},
}: NavigationBarProps) {

  function handleBack(event: GestureResponderEvent) {
    if (typeof onBack === "function") {
      onBack(event);
    } else {
      router.back()
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.actionWrapperLeft}>
        <ButtonIcon onPress={handleBack} varient="outlined" color="inherit">
          {({ color }) => (
            <Iconify icon="mi:chevron-left" color={color} />
          )}
        </ButtonIcon>
      </View>
      <View style={styles.wrapper}>
        {typeof TitleComponent !== "undefined"
          ? TitleComponent
          : title && (
              <Text varient="h5" style={{ textAlign: "center" }}>
                {title}
              </Text>
            )}
      </View>
      <View style={styles.actionWrapperRight}>
        {/* <ButtonIcon varient="outlined" color="inherit">
        {({ color }) => <Iconify icon="mi:chevron-left" size={24} color={color} />}
      </ButtonIcon> */}
      </View>
    </View>
  );
}
