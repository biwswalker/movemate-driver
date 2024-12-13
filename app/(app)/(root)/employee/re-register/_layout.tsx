import { Stack } from "expo-router";

export default function ReRegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="re-register" />
      <Stack.Screen name="re-document" />
      <Stack.Screen name="re-preview" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
