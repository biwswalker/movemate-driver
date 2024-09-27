import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import {
  Notification,
  setNotificationHandler,
  Subscription,
  getPermissionsAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  AndroidImportance,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
  getDevicePushTokenAsync,
  DevicePushToken,
  getExpoPushTokenAsync,
  ExpoPushToken,
} from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

interface PushNotificationState {
  status: boolean;
  refetchPermissionStatus: Function;
  requestPermission: () => Promise<void>;
  notification?: Notification;
  expoPushToken?: ExpoPushToken;
  devicePushToken?: DevicePushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }),
  });

  const [devicePushToken, setDevicePushToken] = useState<
    DevicePushToken | undefined
  >();
  const [expoPushToken, setExpoPushToken] = useState<
    ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<Notification | undefined>();
  const [status, setStatus] = useState(false);

  const notificationListener = useRef<Subscription>();
  const responsListener = useRef<Subscription>();

  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }
      const isGranted = finalStatus === "granted";
      setStatus(isGranted);
      if (!isGranted) {
        // TODO:
        console.log("Failed to get push token");
      }

      const expoToken = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      const deviceToken = await getDevicePushTokenAsync();

      if (Platform.OS === "android") {
        setNotificationChannelAsync("default", {
          name: "default",
          importance: AndroidImportance.MAX,
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
      const { status: existingStatus } = await getPermissionsAsync();
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
    requestPermission()
    notificationListener.current = addNotificationReceivedListener(
      (notification) => setNotification(notification)
    );
    responsListener.current = addNotificationResponseReceivedListener(
      (response) => {
        console.log("addNotificationResponseReceivedListener: ", response);
      }
    );

    return () => {
      removeNotificationSubscription(notificationListener.current!);
      removeNotificationSubscription(responsListener.current!);
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
