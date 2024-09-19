import useAuth from "@/hooks/useAuth";
import { Redirect, router, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
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

  if(!isAuthenticated) {
    return <Redirect href="/landing" />
  }


  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="shipment-list"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
