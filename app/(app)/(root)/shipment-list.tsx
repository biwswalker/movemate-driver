import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import {
  Shipment,
  useGetAvailableShipmentQuery,
} from "@/graphql/generated/graphql";
import { fDateTime, fSecondsToDuration } from "@/utils/formatTime";
import { normalize } from "@/utils/normalizeSize";
import { fCurrency, fNumber } from "@/utils/number";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { addMinutes } from "date-fns";
import { router } from "expo-router";
import hexToRgba from "hex-to-rgba";
import { head, isEmpty, map, tail } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShipmentList() {
  const [hasMore, setHasMore] = useState(false);
  const { data, loading, fetchMore } = useGetAvailableShipmentQuery({
    variables: { limit: 5, skip: 0, status: "new" },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const shipments = useMemo<Shipment[]>(() => {
    if (data?.getAvailableShipment) {
      return data.getAvailableShipment as Shipment[];
    }
    return [];
  }, [data?.getAvailableShipment]);

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  const handleViewShipment = useCallback((trackingNumber: string) => {
    router.push({ pathname: "/shipment-overview", params: { trackingNumber } });
  }, []);

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
        <View style={shipmentStyle.netPriceWrapper}>
          <Text
            varient="caption"
            color="disabled"
            style={shipmentStyle.pricingLabelText}
          >
            ราคาสุทธิ
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: normalize(6),
              alignItems: "flex-end",
            }}
          >
            <Text varient="h3" style={shipmentStyle.pricingText}>
              {fCurrency(item.payment.invoice?.totalCost || 0)}
            </Text>
            <Text
              varient="body2"
              color="secondary"
              style={{ lineHeight: normalize(28) }}
            >
              บาท
            </Text>
          </View>

          <Text
            varient="body2"
            color="secondary"
            style={{ lineHeight: normalize(18) }}
          >
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
            onPress={() => handleViewShipment(item.trackingNumber)}
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
            style={[{ color: colors.primary.darker, textAlign: "center" }]}
          >
            ไม่พบงานขนส่ง
          </Text>
          <Text
            style={[{ paddingTop: 4, textAlign: "center" }]}
            varient="caption"
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
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar onBack={handleOnClose} title="งานขนส่งใหม่" />
        <FlashList
          data={shipments}
          renderItem={Item}
          keyExtractor={(item, indx) => `${indx}-${item._id}`}
          scrollEnabled
          estimatedItemSize={normalize(223)}
          ListFooterComponent={FooterAction}
        />
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
});

const shipmentStyle = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: normalize(8),
  },
  cardWrapper: {
    flex: 1,
    padding: normalize(16),
    marginVertical: normalize(8),
    marginHorizontal: normalize(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOpacity: 0.16,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
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
  titleText: {
    flexDirection: "row",
    gap: normalize(4),
  },
  newContainer: {
    flexDirection: "row",
    paddingHorizontal: 2,
    alignItems: "center",
    gap: normalize(2),
    transform: [{ translateY: -1 }],
  },
  newText: {
    color: colors.error.dark,
  },
  descriptionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  detailWrapper: {
    paddingTop: normalize(12),
  },
  netPriceWrapper: {
    paddingTop: normalize(8),
  },
  pricingLabelText: {
    height: normalize(18),
  },
  pricingText: {
    color: colors.success.main,
    lineHeight: normalize(32),
  },
  actionWrapper: {
    gap: normalize(8),
    paddingTop: normalize(12),
    flexDirection: "row",
  },
  favLabelWrapper: {
    backgroundColor: hexToRgba("#E02D69", 0.16),
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    flexDirection: "row",
    borderRadius: normalize(6),
    gap: normalize(6),
  },
  footerWrapper: {
    paddingTop: normalize(8),
    paddingHorizontal: normalize(24),
  },
});
