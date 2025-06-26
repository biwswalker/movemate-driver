import useAuth from "@/hooks/useAuth";
import { Redirect, router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  Notification,
} from "expo-notifications";

enum ENavigationType {
  INDEX = "index",
  EMPLOYEE = "employee",
  SHIPMENT = "shipment",
  SHIPMENT_WORK = "shipment-work",
  FINANCE = "finance",
  NOTIFICATION = "notification",
  PROFILE = "profile",
  PROFILE_DETAIL = "profile-detail",
  PROFILE_DOCUMENT = "profile-document",
}

function useNotificationObserver() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notification) {
      const data = notification.request.content.data;
      if (data) {
        if (data.navigation === ENavigationType.SHIPMENT) {
          if (data.trackingNumber) {
            router.push({
              pathname: "/shipment-overview",
              params: { trackingNumber: data.trackingNumber },
            });
          }
        } else if (data.navigation === ENavigationType.SHIPMENT_WORK) {
          if (data.trackingNumber) {
            router.push({
              pathname: "/shipment-working",
              params: { trackingNumber: data.trackingNumber },
            });
          }
        } else if (data.navigation === ENavigationType.NOTIFICATION) {
        } else if (data.navigation === ENavigationType.EMPLOYEE) {
          router.push("/employee/employees");
          // if (data.driverId) { }
        } else if (data.navigation === ENavigationType.INDEX) {
          router.push("/");
        }
      }
    }

    getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function RootLayout() {
  useNotificationObserver();
  const {
    isAuthenticated,
    isInitialized,
    requireAcceptedPolicy,
    requirePasswordChange,
  } = useAuth();
  useEffect(() => {
    console.log("root mounted");
    if (isAuthenticated) {
      if (requirePasswordChange) {
        router.replace("/change-password");
      } else if (requireAcceptedPolicy) {
        router.replace("/readfirst");
      } else {
        router.replace("/(app)/(root)/(tabs)");
      }
    }
  }, [isAuthenticated, requirePasswordChange, requireAcceptedPolicy]);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [isInitialized]);

  if (!isAuthenticated) {
    return <Redirect href="/landing" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="shipment-list"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-overview"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-working"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-detail"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-success"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="finance-list"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="finance-detail" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile-detail"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-document"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-setting"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-policy"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="employee"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="change-password"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="readfirst"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="re-register" options={{ headerShown: false }} />
    </Stack>
  );
}
