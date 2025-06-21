import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EDriverStatus,
  EUserStatus,
  useChangeDrivingStatusMutation,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { normalize } from "@/utils/normalizeSize";
import { includes, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { storage } from "@/utils/mmkv-storage";

const NOTIFICATION_SETTING_KEY = "notifications_enabled";
export default function ProfileSetting() {
  const { user, removeFCM, initializeFCM, refetchMe } = useAuth();
  // const {
  //   status: notificationStatus,
  //   refetchPermissionStatus,
  //   requestPermission,
  // } = usePushNotifications();
  const [changeDrivingStatus] = useChangeDrivingStatusMutation();

  // const [isNotification, setIsNotification] = useState(notificationStatus);
  const [isNotificationLoading, setIsNotificationLoding] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isShipment, setIsShipment] = useState(false);
  const [isShipmentLoading, setIsShipmentLoding] = useState(false);

  async function onToggleNotificationSwitch() {
    const newValue = !isNotificationsEnabled;
    setIsNotificationsEnabled(newValue);
    storage.set(NOTIFICATION_SETTING_KEY, newValue);

    try {
      setIsNotificationLoding(true);
      if (newValue) {
        await initializeFCM();
        await refetchMe();
      } else {
        await removeFCM();
      }
    } catch (error) {
      console.log("onToggleNotificationSwitch: ", error);
    } finally {
      setIsNotificationLoding(false);
    }
  }

  async function onToggleShipmentSwitch(state: boolean) {
    try {
      setIsShipmentLoding(true);
      // if (!includes([EDriverStatus.IDLE, EDriverStatus.BUSY], user?.drivingStatus)) return;
      const changeStatus = state ? EDriverStatus.IDLE : EDriverStatus.BUSY;
      await changeDrivingStatus({ variables: { status: changeStatus } });
      await refetchMe();
    } catch (error) {
      console.log("onToggleNotificationSwitch: ", error);
    } finally {
      setIsShipmentLoding(false);
    }
  }

  useEffect(() => {
    // ตั้งค่าเริ่มต้นเป็น true ถ้ายังไม่เคยตั้งค่ามาก่อน
    const savedSetting = storage.getBoolean(NOTIFICATION_SETTING_KEY);
    if (savedSetting === undefined) {
      setIsNotificationsEnabled(true);
      storage.set(NOTIFICATION_SETTING_KEY, true);
    } else {
      setIsNotificationsEnabled(savedSetting);
    }
  }, []);

  // useEffect(() => {
  //   // Get status
  //   if (!isEmpty(user?.fcmToken) && notificationStatus) {
  //     setIsNotification(notificationStatus);
  //   } else {
  //     setIsNotification(false);
  //   }
  // }, [notificationStatus, user]);

  useEffect(() => {
    if (user) {
      console.log("user.drivingStatus", user.drivingStatus);
      setIsShipment(
        user.drivingStatus === EDriverStatus.IDLE ||
          user.drivingStatus === EDriverStatus.WORKING
      );
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar title="งานขนส่ง/แจ้งเตือน" />
        <View style={styles.content}>
          <View style={styles.itemWrapper}>
            <Text varient="subtitle1">แสดงการแจ้งเตือน</Text>
            {isNotificationLoading ? (
              <View
                style={{
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(4),
                }}
              >
                <ActivityIndicator size="small" color={colors.text.secondary} />
              </View>
            ) : (
              <Switch
                value={isNotificationsEnabled}
                disabled={user?.status === EUserStatus.DENIED}
                onValueChange={onToggleNotificationSwitch}
              />
            )}
          </View>
          <View style={styles.itemWrapper}>
            <Text varient="subtitle1">เปิดรับงานขนส่ง</Text>
            {isShipmentLoading ? (
              <View
                style={{
                  paddingHorizontal: normalize(12),
                  paddingVertical: normalize(4),
                }}
              >
                <ActivityIndicator size="small" color={colors.text.secondary} />
              </View>
            ) : (
              <Switch
                value={isShipment}
                disabled={user?.status === EUserStatus.DENIED}
                onValueChange={onToggleShipmentSwitch}
              />
            )}
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
    paddingHorizontal: normalize(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
