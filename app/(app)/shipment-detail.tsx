import Iconify from "@/components/Iconify";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  Shipment,
  useGetAvailableShipmentByTrackingNumberQuery,
} from "@/graphql/generated/graphql";
import { imagePath } from "@/utils/file";
import { fDateTime, fSecondsToDuration } from "@/utils/formatTime";
import { normalize } from "@/utils/normalizeSize";
import { fCurrency, fNumber } from "@/utils/number";
import { router, useLocalSearchParams } from "expo-router";
import hexToRgba from "hex-to-rgba";
import { get, isEmpty, last, map, sortBy, tail } from "lodash";
import { Fragment, useEffect, useMemo } from "react";
import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * @deprecated using shipment-overview instead
 * @returns
 */
export default function _Deprecated_ShipmentDetail() {
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();

  const { data } = useGetAvailableShipmentByTrackingNumberQuery({
    variables: { tracking: searchParam?.trackingNumber || "" },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    const backAction = () => {
      handleOnClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const shipment = useMemo<Shipment>(
    () => data?.getAvailableShipmentByTrackingNumber as Shipment,
    [data]
  );

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          onBack={handleOnClose}
          containerStyle={styles.navigator}
          TitleComponent={
            <View>
              <Text varient="body2" color="secondary" style={styles.textCenter}>
                หมายเลขงานขนส่ง
              </Text>
              <Text varient="h4" style={styles.textCenter}>
                {searchParam?.trackingNumber || ""}
              </Text>
            </View>
          }
        />
        <ScrollView>
          <Overview shipment={shipment} />
          <OverviewDetail shipment={shipment} />
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
  navigator: {
    paddingVertical: normalize(12),
  },
  textCenter: {
    textAlign: "center",
  },
});

interface OverviewProps {
  shipment: Shipment;
}

function Overview({ shipment }: OverviewProps) {
  const _quotation = last(sortBy(shipment.quotations, "createdAt"));

  return (
    <View style={overviewStyles.container}>
      <View style={overviewStyles.titleContainer}>
        <View style={overviewStyles.descriptionContainer}>
          <View style={overviewStyles.titleWrapper}>
            <Text varient="body2" color="disabled">
              เริ่มงาน
            </Text>
            <Text varient="subtitle1" color="primary">
              {fDateTime(shipment?.bookingDateTime, "dd/MM/yyyy p")}
            </Text>
          </View>
          <View style={overviewStyles.titleWrapper}>
            <Text varient="body2" color="disabled">
              จุดส่ง
            </Text>
            <Text varient="subtitle1" color="primary">
              {get(shipment, "destinations.length", 0) - 1} จุด
            </Text>
          </View>
        </View>
        <View>
          <Text varient="body2" color="disabled">
            ระยะทาง/เวลา
          </Text>
          <Text varient="subtitle1" color="primary">
            {fNumber(shipment?.displayDistance / 1000, "0,0.0")} กม. /{" "}
            {fSecondsToDuration(shipment?.displayTime, {
              format: ["days", "hours", "minutes"],
            })}
          </Text>
        </View>
        <View>
          <Text varient="body2" color="disabled">
            ราคาสุทธิ
          </Text>
          <View
            style={{
              flexDirection: "row",
              gap: normalize(2),
              alignItems: "flex-end",
            }}
          >
            <Text varient="h3" style={overviewStyles.pricingText}>
              {fCurrency(_quotation?.cost.total || 0)}
            </Text>
            <Text varient="body2" style={{ lineHeight: normalize(32) }}>
              {" "}
              บาท
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const overviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(8),
    paddingHorizontal: normalize(16),
    gap: normalize(16),
  },
  titleContainer: {
    gap: normalize(8),
    backgroundColor: colors.background.default,
    borderColor: colors.background.neutral,
    borderWidth: normalize(6),
    borderRadius: normalize(12),
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(12),
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  titleWrapper: {},
  pricingText: {
    verticalAlign: "middle",
    color: colors.success.main,
  },
});

interface OverviewDetailProps {
  shipment: Shipment;
}

function OverviewDetail({ shipment }: OverviewDetailProps) {
  const customer = get(shipment, "customer", undefined);

  const additionalService = get(shipment, "additionalServices", undefined);
  const destinations = get(shipment, "destinations", []);
  const origin = get(destinations, "0", undefined);
  const dropoffs = tail(destinations);

  return (
    <View style={detailStyles.cardWrapper}>
      <View style={[detailStyles.accountContainer]}>
        <View style={detailStyles.accountAvatarWrapper}>
          {customer?.profileImage ? (
            <Image
              style={detailStyles.avatarImage}
              source={{ uri: imagePath(customer.profileImage.filename) }}
            />
          ) : (
            <Iconify
              icon="solar:user-circle-bold-duotone"
              size={normalize(44)}
              color={colors.text.disabled}
            />
          )}
        </View>
        <View style={detailStyles.accountNameWrapper}>
          <Text varient="body2" color="secondary" numberOfLines={1}>
            ลูกค้า
          </Text>
          <Text varient="subtitle1" color="primary">
            {customer?.fullname}
          </Text>
        </View>
      </View>
      <View style={detailStyles.divider} />
      {/* Locations */}
      <View style={detailStyles.locationWrapper}>
        <View style={detailStyles.boxIconWrapper}>
          <Iconify
            icon="solar:box-bold-duotone"
            size={normalize(24)}
            color={colors.primary.main}
          />
        </View>
        <View style={detailStyles.locationDetailWrapper}>
          <View style={detailStyles.locationTitleWrapper}>
            <Text varient="body2" color="secondary">
              จุดรับสินค้า
            </Text>
            {/* <Label text="ดำเนินการ" color="warning" /> */}
          </View>
          <Text varient="subtitle1" color="primary">
            {origin?.detail}
          </Text>
        </View>
      </View>
      {map(dropoffs, (destination, index) => {
        const isMultipleDestination = dropoffs.length > 1;
        return (
          <Fragment key={`${destination.placeId}-${index}`}>
            <View style={detailStyles.divider} />
            <View style={detailStyles.locationWrapper}>
              <View style={detailStyles.boxNumberWrapper}>
                <Text varient="h5" style={{ color: colors.secondary.main }}>
                  {index + 1}
                </Text>
              </View>
              <View style={detailStyles.locationDetailWrapper}>
                <View style={detailStyles.locationTitleWrapper}>
                  <Text varient="body2" color="secondary">
                    {isMultipleDestination
                      ? `จุดส่งสินค้าที่ ${index + 1}}`
                      : "จุดส่งสินค้า"}
                  </Text>
                  {/* <Label text="ดำเนินการ" color="warning" /> */}
                </View>
                <Text varient="subtitle1" color="primary">
                  {destination?.detail}
                </Text>
              </View>
            </View>
          </Fragment>
        );
      })}
      {/* Rounded */}
      {shipment?.isRoundedReturn && (
        <Fragment>
          <View style={detailStyles.divider} />
          <View
            style={[
              detailStyles.locationWrapper,
              { paddingVertical: normalize(12) },
            ]}
          >
            <View style={[detailStyles.boxReturnIconWrapper, { marginTop: 0 }]}>
              <Iconify
                icon="icon-park-outline:return"
                size={normalize(24)}
                color={colors.text.primary}
              />
            </View>
            <View
              style={[
                detailStyles.locationDetailWrapper,
                { alignSelf: "center" },
              ]}
            >
              <Text varient="subtitle1" color="primary">
                ไป - กลับ
              </Text>
            </View>
          </View>
        </Fragment>
      )}
      {!isEmpty(additionalService) && (
        <Fragment>
          <View style={detailStyles.divider} />
          <View style={detailStyles.additionalServiceWrapper}>
            <Text varient="body2" color="secondary">
              บริการเสริม
            </Text>
            {map(additionalService, (service) => {
              const serviceName = get(
                service,
                "reference.additionalService.name",
                ""
              );
              if (!serviceName) return <Fragment key={service._id} />;
              return (
                <Text varient="subtitle1" color="primary" key={service._id}>
                  •{" "}
                  {serviceName === "POD" ? "บริการคืนใบส่งสินค้า" : serviceName}
                </Text>
              );
            })}
          </View>
        </Fragment>
      )}
    </View>
  );
}

const detailStyles = StyleSheet.create({
  accountContainer: {
    padding: normalize(8),
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  divider: {
    marginHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  accountAvatarWrapper: {},
  avatarImage: {
    borderRadius: normalize(24),
    width: normalize(44),
    height: normalize(44),
    resizeMode: "cover",
    aspectRatio: 1,
  },
  accountNameWrapper: {
    flex: 1,
  },
  boxIconWrapper: {
    marginTop: normalize(8),
    padding: normalize(4),
    width: normalize(32),
    height: normalize(32),
    backgroundColor: colors.master.lighter,
    alignSelf: "flex-start",
    borderRadius: normalize(16),
    alignItems: "center",
    justifyContent: "center",
  },
  boxReturnIconWrapper: {
    marginTop: normalize(8),
    padding: normalize(4),
    width: normalize(32),
    height: normalize(32),
    backgroundColor: colors.background.neutral,
    alignSelf: "flex-start",
    borderRadius: normalize(16),
    alignItems: "center",
    justifyContent: "center",
  },
  boxNumberWrapper: {
    marginTop: normalize(8),
    width: normalize(32),
    height: normalize(32),
    backgroundColor: colors.secondary.lighter,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    borderRadius: normalize(16),
  },
  cardWrapper: {
    flex: 1,
    marginVertical: normalize(16),
    marginHorizontal: normalize(16),
    ...Platform.select({
      ios: {
        shadowColor: colors.grey[500],
        shadowOpacity: 0.16,
        shadowRadius: normalize(8),
        shadowOffset: { width: 0, height: normalize(4) },
      },
      android: {
        elevation: 8,
        shadowColor: hexToRgba(colors.grey[500], 0.84),
      },
    }),
    backgroundColor: colors.common.white,
    borderRadius: normalize(16),
  },
  additionalServiceWrapper: {
    padding: normalize(12),
  },
  locationWrapper: {
    flexDirection: "row",
    gap: normalize(8),
    padding: normalize(12),
  },
  locationTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  locationDetailWrapper: {
    flex: 1,
  },
});
