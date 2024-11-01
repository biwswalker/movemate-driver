import Text from "@/components/Text";
import colors from "@constants/colors";
import {
  EShipmentStatus,
  EStepDefinition,
  EStepStatus,
  Shipment,
  useGetAvailableShipmentByTrackingNumberQuery,
} from "@/graphql/generated/graphql";
import { normalize } from "@/utils/normalizeSize";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { filter, get, isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  BackHandler,
  Dimensions,
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

export default function ShipmentDetail() {
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data, refetch } = useGetAvailableShipmentByTrackingNumberQuery({
    variables: { tracking: searchParam.trackingNumber },
  });

  const snapPoints = useMemo(() => ["15%", "90%"], []); // "85%"
  const shipment = useMemo<Shipment | undefined>(
    () => data?.getAvailableShipmentByTrackingNumber as Shipment,
    [data]
  );

  const currentStepSeq = get(shipment, "currentStepSeq", 0);
  const currentStepDefinition = get(
    shipment,
    `steps.${currentStepSeq}`,
    undefined
  );
  const isConfirmFinishShipment =
    currentStepDefinition?.step === EStepDefinition.FINISH &&
    currentStepDefinition.stepStatus === EStepStatus.PROGRESSING &&
    shipment?.status === EShipmentStatus.PROGRESSING;

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

  // Bottom Sheet
  const handleSheetChange = useCallback((index: number) => {
    // console.log("handleSheetChange", index);
  }, []);

  // const handleSnapPress = useCallback((index: number) => {
  //   bottomSheetRef.current?.snapToIndex(index);
  // }, []);
  // const handleClosePress = useCallback(() => {
  //   bottomSheetRef.current?.close();
  // }, []);

  function handleOnClose() {
    if (router.canDismiss()) {
      router.dismiss();
    }
  }

  // Datas
  function handleRefetch() {
    refetch();
  }

  function handleOnShipmentComplete() {
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

  const stepItems = filter(
    shipment?.steps,
    (step) => !isEmpty(step.driverMessage) && step.step !== "FINISH"
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {shipment && (
            <>
              <Overview shipment={shipment} />
              <Detail shipment={shipment} />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        style={styles.sheetContainer}
        topInset={StatusBar.currentHeight}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleComponent={SheetHandle}
        backdropComponent={SheetBackdrop.Default}
      >
        <BottomSheetView
          style={{
            flex: 1,
            gap: 8,
          }}
        >
          <View style={{ paddingHorizontal: normalize(16) }}>
            <Text varient="body2" color="secondary">
              รายละเอียด
            </Text>
            <Text varient="h4">ขั้นตอนงานขนส่ง</Text>
          </View>
          {shipment && (
            <ScrollView style={{ paddingBottom: normalize(32) }}>
              <MainStep
                steps={stepItems}
                shipment={shipment}
                refetch={handleRefetch}
              />
              {isConfirmFinishShipment && (
                <FinishShipment
                  shipmentId={shipment._id}
                  onFinishComplete={handleOnShipmentComplete}
                />
              )}
            </ScrollView>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
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
});
