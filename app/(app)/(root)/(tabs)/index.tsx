import colors from "@constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import AccountHeader from "@components/AccountHeader";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import NewShipments, {
  NewShipmentsRef,
} from "@/components/Shipment/NewShipment";
import TodayCard, {
  DeniedApproval,
  PendingApproval,
} from "@/components/Shipment/TodayCard";
import { includes } from "lodash";
import { EDriverType, EUserStatus } from "@/graphql/generated/graphql";
import UsersHeader from "@/components/UsersHeader";
import Text from "@/components/Text";
import Button from "@/components/Button";

export default function HomeScreen() {
  const { user, refetchMe } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const newShipmentsRef = useRef<NewShipmentsRef>(null);

  const userStatus = useMemo(() => user?.status, [user]);
  const driverTypes = useMemo(
    () => user?.driverDetail?.driverType || [],
    [user]
  );

  const handleShowShipmentDetail = useCallback((trackingNumber: string) => {
    router.push({ pathname: "/shipment-overview", params: { trackingNumber } });
  }, []);

  async function handleOnRefresh() {
    try {
      // Refresh
      setRefreshing(true);
      await refetchMe();
      if (newShipmentsRef.current) {
        newShipmentsRef.current.onRestartListening();
      }
    } catch (error) {
      console.log("error: ", JSON.stringify(error, undefined, 2));
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 560);
    }
  }

  return (
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    //   headerImage={
    //     <Image
    //       source={require("@/assets/images/partial-react-logo.png")}
    //       style={styles.reactLogo}
    //     />
    //   }
    // >
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <AccountHeader style={styles.accountContainer} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleOnRefresh}
            />
          }
        >
          {includes(driverTypes, EDriverType.BUSINESS) && (
            <UsersHeader containerStyle={styles.userHeaderStyle} />
          )}
          {user?.status === EUserStatus.ACTIVE &&
            !includes(driverTypes, EDriverType.BUSINESS) && <TodayCard />}
          <View style={styles.contentWrapper}>
            {includes([EUserStatus.ACTIVE], user?.status) && (
              <View style={styles.tabMenuWrapper}>
                <Iconify
                  icon="bi:stars"
                  color={colors.primary.main}
                  size={normalize(16)}
                />
                <Text varient="buttonM" style={{ flex: 1 }}>
                  งานขนส่งใหม่
                </Text>
                <Button
                  onPress={handleOnRefresh}
                  color="inherit"
                  varient="soft"
                  size="small"
                  title="โหลดใหม่"
                  StartIcon={
                    <Iconify
                      icon="tabler:reload"
                      size={normalize(16)}
                      color={colors.text.primary}
                    />
                  }
                />
              </View>
            )}

            {user?.status === EUserStatus.PENDING ? (
              <PendingApproval />
            ) : user?.status === EUserStatus.ACTIVE ? (
              <NewShipments
                onPress={handleShowShipmentDetail}
                ref={newShipmentsRef}
              />
            ) : user?.status === EUserStatus.INACTIVE ? (
              <></>
            ) : user?.status === EUserStatus.DENIED ? (
              <DeniedApproval />
            ) : (
              <></>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
  accountContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(8),
  },
  contentWrapper: {
    paddingTop: normalize(16),
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginTop: normalize(24),
    backgroundColor: colors.background.neutral,
    borderRadius: normalize(24),
    padding: normalize(24),
    gap: normalize(16),
  },
  infoTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(16),
  },
  infoTexts: {
    flexWrap: "wrap",
  },
  linkText: {
    color: colors.master.dark,
  },
  iconWrapper: {
    minWidth: normalize(32),
  },
  tabMenuWrapper: {
    paddingHorizontal: normalize(24),
    gap: normalize(8),
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: normalize(16),
  },
  listWrapper: {},
  gradient: {
    flex: 1,
  },
  gradientWrapper: {
    pointerEvents: "none",
    flexDirection: "row",
  },
  userHeaderStyle: {
    marginHorizontal: normalize(16),
    marginTop: normalize(8),
  },
});
