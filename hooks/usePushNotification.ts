import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import {
  Notification,
  ExpoPushToken,
  setNotificationHandler,
  Subscription,
  getPermissionsAsync,
  requestPermissionsAsync,
  getExpoPushTokenAsync,
  setNotificationChannelAsync,
  AndroidImportance,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  removeNotificationSubscription,
} from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

interface PushNotificationState {
  notification?: Notification;
  expoPushToken?: ExpoPushToken;
}

export const usePushNotifications = (): PushNotificationState => {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: true,
      shouldShowAlert: true,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<
    ExpoPushToken | undefined
  >();
  const [notification, setNotification] = useState<Notification | undefined>();

  const notificationListener = useRef<Subscription>();
  const responsListener = useRef<Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // TODO:
        console.log("Failed to get push token");
      }

      token = await getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      if (Platform.OS === "android") {
        setNotificationChannelAsync("default", {
          name: "default",
          importance: AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      return token;
    } else {
      console.log("Error: Please use a physical device");
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      console.log("Expo FCM Token: ", token);
      setExpoPushToken(token);
    });

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
    expoPushToken,
    notification,
  };
};
