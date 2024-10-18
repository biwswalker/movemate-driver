import colors from "@constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import AccountHeader from "@components/AccountHeader";
import TabCarousel, { TabItem } from "@components/TabCarousel";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import hexToRgba from "hex-to-rgba";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import NewShipments, {
  NewShipmentsRef,
} from "@/components/Shipment/NewShipment";
import TodayCard, {
  DeniedApproval,
  PendingApproval,
} from "@/components/Shipment/TodayCard";
import { includes } from "lodash";

export default function HomeScreen() {
  const { user, refetchMe } = useAuth();
  const [activeMenu, setActiveMenu] = useState("new");
  const [refreshing, setRefreshing] = useState(false);
  const newShipmentsRef = useRef<NewShipmentsRef>(null);

  const menus = useMemo<TabItem[]>(() => {
    return [
      {
        label: "งานขนส่งใหม่",
        value: "new",
        Icon: (isActive: boolean) => (
          <Iconify
            icon="bi:stars"
            color={isActive ? colors.primary.main : colors.text.primary}
            size={normalize(16)}
          />
        ),
      },
    ];
  }, []);

  function handleChangeTabMenu(menu: string) {
    setActiveMenu(menu);
  }

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
          {user?.status === "active" && <TodayCard />}
          <View style={styles.contentWrapper}>
            {includes(["active"], user?.status) && (
              <View style={styles.tabMenuWrapper}>
                <TabCarousel
                  data={menus}
                  value={activeMenu}
                  onChange={handleChangeTabMenu}
                  width={normalize(140)}
                  height={36}
                />
                <View
                  style={[
                    StyleSheet.absoluteFillObject,
                    styles.gradientWrapper,
                  ]}
                >
                  <LinearGradient
                    colors={[
                      hexToRgba(colors.common.white, 0),
                      hexToRgba(colors.common.white, 1),
                    ]}
                    style={styles.gradient}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                  />
                  <View style={styles.gradient} />
                  <LinearGradient
                    colors={[
                      hexToRgba(colors.common.white, 0),
                      hexToRgba(colors.common.white, 1),
                    ]}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                </View>
              </View>
            )}

            {user?.status === "pending" ? (
              <PendingApproval />
            ) : user?.status === "active" ? (
              <NewShipments
                onPress={handleShowShipmentDetail}
                ref={newShipmentsRef}
              />
            ) : user?.status === "inactive" ? (
              <></>
            ) : user?.status === "denied" ? (
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
    paddingTop: normalize(24),
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
    position: "relative",
    height: 36,
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
});
