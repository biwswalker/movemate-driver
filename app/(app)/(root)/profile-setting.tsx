import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import { normalize } from "@/utils/normalizeSize";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSetting() {
  const [isNotification, setIsNotification] = useState(false);
  const [isShipment, setIsShipment] = useState(false);

  const onToggleNotificationSwitch = () => setIsNotification(!isNotification);
  const onToggleShipmentSwitch = () => setIsShipment(!isShipment);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="งานขนส่ง/แจ้งเตือน" />
        <View style={styles.content}>
          <View style={styles.itemWrapper}>
            <Text varient="subtitle1">แสดงการแจ้งเตือน</Text>
            <Switch
              value={isNotification}
              onValueChange={onToggleNotificationSwitch}
            />
          </View>
          <View style={styles.itemWrapper}>
            <Text varient="subtitle1">เปิดรับงานขนส่ง</Text>
            <Switch value={isShipment} onValueChange={onToggleShipmentSwitch} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  content: {},
  itemWrapper: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(32),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
});
