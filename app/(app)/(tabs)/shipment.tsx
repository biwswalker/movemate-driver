import colors from "@constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import TabCarousel, { TabItem } from "@components/TabCarousel";
import Text from "@components/Text";
import { fDateTime } from "@utils/formatTime";
import { normalize } from "@utils/normalizeSize";
import Button from "@components/Button";
import Iconify from "@components/Iconify";
import {
  find,
  get,
  head,
  includes,
  isEmpty,
  last,
  map,
  sortBy,
  tail,
} from "lodash";
import hexToRgba from "hex-to-rgba";
import {
  EDriverType,
  EShipmentMatchingCriteria,
  EShipmentStatus,
  EStepDefinition,
  EUserStatus,
  EUserType,
  Shipment,
  useGetAvailableShipmentQuery,
} from "@graphql/generated/graphql";
import { fCurrency } from "@utils/number";
import useAuth from "@/hooks/useAuth";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { useIsFocused } from "@react-navigation/native";
import { ICarouselInstance } from "react-native-reanimated-carousel";
import { FlatList, RefreshControl } from "react-native-gesture-handler";

export default function HomeScreen() {
  const tabsRef = useRef<ICarouselInstance>(null);
  const { user } = useAuth();
  const [forceActiveMenu, setForceActiveMenu] = useState<
    EShipmentMatchingCriteria | ""
  >("");
  const [activeMenu, setActiveMenu] = useState<EShipmentMatchingCriteria>(
    EShipmentMatchingCriteria.PROGRESSING
  );
  const searchParam = useLocalSearchParams<{ active: string }>();

  const menus = useMemo<TabItem[]>(() => {
    return [
      {
        label: "งานปัจจุบัน",
        value: EShipmentMatchingCriteria.PROGRESSING,
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
        value: EShipmentMatchingCriteria.DELIVERED,
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
        value: EShipmentMatchingCriteria.CANCELLED,
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

  function handleChangeTabMenu(menu: EShipmentMatchingCriteria) {
    setActiveMenu(menu);
  }

  useFocusEffect(() => {
    if (forceActiveMenu) {
      setActiveMenu(forceActiveMenu);
      setForceActiveMenu("");
      if (tabsRef.current) {
        tabsRef.current.scrollTo({
          animated: true,
          index: 0,
        });
      }
      router.replace("/shipment");
    }
  });

  useEffect(() => {
    if (searchParam) {
      setForceActiveMenu(searchParam.active as EShipmentMatchingCriteria);
    }
  }, [searchParam]);

  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.contentWrapper}>
            {user?.status === EUserStatus.PENDING && <PendingApproval />}
            {user?.status === EUserStatus.DENIED && <DeniedApproval />}
            <View style={styles.tabMenuWrapper}>
              <TabCarousel<EShipmentMatchingCriteria>
                ref={tabsRef}
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
            {user?.status === EUserStatus.ACTIVE ? (
              <Shipments status={activeMenu} />
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
    </Fragment>
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
  errorText: {
    color: colors.error.dark,
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

function DeniedApproval() {
  return (
    <View style={styles.infoTextContainer}>
      <View
        style={[
          styles.infoTextWrapper,
          { backgroundColor: hexToRgba(colors.error.main, 0.12) },
        ]}
      >
        <Iconify
          icon="iconoir:warning-circle-solid"
          size={normalize(18)}
          color={colors.error.dark}
          style={styles.iconWrapper}
        />
        <Text varient="body2" color="secondary" style={styles.errorText}>
          {`บัญชีของคุณไม่ผ่านการอนุมัติจากผู้ดูแล`}
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
    alignItems: "center",
    paddingTop: normalize(16),
    paddingHorizontal: normalize(24),
  },
  footerEmptyWrapper: {
    paddingTop: normalize(56),
    paddingHorizontal: normalize(24),
  },
});

interface ShipmentsProps {
  status: EShipmentMatchingCriteria;
}

function Shipments({ status }: ShipmentsProps) {
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const driverTypes = get(user, "driverDetail.driverType", []);
  const isAgent = user?.userType === EUserType.BUSINESS;
  const isBusinessDriver = includes(driverTypes, EDriverType.BUSINESS_DRIVER); // isBusinessDriver != isAgent

  const [hasMore, setHasMore] = useState(false);
  const { data, refetch, fetchMore, loading } = useGetAvailableShipmentQuery({
    variables: {
      limit: 5,
      skip: 0,
      status,
    },
    notifyOnNetworkStatusChange: true,
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  useEffect(() => {
    refetch({ limit: 5, skip: 0, status });
  }, [status]);

  useEffect(() => {
    if (isFocused) {
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

  function Item({ item, index }: ListRenderItemInfo<Shipment>) {
    const _quotation = last(sortBy(item.quotations, "createdAt"));

    const pickupLocation = head(item.destinations);
    const dropoffLocations = tail(item.destinations);

    const isHiddenInfo = includes(
      [
        EShipmentStatus.DELIVERED,
        EShipmentStatus.CANCELLED,
        EShipmentStatus.REFUND,
      ],
      item.status
    );

    const currentLog = find(item.steps, ["seq", item.currentStepSeq]);

    const isFirstProcess =
      index === 0 &&
      (item.status === EShipmentStatus.PROGRESSING ||
        item.status === EShipmentStatus.IDLE);

    /**
     * TODO: Asign driver --->
     */
    const assignDriver = currentLog?.step === EStepDefinition.DRIVER_ACCEPTED;
    const statusColor = assignDriver
      ? colors.warning
      : item.status === EShipmentStatus.IDLE
        ? colors.warning
        : item.status === EShipmentStatus.PROGRESSING
          ? colors.primary
          : item.status === EShipmentStatus.DELIVERED
            ? colors.success
            : item.status === EShipmentStatus.CANCELLED ||
                item.status === EShipmentStatus.REFUND
              ? colors.error
              : colors.info;

    // ถึง {dropoffLocations.length > 1 ? location?.detail : ``} {location?.detail}

    const firstdropoff = head(dropoffLocations);
    const dropofftexts =
      dropoffLocations.length > 1
        ? `ส่ง ${dropoffLocations.length} จุด`
        : `ถึง ${isHiddenInfo ? firstdropoff?.placeProvince || firstdropoff?.detail : firstdropoff?.name}`;

    return (
      <View
        style={[
          shipmentStyle.cardWrapper,
          isFirstProcess && {
            borderWidth: 1,
            borderColor: colors.master.dark,
          },
        ]}
      >
        <View style={shipmentStyle.titleContainer}>
          <View style={shipmentStyle.titleWrapper}>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <Text
                varient="subtitle1"
                style={{ color: colors.primary.darker }}
              >
                {item.trackingNumber}
              </Text>
              {isFirstProcess && (
                <Text
                  varient="caption"
                  style={{
                    color: colors.info.main,
                    lineHeight: normalize(20),
                    marginLeft: normalize(6),
                  }}
                >
                  ดำเนินการก่อน
                </Text>
              )}
            </View>
            {/* <Text
              varient="body2"
              color="disabled"
              style={shipmentStyle.pricingLabelText}
            >
              ราคา
            </Text> */}
            {item.agentDriver && !isAgent ? (
              <Fragment />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Text varient="h3">
                  {fCurrency(_quotation?.cost.total || 0)}
                </Text>
                <Text varient="body2" style={{ lineHeight: normalize(26) }}>
                  {" "}
                  บาท
                </Text>
              </View>
            )}
            {/* <Text varient="body2" color="disabled">เริ่มงาน</Text>
            <Text varient="body2" color="secondary">
              {fDateTime(item.bookingDateTime, "dd/MM/yyyy p")}
            </Text> */}
          </View>
        </View>
        <View style={shipmentStyle.detailWrapper}>
          {item.agentDriver && !isAgent && (
            <View style={shipmentStyle.descriptionWrapper}>
              <Iconify
                icon="fluent:person-circle-32-regular"
                color={colors.text.disabled}
                size={16}
              />
              <View style={{ flexDirection: "row", gap: normalize(4) }}>
                <Text varient="body2" color="secondary" numberOfLines={1}>
                  งานจากนายหน้า
                </Text>
                <Text varient="body2" numberOfLines={1}>
                  {item.agentDriver?.fullname || "-"}
                </Text>
              </View>
            </View>
          )}
          {item.driver && isAgent && (
            <View style={shipmentStyle.descriptionWrapper}>
              <Iconify
                icon="fluent:person-circle-32-regular"
                color={colors.text.disabled}
                size={16}
              />
              <View style={{ flexDirection: "row", gap: normalize(4) }}>
                <Text varient="body2" color="secondary" numberOfLines={1}>
                  คนขับ
                </Text>
                <Text varient="body2" numberOfLines={1}>
                  {item.driver?.fullname || "-"}
                </Text>
              </View>
            </View>
          )}
          {!item.driver && isAgent && (
            <View style={shipmentStyle.descriptionWrapper}>
              <Iconify
                icon="fluent:person-circle-32-regular"
                color={colors.text.disabled}
                size={16}
              />
              <View style={{ flexDirection: "row", gap: normalize(4) }}>
                <Text
                  varient="body2"
                  numberOfLines={1}
                  style={{ color: colors.warning.main }}
                >
                  ยังไม่ได้มอบหมายงานให้คนขับ
                </Text>
              </View>
            </View>
          )}
          <View style={shipmentStyle.descriptionWrapper}>
            <Iconify
              icon="fluent:clock-12-regular"
              color={colors.text.disabled}
              size={16}
            />
            <Text varient="body2" color="secondary" numberOfLines={1}>
              เริ่มงาน {fDateTime(item.bookingDateTime, "dd/MM/yyyy p")}
            </Text>
          </View>
          <View style={shipmentStyle.descriptionWrapper}>
            <Iconify
              icon="humbleicons:location"
              color={colors.text.disabled}
              size={16}
            />
            <Text varient="body2" color="secondary" numberOfLines={1}>
              จาก{" "}
              {isHiddenInfo
                ? pickupLocation?.placeProvince || pickupLocation?.detail
                : pickupLocation?.name}
            </Text>
          </View>
          <View style={shipmentStyle.descriptionWrapper}>
            <Iconify icon="mage:flag" color={colors.text.disabled} size={16} />
            <Text varient="body2" color="secondary" numberOfLines={1}>
              {dropofftexts}
            </Text>
          </View>
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
              {assignDriver
                ? "รอมอบหมายงานให้คนขับ"
                : currentLog?.driverMessage}
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
            onLongPress={() => {
              console.log("long press...........");
            }}
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
      return <Fragment />;
    }
  }

  return (
    <View style={[{ paddingTop: normalize(16) }]}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        data={shipments}
        renderItem={Item as any}
        keyExtractor={(item, index) => `${index}-${item._id}`}
        // estimatedItemSize={normalize(224)}
        contentContainerStyle={{
          paddingBottom: normalize(156),
          paddingHorizontal: normalize(16),
        }}
        ListFooterComponent={FooterAction}
      />
    </View>
  );
}
