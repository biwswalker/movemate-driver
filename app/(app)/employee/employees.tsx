import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EDriverStatus,
  EUserCriterialType,
  EUserRole,
  EUserStatus,
  useEmployeesQuery,
  User,
  useResentEmployeeMutation,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";
import { get, includes, isEmpty, map, reduce } from "lodash";
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BackHandler, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import { imagePath } from "@/utils/file";
import Detail, { DriverDetailModalRef } from "./detail";
import { useIsFocused } from "@react-navigation/native";
import hexToRgba from "hex-to-rgba";
import { useSnackbarV2 } from "@/hooks/useSnackbar";

export default function Employees() {
  const isFocused = useIsFocused();
  const detailRef = useRef<DriverDetailModalRef>(null);
  const { user } = useAuth();
  const { data, loading, called, refetch } = useEmployeesQuery({
    variables: {
      parentId: user?._id || "",
      userRole: EUserRole.DRIVER,
      userType: EUserCriterialType.INDIVIDUAL,
    },
    onError: (error) => {
      console.log("error: ", error);
    },
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
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const isActiveUser = useMemo(
    () => [EUserStatus.ACTIVE].includes(user?.status || EUserStatus.INACTIVE),
    [user?.status]
  );

  const employees = useMemo<User[]>(() => {
    if (data?.users) {
      return data.users.docs as User[];
    }
    return [];
  }, [data?.users]);

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismissAll();
      router.replace("/(app)/(tabs)");
    }
  }

  function _FooterAction() {
    if (!called || loading) {
      return (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color={colors.text.secondary} />
        </View>
      );
    }
    if (isEmpty(employees)) {
      return (
        <View style={styles.loadingWrapper}>
          <Iconify
            icon="iconoir:file-not-found"
            color={colors.primary.main}
            size={normalize(44)}
          />
          <Text color="secondary" style={{ marginTop: normalize(16) }}>
            ไม่พบคนขับ
          </Text>

          {isActiveUser && (
            <>
              <Text color="secondary">ท่านสามารถเพิ่มรายชื่อคนขับได้</Text>
              <View style={styles.emptyDataActions}>
                <Button
                  title="เพิ่มคนขับ"
                  varient="soft"
                  onPress={handleOnAddDriver}
                />
              </View>
            </>
          )}
        </View>
      );
    }
  }

  function handleOnAddDriver() {
    router.push("/employee/new");
  }

  const handleViewDetail = useCallback((userId: string) => {
    if (detailRef.current) {
      detailRef.current.present(userId);
    }
  }, []);

  function _Item({ item }: ListRenderItemInfo<User>) {
    return (
      <UserItem
        onPress={() => handleViewDetail(item._id)}
        user={item}
        disabled={!isActiveUser}
        onReload={refetch}
      />
    );
  }

  return (
    <Fragment>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <NavigationBar
            onBack={handleOnClose}
            title={`คนขับรถ${employees.length > 0 ? ` (${employees.length})` : ""}`}
            RightComponent={
              isActiveUser ? (
                <Button
                  size="small"
                  title="เพิ่มคนขับ"
                  varient="soft"
                  onPress={handleOnAddDriver}
                />
              ) : (
                <></>
              )
            }
          />
          <FlashList
            data={employees}
            renderItem={_Item}
            keyExtractor={(item, indx) => `${indx}-${item._id}`}
            scrollEnabled
            contentContainerStyle={styles.listContainer}
            estimatedItemSize={normalize(100)}
            ListFooterComponent={_FooterAction}
          />
        </SafeAreaView>
      </View>
      <Detail ref={detailRef} />
    </Fragment>
  );
}

interface UserItemProps {
  user: User;
  disabled?: boolean;
  onPress: VoidFunction;
  onReload: VoidFunction;
}

function UserItem({ user, disabled, onPress, onReload }: UserItemProps) {
  const { user: me } = useAuth();
  const { DropdownType, showSnackbar } = useSnackbarV2();
  const [resentEmployee, { loading: resentLoading }] =
    useResentEmployeeMutation();

  function handleViewDriver() {
    onPress();
  }

  function handleReInviteDriver() {
    resentEmployee({
      variables: { driverId: user._id },
      onCompleted: () => {
        onReload();
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

  const isPendingRequest = includes(user.requestedParents, me?._id);
  const isRejectedRequest = includes(user.rejectedRequestParents, me?._id);

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
  const { color: drivingStatusColor, label: drivingStatusLabel } =
    drivingStatus();

  return (
    <View style={styles.itemContainer}>
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
        <View style={{ paddingLeft: 6 }}>
          <Text varient="body1">{user.fullname}</Text>
          <Text varient="body2" color="secondary">
            {user.contactNumber}
          </Text>
        </View>
      </View>
      <View style={styles.driverStatusWrapper}>
        <View style={styles.driverStatusTextWrapper}>
          <View style={styles.driverStatusText}>
            <Text varient="subtitle2">ประเภทรถ</Text>
            <Text varient="body2" color="secondary">
              {reduce(
                get(user, "driverDetail.serviceVehicleTypes", []),
                (prev, vehicle) =>
                  prev ? `${prev}, ${vehicle.name}` : vehicle.name,
                ""
              )}
            </Text>
          </View>
        </View>
        <View style={styles.driverStatusTextWrapper}>
          <View style={styles.driverStatusText}>
            <Text varient="subtitle2">สถานะบัญชี</Text>
            <Text varient="body2" style={[{ color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
          <View style={styles.driverStatusText}>
            <Text varient="subtitle2">สถานะขับรถ</Text>
            <Text
              varient="body2"
              style={[
                {
                  color:
                    isRejectedRequest || isPendingRequest
                      ? colors.text.secondary
                      : drivingStatusColor,
                },
              ]}
            >
              {isRejectedRequest || isPendingRequest ? "-" : drivingStatusLabel}
            </Text>
          </View>
        </View>
        {user.validationRejectedMessage && (
          <View style={styles.rejectedRequestWrapper}>
            <Text varient="caption" style={styles.rejectedRequestText}>
              {user.validationRejectedMessage}
            </Text>
          </View>
        )}

        {!disabled &&
          (isRejectedRequest ? (
            <Button
              title="ชวนอีกครั้ง"
              color="warning"
              varient="soft"
              fullWidth
              loading={resentLoading}
              onPress={handleReInviteDriver}
              StartIcon={
                <Iconify icon="bi:plus" size={16} color={colors.warning.dark} />
              }
            />
          ) : (
            <Button
              title="รายละเอียด"
              color="info"
              varient="soft"
              fullWidth
              onPress={handleViewDriver}
              StartIcon={
                <Iconify
                  icon="gg:details-more"
                  size={16}
                  color={colors.info.dark}
                />
              }
            />
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.common.white },
  wrapper: { flex: 1 },
  // employeeNumberWrapper: {
  //   marginHorizontal: normalize(16),
  //   flex: 0,
  //   borderRadius: normalize(16),
  //   alignItems: "center",
  //   paddingHorizontal: normalize(8),
  //   paddingVertical: normalize(16),
  //   backgroundColor: hexToRgba(colors.primary.main, 0.08),
  // },
  loadingWrapper: {
    padding: normalize(24),
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: { paddingHorizontal: normalize(16) },
  itemContainer: {
    padding: normalize(12),
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.common.white,
    gap: normalize(16),
    marginBottom: normalize(16),
  },
  driverInfoWrapper: { flexDirection: "row", gap: normalize(4) },
  profileImage: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
  },
  driverStatusWrapper: {
    backgroundColor: colors.grey[200],
    borderRadius: normalize(16),
    padding: normalize(12),
    gap: normalize(12),
  },
  driverStatusTextWrapper: { flexDirection: "row", flex: 1 },
  driverStatusText: { flex: 1 },
  emptyDataActions: { marginTop: normalize(16) },
  waitingForRequestWrapper: {
    backgroundColor: hexToRgba(colors.warning.main, 0.08),
    borderRadius: normalize(6),
    alignSelf: "center",
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
  },
  waitingForRequestText: { color: colors.warning.dark },
  rejectedRequestWrapper: {
    backgroundColor: hexToRgba(colors.error.main, 0.08),
    borderRadius: normalize(6),
    alignSelf: "center",
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
  },
  rejectedRequestText: { color: colors.error.dark },
});
