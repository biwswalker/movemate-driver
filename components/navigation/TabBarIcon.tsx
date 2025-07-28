import colors from "@constants/colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { ReactNode } from "react";
import {
  GestureResponderEvent,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import Iconify from "../Iconify";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type TMenu = "home" | "shipment" | "finance" | "profile";

const Icon: Record<TMenu, ReactNode> = {
  home: (
    <Iconify
      icon="fluent:home-20-filled"
      size={26}
      color={colors.common.white}
    />
  ),
  shipment: (
    <Iconify icon="mdi:truck-fast" size={26} color={colors.common.white} />
  ),
  finance: (
    <Iconify icon="solar:document-bold" size={26} color={colors.common.white} />
  ),
  profile: (
    <Iconify icon="mage:user-fill" size={26} color={colors.common.white} />
  ),
};
const Label: Record<TMenu, string> = {
  home: "หน้าหลัก",
  shipment: "งานของฉัน",
  finance: "การเงิน",
  profile: "โปรไฟล์",
};

export function IconItem(menu: TMenu) {
  return ({
    accessibilityState,
    onPress = () => {},
  }: BottomTabBarButtonProps) => {
    const isActive = accessibilityState?.selected;

    const handlePress = (event: GestureResponderEvent) => {
      // Animate the change between active and inactive states
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onPress(event);
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        style={
          isActive ? tabStyles.containerActive : tabStyles.containerInactive
        }
      >
        <View
          style={isActive ? tabStyles.wrapperActive : tabStyles.wrapperInactive}
        >
          {Icon[menu]}
        </View>
      </TouchableOpacity>
    );
  };
}

export const tabStyles = StyleSheet.create({
  // --- Layout ของ Tab Bar หลัก ---
  tabBar: {
    position: "absolute",
    bottom: 16,
    height: 52,
    marginHorizontal: 16,
    borderRadius: 50,
    backgroundColor: colors.text.primary,

    alignItems: "center",
    justifyContent: "center",
  },
  shadow: {
    shadowColor: colors.grey[500],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  // --- Style สำหรับควบคุม Layout (Flexbox) ---
  containerActive: {
    flex: 1, // ยืดให้เต็มพื้นที่ว่างทั้งหมด
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  containerInactive: {
    flex: 0, // หดให้มีขนาดพอดีกับเนื้อหา
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  // --- Style สำหรับควบคุมหน้าตา (Visual) ---
  wrapperActive: {
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.master.main,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 6,
    flex: 1,
    marginVertical: 4,
  },
  wrapperInactive: {
    width: 44, // กำหนดขนาดเป็นวงกลม
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: {
    color: colors.common.white,
    fontWeight: "600",
  },
});
