import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="privacy-policy"
        options={{ presentation: "fullScreenModal" }}
      />
      <Stack.Screen name="individual" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
