import { ProgressingStepsProps } from "./ProgressingStep";
import { Platform, StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import colors from "@constants/colors";
import { get, includes } from "lodash";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  Destination,
  EShipmentStatus,
  StepDefinition,
  useNextShipmentStepMutation,
} from "@/graphql/generated/graphql";
import * as Linking from "expo-linking";
import Button from "@/components/Button";
import { fDateTime } from "@/utils/formatTime";
import { censorText } from "@/utils/string";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

interface ArrivalLocationProps extends ProgressingStepsProps {
  definition: StepDefinition | undefined;
  destination: Destination;
  done?: boolean;
}

export function ProgressArrivalLocation({
  shipment,
  refetch,
  done,
  destination,
  definition,
  index,
  step,
}: ArrivalLocationProps) {
  const [isLoading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbarV2();
  const [nextShipmentStep, { loading }] = useNextShipmentStepMutation();
  
  function handleCallToCustomer() {
    const phoneNumber = destination?.contactNumber;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }

  function handleDirection() {
    const location = get(destination, "location", undefined);
    const scheme = Platform.OS === "android" ? "geo:0,0?q=" : "maps:0,0?q=";
    const latLng = `${location?.latitude},${location?.longitude}`;
    const url =
      Platform.select({
        ios: `${scheme}${destination?.name}@${latLng}`,
        android: `${scheme}${latLng}(${destination?.name})`,
      }) || "";
    Linking.openURL(url);
  }

  function handleConfirmComplete() {
    refetch();
  }

  function handleConfirmError(error: ApolloError) {
    setLoading(false);
    const message = error.message || "พบข้อผิดพลาด";
    showSnackbar({
      message,
      title: "พบข้อผิดพลาด",
      type: DropdownAlertType.Error,
    });
  }

  function handleConfirm() {
    setLoading(true);
    nextShipmentStep({
      variables: { data: { shipmentId: shipment._id } },
      onCompleted: handleConfirmComplete,
      onError: handleConfirmError,
    });
  }

  return (
    <ScrollView style={progressStyles.wrapper}>
      {/* Direction detail */}
      <Text varient="body2" color="secondary">
        ข้อมูลสถานที่
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          <Text varient="subtitle1">{destination?.name}</Text>
          <Text varient="body1">{destination?.detail}</Text>
          {destination?.customerRemark && (
            <Text varient="body2" color="secondary">
              {destination.customerRemark}
            </Text>
          )}
        </View>
        <View style={progressStyles.contactIcon}>
          <ButtonIcon
            circle
            varient="soft"
            color="secondary"
            onPress={handleDirection}
          >
            <Iconify
              icon="material-symbols:directions"
              size={24}
              color={colors.secondary.main}
            />
          </ButtonIcon>
        </View>
      </View>
      {/* Contact detail */}
      <Text
        varient="body2"
        color="secondary"
        style={{ paddingTop: normalize(8) }}
      >
        ข้อมูลติดต่อ
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          <Text varient="subtitle1">{destination?.contactName}</Text>
          <Text varient="body1">{destination?.contactNumber}</Text>
        </View>
        <View style={progressStyles.contactIcon}>
          <ButtonIcon
            circle
            varient="soft"
            color="secondary"
            onPress={handleCallToCustomer}
          >
            <Iconify
              icon="tabler:phone"
              size={24}
              color={colors.secondary.main}
            />
          </ButtonIcon>
        </View>
      </View>
      {done ? (
        <>
          <Text
            varient="body2"
            color="secondary"
            style={{ paddingTop: normalize(8) }}
          >
            คุณมาถึงเมื่อ
          </Text>
          <Text varient="subtitle1">{fDateTime(definition?.updatedAt)}</Text>
        </>
      ) : (
        <View style={progressStyles.actionsWrapper}>
          <Button
            ripple
            size="large"
            title="กดค้างเพื่อยืนยันมาถึงแล้ว"
            varient="soft"
            fullWidth
            loading={isLoading}
            delayLongPress={1500}
            onLongPress={handleConfirm}
          />
        </View>
      )}
    </ScrollView>
  );
}

const progressStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(2),
  },
  contactWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: normalize(8),
    paddingTop: normalize(2),
    paddingBottom: normalize(8),
  },
  contactNameWrapper: {
    flex: 1,
  },
  actionsWrapper: {
    paddingTop: normalize(24),
  },
  contactIcon: {
    paddingTop: normalize(4),
  },
});

export function DoneArrivalLocation({
  destination,
  definition,
  shipment,
}: ArrivalLocationProps) {
  const isHiddenInfo = includes(
    [
      EShipmentStatus.DELIVERED,
      EShipmentStatus.CANCELLED,
      EShipmentStatus.REFUND,
    ],
    shipment?.status
  );

  function handleCallToCustomer() {
    const phoneNumber = destination.contactNumber;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }

  function handleDirection() {
    const location = get(destination, "location", undefined);
    const scheme = Platform.OS === "android" ? "geo:0,0?q=" : "maps:0,0?q=";
    const latLng = `${location?.latitude},${location?.longitude}`;
    const url =
      Platform.select({
        ios: `${scheme}${destination?.name}@${latLng}`,
        android: `${scheme}${latLng}(${destination?.name})`,
      }) || "";
    Linking.openURL(url);
  }

  return (
    <View style={progressStyles.wrapper}>
      {/* Direction detail */}
      <Text varient="body2" color="disabled">
        ข้อมูลสถานที่
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          {!isHiddenInfo && <Text varient="subtitle1">{destination?.name}</Text>}
          <Text varient="body2">{destination?.detail}</Text>
        </View>
        {!isHiddenInfo && (
          <View style={progressStyles.contactIcon}>
            <ButtonIcon
              circle
              varient="soft"
              color="secondary"
              onPress={handleDirection}
            >
              <Iconify
                icon="material-symbols:directions"
                size={24}
                color={colors.secondary.main}
              />
            </ButtonIcon>
          </View>
        )}
      </View>
      {/* Contact detail */}
      <Text
        varient="body2"
        color="disabled"
        style={{ paddingTop: normalize(8) }}
      >
        ข้อมูลติดต่อ
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          <Text varient="subtitle1">
            {isHiddenInfo
              ? censorText(destination.contactName)
              : destination.contactName}
          </Text>
          {!isHiddenInfo && (
            <Text varient="body2">{destination.contactNumber}</Text>
          )}
        </View>
        {!isHiddenInfo && (
          <View style={progressStyles.contactIcon}>
            <ButtonIcon
              circle
              varient="soft"
              color="secondary"
              onPress={handleCallToCustomer}
            >
              <Iconify
                icon="tabler:phone"
                size={24}
                color={colors.secondary.main}
              />
            </ButtonIcon>
          </View>
        )}
      </View>
      {/* Remark */}
      {destination.customerRemark && (
        <>
          <Text
            varient="body2"
            color="disabled"
            style={{ paddingTop: normalize(8) }}
          >
            หมายเหตุ
          </Text>
          <Text varient="body2">{destination?.customerRemark}</Text>
        </>
      )}
      {/* Stamped time */}
      <Text
        varient="body2"
        color="disabled"
        style={{ paddingTop: normalize(8) }}
      >
        คุณมาถึงเมื่อ
      </Text>
      <Text varient="body2">{fDateTime(definition?.updatedAt)}</Text>
    </View>
  );
}
