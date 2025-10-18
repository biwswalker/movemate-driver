import { Stack } from "expo-router";
import { Redirect } from "expo-router";
import { useNotificationObserver } from "@/hooks/useNotificationObserver";
import useAuth from "@/hooks/useAuth";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();
  useNotificationObserver();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="shipment-list"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-overview"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-working"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-detail"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="shipment-success"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="finance-list"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="finance-detail" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile-detail"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-document"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-setting"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="profile-policy"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="employee"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="change-password"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="readfirst"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="notifications"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="re-register" />
      <Stack.Screen
        name="view-images"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="view-pdf"
        options={{ presentation: "fullScreenModal" }}
      />
    </Stack>
  );
}
