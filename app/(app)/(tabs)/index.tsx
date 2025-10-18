import colors from "@constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import AccountHeader from "@components/AccountHeader";
import Iconify from "@components/Iconify";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import NewShipments, {
  NewShipmentsRef,
} from "@/components/Shipment/NewShipment";
import TodayCard, {
  DeniedApproval,
  InActiveUserStatus,
  PendingApproval,
  TodayShipmentsRef,
} from "@/components/Shipment/TodayCard";
import { includes } from "lodash";
import {
  EDriverType,
  EUserStatus,
  EUserValidationStatus,
  useCheckAvailableToWorkQuery,
} from "@/graphql/generated/graphql";
import UsersHeader from "@/components/UsersHeader";
import Text from "@/components/Text";
import Button from "@/components/Button";
import hexToRgba from "hex-to-rgba";
import EmploymentApproval, {
  EmploymentApprovalRef,
} from "@/components/EmploymentApproval";

export default function HomeScreen() {
  const { user, refetchMe, isAuthenticated } = useAuth();

  const {
    data: checkAvailableToWorkData,
    refetch: refetchCheckAvailableToWork,
  } = useCheckAvailableToWorkQuery({
    fetchPolicy: "network-only",
    skip: !isAuthenticated,
  });

  const isAvailableWork = useMemo(
    () => checkAvailableToWorkData?.checkAvailableToWork || false,
    [checkAvailableToWorkData]
  );

  // Get all driver include Parents

  const [refreshing, setRefreshing] = useState(false);
  const newShipmentsRef = useRef<NewShipmentsRef>(null);
  const todayShipmentsRef = useRef<TodayShipmentsRef>(null);
  const employmentRequestRef = useRef<EmploymentApprovalRef>(null);

  const userStatus = useMemo(() => user?.status, [user]);
  const driverTypes = useMemo(
    () => user?.driverDetail?.driverType || [],
    [user]
  );

  const isAgent = includes(driverTypes, EDriverType.BUSINESS);

  const isOnlyBusinessDriver =
    driverTypes.length > 1
      ? false
      : includes(driverTypes, EDriverType.BUSINESS_DRIVER);

  const handleShowShipmentDetail = useCallback((trackingNumber: string) => {
    router.push({ pathname: "/shipment-overview", params: { trackingNumber } });
  }, []);

  async function handleOnRefresh() {
    try {
      // Refresh
      setRefreshing(true);
      await refetchMe();
      await refetchCheckAvailableToWork();
      if (newShipmentsRef.current && !isOnlyBusinessDriver) {
        newShipmentsRef.current.onRestartListening();
      }

      if (todayShipmentsRef.current) {
        todayShipmentsRef.current.refetch();
      }

      if (employmentRequestRef.current) {
        employmentRequestRef.current.refetch();
      }

      // Refetch Request
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
          {includes(driverTypes, EDriverType.BUSINESS) &&
            user?.validationStatus === EUserValidationStatus.APPROVE && (
              <UsersHeader containerStyle={styles.userHeaderStyle} />
            )}
          <EmploymentApproval
            ref={employmentRequestRef}
            containerStyle={styles.employmentApprovalContainer}
          />
          {user?.status === EUserStatus.ACTIVE &&
            !includes(driverTypes, EDriverType.BUSINESS) && (
              <TodayCard ref={todayShipmentsRef} />
            )}
          <View style={styles.contentWrapper}>
            {includes([EUserStatus.ACTIVE], user?.status) &&
              !isOnlyBusinessDriver && (
                <View style={styles.tabMenuWrapper}>
                  <Iconify
                    icon="bi:stars"
                    color={colors.primary.main}
                    size={16}
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
                        size={16}
                        color={colors.text.primary}
                      />
                    }
                  />
                </View>
              )}

            {user?.status === EUserStatus.PENDING ? (
              <PendingApproval />
            ) : user?.status === EUserStatus.ACTIVE ? (
              isAgent && !isAvailableWork ? (
                <View style={styles.onlyBusinessDriverWrapper}>
                  <Iconify
                    icon="lets-icons:user-add-duotone"
                    color={hexToRgba(colors.primary.main, 0.32)}
                    size={124}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      paddingHorizontal: 16,
                      paddingTop: 16,
                      paddingBottom: 8,
                    }}
                  >
                    <Text color="secondary">
                      {" "}
                      ยินดีต้อนรับสู่
                      <Text
                        varient="subtitle1"
                        style={{ color: colors.primary.dark }}
                      >
                        {" "}
                        Movemate Driver{" "}
                      </Text>
                      ขณะนี้คุณยังไม่สามารถเห็นงานขนส่ง
                      เนื่องจากคุณไม่มีคนขับรถในสังกัด
                    </Text>
                  </View>
                  <Button
                    title="เพิ่มรายชื่อพนักงานขับรถ"
                    varient="soft"
                    onPress={() => {
                      router.push("/employee/employees");
                    }}
                    EndIcon={
                      <Iconify
                        icon="mingcute:arrow-right-line"
                        color={colors.primary.dark}
                      />
                    }
                  />
                </View>
              ) : isOnlyBusinessDriver ? (
                <View style={styles.onlyBusinessDriverWrapper}>
                  <Iconify
                    icon="solar:sticker-smile-circle-2-bold-duotone"
                    color={hexToRgba(colors.primary.main, 0.32)}
                    size={124}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 6,
                      paddingTop: 16,
                      paddingBottom: 8,
                    }}
                  >
                    <Text color="secondary">ยินดีต้อนรับสู่</Text>
                    <Text
                      varient="subtitle1"
                      style={{ color: colors.primary.dark }}
                    >
                      Movemate Driver
                    </Text>
                  </View>
                  <Button
                    title="ไปหน้างานขนส่งของท่าน"
                    varient="soft"
                    onPress={() => {
                      router.push("/shipment");
                    }}
                    EndIcon={
                      <Iconify
                        icon="mingcute:arrow-right-line"
                        color={colors.primary.dark}
                      />
                    }
                  />
                </View>
              ) : (
                <NewShipments
                  onPress={handleShowShipmentDetail}
                  ref={newShipmentsRef}
                />
              )
            ) : user?.status === EUserStatus.INACTIVE ? (
              <View style={styles.inactiveWrapper}>
                <InActiveUserStatus />
              </View>
            ) : user?.status === EUserStatus.DENIED ? (
              <DeniedApproval
                reasonMessage={user.validationRejectedMessage || "-"}
              />
            ) : (
              <Fragment />
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
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  contentWrapper: {
    paddingTop: 16,
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginTop: 24,
    backgroundColor: colors.background.neutral,
    borderRadius: 24,
    padding: 24,
    gap: 16,
  },
  infoTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  infoTexts: {
    flexWrap: "wrap",
  },
  linkText: {
    color: colors.master.dark,
  },
  iconWrapper: {
    minWidth: 32,
  },
  tabMenuWrapper: {
    paddingHorizontal: 24,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 16,
  },
  onlyBusinessDriverWrapper: {
    paddingVertical: 16,
    alignItems: "center",
    gap: 8,
  },
  gradient: {
    flex: 1,
  },
  gradientWrapper: {
    pointerEvents: "none",
    flexDirection: "row",
  },
  userHeaderStyle: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  employmentApprovalContainer: {
    marginHorizontal: 16,
  },
  inactiveWrapper: {
    marginTop: 16,
  },
});
