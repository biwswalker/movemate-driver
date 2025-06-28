import React from "react";
import Text from "@components/Text";
import Button from "@components/Button";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "lodash";
import { Iconify } from "react-native-iconify";
import { normalize } from "@utils/normalizeSize";
import { router, useLocalSearchParams } from "expo-router";
import { EDriverType, RegisterPayload } from "@/graphql/generated/graphql";
import colors from "@constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.common.white,
  },
  headerWrapper: {
    paddingHorizontal: normalize(16),
  },
  rowWrapper: {
    flexDirection: "row",
  },
  sectionContainer: {
    marginTop: normalize(32),
    paddingHorizontal: normalize(16),
  },
  titleText: {
    color: colors.primary.darker,
    marginTop: normalize(48),
    marginBottom: normalize(16),
  },
  textCenter: {
    textAlign: "center",
  },
  subTitleText: {
    marginTop: normalize(24),
  },
  emailText: {
    color: colors.primary.darker,
  },
  actionWrapper: {
    marginTop: normalize(32),
  },
  secureImage: {
    height: normalize(180),
    alignSelf: "center",
    resizeMode: "contain",
  },
  actionTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalize(16),
    gap: normalize(4),
  },
  textButton: {
    color: colors.info.main,
    textAlign: "justify",
  },
});

export default function RegisterSuccessScreen() {
  const searchParam = useLocalSearchParams<{ param: string }>();
  const params = JSON.parse(searchParam.param) as RegisterPayload;
  const isBusinessRegisted = params.driverType === EDriverType.BUSINESS
  const phoneNumber = get(params, "phoneNumber", "");
  const subtitleBusiness = `ขอบคุณสำหรับการสมัครสมาชิกขับรถรูปแบบ\nบริษัท/นายหน้ากับ Movemate`;
  const subtitleIndividual = `ขอบคุณสำหรับการสมัครสมาชิกขับรถรูปแบบ\nส่วนบุคคลกับ Movemate`;
  const subtitle2 = `คุณจะได้รับข้อความแจ้งสถานะการสมัครสมาชิก\nผ่านทาง SMS ภายใน 1-3 วันทำการ \nโดยเราจะส่งข้อความไปยัง\n`;
  const subtitle3 = ` \nโปรดตรวจสอบข้อความของท่าน`;

  function handleSignin() {
    router.replace("/login");
  }

  function handleGoToLanding() {
    router.replace("/landing");
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sectionContainer}>
        <Image
          style={styles.secureImage}
          source={require("@assets/images/registered_success.png")}
        />
        <Text varient="h3" style={[styles.titleText, styles.textCenter]}>
          ขอบคุณที่ร่วมสมัคร
        </Text>
        <Text varient="caption" color="secondary" style={styles.textCenter}>
          {isBusinessRegisted ? subtitleBusiness : subtitleIndividual}
        </Text>
        <Text
          varient="caption"
          color="secondary"
          style={[styles.subTitleText, styles.textCenter]}
        >
          {subtitle2}
          <Text varient="caption" style={styles.emailText}>
            {phoneNumber}
          </Text>
          {/* {subtitle3} */}
        </Text>
        <View style={styles.actionWrapper}>
          <Button
            fullWidth
            size="large"
            varient="soft"
            title="กลับสู่หน้าหลัก"
            onPress={handleGoToLanding}
            EndIcon={
              <Iconify
                icon="flowbite:arrow-right-outline"
                size={24}
                color={colors.primary.dark}
              />
            }
          />
          <View style={[styles.rowWrapper, styles.actionTextWrapper]}>
            <Text varient="body2" color="disabled">
              หรือ
            </Text>
            <TouchableOpacity onPress={handleSignin}>
              <Text
                varient="subtitle2"
                style={[styles.textButton, { color: colors.primary.main }]}
              >
                เข้าสู่ระบบ
              </Text>
            </TouchableOpacity>
            <Text varient="body2" color="disabled">
              ได้เลย!
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
