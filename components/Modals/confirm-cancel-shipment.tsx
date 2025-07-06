import React, {
  forwardRef,
  Fragment,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import Text from "@components/Text";
import { StyleSheet, View } from "react-native";
import { normalize } from "@utils/normalizeSize";
import {
  Shipment,
  useCancelShipmentMutation,
  User,
} from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Button from "../Button";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import Iconify from "../Iconify";

interface ConfirmCancelShipmentProps {
  onCallback: VoidFunction;
}

export interface ConfirmCancelShipmentModalRef {
  present: (shipment: Shipment | undefined) => void;
  close: Function;
}

const ConfirmCancelShipmentModal = forwardRef<
  ConfirmCancelShipmentModalRef,
  ConfirmCancelShipmentProps
>(({ onCallback }, ref) => {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const [cancelShipment, { loading }] = useCancelShipmentMutation();

  function handlePresent(shipment: Shipment | undefined) {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.present(shipment as any);
    }
  }

  function handleCloseModal() {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.close();
    }
  }

  useImperativeHandle(ref, () => ({
    present: handlePresent,
    close: handleCloseModal,
  }));

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      console.log("handleSheetChanges: Open", index);
      // Open
    } else {
      console.log("handleSheetChanges:", index);
      // Closed
    }
  }, []);

  function handleCancelShipmentComplete() {
    onCallback();
  }

  function handleCancelShipmentError(error: ApolloError) {
    handleCloseModal();
    showSnackbar({
      message: error.message,
      title: "ไม่สามารถยกเลิกงานขนส่งได้",
      type: DropdownType.Error,
    });
  }

  const handleCancelShipment = useCallback((shipmentId: string) => {
    cancelShipment({
      variables: { shipmentId, reason: "คนขับยกเลิกงาน" },
      onCompleted: handleCancelShipmentComplete,
      onError: handleCancelShipmentError,
    });
  }, []);

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backdropComponent={SheetBackdrop.NoAnimate}
      enableDynamicSizing={false}
    >
      {({ data }) => {
        const shipment = data as Shipment | undefined;
        if (shipment) {
          return (
            <BottomSheetView style={styles.container}>
              <View style={styles.textWrapper}>
                <Text varient="h4" style={{ marginBottom: normalize(12) }}>
                  ยืนยันยกเลิกงาน
                </Text>
                <Text>คุณแน่ใจใช่ไหมว่าต้องยกเลิกงานหมายเลข</Text>
                <Text varient="subtitle1">{shipment.trackingNumber}</Text>
              </View>
              <View style={styles.actionWrapper}>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    ripple
                    size="large"
                    varient="soft"
                    color="error"
                    title="กดค้างเพื่อยืนยันยกเลิกงาน"
                    fullWidth
                    style={[{ borderRadius: normalize(24) }]}
                    delayLongPress={2000}
                    onLongPress={() => handleCancelShipment(shipment._id)}
                    loading={loading}
                    StartIcon={
                      <Iconify
                        icon="material-symbols:cancel-outline-rounded"
                        color={colors.error.dark}
                      />
                    }
                  />
                </View>
                <View>
                  <Button
                    disabled={loading}
                    onPress={handleCloseModal}
                    fullWidth
                    title="ไม่, ฉันยังไม่แน่ใจ"
                    varient="text"
                    color="inherit"
                  />
                </View>
              </View>
            </BottomSheetView>
          );
        }

        return <Fragment />;
      }}
    </BottomSheetModal>
  );
});

export default ConfirmCancelShipmentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: normalize(16),
    padding: normalize(16),
    backgroundColor: colors.background.default,
  },
  textWrapper: {
    gap: normalize(4),
    alignItems: "center",
  },
  actionWrapper: {
    gap: normalize(16),
  },
});
