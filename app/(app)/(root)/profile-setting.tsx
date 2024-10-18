import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { useChangeDrivingStatusMutation } from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { normalize } from "@/utils/normalizeSize";
import { includes, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileSetting() {
  const { user, removeFCM, refetchMe, initializeFCM } = useAuth();
  const {
    status: notificationStatus,
    refetchPermissionStatus,
    requestPermission,
  } = usePushNotifications();
  const [changeDrivingStatus] = useChangeDrivingStatusMutation();

  const [isNotification, setIsNotification] = useState(notificationStatus);
  const [isNotificationLoading, setIsNotificationLoding] = useState(false);
  const [isShipment, setIsShipment] = useState(false);
  const [isShipmentLoading, setIsShipmentLoding] = useState(false);

  async function onToggleNotificationSwitch(state: boolean) {
    try {
      setIsNotificationLoding(true);
      if (state) {
        await requestPermission();
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
      if (!includes(["idle", "busy"], user?.drivingStatus)) return;
      const changeStatus = state ? "idle" : "busy";
      await changeDrivingStatus({ variables: { status: changeStatus } });
      await refetchMe();
    } catch (error) {
      console.log("onToggleNotificationSwitch: ", error);
    } finally {
      setIsShipmentLoding(false);
    }
  }

  useEffect(() => {
    refetchPermissionStatus();
  }, []);

  useEffect(() => {
    if (!isEmpty(user?.fcmToken) && notificationStatus) {
      setIsNotification(notificationStatus);
    } else {
      setIsNotification(false);
    }
  }, [notificationStatus, user]);

  useEffect(() => {
    if (user) {
      setIsShipment(user.drivingStatus === "idle");
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
                value={isNotification}
                disabled={user?.status === 'denied'}
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
                disabled={!includes(["idle", "busy"], user?.drivingStatus) || user?.status === 'denied'}
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
