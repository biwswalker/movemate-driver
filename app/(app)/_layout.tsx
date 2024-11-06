import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(root)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="landing" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
