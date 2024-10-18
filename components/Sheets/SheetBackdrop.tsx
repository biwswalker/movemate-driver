import { BottomSheetBackdropProps } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import hexToRgba from "hex-to-rgba";
import { useMemo } from "react";
import colors from "@/constants/colors";
import { StyleSheet } from "react-native";

export default function SheetBackdrop({
  animatedIndex,
  style,
}: BottomSheetBackdropProps) {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: hexToRgba(colors.common.black, 0.18),
      },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return <Animated.View style={[styles.container, containerStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    pointerEvents: "none",
  },
});
