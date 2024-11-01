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
import { User } from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Button from "../Button";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router } from "expo-router";

interface ConfirmRemoveEmployeeModalProps {
  user: User;
}

export interface ConfirmRemoveEmployeeModalRef {
  present: Function;
  close: Function;
}

export default forwardRef<
  ConfirmRemoveEmployeeModalRef,
  ConfirmRemoveEmployeeModalProps
>(function ConfirmRemoveEmployeee({ user }, ref) {
  const { showSnackbar, DropdownType } = useSnackbarV2();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const loading = false;
  // const [removeEmployee, { loading }] =
  //   useRemoveEmployeeMutation();

  function handlePresent() {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.present();
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

  function handleRemoveDriverComplete() {
    handleCloseModal();
    router.navigate("/employee/employees");
  }

  function handleRemoveDriverError(error: ApolloError) {
    handleCloseModal();
    showSnackbar({
      message: error.message,
      title: "ไม่สามารถนำออกได้",
      type: DropdownType.Info,
    });
  }

  function handleRemoveDriver() {
    // removeEmployee({
    //   variables: { driverId: user._id },
    //   onCompleted: handleAcceptDriverComplete,
    //   onError: handleAcceptDriverError,
    // });
  }

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      backdropComponent={SheetBackdrop.NoAnimate}
      enableDynamicSizing={false}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.textWrapper}>
          <Text varient="h4" style={{ marginBottom: normalize(12) }}>
            ยืนยันนำคนขับออก
          </Text>
          <Text>คุณแน่ใจใช่ไหมว่าต้องการให้</Text>
          <Text varient="subtitle1">{user.fullname}</Text>
          <Text>ออกจากบริษัท</Text>
        </View>
        <View style={styles.actionWrapper}>
          <Button
            loading={loading}
            onPress={handleRemoveDriver}
            fullWidth
            size="large"
            title="ใช่, ยืนยันนำคนออก"
            varient="soft"
            color="error"
          />
          <Button
            loading={loading}
            onPress={handleCloseModal}
            fullWidth
            title="ไม่ใช่ตอนนี้"
            varient="soft"
            color="inherit"
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

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
