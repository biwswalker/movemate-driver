import useAuth from "@/hooks/useAuth";
import { router, SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreenComponent from "@/components/SplashScreen";

export default function RootLayout() {
  const { isAuthenticated, isInitialized } = useAuth();
  const [preloading, setLoading] = useState(true);
  useEffect(() => {
    console.log("rooter", isAuthenticated);
    if (isAuthenticated) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isInitialized) {
      SplashScreen.hideAsync();
    }
  }, [isInitialized]);

//   if (preloading) {
//     return <SplashScreenComponent />;
//   }

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
