import { ProgressingStepsProps } from "./ProgressingStep";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { normalize } from "@/utils/normalizeSize";
import Text from "@/components/Text";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import colors from "@/constants/colors";
import { get } from "lodash";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { DropdownAlertType } from "react-native-dropdownalert";
import {
  Destination,
  useNextShipmentStepMutation,
} from "@/graphql/generated/graphql";
import * as Linking from "expo-linking";
import Button from "@/components/Button";

interface ArrivalLocationProps extends ProgressingStepsProps {
  destination: Destination;
}

export function ProgressArrivalLocation({
  shipment,
  destination,
  refetch,
}: ArrivalLocationProps) {
  const { showSnackbar } = useSnackbarV2();
  const [nextShipmentStep, { loading }] = useNextShipmentStepMutation();

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

  function handleConfirmComplete() {
    refetch();
  }

  function handleConfirmError(error: ApolloError) {
    const message = error.message || "พบข้อผิดพลาด";
    showSnackbar({
      message,
      title: "พบข้อผิดพลาด",
      type: DropdownAlertType.Error,
    });
  }

  function handleConfirm() {
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
          <Text varient="subtitle1">{destination.contactName}</Text>
          <Text varient="body1">{destination.contactNumber}</Text>
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
      <View style={progressStyles.actionsWrapper}>
        <Button
          size="large"
          title="ฉันมาถึงแล้ว"
          fullWidth
          loading={loading}
          onPress={handleConfirm}
        />
      </View>
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

export function DoneArrivalLocation({ destination }: ArrivalLocationProps) {
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
      <Text varient="body2" color="secondary">
        ข้อมูลสถานที่
      </Text>
      <View style={progressStyles.contactWrapper}>
        <View style={progressStyles.contactNameWrapper}>
          <Text varient="subtitle1">{destination?.name}</Text>
          <Text varient="body1">{destination?.detail}</Text>
          {destination.customerRemark && (
            <Text varient="body2" color="secondary">
              {destination?.customerRemark}
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
          <Text varient="subtitle1">{destination.contactName}</Text>
          <Text varient="body1">{destination.contactNumber}</Text>
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
    </View>
  );
}
