import { useState, useEffect, useRef } from "react";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import useAuth from "./useAuth";
import Constants from "expo-constants";
import { useStoreFcmMutation } from "@/graphql/generated/graphql";
import { encryption } from "@/utils/crypto";

// --- ฟังก์ชันหลักในการลงทะเบียน Notification ---
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log("Push notifications are only available on physical devices.");
    return;
  }

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to receive notifications was denied.");
      return;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log("Native Push Token obtained:", token);

    return token;
  } catch (error) {
    console.error(
      "An error occurred while registering for push notifications:",
      error
    );
  }
};

export const unregisterForPushNotifications = async () => {
  console.log("Starting unregistration process...");
  await Notifications.unregisterForNotificationsAsync();
  console.log("Unregistered from push notifications locally.");
};

export function usePushNotification() {
  const { isAuthenticated } = useAuth(); // 👈 2. ดึงสถานะ `isAuthenticated`
  const [storeFCMToken] = useStoreFcmMutation();

  async function savedToken(token: string) {
    console.log("A new push token was generated:", token);
    const fcmTokenEncryption = encryption(token);
    await storeFCMToken({
      variables: { fcmToken: fcmTokenEncryption },
      onError: (error) => {
        console.log("----store FCM error---", error);
      },
    });
  }

  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated. Initializing push notifications...");
      registerForPushNotifications().then(async (token) => {
        await savedToken(token);
      });

      const tokenRefreshSubscription = Notifications.addPushTokenListener(
        async ({ data: token }) => {
          await savedToken(token);
        }
      );

      // Cleanup function
      return () => {
        tokenRefreshSubscription.remove();
      };
    } else {
      console.log(
        "User is not authenticated. Skipping push notification setup."
      );
    }
  }, [isAuthenticated]);
}

// interface PushNotificationState {
//   status: boolean;
//   refetchPermissionStatus: Function;
//   requestPermission: () => Promise<void>;
//   notification?: Notification;
//   expoPushToken?: ExpoPushToken;
//   devicePushToken?: DevicePushToken;
// }

// export const usePushNotifications = (): PushNotificationState => {
//   setNotificationHandler({
//     handleNotification: async () => ({
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//       shouldShowAlert: true,
//     }),
//   });

//   const [devicePushToken, setDevicePushToken] = useState<
//     DevicePushToken | undefined
//   >();
//   const [expoPushToken, setExpoPushToken] = useState<
//     ExpoPushToken | undefined
//   >();
//   const [notification, setNotification] = useState<Notification | undefined>();
//   const [status, setStatus] = useState(false);

//   const notificationListener = useRef<Subscription>();
//   const responsListener = useRef<Subscription>();

//   async function registerForPushNotificationsAsync() {
//     if (Device.isDevice) {
//       const { status: existingStatus } = await getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== "granted") {
//         const { status } = await requestPermissionsAsync();
//         finalStatus = status;
//       }
//       const isGranted = finalStatus === "granted";
//       setStatus(isGranted);
//       if (!isGranted) {
//         // TODO:
//         console.log("Failed to get push token");
//       }

//       const expoToken = await getExpoPushTokenAsync({
//         projectId: Constants.expoConfig?.extra?.eas?.projectId,
//       });
//       const deviceToken = await getDevicePushTokenAsync();

//       if (Platform.OS === "android") {
//         setNotificationChannelAsync("default", {
//           name: "default",
//           importance: AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           lightColor: "#FF231F7C",
//         });
//       }
//       return { expoToken, deviceToken };
//     } else {
//       console.log("Error: Please use a physical device");
//       return { expoToken: undefined, deviceToken: undefined };
//     }
//   }

//   async function refetchPermissionStatus() {
//     if (Device.isDevice) {
//       const { status: existingStatus } = await getPermissionsAsync();
//       setStatus(existingStatus === "granted");
//     }
//   }

//   async function requestPermission() {
//     return await registerForPushNotificationsAsync().then(
//       ({ deviceToken, expoToken }) => {
//         if (__DEV__) {
//           console.log("Expo FCM Token: ", expoToken);
//           console.log("Device FCM Token: ", deviceToken);
//         }
//         setDevicePushToken(deviceToken);
//         setExpoPushToken(expoToken);
//       }
//     );
//   }

//   useEffect(() => {
//     requestPermission();
//     notificationListener.current = addNotificationReceivedListener(
//       (notification) => setNotification(notification)
//     );
//     responsListener.current = addNotificationResponseReceivedListener(
//       (response) => {
//         console.log("addNotificationResponseReceivedListener: ", response);
//       }
//     );

//     return () => {
//       removeNotificationSubscription(notificationListener.current!);
//       removeNotificationSubscription(responsListener.current!);
//     };
//   }, []);

//   return {
//     status,
//     refetchPermissionStatus,
//     requestPermission,
//     devicePushToken,
//     expoPushToken,
//     notification,
//   };
// };
