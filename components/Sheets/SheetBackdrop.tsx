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

interface BottomSheetBackdropVarientProps extends BottomSheetBackdropProps {
  opacity?: number;
  animate?: boolean;
}

function SheetBackdropComponent({
  animatedIndex,
  style,
  opacity = 0.18,
  animate = true,
}: BottomSheetBackdropVarientProps) {
  // animated variables
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [animate ? 0 : 1, 1],
      [animate ? 0 : 1, 1],
      Extrapolation.CLAMP
    ),
  }));

  // styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: hexToRgba(colors.common.black, opacity),
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

const SheetBackdrop = {
  Default: (props: BottomSheetBackdropProps) => (
    <SheetBackdropComponent {...props} />
  ),
  Normal: (props: BottomSheetBackdropProps) => (
    <SheetBackdropComponent {...props} opacity={0.46} />
  ),
  NoAnimate: (props: BottomSheetBackdropProps) => (
    <SheetBackdropComponent {...props} opacity={0.46} animate={false} />
  ),
};

export default SheetBackdrop;
