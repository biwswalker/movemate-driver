import { Tabs } from "expo-router";
import React from "react";
import {
  EDriverType,
  EUserStatus,
  useListenUserStatusSubscription,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import { get, includes } from "lodash";
import CustomTab from "@/components/navigation/CustomTab";

export default function TabLayout() {
  const { refetchMe, user, logout, isAuthenticated } = useAuth();

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
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  // Subscription
  const driverType = get(user, "driverDetail.driverType", []);
  const isOnlyBusinessDriver =
    driverType.length > 1
      ? false
      : includes(driverType, EDriverType.BUSINESS_DRIVER);

  return (
    <Tabs
      tabBar={(props) => (
        <CustomTab {...props} businessDriver={isOnlyBusinessDriver} />
      )}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        animation: "shift",
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="shipment" />
      <Tabs.Screen name="finance" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
