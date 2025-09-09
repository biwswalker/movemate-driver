import { View, StyleSheet } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FC } from "react";
import Iconify from "../Iconify";
import colors from "@constants/colors";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { AnimatedText } from "../Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(PlatformPressable);

const Label: Record<string, string> = {
  index: "หน้าหลัก",
  shipment: "งานของฉัน",
  finance: "การเงิน",
  profile: "โปรไฟล์",
};

const CustomTab: FC<BottomTabBarProps & { businessDriver?: boolean }> = ({
  state,
  descriptors,
  navigation,
  businessDriver = false,
}) => {
  const insets = useSafeAreaInsets()
  return (
    <View style={[styles.container, { bottom: insets.bottom + 4 }]}>
      {state.routes.map((route, index) => {
        if (
          ["_sitemap", "+not-found"]
            .concat(businessDriver ? ["finance"] : [])
            .includes(route.name)
        )
          return null;

        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <AnimatedTouchableOpacity
            layout={LinearTransition.springify().mass(0.5)}
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabItem,
              {
                backgroundColor: isFocused ? colors.master.main : "transparent",
                flex: isFocused ? 1 : 0,
              },
            ]}
          >
            {getIconByRouteName(route.name, colors.common.white)}
            {isFocused && (
              <AnimatedText
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                varient="body2"
                style={styles.text}
              >
                {Label[label as string] || ""}
              </AnimatedText>
            )}
          </AnimatedTouchableOpacity>
        );
      })}
    </View>
  );
};

function getIconByRouteName(routeName: string, color: string) {
  switch (routeName) {
    case "index":
      return <Iconify icon="fluent:home-20-filled" size={26} color={color} />;
    case "shipment":
      return <Iconify icon="mdi:truck-fast" size={26} color={color} />;
    case "finance":
      return <Iconify icon="solar:document-bold" size={26} color={color} />;
    case "profile":
      return <Iconify icon="mage:user-fill" size={26} color={color} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.text.primary,
    width: "90%",
    alignSelf: "center",
    bottom: 24,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  text: {
    color: colors.common.white,
    marginLeft: 8,
  },
});

export default CustomTab;
