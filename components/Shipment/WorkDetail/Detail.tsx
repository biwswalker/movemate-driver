import Iconify from "@/components/Iconify";
import Text from "@/components/Text";
import colors from "@constants/colors";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import { get, includes, map, tail } from "lodash";
import { Fragment } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import {
  EShipmentStatus,
  EUserType,
  Shipment,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";

interface OverviewDetailProps {
  shipment: Shipment;
}

export default function Detail({ shipment }: OverviewDetailProps) {
  const { user } = useAuth();
  const isBusiness = user?.userType === EUserType.BUSINESS;
  const driver = get(shipment, "driver", undefined);
  const agentDriver = get(shipment, "agentDriver", undefined);
  const customer = get(shipment, "customer", undefined);

  const additionalService = get(shipment, "additionalServices", undefined);
  const destinations = get(shipment, "destinations", []);
  const origin = get(destinations, "0", undefined);
  const dropoffs = tail(destinations);
  const isHiddenInfo = includes(
    [
      EShipmentStatus.DELIVERED,
      EShipmentStatus.CANCELLED,
      EShipmentStatus.REFUND,
    ],
    shipment?.status
  );

  return (
    <>
      <View
        style={[detailStyles.dividerContainer, { marginTop: normalize(16) }]}
      >
        <View style={[detailStyles.divider, { flex: 1 }]} />
        <Text varient="caption" color="disabled">
          รายละเอียดงาน
        </Text>
        <View style={[detailStyles.divider, { flex: 1 }]} />
      </View>

      {/*  */}
      {isBusiness && driver && (
        <View
          style={[
            detailStyles.accountContainer,
            { ...(!isHiddenInfo ? { marginBottom: 0 } : {}) },
          ]}
        >
          <View style={detailStyles.accountAvatarWrapper}>
            {driver?.profileImage ? (
              <Image
                style={detailStyles.avatarImage}
                source={{ uri: imagePath(driver.profileImage.filename) }}
              />
            ) : (
              <Iconify
                icon="solar:user-circle-bold-duotone"
                size={normalize(32)}
                color={colors.text.disabled}
              />
            )}
          </View>
          <View style={detailStyles.accountNameWrapper}>
            <Text varient="body2" color="secondary" numberOfLines={1}>
              คนขับที่รับผิดชอบ
            </Text>
            <Text varient="subtitle1" color="primary">
              {driver?.fullname}
            </Text>
          </View>
        </View>
      )}

      {agentDriver && (
        <View
          style={[
            detailStyles.accountContainer,
            { ...(!isHiddenInfo ? { marginBottom: 0 } : {}) },
          ]}
        >
          <View style={detailStyles.accountAvatarWrapper}>
            {agentDriver?.profileImage ? (
              <Image
                style={detailStyles.avatarImage}
                source={{ uri: imagePath(agentDriver.profileImage.filename) }}
              />
            ) : (
              <Iconify
                icon="solar:user-circle-bold-duotone"
                size={normalize(32)}
                color={colors.text.disabled}
              />
            )}
          </View>
          <View style={detailStyles.accountNameWrapper}>
            <Text varient="body2" color="secondary" numberOfLines={1}>
              นายหน้า
            </Text>
            <Text varient="subtitle1" color="primary">
              {agentDriver?.fullname}
            </Text>
          </View>
        </View>
      )}

      {!isHiddenInfo && (
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
                size={normalize(32)}
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
      )}
      {/*  */}
      <View style={detailStyles.cardWrapper}>
        {/* Locations */}
        <View style={detailStyles.locationWrapper}>
          <View style={detailStyles.boxIconWrapper}>
            <Iconify
              icon="solar:box-bold-duotone"
              size={normalize(18)}
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
            <Text varient="subtitle2" color="primary">
              {isHiddenInfo
                ? origin?.detail
                : `${origin?.name} ${origin?.detail}`}
            </Text>
          </View>
        </View>
        {map(dropoffs, (destination, index) => {
          const isMultipleDestination = dropoffs.length > 1;
          return (
            <View
              style={detailStyles.locationWrapper}
              key={`destination-${destination.placeId}-${index}`}
            >
              <View style={detailStyles.boxNumberWrapper}>
                <Text varient="h6" style={{ color: colors.secondary.main }}>
                  {index + 1}
                </Text>
              </View>
              <View style={detailStyles.locationDetailWrapper}>
                <View style={detailStyles.locationTitleWrapper}>
                  <Text varient="body2" color="secondary">
                    {isMultipleDestination
                      ? `จุดส่งสินค้าที่ ${index + 1}`
                      : "จุดส่งสินค้า"}
                  </Text>
                  {/* <Label text="ดำเนินการ" color="warning" /> */}
                </View>
                <Text varient="subtitle2" color="primary">
                  {isHiddenInfo
                    ? destination?.detail
                    : `${destination?.name} ${destination?.detail}`}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Additional Services */}
        <View style={detailStyles.additionalServiceWrapper}>
          <Text varient="body2" color="secondary">
            บริการเสริม
          </Text>
          {shipment?.isRoundedReturn && (
            <Text varient="subtitle1" color="primary">
              • ไป - กลับ
            </Text>
          )}
          {map(additionalService, (service) => {
            const serviceName = get(
              service,
              "reference.additionalService.name",
              ""
            );
            if (!serviceName) return <Fragment key={service._id} />;
            return (
              <Text varient="subtitle1" color="primary" key={service._id}>
                • {serviceName === "POD" ? "บริการคืนใบส่งสินค้า" : serviceName}
              </Text>
            );
          })}
        </View>

        {/* Vehicle Type */}
        <View style={detailStyles.additionalServiceWrapper}>
          <Text varient="body2" color="secondary">
            ประเภทรถขนส่ง
          </Text>
          <Text varient="subtitle1" color="primary">
            {shipment?.vehicleId?.name || "-"}
          </Text>
        </View>
      </View>
    </>
  );
}

const detailStyles = StyleSheet.create({
  divider: {
    marginHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dividerWithText: {},
  accountContainer: {
    margin: normalize(16),
    padding: normalize(8),
    paddingHorizontal: normalize(12),
    backgroundColor: colors.background.default,
    borderColor: colors.background.neutral,
    borderWidth: 1,
    borderRadius: normalize(12),
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
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
  },
  accountAvatarWrapper: {},
  avatarImage: {
    borderRadius: normalize(24),
    width: normalize(32),
    height: normalize(32),
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
    // backgroundColor: colors.master.lighter,
    alignSelf: "flex-start",
    borderRadius: normalize(16),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  boxReturnIconWrapper: {
    marginTop: normalize(8),
    padding: normalize(4),
    width: normalize(32),
    height: normalize(32),
    alignSelf: "flex-start",
    borderRadius: normalize(16),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.neutral,
  },
  boxNumberWrapper: {
    backgroundColor: colors.background.default,
    marginTop: normalize(8),
    width: normalize(32),
    height: normalize(32),
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-start",
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: normalize(16),
    backgroundColor: colors.common.white,
  },
  additionalServiceWrapper: {
    // padding: normalize(12),
    marginHorizontal: normalize(12),
    marginLeft: normalize(46),
    paddingVertical: normalize(8),
  },
  locationWrapper: {
    flexDirection: "row",
    gap: normalize(8),
    padding: normalize(12),
    paddingVertical: normalize(8),
  },
  locationTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDetailWrapper: {
    flex: 1,
  },
});
