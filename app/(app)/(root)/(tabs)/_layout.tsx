import { Tabs } from "expo-router";
import React from "react";
import { tabStyles, IconItem } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
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
