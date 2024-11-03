import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import Text from "@components/Text";
import { StyleSheet, View } from "react-native";
import { normalize } from "@utils/normalizeSize";
import { useAssignShipmentMutation, User } from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Button from "../Button";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";

interface ConfirmAssignShipmentProps {
  shipmentId: string;
  onCallback: VoidFunction;
}

export interface ConfirmAssignShipmentModalRef {
  present: (user: User | undefined) => void;
  close: Function;
}

const ConfirmAssignShipmentModal = forwardRef<
  ConfirmAssignShipmentModalRef,
  ConfirmAssignShipmentProps
>(({ onCallback, shipmentId }, ref) => {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const [assignShipment, { loading }] = useAssignShipmentMutation();

  function handlePresent(user: User | undefined) {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.present(user as any);
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

  function handleAssignDriverComplete() {
    onCallback();
  }

  function handleAssignDriverError(error: ApolloError) {
    handleCloseModal();
    showSnackbar({
      message: error.message,
      title: "ไม่สามารถมอบหมายงานได้",
      type: DropdownType.Info,
    });
  }

  const handleAcceptDriver = useCallback((userId: string) => {
    assignShipment({
      variables: { shipmentId, driverId: userId },
      onCompleted: handleAssignDriverComplete,
      onError: handleAssignDriverError,
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
        const user = data as User | undefined;
        if (user) {
          return (
            <BottomSheetView style={styles.container}>
              <View style={styles.textWrapper}>
                <Text varient="h4" style={{ marginBottom: normalize(12) }}>
                  ยืนยันมอบหมายงาน
                </Text>
                <Text>คุณแน่ใจใช่ไหมว่าต้องการมอบหมายงานให้</Text>
                <Text varient="subtitle1">{user.fullname}</Text>
                <Text>ทำงานขนส่งนี้</Text>
              </View>
              <View style={styles.actionWrapper}>
                <Button
                  loading={loading}
                  onPress={() => handleAcceptDriver(user._id)}
                  fullWidth
                  size="large"
                  title="ใช่, ยืนยัน"
                  varient="soft"
                  color="primary"
                />
                <Button
                  loading={loading}
                  onPress={handleCloseModal}
                  fullWidth
                  title="ไม่, ฉันยังไม่แน่ใจ"
                  varient="soft"
                  color="inherit"
                />
              </View>
            </BottomSheetView>
          );
        }

        return <></>;
      }}
    </BottomSheetModal>
  );
});

export default ConfirmAssignShipmentModal;

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
    gap: normalize(8),
  },
});
