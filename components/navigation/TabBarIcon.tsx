import colors from "@/constants/colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { ReactNode, type ComponentProps } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import Iconify from "../Iconify";
import Text from "../Text";
import { normalize } from "@/utils/normalizeSize";

type TMenu = "home" | "shipment" | "finance" | "profile";

const Icon: Record<TMenu, ReactNode> = {
  home: (
    <Iconify
      icon="fluent:home-20-filled"
      size={normalize(26)}
      color={colors.common.white}
    />
  ),
  shipment: (
    <Iconify icon="mdi:truck-fast" size={normalize(26)} color={colors.common.white} />
  ),
  finance: (
    <Iconify icon="solar:document-bold" size={normalize(26)} color={colors.common.white} />
  ),
  profile: (
    <Iconify icon="mage:user-fill" size={normalize(26)} color={colors.common.white} />
  ),
};
const Label: Record<TMenu, string> = {
  home: "หน้าหลัก",
  shipment: "งานของฉัน",
  finance: "การเงิน",
  profile: "โปรไฟล์",
};

export function IconItem(menu: TMenu) {
  return ({ accessibilityState, onPress }: BottomTabBarButtonProps) => {
    const isActive = accessibilityState?.selected;
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[tabStyles.menuContainer, isActive && tabStyles.menuActive]}
      >
        <Animated.View style={[tabStyles.menuWrapper]}>
          {Icon[menu]}
          {isActive && <Text style={tabStyles.menuText}>{Label[menu]}</Text>}
        </Animated.View>
      </TouchableOpacity>
    );
  };
}

export const tabStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: normalize(24),
    left: normalize(24),
    right: normalize(24),
    elevation: 0,
    backgroundColor: colors.text.primary,
    borderRadius: normalize(32),
    height: normalize(56),
    paddingHorizontal: normalize(8),
  },
  shadow: {
    shadowColor: colors.grey[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.32,
    elevation: 5,
  },
  menuContainer: {
    backgroundColor: "transparent",
    borderRadius: normalize(32),
    paddingHorizontal: normalize(8),
    marginVertical: normalize(8),
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: normalize(40)
  },
  menuActive: {
    backgroundColor: colors.master.main,
  },
  menuWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  menuText: {
    color: colors.common.white,
  },
});
