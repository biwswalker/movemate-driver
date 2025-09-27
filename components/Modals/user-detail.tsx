import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import SheetBackdrop from "@/components/Sheets/SheetBackdrop";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import {
  EDriverStatus,
  EUserStatus,
  useGetUserQuery,
  User,
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
} from "react";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import hexToRgba from "hex-to-rgba";

interface UserDetailProps {
  userId: string;
  onClose: VoidFunction;
}

export interface UserDetailModalRef {
  present: (userId: string) => void;
  close: Function;
}

function UserDetail({ userId, onClose }: UserDetailProps) {
  const { data, loading } = useGetUserQuery({
    variables: { id: userId },
    fetchPolicy: "network-only",
  });

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

  const accountStatus = () => {
    switch (user.status) {
      case EUserStatus.ACTIVE:
        return { label: "ปกติ", color: colors.success.main };
      case EUserStatus.BANNED:
        return { label: "ห้ามใช้งาน", color: colors.error.main };
      case EUserStatus.DENIED:
        return { label: "ถูกปฎิเสธบัญชี", color: colors.text.secondary };
      case EUserStatus.INACTIVE:
        return { label: "ถูกระงับ", color: colors.warning.darker };
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
  // const { color: drivingStatusColor, label: drivingStatusLabel } =
  //   drivingStatus();

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
              {/* <View style={styles.detail}>
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
              </View> */}
            </View>
            {user.driverDetail?.licensePlateNumber && user.driverDetail?.licensePlateProvince && (
            <View style={styles.detailRowWrapper}>
              <View style={styles.detail}>
                <Text varient="body2">ทะเบียนรถ</Text>
                <Text
                  varient="body1"
                  color="secondary"
                  style={{ lineHeight: normalize(20) }}
                >
                  {user.driverDetail?.licensePlateNumber} (
                  {user.driverDetail?.licensePlateProvince})
                </Text>
              </View>
            </View>
            )}
          </View>
        </View>
      </View>
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

export default forwardRef<UserDetailModalRef, any>(({}, ref) => {
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
        <UserDetail userId={data as any} onClose={handleCloseModal} />
      )}
    </BottomSheetModal>
  );
});
