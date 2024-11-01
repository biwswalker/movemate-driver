import { Stack } from "expo-router";

export default function RegisterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="employees" />
      <Stack.Screen name="new" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="preview" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
