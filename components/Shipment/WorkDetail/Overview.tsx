import Text from "@/components/Text";
import colors from "@constants/colors";
import { EUserType, Shipment } from "@/graphql/generated/graphql";
import { fDateTime, fSecondsToDuration } from "@/utils/formatTime";
import { normalize } from "@/utils/normalizeSize";
import { fCurrency, fNumber } from "@/utils/number";
import { StyleSheet, View } from "react-native";
import { get, last, sortBy } from "lodash";
import useAuth from "@/hooks/useAuth";
import { Fragment } from "react";

interface OverviewProps {
  shipment: Shipment;
}

export default function Overview({ shipment }: OverviewProps) {
  const { user } = useAuth();

  const isAgent = user?.userType === EUserType.BUSINESS;
  const _quotation = last(sortBy(shipment.quotations, "createdAt"));

  // const driverTypes = get(user, "driverDetail.driverType", []);
  // const isBusinessDriver = includes(driverTypes, EDriverType.BUSINESS_DRIVER); // isBusinessDriver != isAgent

  return (
    <View style={overviewStyles.container}>
      <View style={overviewStyles.titleContainer}>
        <View style={overviewStyles.descriptionContainer}>
          <View style={overviewStyles.titleWrapper}>
            <Text varient="caption" color="disabled">
              เริ่มงาน
            </Text>
            <Text varient="subtitle1" color="primary">
              {fDateTime(shipment?.bookingDateTime, "dd/MM/yyyy p")}
            </Text>
          </View>
          <View style={overviewStyles.titleWrapper}>
            <Text varient="caption" color="disabled">
              จุดส่ง
            </Text>
            <Text varient="subtitle1" color="primary">
              {get(shipment, "destinations.length", 0) - 1} จุด
            </Text>
          </View>
        </View>
        <View>
          <Text varient="caption" color="disabled">
            ระยะทาง/เวลา
          </Text>
          <Text varient="subtitle1" color="primary">
            {fNumber(shipment?.displayDistance / 1000, "0,0.0")} กม. /{" "}
            {fSecondsToDuration(shipment?.displayTime, {
              format: ["days", "hours", "minutes"],
            })}
          </Text>
        </View>
        {shipment?.agentDriver && !isAgent ? (
          <Fragment />
        ) : (
          <View>
            <Text varient="caption" color="disabled">
              ราคาสุทธิ
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: normalize(2),
                alignItems: "flex-end",
              }}
            >
              <Text varient="h4" style={overviewStyles.pricingText}>
                {fCurrency(_quotation?.cost.total || 0)}
              </Text>
              <Text varient="body2" style={{ lineHeight: normalize(32) }}>
                {" "}
                บาท
              </Text>
            </View>
          </View>
        )}
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
