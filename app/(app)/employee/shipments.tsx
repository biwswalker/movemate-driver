import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import SheetBackdrop from "@/components/Sheets/SheetBackdrop";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import { useGetUserQuery, User } from "@/graphql/generated/graphql";
import { imagePath } from "@/utils/file";
import { normalize } from "@/utils/normalizeSize";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  forwardRef,
  Fragment,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Image, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

interface DriverShipmentProps {
  userId: string;
  onClose: VoidFunction;
}

export interface DriverShipmentModalRef {
  present: (userId: string) => void;
  close: Function;
}

function DriverShipments({ userId, onClose }: DriverShipmentProps) {
  //   const filterModalRef = useRef<FilterModalRef>(null);
  const { data, loading } = useGetUserQuery({ variables: { id: userId } });

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

  //   function handleConfirmRemove() {
  //     if (filterModalRef.current) {
  //       filterModalRef.current.present();
  //     }
  //   }

  return (
    <Fragment>
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.driverInfoWrapper}>
            <View style={[styles.headerText, { alignItems: "center" }]}>
              <Text varient="h3" numberOfLines={1}>
                รายการขนส่ง
              </Text>
            </View>
          </View>
          <View style={styles.driverInfoWrapper}>
            {user.profileImage ? (
              <Image
                style={[styles.profileImage]}
                source={{ uri: imagePath(user.profileImage?.filename) }}
              />
            ) : (
              <Iconify
                icon="solar:user-circle-bold-duotone"
                size={44}
                color={colors.text.disabled}
              />
            )}
            <View style={styles.headerText}>
              <Text varient="h5" numberOfLines={1}>
                {user.fullname}
              </Text>
              <Text varient="body2" color="secondary">
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
        </View>
      </View>
      {/* TODO: Filter */}
      {/* <ConfirmRemoveEmployeee user={user} ref={confirmRemoveModalRef} /> */}
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
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  loadingWrapper: {
    paddingVertical: 32,
  },
  driverInfoWrapper: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  headerText: { flex: 1, padding: 6 },
  headerAction: {
    paddingLeft: 8,
  },
});

export default forwardRef<DriverShipmentModalRef, any>(({}, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
        <DriverShipments userId={data as any} onClose={handleCloseModal} />
      )}
    </BottomSheetModal>
  );
});
