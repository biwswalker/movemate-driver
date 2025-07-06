import { Tabs } from "expo-router";
import React from "react";
import { tabStyles, IconItem } from "@/components/navigation/TabBarIcon";
import {
  EDriverType,
  EUserStatus,
  useListenUserStatusSubscription,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { get, includes } from "lodash";

export default function TabLayout() {
  const { refetchMe, user, logout } = useAuth();

  useListenUserStatusSubscription({
    onData: (response) => {
      const userStatus = response.data.data?.listenUserStatus;
      console.log("handleListenUserStatusData: ", userStatus);
      if (includes([EUserStatus.BANNED], userStatus)) {
        logout();
        return;
      }
      refetchMe();
    },
  });

  // Subscription
  const driverType = get(user, "driverDetail.driverType", []);
  const isOnlyBusinessDriver =
    driverType.length > 1
      ? false
      : includes(driverType, EDriverType.BUSINESS_DRIVER);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [tabStyles.shadow, tabStyles.tabBar],
        animation: "shift",
      }}
    >
      <Tabs.Screen name="index" options={{ tabBarButton: IconItem("home") }} />
      <Tabs.Screen
        name="shipment"
        options={{ tabBarButton: IconItem("shipment") }}
      />
      <Tabs.Screen
        name="finance"
        options={{ tabBarButton: IconItem("finance", isOnlyBusinessDriver) }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarButton: IconItem("profile") }}
      />
    </Tabs>
  );
}
