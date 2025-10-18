import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import SheetBackdrop from "@/components/Sheets/SheetBackdrop";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import {
  EDriverStatus,
  EUserStatus,
  EUserValidationStatus,
  useGetUserQuery,
  User,
  useResentEmployeeMutation,
} from "@/graphql/generated/graphql";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import ConfirmRemoveEmployeee, {
  ConfirmRemoveEmployeeModalRef,
} from "@components/Modals/confirm-remove-employee";
import DriverShipments, { DriverShipmentModalRef } from "./shipments";
import { includes } from "lodash";
import useAuth from "@/hooks/useAuth";
import hexToRgba from "hex-to-rgba";
import { router } from "expo-router";
import { useSnackbarV2 } from "@/hooks/useSnackbar";

interface DriverDetailProps {
  userId: string;
  onClose: VoidFunction;
}

export interface DriverDetailModalRef {
  present: (userId: string) => void;
  close: Function;
}

function DriverDetail({ userId, onClose }: DriverDetailProps) {
  const { user: me } = useAuth();
  const { DropdownType, showSnackbar } = useSnackbarV2();

  const shipmentModalRef = useRef<DriverShipmentModalRef>(null);
  const confirmRemoveModalRef = useRef<ConfirmRemoveEmployeeModalRef>(null);
  const { data, loading } = useGetUserQuery({
    variables: { id: userId },
    fetchPolicy: "network-only",
  });
  const [resentEmployee, { loading: resentLoading }] =
    useResentEmployeeMutation();

  const user = useMemo(() => {
    return data?.getUser as User | undefined;
  }, [data?.getUser]);

  if (loading || !user) {
    return (
      <View style={styles.loadingWrapper}>
        <ActivityIndicator size="small" color={colors.text.secondary} />
      </View>
    );
  }

  function handleOpenShipment() {
    if (shipmentModalRef.current) {
      shipmentModalRef.current.present(userId);
    }
  }

  function handleOpenReRegister() {
    onClose();
    const param = JSON.stringify({ id: user?._id });
    router.push({
      pathname: "/employee/re-register/re-register",
      params: { param },
    });
  }

  function handleConfirmRemove() {
    if (confirmRemoveModalRef.current) {
      confirmRemoveModalRef.current.present();
    }
  }

  function handleRemoved() {
    onClose();
  }

  function handleReInviteDriver() {
    resentEmployee({
      variables: { driverId: userId },
      onCompleted: () => {
        showSnackbar({
          title: "สำเร็จ",
          message: "ส่งคำขอใหม่สำเร็จ",
          type: DropdownType.Success,
        });
      },
      onError: (error) => {
        console.log("error: ", error);
        showSnackbar({
          title: "เกิดข้อผิดพลาด",
          message: error.message || "ส่งคำขอใหม่อีกครั้ง",
          type: DropdownType.Error,
        });
      },
    });
  }

  const isRejectedRequest = includes(user.rejectedRequestParents, me?._id);
  const isPendingRequest = includes(user.requestedParents, me?._id);

  const accountStatus = () => {
    switch (user.status) {
      case EUserStatus.ACTIVE:
        if (includes(user.requestedParents, me?._id)) {
          return { label: "รอตอบรับ", color: colors.warning.main };
        } else if (includes(user.rejectedRequestParents, me?._id)) {
          return { label: "ปฏิเสธการชวน", color: colors.error.main };
        }
        return { label: "ปกติ", color: colors.success.main };
      case EUserStatus.BANNED:
        return { label: "ห้ามใช้งาน", color: colors.primary.main };
      case EUserStatus.DENIED:
        return { label: "ถูกปฎิเสธบัญชี", color: colors.text.secondary };
      case EUserStatus.INACTIVE:
        return { label: "ถูกระงับ", color: colors.error.darker };
      case EUserStatus.PENDING:
        return { label: "รอตรวจสอบ", color: colors.warning.light };
      default:
        return { label: "", color: colors.divider };
    }
  };

  const drivingStatus = () => {
    if (user.status === EUserStatus.ACTIVE) {
      switch (user.drivingStatus) {
        case EDriverStatus.IDLE:
          return { label: "ว่าง", color: colors.success.main };
        case EDriverStatus.WORKING:
          return { label: "ดำเนินการขนส่งอยู่", color: colors.info.main };
        case EDriverStatus.BUSY:
          return { label: "ไม่ว่าง", color: colors.warning.main };
        default:
          return { label: "", color: colors.divider };
      }
    } else {
      return { label: "-", color: colors.text.secondary };
    }
  };

  const { color: statusColor, label: statusLabel } = accountStatus();
  const { color: drivingStatusColor, label: drivingStatusLabel } =
    drivingStatus();

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.driverInfoWrapper}>
            {user.profileImage ? (
              <Image
                style={[styles.profileImage]}
                source={{ uri: imagePath(user.profileImage?.filename) }}
              />
            ) : (
              <Iconify
                icon="solar:user-circle-bold-duotone"
                size={normalize(44)}
                color={colors.text.disabled}
              />
            )}
            <View style={styles.headerText}>
              <Text varient="h5" numberOfLines={1}>
                {user.fullname}
              </Text>
              <Text
                varient="body2"
                color="secondary"
                style={{ lineHeight: normalize(18) }}
              >
                {user.userNumber}
              </Text>
            </View>
            <View style={styles.headerAction}>
              <ButtonIcon
                circle
                varient="soft"
                color="inherit"
                onPress={onClose}
              >
                {({ color }) => (
                  <Iconify icon="bx:chevron-down" color={color} />
                )}
              </ButtonIcon>
            </View>
          </View>
          <View style={styles.actionWrapper}>
            {isRejectedRequest ? (
              <Button
                title="คนขับปฏิเสธการชวน ชวนอีกครั้ง"
                color="error"
                varient="soft"
                fullWidth
                loading={resentLoading}
                onPress={handleReInviteDriver}
                StartIcon={
                  <Iconify icon="bi:plus" size={16} color={colors.error.dark} />
                }
              />
            ) : isPendingRequest ? (
              <View>
                <View style={styles.waitingForRequestWrapper}>
                  <Text style={styles.waitingForRequestText}>
                    กำลังรอการตอบรับจากคนขับ
                  </Text>
                </View>
              </View>
            ) : user.status === EUserStatus.ACTIVE ? (
              <Button
                fullWidth
                StartIcon={
                  <Iconify
                    icon="solar:box-bold-duotone"
                    color={colors.info.dark}
                  />
                }
                title="รายการขนส่ง"
                varient="soft"
                color="info"
                onPress={handleOpenShipment}
              />
            ) : user.validationStatus === EUserValidationStatus.DENIED ? (
              <Button
                fullWidth
                StartIcon={
                  <Iconify icon="gg:details-less" color={colors.warning.dark} />
                }
                title="ดำเนินการแก้ไขบัญชี"
                varient="soft"
                color="warning"
                onPress={handleOpenReRegister}
              />
            ) : (
              <Fragment />
            )}
          </View>
          <View style={styles.detailWrapper}>
            <View style={styles.detailRowWrapper}>
              <View style={styles.detail}>
                <Text varient="body2">หมายเลขโทรศัพท์</Text>
                <Text
                  varient="body1"
                  color="secondary"
                  style={{ lineHeight: normalize(20) }}
                >
                  {user.contactNumber}
                </Text>
              </View>

              <View style={styles.detail}>
                <Text varient="body2">บัญชีไลน์</Text>
                <Text
                  varient="body1"
                  color="secondary"
                  style={{ lineHeight: normalize(20) }}
                >
                  {user.driverDetail?.lineId || "-"}
                </Text>
              </View>
            </View>
            <View style={styles.detailRowWrapper}>
              <View style={styles.detail}>
                <Text varient="body2">สถานะบัญชี</Text>
                <Text
                  varient="body1"
                  style={{ lineHeight: normalize(20), color: statusColor }}
                >
                  {statusLabel}
                </Text>
              </View>
              <View style={styles.detail}>
                <Text varient="body2">สถานะขับรถ</Text>
                <Text
                  varient="body1"
                  style={{
                    lineHeight: normalize(20),
                    color:
                      isRejectedRequest || isPendingRequest
                        ? colors.text.secondary
                        : drivingStatusColor,
                  }}
                >
                  {isRejectedRequest || isPendingRequest
                    ? "-"
                    : drivingStatusLabel}
                </Text>
              </View>
            </View>
            {user.validationRejectedMessage && (
              <View style={styles.detailRowWrapper}>
                <View style={styles.detail}>
                  <Text varient="body2">เหตุผลปฏิเสธบัญชี</Text>
                  <Text
                    varient="body1"
                    color="secondary"
                    style={{ lineHeight: normalize(20) }}
                  >
                    {user.validationRejectedMessage}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.detailRowWrapper}>
              <View style={styles.detail}>
                <Text varient="body2">ทะเบียนรถ</Text>
                <Text
                  varient="body1"
                  color="secondary"
                  style={{ lineHeight: normalize(20) }}
                >
                  {user.driverDetail?.licensePlateNumber}{" "}
                  ({user.driverDetail?.licensePlateProvince})
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.actionWrapper}>
            <Button
              title="นำคนขับออก"
              varient="outlined"
              color="error"
              onPress={handleConfirmRemove}
            />
          </View>
        </View>
      </View>
      <ConfirmRemoveEmployeee
        user={user}
        ref={confirmRemoveModalRef}
        onRemoved={handleRemoved}
      />
      <DriverShipments ref={shipmentModalRef} />
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  wrapper: {
    flex: 1,
    paddingTop: normalize(16),
    paddingHorizontal: normalize(16),
  },
  loadingWrapper: {
    paddingVertical: normalize(32),
  },
  driverInfoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(8),
  },
  profileImage: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
  },
  headerText: { flex: 1, paddingLeft: 6 },
  headerAction: {
    paddingLeft: normalize(8),
  },
  detailWrapper: {
    paddingTop: normalize(16),
    gap: normalize(16),
    flex: 1,
  },
  detailRowWrapper: {
    flexDirection: "row",
  },
  detail: {
    flex: 1,
    gap: 8,
  },
  actionWrapper: {
    paddingVertical: 24,
    alignItems: "center",
  },
  waitingForRequestWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    borderRadius: normalize(6),
    alignSelf: "center",
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
  },
  waitingForRequestText: {
    color: colors.warning.dark,
  },
});

export default forwardRef<DriverDetailModalRef, any>(({}, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    const backAction = () => {
      handleCloseModal();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  function handlePresent(userId: string) {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current?.present(userId as any);
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

  return (
    <BottomSheetModal
      detached
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      snapPoints={["100%"]}
      backdropComponent={SheetBackdrop.NoAnimate}
      enableDynamicSizing={false}
    >
      {({ data }) => (
        <DriverDetail userId={data as any} onClose={handleCloseModal} />
      )}
    </BottomSheetModal>
  );
});
