import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import colors from "@constants/colors";
import { useMarkAsFinishMutation } from "@/graphql/generated/graphql";
import useSnackbar, { useSnackbarV2 } from "@/hooks/useSnackbar";
import { normalize } from "@/utils/normalizeSize";
import { ApolloError } from "@apollo/client";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

interface FinishShipmentProps {
  shipmentId: string;
  onFinishComplete: Function;
}

export default function FinishShipment({
  shipmentId,
  onFinishComplete,
}: FinishShipmentProps) {
  const insets = useSafeAreaInsets();
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const [loading, setLoading] = useState(false);
  const [markAsFinish] = useMarkAsFinishMutation();

  function onFinishError(error: ApolloError) {
    setLoading(false);
    const message = error.message || "ไม่สามารถจบงานได้";
    showSnackbar({
      message,
      title: "พบข้อผิดพลาด",
      type: DropdownType.Error,
    });
  }

  function onFinish() {
    onFinishComplete();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);
  }

  function handleOnPressFinish() {
    setLoading(true);
    markAsFinish({
      variables: { shipmentId },
      onCompleted: onFinish,
      onError: onFinishError,
    });
  }

  return (
    <View style={[styles.finishWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.actionsWrapper}>
        <Button
          ripple
          size="large"
          varient="soft"
          color="success"
          title="กดค้างเพื่อแจ้งเสร็จงาน"
          fullWidth
          style={[{ borderRadius: normalize(24) }]}
          delayLongPress={2000}
          onLongPress={handleOnPressFinish}
          loading={loading}
          StartIcon={
            <Iconify
              icon="fluent-emoji-high-contrast:party-popper"
              color={colors.success.dark}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionsWrapper: {
    flex: 1,
    paddingBottom: normalize(8),
  },
  finishWrapper: {
    flexDirection: "row",
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    backgroundColor: colors.common.white,
  },
});
