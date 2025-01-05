import colors from "@constants/colors";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import Text from "@components/Text";
import { fDateTime, fSecondsToDuration } from "@utils/formatTime";
import { normalize } from "@utils/normalizeSize";
import Button from "@components/Button";
import Iconify from "@components/Iconify";
import { head, isEmpty, last, map, sortBy, tail } from "lodash";
import {
  EDriverStatus,
  Shipment,
  useListenAvailableShipmentSubscription,
} from "@graphql/generated/graphql";
import { fCurrency, fNumber } from "@utils/number";
import { addMinutes } from "date-fns";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import hexToRgba from "hex-to-rgba";

export interface NewShipmentsRef {
  onRestartListening: Function;
}

interface NewShipmentsProps {
  onPress: (trackingNumber: string) => void;
}

const NewShipments = forwardRef<NewShipmentsRef, NewShipmentsProps>(
  ({ onPress }, ref) => {
    const isFocused = useIsFocused();
    const { user } = useAuth();
    const { data, restart, loading } = useListenAvailableShipmentSubscription({
      onError: (errr) => {
        console.log("Listen error: ", JSON.stringify(errr));
      },
    });

    useImperativeHandle(ref, () => ({
      onRestartListening: restart,
    }));

    useEffect(() => {
      if (isFocused) {
        console.log("----New Shipment Focused----");
        restart();
      }
    }, [isFocused]);

    const shipments = useMemo<Shipment[]>(() => {
      if (data?.listenAvailableShipment) {
        return data.listenAvailableShipment as Shipment[];
      }
      return [];
    }, [data?.listenAvailableShipment]);

    function Item({ item, index }: ListRenderItemInfo<Shipment>) {
      const _quotation = last(sortBy(item.quotations, "createdAt"));

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
                size={normalize(16)}
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
                    size={normalize(16)}
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
                  size={normalize(16)}
                />
                <Text varient="body2" color="secondary" numberOfLines={1}>
                  ไป-กลับ
                </Text>
              </View>
            )}
          </View>
          <View style={shipmentStyle.netPriceWrapper}>
            <Text varient="caption" color="disabled">
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
                {fCurrency(_quotation?.cost.total || 0)}
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
      if (loading) {
        return (
          <Fragment />
          // <View style={shipmentStyle.loadingWrapper}>
          //   <ActivityIndicator size="small" color={colors.text.secondary} />
          // </View>
        );
      }
      if (isEmpty(shipments)) {
        if (user?.drivingStatus === EDriverStatus.BUSY) {
          return (
            <View style={shipmentStyle.footerWrapper}>
              <Iconify
                icon="pepicons-print:eye-closed"
                size={normalize(112)}
                color={colors.text.secondary}
              />
              <Text
                varient="subtitle1"
                style={[
                  shipmentStyle.textCenter,
                  { color: colors.primary.darker, paddingTop: normalize(8) },
                ]}
              >
                ขณะนี้ท่านปิดการรับงานขนส่ง
              </Text>
              <Text
                style={[shipmentStyle.textCenter, { paddingTop: 4 }]}
                varient="caption"
                color="secondary"
              >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nโปรดเปิดการรับงาน`}</Text>
            </View>
          );
          // } else if (user?.drivingStatus === "working") {
          //   return (
          //     <View style={shipmentStyle.footerWrapper}>
          //       <Iconify
          //         icon="solar:box-bold-duotone"
          //         size={normalize(112)}
          //         color={colors.text.disabled}
          //       />
          //       <Text
          //         varient="subtitle1"
          //         style={[
          //           shipmentStyle.textCenter,
          //           { color: colors.primary.darker, paddingTop: normalize(8) },
          //         ]}
          //       >
          //         ท่านกำลังดำเนินการขนส่งอยู่
          //       </Text>
          //       <Text
          //         style={[shipmentStyle.textCenter, { paddingTop: 4 }]}
          //         varient="caption"
          //         color="secondary"
          //       >{`เมื่อท่านดำเนินการขนส่งเสร็จสิ้นแล้ว\nท่านจะสามารถรับงานต่อไปได้`}</Text>
          //     </View>
          //   );
        } else {
          return (
            <View style={shipmentStyle.footerWrapper}>
              <Image
                source={require("@assets/images/notfound-shipment.png")}
                style={{ height: normalize(144), objectFit: "contain" }}
              />
              <Text
                varient="subtitle1"
                style={[
                  shipmentStyle.textCenter,
                  { color: colors.primary.darker },
                ]}
              >
                ไม่พบงานขนส่ง
              </Text>
              <Text
                style={[shipmentStyle.textCenter, { paddingTop: 4 }]}
                varient="caption"
                color="secondary"
              >{`ไม่มีงานขนส่งใหม่ที่แสดงในขณะนี้\nโปรดตรวจสอบอีกครั้ง`}</Text>
            </View>
          );
        }
      }
      return (
        <View style={shipmentStyle.footerWrapper}>
          <Button
            title="งานขนส่งทั้งหมด"
            fullWidth
            size="large"
            varient="soft"
            onPress={() => {
              router.push("/shipment-list");
            }}
          />
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
          contentContainerStyle={{ paddingBottom: normalize(104) }}
          ListFooterComponent={FooterAction}
        />
      </View>
    );
  }
);

export default NewShipments;

const shipmentStyle = StyleSheet.create({
  textCenter: {
    textAlign: "center",
  },
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
    alignItems: "center",
  },
  loadingWrapper: {
    padding: normalize(24),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
