import colors from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Image,
  Linking,
  ListRenderItemInfo,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import AccountHeader from "@components/AccountHeader";
import TabCarousel, { TabItem } from "@components/TabCarousel";
import Text from "@components/Text";
import { fDate, fDateTime, fSecondsToDuration } from "@utils/formatTime";
import ButtonIcon from "@components/ButtonIcon";
import { normalize } from "@utils/normalizeSize";
import Button from "@components/Button";
import Iconify from "@components/Iconify";
import { find, get, head, isEmpty, map, tail } from "lodash";
import hexToRgba from "hex-to-rgba";
import {
  Shipment,
  useGetAvailableShipmentQuery,
} from "@graphql/generated/graphql";
import { fCurrency, fNumber } from "@utils/number";
import { addMinutes } from "date-fns";
import useAuth from "@/hooks/useAuth";
import { useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { imagePath } from "@/utils/file";

export default function HomeScreen() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState("new");

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

  function handleShowShipmentDetail(trackingNumber: string) {
    // TODO
  }

  function handleAcceptedShipment() {
    // navigation.jumpTo("Shipment");
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
        <ScrollView>
          {user?.status !== "pending" && <TodayCard />}
          <View style={styles.contentWrapper}>
            <View style={styles.tabMenuWrapper}>
              <TabCarousel
                data={menus}
                value={activeMenu}
                onChange={handleChangeTabMenu}
                width={normalize(150)}
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
            {user?.status === "pending" ? (
              <PendingApproval />
            ) : user?.status === "active" ? (
              <NewShipments onPress={handleShowShipmentDetail} />
            ) : user?.status === "inactive" ? (
              <></>
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
    paddingHorizontal: normalize(32),
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

const todayCardStyles = StyleSheet.create({
  todayContainer: {
    marginTop: normalize(16),
    paddingHorizontal: normalize(32),
  },
  todayWrapper: {
    position: "relative",
    backgroundColor: colors.text.primary,
    borderRadius: normalize(16),
    padding: normalize(16),
  },
  todayText: {
    color: colors.common.white,
  },
  todaySubtitleText: {
    color: colors.primary.lighter,
  },
  todayActionWrapper: {
    marginTop: normalize(24),
    alignItems: "flex-start",
  },
  truckImageContainer: {
    pointerEvents: "none",
    position: "absolute",
    // bottom: 0,
  },
  truckImage: {
    pointerEvents: "none",
    position: "absolute",
    height: normalize(110),
    width: normalize(220),
    resizeMode: "contain",
  },
});

function TodayCard() {
  // TODO: Get active work
  const { user } = useAuth();

  // TODO: To support business recheck
  const vehicleImages = get(
    user,
    "individualDriver.serviceVehicleType.image.filename",
    ""
  );

  const screenWidth = Dimensions.get("screen").width;
  const translateXAnim = useRef(new Animated.Value(0)).current;

  function startAnimation() {
    Animated.sequence([
      Animated.timing(translateXAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(translateXAnim, { toValue: 0.96, useNativeDriver: true }),
    ]).start();
  }

  const translateX = translateXAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, screenWidth - normalize(200)],
  });

  useEffect(() => {
    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={todayCardStyles.todayContainer}>
      <View style={todayCardStyles.todayWrapper}>
        <Text varient="h5" style={todayCardStyles.todayText}>
          งานวันนี้ {fDate(new Date(), "dd/MM/yyyy")}
        </Text>
        <Text style={todayCardStyles.todaySubtitleText}>ไม่พบงานขนส่ง</Text>
        <View style={todayCardStyles.todayActionWrapper}>
          {/* <ButtonIcon varient="soft" size="large" color="info" circle>
            <Iconify
              icon="ci:arrow-right-lg"
              size={normalize(24)}
              color={colors.info.main}
            />
          </ButtonIcon> */}
        </View>
      </View>
      {/* {vehicleImages && (
        <Animated.View
          style={[
            todayCardStyles.truckImageContainer,
            { transform: [{ translateY: normalize(64) }, { translateX }] },
          ]}
        >
          <Image
            style={todayCardStyles.truckImage}
            source={{ uri: imagePath(vehicleImages) }}
          />
        </Animated.View>
      )} */}
    </View>
  );
}

function PendingApproval() {
  return (
    <>
      <Text varient="h6" style={styles.textCenter}>
        ขณะนี้ยังไม่สามารถใช้ฟีเจอร์นี้ได้
      </Text>
      <Text color="secondary" style={styles.textCenter}>
        เนื่องจากบัญชีของท่านยังไม่สมบูรณ์{" "}
      </Text>
      <View style={styles.infoTextContainer}>
        <View style={styles.infoTextWrapper}>
          <Iconify
            icon="fa6-solid:user-clock"
            size={normalize(24)}
            color={colors.primary.main}
            style={styles.iconWrapper}
          />
          <View style={styles.infoTexts}>
            <Text varient="subtitle1">รอการตรวจสอบบัญชี</Text>
            <Text varient="body2" color="secondary">
              {`บัญชีของท่านยังไม่สามารถรับงานได้\nกรุณารอการตรวจสอบจากผู้ดูแลระบบ`}
            </Text>
          </View>
        </View>
        <View style={styles.infoTextWrapper}>
          <Iconify
            icon="mdi:comment-quote"
            size={normalize(24)}
            color={colors.primary.main}
            style={styles.iconWrapper}
          />
          <View style={styles.infoTexts}>
            <Text varient="subtitle1">มีข้อแนะนำหรือปัญหาการใช้งาน</Text>
            <Text varient="body2" color="secondary">
              {`หากท่านพบปัญหาหรือใช้งานไม่ได้\nกรุณาติดต่อผู้ดูแลระบบผ่าน`}
            </Text>
            <Text varient="body2" style={styles.linkText}>
              Movematethailand.com
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

const shipmentStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  cardWrapper: {
    flex: 1,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 12 },
      },
      android: {
        elevation: 8,
        shadowColor: hexToRgba(colors.grey[500], 0.84),
      },
    }),
    backgroundColor: colors.common.white,
    borderRadius: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleWrapper: {},
  titleText: {
    flexDirection: "row",
    gap: 4,
  },
  newContainer: {
    flexDirection: "row",
    paddingHorizontal: 2,
    alignItems: "center",
    gap: 2,
    transform: [{ translateY: -1 }],
  },
  newText: {
    color: colors.error.dark,
  },
  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailWrapper: {
    paddingTop: 12,
  },
  netPriceWrapper: {
    paddingTop: 16,
  },
  pricingLabelText: {
    height: 22,
  },
  pricingText: {
    verticalAlign: "middle",
    height: 28,
    color: colors.success.main,
  },
  actionWrapper: {
    gap: 8,
    paddingTop: 12,
    flexDirection: "row",
  },
  favLabelWrapper: {
    backgroundColor: hexToRgba("#E02D69", 0.16),
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    borderRadius: 6,
    gap: 6,
  },
  footerWrapper: {
    paddingTop: 8,
    paddingHorizontal: 24,
  },
});

interface NewShipmentsProps {
  onPress: (trackingNumber: string) => void;
}

function NewShipments({ onPress }: NewShipmentsProps) {
  const { data, refetch } = useGetAvailableShipmentQuery({
    variables: { limit: 3, skip: 0, status: "new" },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  useFocusEffect(() => {
    refetch();
  });

  const shipments = useMemo<Shipment[]>(() => {
    if (data?.getAvailableShipment) {
      return data.getAvailableShipment as Shipment[];
    }
    return [];
  }, [data?.getAvailableShipment]);

  function Item({ item, index }: ListRenderItemInfo<Shipment>) {
    const pickupLocation = head(item.destinations);
    const dropoffLocations = tail(item.destinations);

    const createTime = addMinutes(new Date(item.createdAt), 60).getTime();
    const isNew = new Date().getTime() < createTime;

    return (
      <View style={shipmentStyle.cardWrapper} key={`${index}-${item._id}`}>
        <View style={shipmentStyle.titleContainer}>
          <View style={shipmentStyle.titleWrapper}>
            <View style={shipmentStyle.titleText}>
              <Text
                varient="subtitle1"
                style={{ color: colors.primary.darker }}
              >
                {item.trackingNumber}
              </Text>
              {isNew && (
                <View style={shipmentStyle.newContainer}>
                  <Iconify
                    icon="ic:round-new-releases"
                    size={12}
                    color={colors.error.dark}
                  />
                  <Text varient="overline" style={shipmentStyle.newText}>
                    ใหม่
                  </Text>
                </View>
              )}
            </View>
            <Text varient="body2">
              เริ่มงาน
              <Text varient="body2" color="secondary">
                {" "}
                {fDateTime(item.bookingDateTime, "dd/MM/yyyy p")}
              </Text>
            </Text>
          </View>
          <View>
            {item.requestedDriver && (
              <View style={shipmentStyle.favLabelWrapper}>
                <Iconify icon="solar:star-bold" size={16} color="#E02D69" />
                <Text varient="overline" style={{ color: "#E02D69" }}>
                  เห็นเป็นคนแรก
                </Text>
              </View>
            )}
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
                  icon="humbleicons:location"
                  color={colors.text.disabled}
                  size={16}
                />
                <Text varient="body2" color="secondary" numberOfLines={1}>
                  ถึง {location?.detail}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={shipmentStyle.netPriceWrapper}>
          <Text
            varient="caption"
            color="disabled"
            style={shipmentStyle.pricingLabelText}
          >
            ราคาสุทธิ
          </Text>
          <Text varient="h3" style={shipmentStyle.pricingText}>
            {fCurrency(item.payment.invoice?.totalCost || 0)}
            <Text varient="body2"> บาท</Text>
          </Text>
          <Text varient="body2" color="secondary" style={{ lineHeight: 18 }}>
            ระยะทาง {fNumber(item.displayDistance / 1000, "0,0.0")} กม. (
            {fSecondsToDuration(item.displayTime, {
              format: ["days", "hours", "minutes"],
            })}
            )
          </Text>
        </View>
        <View style={shipmentStyle.actionWrapper}>
          <Button
            fullWidth
            varient="outlined"
            color="inherit"
            size="large"
            title="รายละเอียดงาน"
            onPress={() => onPress(item.trackingNumber)}
            style={{ paddingHorizontal: normalize(32) }}
            StartIcon={
              <Iconify icon="gg:details-more" color={colors.text.primary} />
            }
          />
        </View>
      </View>
    );
  }

  function FooterAction() {
    if (isEmpty(shipments)) {
      return (
        <View style={shipmentStyle.footerWrapper}>
          <Image
            source={require("@assets/images/notfound-shipment.png")}
            style={{ height: normalize(144), objectFit: "contain" }}
          />
          <Text
            varient="subtitle1"
            style={[styles.textCenter, { color: colors.primary.darker }]}
          >
            ไม่พบงานขนส่ง
          </Text>
          <Text
            style={[styles.textCenter, { paddingTop: 4 }]}
            varient="caption"
            color="secondary"
          >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nโปรดตรวจสอบอีกครั้ง`}</Text>
        </View>
      );
    }
    return (
      <View style={shipmentStyle.footerWrapper}>
        <Button title="งานขนส่งทั้งหมด" fullWidth size="large" varient="soft" />
      </View>
    );
  }
  return (
    <View style={shipmentStyle.container}>
      <FlatList
        data={shipments}
        renderItem={Item}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 104 }}
        ListFooterComponent={FooterAction}
      />
    </View>
  );
}
