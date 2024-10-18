import { Tabs } from "expo-router";
import React from "react";
import { tabStyles, IconItem } from "@/components/navigation/TabBarIcon";
import { useListenUserStatusSubscription } from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";

export default function TabLayout() {
  const { refetchMe } = useAuth();

  // Subscription
  function handleListenUserStatusData(data: any) {
    console.log("handleListenUserStatusData: ", data);
    refetchMe();
  }
  useListenUserStatusSubscription({
    onData: handleListenUserStatusData,
  });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [tabStyles.shadow, tabStyles.tabBar],
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarButton: IconItem("home") }} />
      <Tabs.Screen
        name="shipment"
        options={{ tabBarButton: IconItem("shipment") }}
      />
      <Tabs.Screen
        name="finance"
        options={{ tabBarButton: IconItem("finance") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarButton: IconItem("profile") }}
      />
    </Tabs>
  );
}
