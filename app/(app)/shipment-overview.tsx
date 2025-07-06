import Button from "@/components/Button";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EShipmentMatchingCriteria,
  EShipmentStatus,
  Shipment,
  useAcceptShipmentMutation,
  useGetAvailableShipmentByTrackingNumberQuery,
} from "@/graphql/generated/graphql";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { normalize } from "@/utils/normalizeSize";
import { fCurrency, fNumber } from "@/utils/number";
import { ApolloError } from "@apollo/client";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import hexToRgba from "hex-to-rgba";
import { isEqual, last, sortBy } from "lodash";
import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BackHandler, Modal, StyleSheet, View } from "react-native";
import { DropdownAlertType } from "react-native-dropdownalert";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import Overview from "@/components/Shipment/WorkDetail/Overview";
import Detail from "@/components/Shipment/WorkDetail/Detail";
import useAuth from "@/hooks/useAuth";

export default function ShipmentOverview() {
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();

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
    setConfirmOpen(true);
  }

  return (
    <Fragment>
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
              <Detail shipment={shipment} />
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
      {shipment && (
        <ConfirmDialog
          open={confirmOpen}
          setOpen={setConfirmOpen}
          shipment={shipment}
        />
      )}
    </Fragment>
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

interface IConfirmDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shipment: Shipment;
}

function ConfirmDialog({ open, setOpen, shipment }: IConfirmDialogProps) {
  const { showSnackbar } = useSnackbarV2();
  const _quotation = last(sortBy(shipment.quotations, "createdAt"));

  const handleClose = () => {
    setOpen(false);
  };

  const [acceptShipment, { loading }] = useAcceptShipmentMutation();

  function handleAcceptComplete() {
    setOpen(false);
    router.dismiss();
    router.push(`/shipment?active=${EShipmentMatchingCriteria.PROGRESSING}`);
  }

  function handleAcceptShipmentError(error: ApolloError) {
    showSnackbar({
      message: error.message,
      title: "ไม่สามารถรับงานนี้ได้",
      type: DropdownAlertType.Error,
    });
  }

  function handleConfirmed() {
    if (shipment) {
      acceptShipment({
        variables: { shipmentId: shipment._id },
        onError: handleAcceptShipmentError,
        onCompleted: handleAcceptComplete,
      });
    }
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <View style={modalStyle.container}>
        <View style={modalStyle.wrapper}>
          <View style={modalStyle.titleWrapper}>
            <Text varient="h4">ยืนยันการรับงาน</Text>
          </View>
          <View style={modalStyle.detailWrapper}>
            <Text>คุณแน่ใจไหมว่า จะรับงานหมายเลข </Text>
            <Text
              varient="h5"
              style={{ color: colors.primary.darker, paddingTop: 12 }}
            >
              {shipment?.trackingNumber || ""}
            </Text>
            <Text>
              ราคา{" "}
              <Text varient="subtitle1">
                {fCurrency(_quotation?.cost.total || 0)}
              </Text>{" "}
              บาท ({fNumber(shipment?.displayDistance / 1000, "0,0.0")} กม.)
            </Text>
          </View>
          <View style={modalStyle.actionWrapper}>
            <Button
              varient="contained"
              size="large"
              fullWidth
              title="ยืนยันรับงาน"
              loading={loading}
              onPress={handleConfirmed}
            />
            <Button
              varient="outlined"
              color="inherit"
              size="large"
              fullWidth
              title="ไม่, ฉันขอกลับไปดูรายละเอียด"
              onPress={handleClose}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyle = StyleSheet.create({
  container: {
    backgroundColor: hexToRgba(colors.common.black, 0.32),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: normalize(24),
  },
  wrapper: {
    backgroundColor: colors.common.white,
    overflow: "hidden",
    borderRadius: normalize(16),
    width: "100%",
    padding: normalize(24),
  },
  actionWrapper: {
    gap: 8,
  },
  titleWrapper: {
    marginBottom: normalize(16),
  },
  detailWrapper: {
    marginBottom: normalize(24),
  },
});
