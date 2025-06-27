import useAuth from "@/hooks/useAuth";
import { useNotificationObserver } from "@/hooks/useNotificationObserver";
import { Redirect, router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  useNotificationObserver();

  const {
    isAuthenticated,
    isInitialized,
    requireAcceptedPolicy,
    requirePasswordChange,
  } = useAuth();

  useEffect(() => {
    // console.log("root mounted");
    // if (isAuthenticated) {
    //   if (requirePasswordChange) {
    //     router.replace("/change-password");
    //   } else if (requireAcceptedPolicy) {
    //     router.replace("/readfirst");
    //   } else {
    //     router.replace("/(app)/(root)/(tabs)");
    //   }
    // }
    if (!isInitialized) {
      return;
    }
    SplashScreen.hideAsync();
    if (isAuthenticated) {
      if (requirePasswordChange) {
        router.replace("/change-password");
      } else if (requireAcceptedPolicy) {
        router.replace("/readfirst");
      } else {
        console.log('GGGGGGGGGGGGGGG')
        router.replace("/(app)/(root)/(tabs)");
      }
    } else {
      router.replace("/landing");
    }
  }, [
    isInitialized,
    // isAuthenticated,
    // requirePasswordChange,
    // requireAcceptedPolicy,
  ]);

  useEffect(() => {
    if (isInitialized) {
    }
  }, [isInitialized]);

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return null; //<Redirect href="/landing" />;
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
