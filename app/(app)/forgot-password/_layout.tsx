import { Stack } from "expo-router";

export default function ForgotPasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="new-password" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
