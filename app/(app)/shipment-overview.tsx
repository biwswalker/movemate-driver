import Button from "@/components/Button";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EShipmentMatchingCriteria,
  EShipmentStatus,
  Shipment,
  useGetAvailableShipmentByTrackingNumberQuery,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import hexToRgba from "hex-to-rgba";
import { isEqual } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { BackHandler, StyleSheet, View } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Overview from "@/components/Shipment/WorkDetail/Overview";
import Detail from "@/components/Shipment/WorkDetail/Detail";
import useAuth from "@/hooks/useAuth";
import ConfirmAcceptShipmentModal, {
  ConfirmAcceptShipmentModalRef,
} from "@/components/Modals/confirm-accept-shipment";

export default function ShipmentOverview() {
  const { user } = useAuth();
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();
  const acceptShipmentModalRef = useRef<ConfirmAcceptShipmentModalRef>(null);

  const { data, loading } = useGetAvailableShipmentByTrackingNumberQuery({
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

  useEffect(() => {
    if (data?.getAvailableShipmentByTrackingNumber) {
      const _shipment = data?.getAvailableShipmentByTrackingNumber;
      const _shipmentStatus = _shipment?.status;
      const _statusNotInclude = _shipmentStatus !== EShipmentStatus.IDLE;

      if (_statusNotInclude) {
        if (
          _shipmentStatus === EShipmentStatus.PROGRESSING &&
          isEqual(_shipment.driver?._id, user?._id)
        ) {
          // Navigate to working
          // router.push({
          //   pathname: "/shipment-working",
          //   params: { trackingNumber: _shipment.trackingNumber },
          // });
        }
      }
    }
  }, [data]);

  const shipment = useMemo<Shipment>(
    () => data?.getAvailableShipmentByTrackingNumber as Shipment,
    [data]
  );

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  function handleOnAccept() {
    if (acceptShipmentModalRef.current && shipment) {
      acceptShipmentModalRef.current.present(shipment);
    }
  }

  function handleOnConfirmedSucces() {
    router.push(`/shipment?active=${EShipmentMatchingCriteria.PROGRESSING}`);
  }

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <NavigationBar
            onBack={handleOnClose}
            containerStyle={styles.navigator}
            TitleComponent={
              <View>
                <Text
                  varient="body2"
                  color="secondary"
                  style={styles.textCenter}
                >
                  หมายเลขงานขนส่ง
                </Text>
                <Text varient="h4" style={styles.textCenter}>
                  {searchParam?.trackingNumber || ""}
                </Text>
              </View>
            }
          />
          <ScrollView
            style={styles.scrollContainer}
            refreshControl={<RefreshControl refreshing={loading} />}
          >
            {shipment && <Overview shipment={shipment} />}
            {shipment && shipment.status === EShipmentStatus.IDLE && (
              <Detail shipment={shipment} defaultExpanded />
            )}
            <View style={styles.spacingBox} />
          </ScrollView>
          <View style={styles.actionButton}>
            <LinearGradient
              colors={[
                hexToRgba(colors.common.white, 0),
                hexToRgba(colors.common.white, 1),
              ]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View
              style={[styles.buttonWrapper, { paddingBottom: normalize(24) }]}
            >
              <Button
                varient="soft"
                size="large"
                fullWidth
                disabled={shipment?.status !== EShipmentStatus.IDLE}
                title="รับงาน"
                onPress={handleOnAccept}
              />
              <Button
                varient="outlined"
                color="inherit"
                size="large"
                fullWidth
                title="ย้อนกลับ"
                onPress={handleOnClose}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
      <ConfirmAcceptShipmentModal
        ref={acceptShipmentModalRef}
        onCallback={handleOnConfirmedSucces}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
    position: "relative",
  },
  navigator: {
    paddingVertical: normalize(12),
  },
  textCenter: {
    textAlign: "center",
  },
  scrollContainer: {},
  buttonWrapper: {
    backgroundColor: colors.common.white,
    paddingHorizontal: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(8),
  },
  gradient: {
    width: "100%",
    height: normalize(44),
    pointerEvents: "none",
  },
  spacingBox: {
    height: normalize(156),
  },
  actionButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
});
