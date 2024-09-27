import { ProgressingStepsProps } from "./ProgressingStep";
import { StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";

export function Refund({}: ProgressingStepsProps) {
  return (
    <View style={progressStyles.wrapper}>
      <Text varient="body2" color="secondary">
        คืนเงินลูกค้า
      </Text>
      <Text varient="body1">เนื่องจากมีการยกเลิกงานขนส่ง</Text>
    </View>
  );
}

const progressStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
  },
});
