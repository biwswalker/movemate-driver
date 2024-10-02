import colors from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, View } from "react-native";
import TabCarousel, { TabItem } from "@components/TabCarousel";
import Text from "@components/Text";
import { fDateTime } from "@utils/formatTime";
import { normalize } from "@utils/normalizeSize";
import Button from "@components/Button";
import Iconify from "@components/Iconify";
import { find, head, isEmpty, map, tail } from "lodash";
import hexToRgba from "hex-to-rgba";
import {
  Shipment,
  useGetAvailableShipmentQuery,
} from "@graphql/generated/graphql";
import { fCurrency } from "@utils/number";
import useAuth from "@/hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState("progressing");

  const menus = useMemo<TabItem[]>(() => {
    return [
      {
        label: "งานปัจจุบัน",
        value: "progressing",
        Icon: (isActive: boolean) => (
          <Iconify
            icon="bi:stars"
            color={isActive ? colors.primary.main : colors.text.primary}
            size={normalize(16)}
          />
        ),
      },
      {
        label: "เสร็จสิ้นแล้ว",
        value: "dilivered",
        Icon: (isActive: boolean) => (
          <Iconify
            icon="ic:round-verified"
            color={isActive ? colors.primary.main : colors.text.primary}
            size={normalize(16)}
          />
        ),
      },
      {
        label: "ยกเลิก",
        value: "cancelled",
        Icon: (isActive: boolean) => (
          <Iconify
            icon="pajamas:status-cancelled"
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.contentWrapper}>
          {user?.status === "pending" && <PendingApproval />}
          <View style={styles.tabMenuWrapper}>
            <TabCarousel
              data={menus}
              value={activeMenu}
              onChange={handleChangeTabMenu}
              width={normalize(132)}
              height={36}
            />
            <View
              style={[StyleSheet.absoluteFillObject, styles.gradientWrapper]}
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
              <View style={[styles.gradient, { flex: 2 }]} />
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
          {user?.status === "active" ? (
            <Shipments status={activeMenu as TShipmentStatus} />
          ) : (
            <View style={shipmentStyle.footerEmptyWrapper}>
              <Image
                source={require("@assets/images/notfound-shipment.png")}
                style={{ height: normalize(144), objectFit: "contain" }}
              />
              <Text
                varient="h4"
                style={[
                  styles.textCenter,
                  { color: colors.primary.darker, paddingTop: normalize(16) },
                ]}
              >
                ไม่พบงานขนส่ง
              </Text>
              <Text
                style={[styles.textCenter, { paddingTop: normalize(4) }]}
                varient="body1"
                color="secondary"
              >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nกรุณารอการตรวจสอบข้อมูลจกแอดมิน`}</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
    zIndex: 1,
  },
  wrapper: {
    flex: 1,
  },
  contentWrapper: {
    paddingTop: normalize(24),
    alignItems: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  infoTextContainer: {
    marginBottom: normalize(24),
    // flexGrow: 1,
    // flex: 1,
    width: "100%",
    paddingHorizontal: normalize(24),
  },
  infoTextWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    padding: normalize(16),
    borderRadius: normalize(8),
    gap: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    minWidth: normalize(32),
  },
  infoText: {
    color: colors.warning.dark,
  },
  tabMenuWrapper: {
    position: "relative",
    height: 36,
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

function PendingApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View style={styles.infoTextWrapper}>
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.warning.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" color="secondary" style={styles.infoText}>
          {`บัญชีของคุณรอการตรวจสอบจากผู้ดูแล`}
        </Text>
      </View>
    </View>
  );
}

const shipmentStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(16),
  },
  cardWrapper: {
    flex: 1,
    padding: normalize(16),
    marginVertical: normalize(8),
    marginHorizontal: normalize(8),
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOpacity: 0.12,
        shadowRadius: normalize(4),
        shadowOffset: { width: 0, height: normalize(12) },
      },
      android: {
        elevation: 8,
        shadowColor: hexToRgba(colors.grey[500], 0.84),
      },
    }),
    backgroundColor: colors.common.white,
    borderRadius: normalize(16),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleWrapper: {},
  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  detailWrapper: {
    paddingTop: normalize(12),
  },
  pricingLabelText: {
    height: normalize(16),
  },
  pricingText: {
    verticalAlign: "middle",
    // height: normalize(28),
  },
  actionWrapper: {
    gap: normalize(8),
    paddingTop: normalize(12),
    flexDirection: "row",
  },
  statusContainer: {
    paddingTop: normalize(12),
  },
  statusWrapper: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
    backgroundColor: hexToRgba(colors.info.main, 0.32),
  },
  footerWrapper: {
    paddingTop: normalize(16),
    paddingHorizontal: normalize(24),
  },
  footerEmptyWrapper: {
    paddingTop: normalize(56),
    paddingHorizontal: normalize(24),
  },
});

type TShipmentStatus = "new" | "progressing" | "dilivered" | "cancelled";

interface ShipmentsProps {
  status: TShipmentStatus;
}

function Shipments({ status }: ShipmentsProps) {
  const isFocused = useIsFocused();

  const [hasMore, setHasMore] = useState(false);
  const { data, refetch, fetchMore, loading } = useGetAvailableShipmentQuery({
    variables: { limit: 5, skip: 0, status },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  useEffect(() => {
    refetch({ limit: 5, skip: 0, status });
  }, [status]);

  useEffect(() => {
    if(isFocused) {
      refetch();
    }
  }, [isFocused]);

  // TODO: Add skelleton loader
  function loadMoreShipments() {
    fetchMore({
      variables: { skip: data?.getAvailableShipment.length },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getAvailableShipment.length === 0
        ) {
          setHasMore(false);
          return prevResult;
        } else {
          setHasMore(true);
        }
        return {
          ...prevResult,
          ...fetchMoreResult,
          getAvailableShipment: [
            ...prevResult.getAvailableShipment,
            ...fetchMoreResult.getAvailableShipment,
          ],
        };
      },
    });
  }

  function handleDetailShipment(trackingNumber: string) {
    router.push({ pathname: "/shipment-working", params: { trackingNumber } });
  }

  const shipments = useMemo<Shipment[]>(() => {
    if (data?.getAvailableShipment) {
      return data.getAvailableShipment as Shipment[];
    }
    return [];
  }, [data?.getAvailableShipment]);

  function Item({ item }: ListRenderItemInfo<Shipment>) {
    const pickupLocation = head(item.destinations);
    const dropoffLocations = tail(item.destinations);

    const currentLog = find(item.steps, ["seq", item.currentStepSeq]);

    const statusColor =
      item.status === "idle"
        ? colors.warning
        : item.status === "progressing"
          ? colors.primary
          : item.status === "dilivered"
            ? colors.success
            : item.status === "cancelled" || item.status === "refund"
              ? colors.error
              : colors.info;

    return (
      <View
        style={[
          shipmentStyle.cardWrapper,
          item.status === "progressing" && {
            borderWidth: 1,
            borderColor: colors.master.dark,
          },
        ]}
      >
        <View style={shipmentStyle.titleContainer}>
          <View style={shipmentStyle.titleWrapper}>
            <Text varient="subtitle1" style={{ color: colors.primary.darker }}>
              {item.trackingNumber}
            </Text>
            <Text varient="body2">
              เริ่มงาน
              <Text varient="body2" color="secondary">
                {" "}
                {fDateTime(item.bookingDateTime, "dd/MM/yyyy p")}
              </Text>
            </Text>
          </View>
          <View>
            <Text
              varient="caption"
              color="disabled"
              style={shipmentStyle.pricingLabelText}
            >
              ราคาสุทธิ
            </Text>
            <Text varient="h3" style={shipmentStyle.pricingText}>
              {fCurrency(item.payment.invoice?.totalCost || 0)}
              {/* <Text varient="body2"> บาท</Text> */}
            </Text>
          </View>
        </View>
        <View style={shipmentStyle.detailWrapper}>
          <View style={shipmentStyle.descriptionWrapper}>
            <Iconify
              icon="humbleicons:location"
              color={colors.text.disabled}
              size={16}
            />
            <Text varient="body2" color="secondary" numberOfLines={1}>
              จาก {pickupLocation?.detail}
            </Text>
          </View>
          {map(dropoffLocations, (location, index) => {
            return (
              <View
                style={shipmentStyle.descriptionWrapper}
                key={`${index}-${location.placeId}`}
              >
                <Iconify
                  icon="mage:flag"
                  color={colors.text.disabled}
                  size={16}
                />
                <Text varient="body2" color="secondary" numberOfLines={1}>
                  ถึง {location?.detail}
                </Text>
              </View>
            );
          })}
          {item?.isRoundedReturn && (
            <View style={shipmentStyle.descriptionWrapper}>
              <Iconify
                icon="icon-park-outline:return"
                color={colors.text.disabled}
                size={16}
              />
              <Text varient="body2" color="secondary" numberOfLines={1}>
                ไป-กลับ
              </Text>
            </View>
          )}
        </View>
        <View style={shipmentStyle.statusContainer}>
          <View
            style={[
              shipmentStyle.statusWrapper,
              { backgroundColor: hexToRgba(statusColor.main, 0.08) },
            ]}
          >
            <Text
              varient="body2"
              numberOfLines={1}
              style={[{ color: statusColor.dark }]}
            >
              {currentLog?.driverMessage}
            </Text>
          </View>
        </View>
        <View style={shipmentStyle.actionWrapper}>
          <Button
            fullWidth
            color="master"
            size="large"
            title="รายละเอียดงาน"
            style={{ paddingHorizontal: normalize(32) }}
            StartIcon={
              <Iconify icon="gg:details-more" color={colors.common.white} />
            }
            onPress={() => handleDetailShipment(item.trackingNumber)}
          />
        </View>
      </View>
    );
  }

  function FooterAction() {
    if (isEmpty(shipments)) {
      return (
        <View style={shipmentStyle.footerEmptyWrapper}>
          <Image
            source={require("@assets/images/notfound-shipment.png")}
            style={{ height: normalize(144), objectFit: "contain" }}
          />
          <Text
            varient="h4"
            style={[
              styles.textCenter,
              { color: colors.primary.darker, paddingTop: normalize(16) },
            ]}
          >
            ไม่พบงานขนส่ง
          </Text>
          <Text
            style={[styles.textCenter, { paddingTop: normalize(4) }]}
            varient="body1"
            color="secondary"
          >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nโปรดตรวจสอบอีกครั้ง`}</Text>
        </View>
      );
    } else if (
      !loading &&
      (data?.getAvailableShipment.length || 0) <
        (data?.totalAvailableShipment || 0)
    ) {
      return (
        <View style={shipmentStyle.footerWrapper}>
          <Button
            title="เพิ่มเติม"
            size="medium"
            varient="soft"
            color="inherit"
            onPress={loadMoreShipments}
          />
        </View>
      );
    } else {
      return <></>;
    }
  }

  return (
    <View style={[{ paddingTop: normalize(16) }]}>
      <FlashList
        data={shipments}
        renderItem={Item}
        keyExtractor={(item, index) => `${index}-${item._id}`}
        estimatedItemSize={normalize(224)}
        contentContainerStyle={{ paddingBottom: normalize(156), paddingHorizontal: normalize(16) }}
        ListFooterComponent={FooterAction}
      />
    </View>
  );
}
