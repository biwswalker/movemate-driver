import Button from "@/components/Button";
import Iconify from "@/components/Iconify";
import NavigationBar from "@/components/NavigationBar";
import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EDriverStatus,
  EUserStatus,
  useEmployeesQuery,
  User,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { router } from "expo-router";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import { ActivityIndicator } from "react-native-paper";
import { imagePath } from "@/utils/file";
import Detail, { DriverDetailModalRef } from "./detail";
import { useIsFocused } from "@react-navigation/native";

export default function Employees() {
  const isFocused = useIsFocused();
  const detailRef = useRef<DriverDetailModalRef>(null);
  const { user } = useAuth();
  const { data, loading, called, refetch } = useEmployeesQuery({
    variables: { parentId: user?._id },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  const employees = useMemo<User[]>(() => {
    if (data?.users) {
      return data.users.docs as User[];
    }
    return [];
  }, [data?.users]);

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
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
          <Text color="secondary">ท่านสามารถเพิ่มรายชื่อคนขับได้</Text>
          <View style={styles.emptyDataActions}>
            <Button
              title="เพิ่มคนขับ"
              varient="soft"
              onPress={handleOnAddDriver}
            />
          </View>
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
    return <UserItem onPress={() => handleViewDetail(item._id)} user={item} />;
  }

  return (
    <>
      <View style={styles.container}>
        <SafeAreaView style={styles.wrapper}>
          <NavigationBar
            onBack={handleOnClose}
            title={`คนขับรถ${employees.length > 0 ? ` (${employees.length})` : ""}`}
            RightComponent={
              <Button
                size="small"
                title="เพิ่มคนขับ"
                varient="soft"
                onPress={handleOnAddDriver}
              />
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
    </>
  );
}

interface UserItemProps {
  user: User;
  onPress: VoidFunction;
}

function UserItem({ user, onPress }: UserItemProps) {
  function handleViewDriver() {
    onPress();
  }

  const accountStatus = () => {
    switch (user.status) {
      case EUserStatus.ACTIVE:
        return { label: "ปกติ", color: colors.success.main };
      case EUserStatus.BANNED:
        return { label: "ห้ามใช้งาน", color: colors.error.main };
      case EUserStatus.DENIED:
        return { label: "ปฎิเสธบัญชี", color: colors.text.secondary };
      case EUserStatus.INACTIVE:
        return { label: "ระงับใช้งาน", color: colors.warning.darker };
      case EUserStatus.PENDING:
        return { label: "รอตรวจสอบบัญชี", color: colors.warning.main };
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
      return { label: "-", color: colors.warning.main };
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
        <View>
          <Text varient="body1">{user.fullname}</Text>
          <Text varient="body2" color="secondary">
            {user.contactNumber}
          </Text>
        </View>
      </View>
      <View style={styles.driverStatusWrapper}>
        <View style={styles.driverStatusTextWrapper}>
          <View style={styles.driverStatusText}>
            <Text varient="subtitle2">สถานะบัญชี</Text>
            <Text varient="body2" style={[{ color: statusColor }]}>
              {statusLabel}
            </Text>
          </View>
          <View style={styles.driverStatusText}>
            <Text varient="subtitle2">สถานะขับรถ</Text>
            <Text varient="body2" style={[{ color: drivingStatusColor }]}>
              {drivingStatusLabel}
            </Text>
          </View>
        </View>
        <Button
          title="รายละเอียด"
          color="success"
          varient="soft"
          fullWidth
          onPress={handleViewDriver}
          StartIcon={
            <Iconify
              icon="typcn:plus"
              size={normalize(16)}
              color={colors.success.dark}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  wrapper: {
    flex: 1,
  },
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
  listContainer: {
    paddingHorizontal: normalize(16),
  },
  itemContainer: {
    padding: normalize(12),
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.common.white,
    gap: normalize(16),
    marginBottom: normalize(16)
  },
  driverInfoWrapper: {
    flexDirection: "row",
    gap: normalize(4),
  },
  profileImage: {
    width: normalize(44),
    height: normalize(44),
    borderRadius: normalize(22),
  },
  driverStatusWrapper: {
    backgroundColor: colors.grey[200],
    borderRadius: normalize(16),
    padding: normalize(12),
    gap: normalize(16),
  },
  driverStatusTextWrapper: {
    flexDirection: "row",
    flex: 1,
  },
  driverStatusText: {
    flex: 1,
  },
  emptyDataActions: {
    marginTop: normalize(16),
  },
});
