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
import {
  useAddExistingAccountEmployeeMutation,
  User,
} from "@/graphql/generated/graphql";
import colors from "@constants/colors";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import SheetBackdrop from "../Sheets/SheetBackdrop";
import Button from "../Button";
import { ApolloError } from "@apollo/client";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { router } from "expo-router";

interface ConfirmEmployeeModalProps {
  user: User;
}

export interface ConfirmEmployeeModalRef {
  present: Function;
  close: Function;
}

export default forwardRef<ConfirmEmployeeModalRef, ConfirmEmployeeModalProps>(
  ({ user }, ref) => {
    const { showSnackbar, DropdownType } = useSnackbarV2();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["50%"], []);

    const [addExistingAccountEmployee, { loading }] =
      useAddExistingAccountEmployeeMutation();

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

    function handleAcceptDriverComplete() {
      handleCloseModal();
      router.navigate("/employee/employees");
    }

    function handleAcceptDriverError(error: ApolloError) {
      handleCloseModal();
      showSnackbar({
        message: error.message,
        title: "ไม่สามารถเพิ่มได้",
        type: DropdownType.Info,
      });
    }

    function handleAcceptDriver() {
      addExistingAccountEmployee({
        variables: { driverId: user._id },
        onCompleted: handleAcceptDriverComplete,
        onError: handleAcceptDriverError,
      });
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
              ยืนยันเพิ่มคนขับ
            </Text>
            <Text>คุณแน่ใจใช่ไหมว่าต้องการเพิ่ม</Text>
            <Text varient="subtitle1">{user.fullname}</Text>
            <Text>เป็นคนขับของคุณ</Text>
          </View>
          <View style={styles.actionWrapper}>
            <Button
              loading={loading}
              onPress={handleAcceptDriver}
              fullWidth
              size="large"
              title="ใช่, ยืนยัน"
              varient="soft"
              color="primary"
            />
            <Button
              disabled={loading}
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
  }
);

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
    gap: 8,
  },
});
