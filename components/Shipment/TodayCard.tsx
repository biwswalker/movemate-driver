import colors from "@constants/colors";
import React, {
  forwardRef,
  Fragment,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import Text from "@components/Text";
import { fDate } from "@utils/formatTime";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import { find, get } from "lodash";
import useAuth from "@/hooks/useAuth";
import {
  Shipment,
  useGetTodayShipmentQuery,
} from "@/graphql/generated/graphql";
import { ActivityIndicator } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import hexToRgba from "hex-to-rgba";
import Button from "../Button";
import { router } from "expo-router";

export interface TodayShipmentsRef {
  refetch: Function;
}

interface TodayShipmentsProps {}

const TodayCard = forwardRef<TodayShipmentsRef, TodayShipmentsProps>(
  (_, ref) => {
    const isFocused = useIsFocused();
    const { user } = useAuth();

    const [mainLoading, setMainLoading] = useState(false);

    const { data, refetch, loading } = useGetTodayShipmentQuery({
      notifyOnNetworkStatusChange: true,
      onError: (error) => {
        console.log("error: ", error);
      },
    });

    function refetchShipment() {
      refetch();
    }

    useImperativeHandle(ref, () => ({
      refetch: refetchShipment,
    }));

    useEffect(() => {
      if (isFocused) {
        // refetchShipment();
      }
    }, [isFocused]);

    useEffect(() => {
      if (loading) {
        setMainLoading(true);
      } else {
        setTimeout(() => setMainLoading(false), 600);
      }
    }, [loading]);

    const shipment = useMemo(() => {
      return get(data, "getTodayShipment", undefined) as Shipment | undefined;
    }, [data?.getTodayShipment]);

    // TODO: To support business recheck
    const vehicleImages = get(
      user,
      "individualDriver.serviceVehicleType.image.filename",
      ""
    );

    const screenWidth = Dimensions.get("screen").width;
    const translateXAnim = useRef(new Animated.Value(0)).current;

    function startAnimation() {
      Animated.sequence([
        Animated.timing(translateXAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(translateXAnim, {
          toValue: 0.96,
          useNativeDriver: true,
        }),
      ]).start();
    }

    const translateX = translateXAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [screenWidth, screenWidth - normalize(200)],
    });

    useEffect(() => {
      startAnimation();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function onViewShipment() {
      router.push({
        pathname: "/shipment-working",
        params: { trackingNumber: shipment?.trackingNumber },
      });
    }
    // const status
    const currentStatus = find(shipment?.steps, [
      "seq",
      shipment?.currentStepSeq,
    ]);

    return (
      <View style={todayCardStyles.todayContainer}>
        <View style={todayCardStyles.todayWrapper}>
          <Text varient="body1" style={todayCardStyles.todayText}>
            งานวันนี้ {fDate(new Date(), "dd/MM/yyyy")}
          </Text>
          {mainLoading ? (
            <View style={todayCardStyles.loadingWrapper}>
              <ActivityIndicator size="small" color={colors.text.secondary} />
            </View>
          ) : shipment ? (
            <View style={todayCardStyles.shipmentStatusContainer}>
              <Text varient="body1" style={todayCardStyles.trackingNumber}>
                {shipment.trackingNumber}
              </Text>
              {currentStatus && (
                <Text
                  varient="body2"
                  numberOfLines={1}
                  style={[{ color: colors.text.secondary }]}
                >
                  {currentStatus?.driverMessage}
                </Text>
              )}
              <View style={todayCardStyles.todayActionWrapper}>
                <Button
                  fullWidth
                  varient="contained"
                  color="info"
                  title="แสดงข้อมูลขนส่ง"
                  onPress={onViewShipment}
                  StartIcon={
                    <Iconify
                      icon="fluent:map-24-filled"
                      size={normalize(24)}
                      color={colors.common.white}
                    />
                  }
                />
              </View>
            </View>
          ) : (
            <Text style={todayCardStyles.todaySubtitleText}>ไม่พบงานขนส่ง</Text>
          )}
        </View>
        {/* {vehicleImages && (
          <Animated.View
            style={[
              todayCardStyles.truckImageContainer,
              { transform: [{ translateY: normalize(64) }, { translateX }] },
            ]}
          >
            <Image
              style={todayCardStyles.truckImage}
              source={{ uri: imagePath(vehicleImages) }}
            />
          </Animated.View>
        )} */}
      </View>
    );
  }
);

export default TodayCard;

export function PendingApproval() {
  return (
    <Fragment>
      <Text varient="h6" style={todayCardStyles.textCenter}>
        ขณะนี้ยังไม่สามารถใช้ฟีเจอร์นี้ได้
      </Text>
      <Text color="secondary" style={todayCardStyles.textCenter}>
        เนื่องจากบัญชีของท่านยังไม่สมบูรณ์{" "}
      </Text>
      <View style={todayCardStyles.infoTextContainer}>
        <View style={todayCardStyles.infoTextWrapper}>
          <Iconify
            icon="fa6-solid:user-clock"
            size={normalize(24)}
            color={colors.primary.main}
            style={todayCardStyles.iconWrapper}
          />
          <View style={todayCardStyles.infoTexts}>
            <Text varient="subtitle1">รอการตรวจสอบบัญชี</Text>
            <Text varient="body2" color="secondary">
              {`บัญชีของท่านยังไม่สามารถรับงานได้\nกรุณารอการตรวจสอบจากผู้ดูแลระบบ`}
            </Text>
          </View>
        </View>
        <View style={todayCardStyles.infoTextWrapper}>
          <Iconify
            icon="mdi:comment-quote"
            size={normalize(24)}
            color={colors.primary.main}
            style={todayCardStyles.iconWrapper}
          />
          <View style={todayCardStyles.infoTexts}>
            <Text varient="subtitle1">มีข้อแนะนำหรือปัญหาการใช้งาน</Text>
            <Text varient="body2" color="secondary">
              {`หากท่านพบปัญหาหรือใช้งานไม่ได้\nกรุณาติดต่อผู้ดูแลระบบผ่าน`}
            </Text>
            <Text varient="body2" style={todayCardStyles.linkText}>
              Movematethailand.com
            </Text>
          </View>
        </View>
      </View>
    </Fragment>
  );
}

export function DeniedApproval({ reasonMessage }: { reasonMessage: string }) {
  function handleOnReSubmitForm() {
    router.push("/re-register/re-register");
  }
  return (
    <Fragment>
      <Text
        varient="h6"
        style={[todayCardStyles.textCenter, { color: colors.error.dark }]}
      >
        ไม่สามารถใช้ฟีเจอร์นี้ได้
      </Text>
      <Text
        varient="body2"
        color="secondary"
        style={todayCardStyles.textCenter}
      >
        เนื่องจากบัญชีของท่านไม่ถูกอนุมัติ
      </Text>
      <View style={todayCardStyles.infoTextContainer}>
        <View style={todayCardStyles.infoTextWrapper}>
          <Iconify
            icon="mingcute:user-forbid-fill"
            size={normalize(24)}
            color={colors.text.secondary}
            style={todayCardStyles.iconWrapper}
          />
          <View style={todayCardStyles.infoTexts}>
            <Text varient="subtitle1">บัญชีท่านไม่ถูกอนุมัติ</Text>
            <Text varient="body2" color="secondary">
              {`บัญชีของท่านยังสามารถเข้าใช้ระบบได้\nแต่ไม่สามารถใช้งานอื่นๆได้`}
            </Text>
          </View>
        </View>
        <View style={todayCardStyles.infoTextWrapper}>
          <Iconify
            icon="mage:message-question-mark-fill"
            size={normalize(24)}
            color={colors.text.secondary}
            style={todayCardStyles.iconWrapper}
          />
          <View style={todayCardStyles.infoTexts}>
            <Text varient="subtitle1">หากมีข้อสงใส ติดต่อเราทันที</Text>
            <Text varient="body2" color="secondary">
              {`หากท่านยังประสงค์ใช้งานต่อ\nท่านสามารถเปลี่ยนแปลงข้อมูลได้\nหากได้รับการพิจารณาจากผู้ดูแล`}
            </Text>
          </View>
        </View>
        <View style={todayCardStyles.infoTextWrapper}>
          <Iconify
            icon="mage:message-dots-round-fill"
            size={normalize(24)}
            color={colors.text.secondary}
            style={todayCardStyles.iconWrapper}
          />
          <View style={todayCardStyles.infoTexts}>
            <Text varient="subtitle1">เหตุผลไม่อนุมัติ</Text>
            <Text varient="body2" color="secondary">
              {reasonMessage}
            </Text>
          </View>
        </View>
        <View
          style={[todayCardStyles.infoTextWrapper, { alignSelf: "center" }]}
        >
          <Button
            onPress={handleOnReSubmitForm}
            title="ปรับปรุงเอกสารและข้อมูลส่วนตัว"
            size="large"
            varient="soft"
          />
        </View>
      </View>
    </Fragment>
  );
}

const todayCardStyles = StyleSheet.create({
  textCenter: {
    textAlign: "center",
  },
  todayContainer: {
    marginTop: normalize(16),
    paddingHorizontal: normalize(16),
  },
  todayWrapper: {
    position: "relative",
    backgroundColor: colors.text.primary,
    borderRadius: normalize(16),
    padding: normalize(16),
  },
  todayText: {
    color: colors.common.white,
  },
  todaySubtitleText: {
    color: colors.primary.lighter,
  },
  todayActionWrapper: {
    width: "100%",
    marginTop: normalize(24),
    alignItems: "flex-start",
  },
  truckImageContainer: {
    pointerEvents: "none",
    position: "absolute",
    // bottom: 0,
  },
  truckImage: {
    pointerEvents: "none",
    position: "absolute",
    height: normalize(110),
    width: normalize(220),
    resizeMode: "contain",
  },
  infoTextContainer: {
    marginTop: normalize(16),
    backgroundColor: colors.background.neutral,
    borderRadius: normalize(24),
    padding: normalize(24),
    paddingVertical: normalize(16),
    gap: normalize(16),
    marginBottom: normalize(80),
  },
  infoTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: normalize(16),
  },
  iconWrapper: {
    minWidth: normalize(32),
  },
  infoTexts: {
    flexWrap: "wrap",
  },
  linkText: {
    color: colors.master.dark,
  },
  loadingWrapper: {
    paddingVertical: normalize(16),
    alignItems: "center",
  },
  trackingNumber: {
    color: colors.primary.lighter,
  },
  statusWrapper: {
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
    backgroundColor: hexToRgba(colors.info.main, 0.32),
  },
  statusContainer: {
    paddingTop: normalize(8),
  },
  shipmentStatusContainer: {
    paddingTop: normalize(8),
    alignItems: "flex-start",
  },
});
