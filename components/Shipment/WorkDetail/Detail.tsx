import Iconify from "@/components/Iconify";
import Text, { getFontVarient } from "@/components/Text";
import colors from "@constants/colors";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import hexToRgba from "hex-to-rgba";
import { find, get, includes, isEmpty, isNumber, map, tail } from "lodash";
import { Fragment } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import {
  EShipmentStatus,
  EStepDefinition,
  EStepStatus,
  EUserType,
  Shipment,
  StepDefinition,
} from "@/graphql/generated/graphql";
import useAuth from "@/hooks/useAuth";
import Reanimated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import { isBefore, parseISO } from "date-fns";

interface OverviewDetailProps {
  shipment: Shipment;
  defaultExpanded?: boolean;
  onViewUserDetail?: (userId: string) => void;
  onChangeDriver?: VoidFunction;
}

export default function Detail({
  shipment,
  defaultExpanded = false,
  onViewUserDetail = () => {},
  onChangeDriver = () => {},
}: OverviewDetailProps) {
  const { user } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();

  const progress = useSharedValue(defaultExpanded ? 1 : 0); // Start expanded

  const animationConfig = {
    duration: 80,
    easing: Easing.inOut(Easing.cubic),
  };
  const cardAnimatedStyle = useAnimatedStyle(() => {
    const platformStyles =
      Platform.OS === "android"
        ? {
            elevation: progress.value * 8,
          }
        : {
            shadowOpacity: progress.value * 0.1,
          };

    return {
      ...platformStyles,
      transform: [{ translateY: progress.value * -2 }],
    };
  });

  const arrowAnimatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotate: `${progress.value * 180}deg` }] };
  });
  const bodyAnimatedStyle = useAnimatedStyle(() => {
    return {
      maxHeight: withTiming(progress.value * 1000), // Increased max height for safety
      opacity: withTiming(progress.value),
    };
  });

  const toggleAccordion = () => {
    progress.value = withTiming(progress.value === 1 ? 0 : 1, animationConfig);
  };

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

  function handleOpenActionSheet() {
    const now = new Date();
    const bookingTime = parseISO(shipment.bookingDateTime.toString());
    const isBeforeStartBooking = isBefore(now, bookingTime);

    const confirmStep = find(shipment.steps as StepDefinition[], {
      step: EStepDefinition.CONFIRM_DATETIME,
    });
    const isCannotChangeDriver = includes(
      [EStepStatus.DONE, EStepStatus.CANCELLED],
      confirmStep?.stepStatus
    );

    const defaultMenu = [
      { label: "รายละเอียดคนขับ", value: "DETAIL" },
      ...(isBusiness && isBeforeStartBooking && !isCannotChangeDriver
        ? [{ label: "เปลี่ยนคนขับ", value: "CHANGE_DRIVER" }]
        : []),
      { label: "ยกเลิก", value: "CANCEL" },
    ];

    showActionSheetWithOptions(
      {
        title: "เลือกเมนูดำเนินการ",
        message: "กรุณาเลือกเมนูดำเนินการที่ต้องการ",
        options: defaultMenu.map((option) => option.label),
        cancelButtonIndex: defaultMenu.length - 1,
        titleTextStyle: getFontVarient("h4"),
        messageTextStyle: {
          ...getFontVarient("body2"),
          color: colors.text.disabled,
        },
        textStyle: getFontVarient("buttonL"),
      },
      (selectedIndex: number | undefined) => {
        if (isNumber(selectedIndex)) {
          const pressMenu = defaultMenu[selectedIndex!];
          if (pressMenu.value === "DETAIL") {
            if (!isBusiness && agentDriver) {
              onViewUserDetail(agentDriver._id);
            } else if (driver) {
              onViewUserDetail(driver._id);
            }
          } else if (pressMenu.value === "CHANGE_DRIVER") {
            if (isBusiness) {
              onChangeDriver();
            }
          }
        }
      }
    );
  }

  return (
    <Reanimated.View style={[detailStyles.accordionCard, cardAnimatedStyle]}>
      <TouchableOpacity onPress={toggleAccordion} activeOpacity={0.8}>
        <View style={detailStyles.headerContainer}>
          <Text varient="h5">รายละเอียดงาน</Text>
          <View style={[{ flex: 1 }]} />
          <Reanimated.View style={arrowAnimatedStyle}>
            <Iconify
              icon="eva:arrow-ios-downward-outline"
              size={normalize(24)}
              color={colors.text.disabled}
            />
          </Reanimated.View>
        </View>
      </TouchableOpacity>

      <Reanimated.View style={[detailStyles.body, bodyAnimatedStyle]}>
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
            <ButtonIcon
              onPress={handleOpenActionSheet}
              varient="text"
              color="inherit"
            >
              {({ color }) => (
                <Iconify icon="mage:dots" size={24} color={color} />
              )}
            </ButtonIcon>
          </View>
        )}

        {!isBusiness && agentDriver && (
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
                  source={{
                    uri: imagePath(agentDriver.profileImage.filename),
                  }}
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
            <ButtonIcon
              onPress={handleOpenActionSheet}
              varient="text"
              color="inherit"
            >
              {({ color }) => (
                <Iconify icon="mage:dots" size={24} color={color} />
              )}
            </ButtonIcon>
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
                  ? origin?.placeProvince || origin?.detail
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
                      ? destination?.placeProvince || destination?.detail
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
                  •{" "}
                  {serviceName === "POD" ? "บริการคืนใบส่งสินค้า" : serviceName}
                </Text>
              );
            })}
            {isEmpty(additionalService) && !shipment?.isRoundedReturn && (
              <Text varient="subtitle1" color="primary">
                -
              </Text>
            )}
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
      </Reanimated.View>
    </Reanimated.View>
  );
}

const detailStyles = StyleSheet.create({
  accordionCard: {
    gap: 8,
    backgroundColor: colors.background.default,
    borderColor: colors.background.neutral,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginTop: 16,
    // 2. Adjust base styles for shadows
    ...Platform.select({
      ios: {
        shadowColor: colors.background.neutral,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        // We set shadowColor here, and animate elevation in useAnimatedStyle
        shadowColor: colors.background.neutral,
      },
    }),
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  body: {
    overflow: "hidden",
  },
  divider: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  dividerWithText: {},
  accountContainer: {
    padding: 8,
    backgroundColor: colors.background.default,
    borderColor: colors.background.neutral,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  },
  accountAvatarWrapper: {},
  avatarImage: {
    borderRadius: 24,
    width: 32,
    height: 32,
    resizeMode: "cover",
    aspectRatio: 1,
  },
  accountNameWrapper: {
    flex: 1,
  },
  boxIconWrapper: {
    marginTop: 8,
    padding: 4,
    width: 32,
    height: 32,
    // backgroundColor: colors.master.lighter,
    alignSelf: "flex-start",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  boxReturnIconWrapper: {
    marginTop: 8,
    padding: 4,
    width: 32,
    height: 32,
    alignSelf: "flex-start",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background.neutral,
  },
  boxNumberWrapper: {
    backgroundColor: colors.background.default,
    marginTop: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-start",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  cardWrapper: {
    // flex: 1,
    // marginHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.common.white,
  },
  additionalServiceWrapper: {
    // padding: (12),
    marginHorizontal: 12,
    marginLeft: 46,
    paddingVertical: 8,
  },
  locationWrapper: {
    flexDirection: "row",
    gap: 8,
    padding: 8,
  },
  locationTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDetailWrapper: {
    flex: 1,
  },
});
