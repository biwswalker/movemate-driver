import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

interface PushNotificationState {
  status: boolean;
  refetchPermissionStatus: Function;
  requestPermission: () => Promise<void>;
  notification?: Notifications.Notification;
  expoPushToken?: Notifications.ExpoPushToken;
  devicePushToken?: Notifications.DevicePushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const [devicePushToken, setDevicePushToken] = useState<
    Notifications.DevicePushToken | undefined
  >();
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const [status, setStatus] = useState(false);

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responsListener = useRef<Notifications.EventSubscription>();

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      const isGranted = finalStatus === "granted";
      setStatus(isGranted);
      if (!isGranted) {
        // TODO:
        console.log("Failed to get push token");
      }

      const expoToken = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      const deviceToken = await Notifications.getDevicePushTokenAsync();

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return { expoToken, deviceToken };
    } else {
      console.log("Error: Please use a physical device");
      return { expoToken: undefined, deviceToken: undefined };
    }
  }

  async function refetchPermissionStatus() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      setStatus(existingStatus === "granted");
    }
  }

  async function requestPermission() {
    return await registerForPushNotificationsAsync().then(
      ({ deviceToken, expoToken }) => {
        if (__DEV__) {
          console.log("Expo FCM Token: ", expoToken);
          console.log("Device FCM Token: ", deviceToken);
        }
        setDevicePushToken(deviceToken);
        setExpoPushToken(expoToken);
      }
    );
  }

  useEffect(() => {
    requestPermission();
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) =>
        setNotification(notification)
      );
    responsListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("addNotificationResponseReceivedListener: ", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responsListener.current!);
    };
  }, []);

  return {
    status,
    refetchPermissionStatus,
    requestPermission,
    devicePushToken,
    expoPushToken,
    notification,
  };
};
