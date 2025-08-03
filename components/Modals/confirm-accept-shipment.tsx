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
import {
  Shipment,
  useAcceptShipmentMutation,
} from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Button from "../Button";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { fCurrency, fNumber } from "@/utils/number";
import { last, sortBy } from "lodash";

interface ConfirmAcceptShipmentProps {
  onCallback: VoidFunction;
}

export interface ConfirmAcceptShipmentModalRef {
  present: (shipment: Shipment | undefined) => void;
  close: Function;
}

const ConfirmAcceptShipmentModal = forwardRef<
  ConfirmAcceptShipmentModalRef,
  ConfirmAcceptShipmentProps
>(({ onCallback }, ref) => {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const [acceptShipment, { loading }] = useAcceptShipmentMutation();

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

  function handleAcceptComplete() {
    handleCloseModal();
    onCallback();
    showSnackbar({
      title: "สำเร็จ",
      message: "รับงานสำเร็จ",
      type: DropdownType.Success,
    });
  }

  function handleAcceptShipmentError(error: ApolloError) {
    showSnackbar({
      message: error.message,
      title: "ไม่สามารถรับงานนี้ได้",
      type: DropdownType.Error,
    });
  }

  function handleConfirmed(shipmentId: string) {
    acceptShipment({
      variables: { shipmentId },
      onError: handleAcceptShipmentError,
      onCompleted: handleAcceptComplete,
    });
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

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backdropComponent={SheetBackdrop.Normal}
      enableDynamicSizing={false}
    >
      {({ data }) => {
        const shipment = data as Shipment | undefined;
        const _quotation = last(sortBy(shipment?.quotations, "createdAt"));

        if (shipment) {
          return (
            <BottomSheetView style={styles.container}>
              <View style={styles.textWrapper}>
                <Text varient="h4" style={{ marginBottom: 12 }}>
                  ยืนยันการรับงาน
                </Text>
                <Text>คุณแน่ใจไหมว่า จะรับงานหมายเลข</Text>
                <Text varient="subtitle1">{shipment.trackingNumber}</Text>
                <Text>
                  ราคา{" "}
                  <Text varient="subtitle1">
                    {fCurrency(_quotation?.cost.total || 0)}
                  </Text>{" "}
                  บาท ({fNumber(shipment?.displayDistance / 1000, "0,0.0")} กม.)
                </Text>
              </View>
              <View style={styles.actionWrapper}>
                <View style={{ flexDirection: "row" }}>
                  <Button
                    varient="contained"
                    size="large"
                    fullWidth
                    title="ยืนยันรับงาน"
                    loading={loading}
                    onPress={() => handleConfirmed(shipment._id)}
                  />
                </View>
                <View>
                  <Button
                    varient="outlined"
                    color="inherit"
                    size="large"
                    fullWidth
                    title="ไม่, ฉันขอกลับไปดูรายละเอียด"
                    onPress={handleCloseModal}
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

export default ConfirmAcceptShipmentModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    padding: 16,
    backgroundColor: colors.background.default,
  },
  textWrapper: {
    gap: 4,
    alignItems: "center",
  },
  actionWrapper: {
    gap: 8,
  },
});
