import { Alert, Linking, StyleSheet, View } from "react-native";
import * as Location from "expo-location";
import Text, { FONT_NAME } from "./Text";
import Button from "./Button";
import Iconify from "./Iconify";
import colors from "@/constants/colors";

export const PermissionRequestScreen = () => {
  const showSettingsAlert = () => {
    Alert.alert(
      "ต้องการการอนุญาต",
      "กรุณาไปที่ การตั้งค่า > Movemate Driver > ตำแหน่งที่ตั้ง และเลือก 'ตลอดเวลา' (Allow all the time) เพื่อให้แอปทำงานได้อย่างถูกต้อง",
      [
        { text: "ยกเลิก", style: "cancel" },
        { text: "เปิดการตั้งค่า", onPress: () => Linking.openSettings() },
      ]
    );
  };

  const requestPermissions = async () => {
    // 1. ขอ Foreground Permission ก่อน
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== "granted") {
      showSettingsAlert();
      return;
    }

    // 2. ถ้า Foreground สำเร็จ ค่อยขอ Background Permission
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus !== "granted") {
      showSettingsAlert();
    }
  };

  return (
    <View style={styles.permissionContainer}>
      <Iconify
        icon="solar:shield-check-bold-duotone"
        color={colors.primary.main}
        size={100}
      />
      <Text varient="h5" style={styles.permissionText}>
        แอปนี้ต้องการการเข้าถึงตำแหน่งที่ตั้งของคุณเพื่อติดตามงานขนส่ง
      </Text>
      <Button
        varient="soft"
        color="primary"
        size="large"
        fullWidth
        title="ให้สิทธิ์การเข้าถึง"
        onPress={requestPermissions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  permissionText: {
    fontFamily: FONT_NAME.PROMPT_REGULAR,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 16,
  },
});
