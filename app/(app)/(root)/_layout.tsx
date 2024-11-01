import useAuth from "@/hooks/useAuth";
import { Redirect, router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import {
  addNotificationResponseReceivedListener,
  getLastNotificationResponseAsync,
  Notification,
} from "expo-notifications";

enum ENavigationType {
  SHIPMENT = "shipment",
  FINANCE = "finance",
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
        } else if (data.navigation === ENavigationType.FINANCE) {
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
  const { isAuthenticated, isInitialized } = useAuth();
  useEffect(() => {
    console.log("root mounted");
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

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
    </Stack>
  );
}
