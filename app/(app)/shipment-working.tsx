import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EDriverStatus,
  EShipmentStatus,
  EStepDefinition,
  EStepStatus,
  EUserStatus,
  Shipment,
  StepDefinition,
  useAvailableEmployeesQuery,
  useGetAvailableShipmentByTrackingNumberQuery,
  User,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import {
  BottomSheetFlashList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { filter, find, get, includes, isEmpty, sortBy } from "lodash";
import {
  forwardRef,
  Fragment,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import NavigationBar from "@/components/NavigationBar";
import Overview from "@/components/Shipment/WorkDetail/Overview";
import Detail from "@/components/Shipment/WorkDetail/Detail";
import { MainStep } from "@/components/Shipment/Steps/Main";
import FinishShipment from "@/components/Shipment/Steps/FinishStep";
import SheetBackdrop from "@/components/Sheets/SheetBackdrop";
import SheetHandle from "@/components/Sheets/SheetHandle";
import { ActivityIndicator } from "react-native-paper";
import { ListRenderItemInfo } from "@shopify/flash-list";
import Iconify from "@/components/Iconify";
import { imagePath } from "@/utils/file";
import Button from "@/components/Button";
import ConfirmAssignShipmentModal, {
  ConfirmAssignShipmentModalRef,
} from "@/components/Modals/confirm-assign-shipment";
import ConfirmCancelShipmentModal, {
  ConfirmCancelShipmentModalRef,
} from "@/components/Modals/confirm-cancel-shipment";
import { useSnackbarV2 } from "@/hooks/useSnackbar";
import { differenceInMinutes } from "date-fns";

export default function ShipmentDetail() {
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();
  const shipmentStepModalRef = useRef<BottomSheetModal>(null);
  const assignDriverModalRef = useRef<AssingDriverModalRef>(null);
  const cancelShipmentModalRef = useRef<ConfirmCancelShipmentModalRef>(null);
  // const { showSnackbar, DropdownType } = useSnackbarV2();

  const { data, refetch } = useGetAvailableShipmentByTrackingNumberQuery({
    variables: { tracking: searchParam.trackingNumber },
    fetchPolicy: "network-only",
  });

  const snapPoints = useMemo(() => ["15%", "90%"], []); // "85%"
  const shipment = useMemo<Shipment | undefined>(
    () => data?.getAvailableShipmentByTrackingNumber as Shipment,
    [data]
  );
  const steps = useMemo<StepDefinition[]>(() => {
    const allSteps = data?.getAvailableShipmentByTrackingNumber?.steps || [];
    const sorted = sortBy(allSteps, ["seq"]);
    return sorted;
  }, [data]);

  const currentStepSeq = get(shipment, "currentStepSeq", 0);
  const currentStepDefinition = find(steps || [], ["seq", currentStepSeq]);

  const isPendingAssignDriver =
    currentStepDefinition?.step === EStepDefinition.ASSIGN_SHIPMENT &&
    currentStepDefinition.stepStatus === EStepStatus.PROGRESSING &&
    shipment?.status === EShipmentStatus.PROGRESSING;
  const isConfirmFinishShipment =
    currentStepDefinition?.step === EStepDefinition.FINISH &&
    currentStepDefinition.stepStatus === EStepStatus.PROGRESSING &&
    shipment?.status === EShipmentStatus.PROGRESSING;

  const isAbleToCancel = useMemo(() => {
    if (shipment?.status !== EShipmentStatus.PROGRESSING) {
      return false;
    }
    const confirmDateTimeStep = find(steps || [], [
      "step",
      EStepDefinition.CONFIRM_DATETIME,
    ]);
    if (!confirmDateTimeStep) {
      return false;
    } else if ((currentStepDefinition?.seq || 0) > confirmDateTimeStep.seq) {
      return false;
    }
    const currentData = new Date();
    const bookingDate = new Date(shipment?.bookingDateTime);
    const differredMinute = differenceInMinutes(bookingDate, currentData);
    if (differredMinute <= 180) {
      return false;
    }
    return true;
  }, [currentStepDefinition, shipment]);

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
    if (shipment) {
      if (isPendingAssignDriver) {
        if (assignDriverModalRef.current) {
          assignDriverModalRef.current.present(shipment._id);
          if (shipmentStepModalRef.current) {
            shipmentStepModalRef.current.close();
          }
        }
      } else {
        if (shipmentStepModalRef.current) {
          shipmentStepModalRef.current.present();
          if (assignDriverModalRef.current) {
            assignDriverModalRef.current.close();
          }
        }
      }
    }
  }, [shipment]);

  // Bottom Sheet
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  // Datas
  function handleRefetch() {
    refetch();
  }

  function handleAssignSuccess() {
    handleRefetch();
  }

  function handleOnCancelShipmenSuccess() {
    if (cancelShipmentModalRef.current) {
      cancelShipmentModalRef.current.close();
    }
    handleRefetch();
  }

  function handleOnCancelShipment() {
    let notIncludedCondition = false;
    if (shipment?.status !== EShipmentStatus.PROGRESSING) {
      notIncludedCondition = true;
    }
    if (!currentStepDefinition) {
      notIncludedCondition = true;
    }

    const confirmDateTimeStep = find(steps || [], [
      "step",
      EStepDefinition.CONFIRM_DATETIME,
    ]);
    if (!confirmDateTimeStep) {
      notIncludedCondition = true;
    } else if ((currentStepDefinition?.seq || 0) > confirmDateTimeStep.seq) {
      notIncludedCondition = true;
    }

    const currentData = new Date();
    const bookingDate = new Date(shipment?.bookingDateTime);
    const differredMinute = differenceInMinutes(bookingDate, currentData);
    if (differredMinute < 180) {
      notIncludedCondition = true;
    }

    if (notIncludedCondition) {
      // showSnackbar({
      //   title: "ไม่สามารถยกเลิกงานขนส่งได้",
      //   message: "เนื่องจากหมดช่วยเวลาของการยกเลิกแล้ว",
      //   type: DropdownType.Error,
      // });
      return;
    }
    if (cancelShipmentModalRef.current) {
      cancelShipmentModalRef.current.present(shipment);
    }
  }

  function handleOnShipmentComplete() {
    if (shipmentStepModalRef.current) {
      shipmentStepModalRef.current.close();
    }
    router.push({
      pathname: "/shipment-success",
      params: { trackingNumber: shipment?.trackingNumber || "" },
    });
  }

  // function handleViewDetail() {
  //   router.push({
  //     pathname: "/shipment-detail",
  //     params: { trackingNumber: shipment?.trackingNumber || "" },
  //   });
  // }

  // function ShipmentWorkingModal() {
  //   const activeIndex = includes(
  //     [EShipmentStatus.IDLE, EShipmentStatus.PROGRESSING],
  //     shipment?.status
  //   )
  //     ? 1
  //     : 0;
  //   return (
  //     <BottomSheetModal
  //       ref={shipmentStepModalRef}
  //       index={activeIndex}
  //       detached
  //       enablePanDownToClose={false}
  //       enableDynamicSizing={false}
  //       style={styles.sheetContainer}
  //       topInset={StatusBar.currentHeight || 0}
  //       snapPoints={snapPoints}
  //       onChange={handleSheetChange}
  //       handleComponent={SheetHandle}
  //       backdropComponent={SheetBackdrop.Default}
  //     >
  //       <BottomSheetView
  //         style={{
  //           flex: 1,
  //           gap: 8,
  //         }}
  //       >
  //         <View style={{ paddingHorizontal: normalize(16) }}>
  //           <Text varient="body2" color="secondary">
  //             รายละเอียด
  //           </Text>
  //           <Text varient="h4">ขั้นตอนงานขนส่ง</Text>
  //         </View>
  //         {shipment && (
  //           <ScrollView style={{ paddingBottom: normalize(32) }}>
  //             <MainStep
  //               steps={stepItems}
  //               shipment={shipment}
  //               refetch={handleRefetch}
  //             />
  //             {isConfirmFinishShipment && (
  //               <FinishShipment
  //                 shipmentId={shipment._id}
  //                 onFinishComplete={handleOnShipmentComplete}
  //               />
  //             )}
  //           </ScrollView>
  //         )}
  //       </BottomSheetView>
  //     </BottomSheetModal>
  //   );
  // }

  const stepItems = filter(
    steps,
    (step) =>
      !isEmpty(step.driverMessage) &&
      !includes(
        [EStepDefinition.FINISH, EStepDefinition.ASSIGN_SHIPMENT],
        step.step
      )
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.wrapper}>
        <NavigationBar
          onBack={handleOnClose}
          containerStyle={styles.navigator}
          TitleComponent={
            <View>
              <Text varient="body2" color="secondary" style={styles.textCenter}>
                หมายเลขงานขนส่ง
              </Text>
              <Text varient="h4" style={styles.textCenter}>
                {searchParam?.trackingNumber || ""}
              </Text>
            </View>
          }
        />
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {shipment && (
            <Fragment>
              <Overview shipment={shipment} />
              <Detail shipment={shipment} />

              <View
                style={[styles.dividerContainer, { marginTop: normalize(16) }]}
              >
                <View style={[styles.divider, { flex: 1 }]} />
                <Text varient="caption" color="disabled">
                  ขั้นตอนงานขนส่ง
                </Text>
                <View style={[styles.divider, { flex: 1 }]} />
              </View>

              <View
                style={{
                  paddingHorizontal: normalize(16),
                  paddingBottom: normalize(16),
                  paddingTop: normalize(24),
                }}
              >
                {/* <Text varient="body2" color="secondary">
                  รายละเอียด
                </Text> */}
                <Text varient="h4">ขั้นตอนงานขนส่ง</Text>
              </View>

              <View style={{ paddingBottom: normalize(24) }}>
                <MainStep
                  steps={stepItems}
                  shipment={shipment}
                  refetch={handleRefetch}
                />
              </View>

              {isConfirmFinishShipment && (
                <View style={styles.detailActionWrapper}>
                  <FinishShipment
                    shipmentId={shipment._id}
                    onFinishComplete={handleOnShipmentComplete}
                  />
                </View>
              )}

              {isAbleToCancel && (
                <View style={styles.detailActionWrapper}>
                  <Button
                    title="ยกเลิกงานขนส่ง"
                    color="error"
                    size="medium"
                    varient="outlined"
                    fullWidth
                    onPress={handleOnCancelShipment}
                  />
                </View>
              )}
            </Fragment>
          )}
        </ScrollView>
      </SafeAreaView>
      {/*  */}
      {/* <ShipmentWorkingModal /> */}
      <ConfirmCancelShipmentModal
        ref={cancelShipmentModalRef}
        onCallback={handleOnCancelShipmenSuccess}
      />
      {isPendingAssignDriver && (
        <AssingDriverModal
          ref={assignDriverModalRef}
          onCallback={handleAssignSuccess}
        />
      )}
    </View>
  );
}

interface AssingDriverProps {
  shipmentId: string;
  callback: VoidFunction;
}

interface AssingDriverModalRef {
  present: (shipmentId: string) => void;
  close: Function;
}

interface AssingDriverModalProps {
  onCallback: VoidFunction;
}

const AssingDriverModal = forwardRef<
  AssingDriverModalRef,
  AssingDriverModalProps
>(({ onCallback }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["15%", "90%"], []); // "85%"

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

  const handleCallback = useCallback(() => {
    console.log("handleCallback inner: => ");
    onCallback();
    handleCloseModal();
  }, []);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      detached
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      style={styles.sheetContainer}
      topInset={StatusBar.currentHeight || 0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      handleComponent={SheetHandle}
      backdropComponent={SheetBackdrop.Default}
    >
      {({ data }) =>
        data ? (
          <AssingDriver shipmentId={data as any} callback={handleCallback} />
        ) : (
          <Fragment />
        )
      }
    </BottomSheetModal>
  );
});

function AssingDriver({ shipmentId, callback }: AssingDriverProps) {
  const confirmModalRef = useRef<ConfirmAssignShipmentModalRef>(null);
  const { data, loading } = useAvailableEmployeesQuery({
    variables: { shipmentId },
  });

  const employees = useMemo(() => data?.getAvailableDrivers as User[], [data]);

  function handleConfimedAssign() {
    callback();
  }

  function _FooterAction() {
    if (loading) {
      return (
        <BottomSheetView style={styles.footerContainer}>
          <ActivityIndicator size="small" color={colors.text.secondary} />
        </BottomSheetView>
      );
    }
    if (isEmpty(employees)) {
      return (
        <BottomSheetView style={styles.footerContainer}>
          <Text varient="body1" color="secondary">
            ไม่พบคนขับรถว่าง
          </Text>
        </BottomSheetView>
      );
    }
    return <Fragment />;
  }

  function _UserItem({ item: user }: ListRenderItemInfo<User>) {
    function handleAssignDriver() {
      if (confirmModalRef.current) {
        confirmModalRef.current.present(user);
      }
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
            title="มอบหมายงานนี้"
            color="success"
            varient="soft"
            fullWidth
            onPress={handleAssignDriver}
            StartIcon={
              <Iconify
                icon="material-symbols-light:assignment-turned-in"
                size={normalize(16)}
                color={colors.success.dark}
              />
            }
          />
        </View>
      </View>
    );
  }

  return (
    <Fragment>
      <BottomSheetView
        style={{
          flex: 1,
          gap: 8,
        }}
      >
        <View style={{ paddingHorizontal: normalize(16) }}>
          <Text varient="body2" color="secondary">
            มอบหมายงานคนขับ
          </Text>
          <Text varient="h4">รายชื่อคนขับที่สามารถรับงานได้</Text>
        </View>
        <BottomSheetFlashList
          scrollEnabled
          data={employees}
          estimatedItemSize={normalize(175)}
          ListFooterComponent={_FooterAction}
          renderItem={_UserItem}
          contentContainerStyle={styles.listContainer}
          keyExtractor={(item, indx) => `${indx}-${item._id}`}
        />
      </BottomSheetView>
      <ConfirmAssignShipmentModal
        shipmentId={shipmentId}
        onCallback={handleConfimedAssign}
        ref={confirmModalRef}
      />
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
  },
  navigator: {
    paddingVertical: normalize(12),
  },
  textCenter: {
    textAlign: "center",
  },
  mapContainer: {},
  backButtonWrapper: {
    position: "absolute",
    left: normalize(24),
    top: normalize(48),
    backgroundColor: colors.background.default,
    overflow: "hidden",
    borderRadius: normalize(8),
  },
  detailActionWrapper: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    alignItems: "flex-start",
  },
  image: {
    width: normalize(64),
    height: normalize(88),
    resizeMode: "contain",
    alignSelf: "stretch",
  },
  scrollContainer: {
    paddingBottom: Dimensions.get("window").height * 0.15,
  },
  sheetContainer: {
    borderWidth: 1,
    borderRadius: normalize(16),
    borderColor: colors.divider,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 9,
          },
          shadowOpacity: 0.48,
          shadowRadius: 11.95,
        }
      : {
          elevation: 18,
        }),
  },
  // Employee Item
  itemContainer: {
    padding: normalize(12),
    borderRadius: normalize(16),
    borderWidth: 1,
    borderColor: colors.divider,
    backgroundColor: colors.common.white,
    gap: normalize(16),
    marginBottom: normalize(16),
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
  footerContainer: { flex: 1, paddingVertical: normalize(32) },
  listContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(32),
  },
  divider: {
    marginHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
