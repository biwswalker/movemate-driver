import colors from "@constants/colors";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";
import Text from "@components/Text";
import { fDate } from "@utils/formatTime";
import { normalize } from "@utils/normalizeSize";
import Iconify from "@components/Iconify";
import { get } from "lodash";
import useAuth from "@/hooks/useAuth";

export default function TodayCard() {
  // TODO: Get active work
  const { user } = useAuth();

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
      Animated.spring(translateXAnim, { toValue: 0.96, useNativeDriver: true }),
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

  return (
    <View style={todayCardStyles.todayContainer}>
      <View style={todayCardStyles.todayWrapper}>
        <Text varient="h5" style={todayCardStyles.todayText}>
          งานวันนี้ {fDate(new Date(), "dd/MM/yyyy")}
        </Text>
        <Text style={todayCardStyles.todaySubtitleText}>ไม่พบงานขนส่ง</Text>
        <View style={todayCardStyles.todayActionWrapper}>
          {/* <ButtonIcon varient="soft" size="large" color="info" circle>
              <Iconify
                icon="ci:arrow-right-lg"
                size={normalize(24)}
                color={colors.info.main}
              />
            </ButtonIcon> */}
        </View>
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

export function PendingApproval() {
  return (
    <>
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
    </>
  );
}

export function DeniedApproval() {
  return (
    <>
      <Text varient="h6" style={todayCardStyles.textCenter}>
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
      </View>
    </>
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
});
