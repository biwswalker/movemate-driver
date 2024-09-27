import Button from "@/components/Button";
import ButtonIcon from "@/components/ButtonIcon";
import Iconify from "@/components/Iconify";
import Text from "@/components/Text";
import colors from "@/constants/colors";
import {
  Shipment,
  StepDefinition,
  useGetAvailableShipmentByTrackingNumberQuery,
  useMarkAsFinishMutation,
} from "@/graphql/generated/graphql";
import useSnackbar from "@/hooks/useSnackbar";
import { normalize } from "@/utils/normalizeSize";
import { ApolloError } from "@apollo/client";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import hexToRgba from "hex-to-rgba";
import { filter, get, isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import Accordion from "react-native-collapsible/Accordion";
import StepHeader from "@/components/Shipment/Steps/StepHeader";
import StepContent from "@/components/Shipment/Steps/StepContent";
import * as Haptics from "expo-haptics";

export default function ShipmentDetail() {
  const searchParam = useLocalSearchParams<{ trackingNumber: string }>();
  const isPresented = router.canGoBack();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { data, refetch } = useGetAvailableShipmentByTrackingNumberQuery({
    variables: { tracking: searchParam.trackingNumber },
  });

  const snapPoints = useMemo(() => ["25%", "85%"], []);
  const shipment = useMemo<Shipment | undefined>(
    () => data?.getAvailableShipmentByTrackingNumber as Shipment,
    [data]
  );
  const rawDirection = get(shipment, "directionId.rawData", "");
  const directions = rawDirection ? JSON.parse(rawDirection) : undefined;

  const currentStepSeq = get(shipment, "currentStepSeq", 0);
  const currentStepDefinition = get(
    shipment,
    `steps.${currentStepSeq}`,
    undefined
  );
  const isConfirmFinishShipment =
    currentStepDefinition?.step === "FINISH" &&
    currentStepDefinition.stepStatus === "progressing" &&
    shipment?.status === "progressing";

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

  function handleCloseModal() {
    if (isPresented) {
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

  function handleViewDetail() {
    router.push({
      pathname: "/shipment-detail",
      params: { trackingNumber: shipment?.trackingNumber || "" },
    });
  }

  const stepItems = filter(
    shipment?.steps,
    (step) => !isEmpty(step.driverMessage) && step.step !== "FINISH"
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.backButtonWrapper}>
          <ButtonIcon
            onPress={handleCloseModal}
            varient="outlined"
            color="inherit"
          >
            {({ color }) => (
              <Iconify icon="mi:chevron-left" size={24} color={color} />
            )}
          </ButtonIcon>
        </View>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              gap: 8,
            }}
          >
            <View style={{ paddingHorizontal: 16 }}>
              <Text varient="body2" color="secondary">
                หมายเลขงานขนส่ง
              </Text>
              <Text varient="h3">{shipment?.trackingNumber}</Text>
            </View>
            <View style={[styles.detailActionWrapper]}>
              <Button
                title="ดูรายละเอียดงานขนส่ง"
                varient="soft"
                onPress={handleViewDetail}
              />
            </View>
            {shipment && (
              <ScrollView>
                <ShipmentStep
                  steps={stepItems}
                  shipment={shipment}
                  refetch={handleRefetch}
                />
              </ScrollView>
            )}
            {isConfirmFinishShipment && (
              <FinishShipment
                shipmentId={shipment._id}
                onFinishComplete={handleOnShipmentComplete}
              />
            )}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

interface IShipmentStep {
  steps: StepDefinition[];
  shipment: Shipment;
  refetch: Function;
}

function ShipmentStep({ steps, shipment, refetch }: IShipmentStep) {
  const [activeSections, setActiveSections] = useState<number[]>([]);

  useEffect(() => {
    setTimeout(() => {
      // console.log("setActiveSections", shipment.currentStepSeq - 3);
      setActiveSections([shipment.currentStepSeq - 3]);
    }, 10);
  }, [shipment.currentStepSeq]);

  function _renderHeader(
    content: StepDefinition,
    index: number,
    isActive: boolean,
    sections: StepDefinition[]
  ) {
    return <StepHeader step={content} index={index} />;
  }

  function _renderContent(
    content: StepDefinition,
    index: number,
    isActive: boolean,
    sections: StepDefinition[]
  ) {
    return (
      <StepContent
        step={content}
        index={index}
        shipment={shipment}
        refetch={refetch}
      />
    );
  }

  function handleChangeSection(indexs: number[]) {
    setActiveSections(indexs);
  }

  return (
    <Accordion<StepDefinition>
      sections={steps}
      activeSections={activeSections}
      renderHeader={_renderHeader}
      renderContent={_renderContent}
      onChange={handleChangeSection}
      containerStyle={{ backgroundColor: colors.background.paper }}
      touchableProps={{ activeOpacity: colors.action.hoverOpacity }}
      underlayColor={colors.action.hover}
    />
  );
}

interface FinishShipmentProps {
  shipmentId: string;
  onFinishComplete: Function;
}

function FinishShipment({ shipmentId, onFinishComplete }: FinishShipmentProps) {
  const insets = useSafeAreaInsets();
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [markAsFinish] = useMarkAsFinishMutation();

  function onFinishError(error: ApolloError) {
    setLoading(false);
    const message = error.message || "ไม่สามารถจบงานได้";
    showSnackbar({ message: message, varient: "warning" });
  }

  function onFinish() {
    onFinishComplete();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setLoading(false);
  }

  function handleOnPressFinish() {
    setLoading(true);
    markAsFinish({
      variables: { shipmentId },
      onCompleted: onFinish,
      onError: onFinishError,
    });
  }

  return (
    <View style={[styles.finishWrapper, { paddingBottom: insets.bottom }]}>
      <View style={styles.actionsWrapper}>
        <Button
          size="large"
          varient="soft"
          color="success"
          title="กดค้างเพื่อแจ้งเสร็จงาน"
          fullWidth
          style={[{ borderRadius: normalize(24) }]}
          delayLongPress={1000}
          onLongPress={handleOnPressFinish}
          loading={loading}
          StartIcon={
            <Iconify
              icon="fluent-emoji-high-contrast:party-popper"
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
    backgroundColor: colors.divider,
  },
  backButtonWrapper: {
    position: "absolute",
    left: normalize(24),
    top: normalize(48),
    backgroundColor: colors.common.white,
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
  actionsWrapper: {
    flex: 1,
    paddingBottom: normalize(8),
  },
  finishWrapper: {
    flexDirection: "row",
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    backgroundColor: colors.common.white,
  },
});
